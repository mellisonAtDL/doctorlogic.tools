import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";

interface WordMarkConfig {
  text: string;
  tagline: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: "normal" | "italic";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  color: string;
  letterSpacing: number;
  lineHeight: number;
  padding: number;
  layout: "single" | "stacked";
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
  taglineFontSize: number;
  taglineLetterSpacing: number;
  taglineColor: string;
}

// Map font families to local font files
const fontFileMap: Record<string, Record<string, string>> = {
  Inter: {
    "400": "Inter-Regular.ttf",
    "500": "Inter-Medium.ttf",
    "600": "Inter-SemiBold.ttf",
    "700": "Inter-Bold.ttf",
  },
  Montserrat: {
    "400": "Montserrat-Regular.ttf",
    "500": "Montserrat-Medium.ttf",
    "600": "Montserrat-SemiBold.ttf",
    "700": "Montserrat-Bold.ttf",
  },
  Poppins: {
    "400": "Poppins-Regular.ttf",
    "500": "Poppins-Medium.ttf",
    "600": "Poppins-SemiBold.ttf",
    "700": "Poppins-Bold.ttf",
  },
  Roboto: {
    "400": "Roboto-Regular.ttf",
    "500": "Roboto-Medium.ttf",
    "700": "Roboto-Bold.ttf",
  },
  Lato: {
    "400": "Lato-Regular.ttf",
    "700": "Lato-Bold.ttf",
  },
  "Open Sans": {
    "400": "OpenSans-Regular.ttf",
    "600": "OpenSans-SemiBold.ttf",
    "700": "OpenSans-Bold.ttf",
  },
};

// WASM initialization state
let wasmInitialized = false;

// Initialize WASM module
async function ensureWasmInitialized(): Promise<void> {
  if (wasmInitialized) return;

  try {
    // Try to load from node_modules first (works locally)
    const wasmPath = path.join(
      process.cwd(),
      "node_modules",
      "@resvg",
      "resvg-wasm",
      "index_bg.wasm"
    );
    const wasmBuffer = fs.readFileSync(wasmPath);
    await initWasm(wasmBuffer);
    wasmInitialized = true;
  } catch (error) {
    // WASM might already be initialized
    if (error instanceof Error && error.message.includes("Already initialized")) {
      wasmInitialized = true;
    } else {
      throw error;
    }
  }
}

// Cache for loaded font buffers
const fontBufferCache = new Map<string, Uint8Array>();

// Get font filename for a given family and weight
function getFontFileName(fontFamily: string, fontWeight: string): string | null {
  const familyMap = fontFileMap[fontFamily];
  if (!familyMap) {
    return null;
  }

  // Find the closest available weight
  let fileName = familyMap[fontWeight];
  if (!fileName) {
    const weights = Object.keys(familyMap).map(Number).sort((a, b) => a - b);
    const targetWeight = parseInt(fontWeight);
    const closestWeight = weights.reduce((prev, curr) =>
      Math.abs(curr - targetWeight) < Math.abs(prev - targetWeight) ? curr : prev
    );
    fileName = familyMap[closestWeight.toString()];
  }

  return fileName || null;
}

// Load font as Uint8Array - fetches from public URL on Vercel
async function loadFontBuffer(
  fontFamily: string,
  fontWeight: string,
  baseUrl: string
): Promise<Uint8Array | null> {
  const effectiveFamily = fontFileMap[fontFamily] ? fontFamily : "Inter";
  const cacheKey = `${effectiveFamily}-${fontWeight}`;

  if (fontBufferCache.has(cacheKey)) {
    return fontBufferCache.get(cacheKey)!;
  }

  const fileName = getFontFileName(effectiveFamily, fontWeight);
  if (!fileName) {
    console.error(`No font file found for ${effectiveFamily} ${fontWeight}`);
    return null;
  }

  try {
    // Try filesystem first (works locally)
    const fontPath = path.join(process.cwd(), "public", "fonts", fileName);
    try {
      const buffer = fs.readFileSync(fontPath);
      console.log(`Loaded font from filesystem: ${fontPath}, size: ${buffer.length}`);
      const uint8Array = new Uint8Array(buffer);
      fontBufferCache.set(cacheKey, uint8Array);
      return uint8Array;
    } catch (fsError) {
      // Filesystem failed, try fetching from public URL (Vercel)
      console.log(`Filesystem read failed, fetching from URL: ${baseUrl}/fonts/${fileName}`);
      const fontUrl = `${baseUrl}/fonts/${fileName}`;
      const response = await fetch(fontUrl);

      if (!response.ok) {
        console.error(`Failed to fetch font from ${fontUrl}: ${response.status} ${response.statusText}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log(`Loaded font from URL: ${fontUrl}, size: ${arrayBuffer.byteLength}`);
      const uint8Array = new Uint8Array(arrayBuffer);
      fontBufferCache.set(cacheKey, uint8Array);
      return uint8Array;
    }
  } catch (error) {
    console.error(`Failed to load font ${fontFamily} ${fontWeight}:`, error);
    return null;
  }
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Transform text based on textTransform setting
function transformText(text: string, transform: string): string {
  switch (transform) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "capitalize":
      return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    default:
      return text;
  }
}

// Calculate text dimensions (approximate)
function calculateTextDimensions(
  text: string,
  fontSize: number,
  fontWeight: string,
  letterSpacing: number,
  lineHeight: number,
  layout: "single" | "stacked"
): { width: number; height: number } {
  const weightMultiplier =
    parseInt(fontWeight) >= 600 ? 0.65 : parseInt(fontWeight) >= 500 ? 0.6 : 0.55;
  const charWidth = fontSize * weightMultiplier;
  const lineHeightPx = fontSize * lineHeight;

  if (layout === "stacked" && text.includes(" ")) {
    const lines = text.split(" ");
    const maxLineLength = Math.max(...lines.map((line) => line.length));
    const width =
      maxLineLength * charWidth + (maxLineLength - 1) * letterSpacing;
    const height = lines.length * lineHeightPx;
    return { width: Math.ceil(width), height: Math.ceil(height) };
  }

  const width = text.length * charWidth + (text.length - 1) * letterSpacing;
  return { width: Math.ceil(width), height: Math.ceil(lineHeightPx) };
}

// Get the effective font family (map to available fonts or use fallback)
function getEffectiveFontFamily(fontFamily: string): string {
  if (fontFileMap[fontFamily]) {
    return fontFamily;
  }
  const fontMapping: Record<string, string> = {
    "Work Sans": "Inter",
    "DM Sans": "Inter",
    Manrope: "Inter",
    "Plus Jakarta Sans": "Poppins",
    Nunito: "Lato",
    Raleway: "Montserrat",
    Oswald: "Montserrat",
    "Bebas Neue": "Montserrat",
    Anton: "Montserrat",
    "Archivo Black": "Roboto",
    Righteous: "Poppins",
    "Playfair Display": "Lato",
    Merriweather: "Lato",
    Lora: "Lato",
    "Cormorant Garamond": "Lato",
    "Libre Baskerville": "Lato",
    "DM Serif Display": "Lato",
    "Crimson Text": "Lato",
    "EB Garamond": "Lato",
    "Roboto Slab": "Roboto",
    Arvo: "Roboto",
    Bitter: "Roboto",
    "Great Vibes": "Lato",
    Pacifico: "Lato",
    "Dancing Script": "Lato",
    Satisfy: "Lato",
  };
  return fontMapping[fontFamily] || "Inter";
}

// Create SVG for the word mark
function createWordMarkSvg(config: WordMarkConfig): {
  svg: string;
  width: number;
  height: number;
} {
  const transformedText = transformText(config.text, config.textTransform);
  const effectiveFontFamily = getEffectiveFontFamily(config.fontFamily);

  const textDimensions = calculateTextDimensions(
    transformedText,
    config.fontSize,
    config.fontWeight,
    config.letterSpacing,
    config.lineHeight,
    config.layout
  );

  let taglineHeight = 0;
  let taglineWidth = 0;
  const taglineSpacing = config.tagline ? config.fontSize * 0.3 : 0;

  if (config.tagline) {
    const taglineDimensions = calculateTextDimensions(
      config.tagline.toUpperCase(),
      config.taglineFontSize,
      "400",
      config.taglineLetterSpacing,
      1.2,
      "single"
    );
    taglineHeight = taglineDimensions.height + taglineSpacing;
    taglineWidth = taglineDimensions.width;
  }

  const contentWidth = Math.max(textDimensions.width, taglineWidth);
  const contentHeight = textDimensions.height + taglineHeight;

  const width = contentWidth + config.padding * 2;
  const height = contentHeight + config.padding * 2;

  const isStacked = config.layout === "stacked" && transformedText.includes(" ");
  const lines = isStacked ? transformedText.split(" ") : [transformedText];
  const lineHeightPx = config.fontSize * config.lineHeight;

  const strokeAttrs = config.strokeEnabled
    ? `stroke="${config.strokeColor}" stroke-width="${config.strokeWidth}" paint-order="stroke fill"`
    : "";

  let textElements = "";
  const mainTextStartY = config.padding + config.fontSize * 0.85;

  if (isStacked) {
    lines.forEach((line, index) => {
      textElements += `
        <text
          x="50%"
          y="${mainTextStartY + index * lineHeightPx}"
          text-anchor="middle"
          dominant-baseline="auto"
          fill="${config.color}"
          font-family="${effectiveFontFamily}"
          font-size="${config.fontSize}px"
          font-weight="${config.fontWeight}"
          font-style="${config.fontStyle}"
          letter-spacing="${config.letterSpacing}px"
          ${strokeAttrs}
        >${escapeXml(line)}</text>`;
    });
  } else {
    textElements = `
      <text
        x="50%"
        y="${config.padding + textDimensions.height / 2}"
        text-anchor="middle"
        dominant-baseline="central"
        fill="${config.color}"
        font-family="${effectiveFontFamily}"
        font-size="${config.fontSize}px"
        font-weight="${config.fontWeight}"
        font-style="${config.fontStyle}"
        letter-spacing="${config.letterSpacing}px"
        ${strokeAttrs}
      >${escapeXml(transformedText)}</text>`;
  }

  if (config.tagline) {
    const taglineY = config.padding + textDimensions.height + taglineSpacing + config.taglineFontSize * 0.85;
    textElements += `
      <text
        x="50%"
        y="${taglineY}"
        text-anchor="middle"
        dominant-baseline="auto"
        fill="${config.taglineColor}"
        font-family="${effectiveFontFamily}"
        font-size="${config.taglineFontSize}px"
        font-weight="400"
        letter-spacing="${config.taglineLetterSpacing}px"
      >${escapeXml(config.tagline.toUpperCase())}</text>`;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;

  return { svg, width, height };
}

// Get base URL from request
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  return `${protocol}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const config: WordMarkConfig = await request.json();

    if (!config.text || !config.text.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Initialize WASM
    await ensureWasmInitialized();

    // Get base URL for fetching fonts
    const baseUrl = getBaseUrl(request);

    // Get effective font family
    const effectiveFontFamily = getEffectiveFontFamily(config.fontFamily);

    // Load font buffers
    const mainFontBuffer = await loadFontBuffer(effectiveFontFamily, config.fontWeight, baseUrl);
    const regularFontBuffer = await loadFontBuffer(effectiveFontFamily, "400", baseUrl);

    if (!mainFontBuffer) {
      return NextResponse.json(
        { error: `Font ${config.fontFamily} not available` },
        { status: 400 }
      );
    }

    // Create SVG
    const { svg, width, height } = createWordMarkSvg(config);

    // Collect font buffers
    const fontBuffers: Uint8Array[] = [mainFontBuffer];
    if (regularFontBuffer && regularFontBuffer !== mainFontBuffer) {
      fontBuffers.push(regularFontBuffer);
    }

    // Use resvg to render SVG to PNG with fonts
    const scaleFactor = 2;
    console.log(`Creating Resvg with ${fontBuffers.length} font buffer(s), sizes: ${fontBuffers.map(b => b.length).join(', ')}`);
    console.log(`SVG: ${svg.substring(0, 200)}...`);

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: width * scaleFactor,
      },
      font: {
        fontBuffers,
        defaultFontFamily: effectiveFontFamily,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    console.log(`Rendered PNG size: ${pngBuffer.length} bytes`);

    return NextResponse.json({
      success: true,
      base64: Buffer.from(pngBuffer).toString("base64"),
      width: width * scaleFactor,
      height: height * scaleFactor,
    });
  } catch (error) {
    console.error("Word mark creation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create word mark",
      },
      { status: 500 }
    );
  }
}
