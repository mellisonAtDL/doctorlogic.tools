import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

interface ColorAnalysis {
  avgLuminance: number;
  darkRatio: number;
  lightRatio: number;
  isPredominantlyDark: boolean;
  isPredominantlyLight: boolean;
}

interface Variation {
  id: string;
  label: string;
  description: string;
  base64: string;
}

// Stability AI background removal
async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) {
    throw new Error("STABILITY_API_KEY environment variable is not set");
  }

  const form = new FormData();
  form.append(
    "image",
    new Blob([imageBuffer], { type: "image/png" }),
    "image.png"
  );
  form.append("output_format", "png");

  const response = await fetch(
    "https://api.stability.ai/v2beta/stable-image/edit/remove-background",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "image/*",
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stability AI error: ${response.status} - ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// Analyze colors in the image
function analyzeColors(
  data: Buffer,
  width: number,
  height: number
): ColorAnalysis {
  let totalLuminance = 0;
  let darkPixels = 0;
  let lightPixels = 0;
  let visiblePixels = 0;

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const alpha = data[i * 4 + 3];

    // Skip transparent pixels
    if (alpha < 128) continue;

    visiblePixels++;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    totalLuminance += luminance;

    if (luminance < 0.3) darkPixels++;
    if (luminance > 0.7) lightPixels++;
  }

  const avgLuminance = visiblePixels > 0 ? totalLuminance / visiblePixels : 0.5;
  const darkRatio = visiblePixels > 0 ? darkPixels / visiblePixels : 0;
  const lightRatio = visiblePixels > 0 ? lightPixels / visiblePixels : 0;

  return {
    avgLuminance,
    darkRatio,
    lightRatio,
    isPredominantlyDark: darkRatio > 0.4 || avgLuminance < 0.35,
    isPredominantlyLight: lightRatio > 0.4 || avgLuminance > 0.65,
  };
}

// Create outline using morphological dilation
function createOutline(
  sourceData: Buffer,
  width: number,
  height: number,
  outlineR: number,
  outlineG: number,
  outlineB: number,
  outlineWidth: number
): Buffer {
  // Extract alpha channel
  const alphaChannel = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    alphaChannel[i] = sourceData[i * 4 + 3];
  }

  // Dilate alpha (expand by outlineWidth pixels)
  const dilatedAlpha = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxAlpha = 0;
      // Check circular neighborhood
      for (let dy = -outlineWidth; dy <= outlineWidth; dy++) {
        for (let dx = -outlineWidth; dx <= outlineWidth; dx++) {
          if (dx * dx + dy * dy <= outlineWidth * outlineWidth) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              maxAlpha = Math.max(maxAlpha, alphaChannel[ny * width + nx]);
            }
          }
        }
      }
      dilatedAlpha[y * width + x] = maxAlpha;
    }
  }

  // Create outline: colored pixels where dilated > original
  const outlineData = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    outlineData[i * 4] = outlineR;
    outlineData[i * 4 + 1] = outlineG;
    outlineData[i * 4 + 2] = outlineB;
    outlineData[i * 4 + 3] = Math.max(0, dilatedAlpha[i] - alphaChannel[i]);
  }

  return outlineData;
}

// Lighten colors using LAB color space
async function lightenColors(
  sourceData: Buffer,
  width: number,
  height: number,
  maxLighten: number,
  minContrast: number
): Promise<Buffer> {
  const chroma = (await import("chroma-js")).default;
  const result = Buffer.alloc(width * height * 4);
  const darkBgLuminance = 0.1; // Reference dark background

  for (let i = 0; i < width * height; i++) {
    const r = sourceData[i * 4];
    const g = sourceData[i * 4 + 1];
    const b = sourceData[i * 4 + 2];
    const alpha = sourceData[i * 4 + 3];

    // Skip transparent pixels
    if (alpha < 128) {
      result.set([r, g, b, alpha], i * 4);
      continue;
    }

    const pixelLuminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const contrastWithDark =
      (Math.max(pixelLuminance, darkBgLuminance) + 0.05) /
      (Math.min(pixelLuminance, darkBgLuminance) + 0.05);

    let newR = r;
    let newG = g;
    let newB = b;

    // Lighten if poor contrast on dark backgrounds
    if (contrastWithDark < minContrast && pixelLuminance < 0.5) {
      const color = chroma(r, g, b);
      const [L, a, bVal] = color.lab();
      const newL = Math.min(L + maxLighten, 85);
      const [lr, lg, lb] = chroma.lab(newL, a, bVal).rgb();
      newR = Math.round(Math.max(0, Math.min(255, lr)));
      newG = Math.round(Math.max(0, Math.min(255, lg)));
      newB = Math.round(Math.max(0, Math.min(255, lb)));
    }

    result.set([newR, newG, newB, alpha], i * 4);
  }

  return result;
}

// Composite outline under the main image
async function compositeWithOutline(
  imageData: Buffer,
  outlineData: Buffer,
  width: number,
  height: number
): Promise<Buffer> {
  const outlineImg = await sharp(outlineData, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  const mainImg = await sharp(imageData, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  // Outline UNDER main image
  return sharp(outlineImg)
    .composite([{ input: mainImg, blend: "over" }])
    .png()
    .toBuffer();
}

// Generate all 3 variations
async function generateVariations(
  rawData: Buffer,
  width: number,
  height: number,
  analysis: ColorAnalysis
): Promise<Variation[]> {
  const variations: Variation[] = [];

  // Variation 1: Original + White Outline
  const outline1 = createOutline(rawData, width, height, 255, 255, 255, 2);
  const variation1Buffer = await compositeWithOutline(
    rawData,
    outline1,
    width,
    height
  );
  variations.push({
    id: "original-outline",
    label: "Original + Outline",
    description: "Preserves exact brand colors with white outline",
    base64: variation1Buffer.toString("base64"),
  });

  // Determine adaptive outline color
  let outlineR = 200;
  let outlineG = 200;
  let outlineB = 200;

  if (analysis.isPredominantlyLight) {
    // Dark outline for light logos
    outlineR = 30;
    outlineG = 30;
    outlineB = 30;
  } else if (analysis.isPredominantlyDark) {
    // White outline for dark logos
    outlineR = 255;
    outlineG = 255;
    outlineB = 255;
  }

  // Variation 2: Balanced (subtle lightening + adaptive outline)
  const lightenedBalanced = await lightenColors(rawData, width, height, 20, 3.0);
  const outline2 = createOutline(
    lightenedBalanced,
    width,
    height,
    outlineR,
    outlineG,
    outlineB,
    2
  );
  const variation2Buffer = await compositeWithOutline(
    lightenedBalanced,
    outline2,
    width,
    height
  );
  variations.push({
    id: "balanced",
    label: "Balanced",
    description: "Subtle color adjustment with adaptive outline",
    base64: variation2Buffer.toString("base64"),
  });

  // Variation 3: High Contrast (aggressive lightening + outline)
  const lightenedHighContrast = await lightenColors(
    rawData,
    width,
    height,
    35,
    4.5
  );
  const outline3 = createOutline(
    lightenedHighContrast,
    width,
    height,
    outlineR,
    outlineG,
    outlineB,
    2
  );
  const variation3Buffer = await compositeWithOutline(
    lightenedHighContrast,
    outline3,
    width,
    height
  );
  variations.push({
    id: "high-contrast",
    label: "High Contrast",
    description: "Maximum visibility on dark backgrounds",
    base64: variation3Buffer.toString("base64"),
  });

  return variations;
}

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    // 1. Remove background
    const bgRemoved = await removeBackground(imageBuffer);

    // 2. Trim transparent space
    const trimmed = await sharp(bgRemoved).trim().toBuffer();

    // 3. Get raw pixel data
    const image = sharp(trimmed);
    const metadata = await image.metadata();
    const width = metadata.width!;
    const height = metadata.height!;

    const { data: rawData } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 4. Analyze colors
    const analysis = analyzeColors(rawData, width, height);

    // 5. Generate variations
    const variations = await generateVariations(rawData, width, height, analysis);

    return NextResponse.json({
      success: true,
      variations,
      analysis: {
        avgLuminance: analysis.avgLuminance.toFixed(2),
        isPredominantlyDark: analysis.isPredominantlyDark,
        isPredominantlyLight: analysis.isPredominantlyLight,
      },
    });
  } catch (error) {
    console.error("Logo optimization error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to optimize logo",
      },
      { status: 500 }
    );
  }
}
