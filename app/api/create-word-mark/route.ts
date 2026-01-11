import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

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

// Cache for embedded font data to avoid repeated fetches
const fontCache = new Map<string, string>();

// Fetch Google Font and return base64-embedded @font-face CSS
async function getEmbeddedFontCss(
  fontName: string,
  fontWeight: string,
  fontStyle: string
): Promise<string> {
  const cacheKey = `${fontName}-${fontWeight}-${fontStyle}`;

  // Check cache first
  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  const encodedFont = fontName.replace(/ /g, "+");

  // Build the Google Fonts CSS URL
  let cssUrl: string;
  if (fontStyle === "italic") {
    cssUrl = `https://fonts.googleapis.com/css2?family=${encodedFont}:ital,wght@0,400;1,${fontWeight}&display=swap`;
  } else {
    cssUrl = `https://fonts.googleapis.com/css2?family=${encodedFont}:wght@400;${fontWeight}&display=swap`;
  }

  try {
    // Fetch the CSS with a user-agent that returns woff2 format
    const cssResponse = await fetch(cssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!cssResponse.ok) {
      throw new Error(`Failed to fetch font CSS: ${cssResponse.status}`);
    }

    const cssText = await cssResponse.text();

    // Parse out all font URLs from the CSS
    const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
    const urlRegex = /src:\s*url\(([^)]+)\)\s*format\(['"]?woff2['"]?\)/;
    const fontWeightRegex = /font-weight:\s*(\d+)/;
    const fontStyleRegex = /font-style:\s*(\w+)/;

    let embeddedCss = "";
    let match;

    while ((match = fontFaceRegex.exec(cssText)) !== null) {
      const fontFaceBlock = match[1];
      const urlMatch = fontFaceBlock.match(urlRegex);
      const weightMatch = fontFaceBlock.match(fontWeightRegex);
      const styleMatch = fontFaceBlock.match(fontStyleRegex);

      if (urlMatch) {
        const fontUrl = urlMatch[1];
        const weight = weightMatch ? weightMatch[1] : "400";
        const style = styleMatch ? styleMatch[1] : "normal";

        // Fetch the actual font file
        const fontResponse = await fetch(fontUrl);
        if (fontResponse.ok) {
          const fontBuffer = await fontResponse.arrayBuffer();
          const base64Font = Buffer.from(fontBuffer).toString("base64");

          // Create embedded @font-face
          embeddedCss += `
            @font-face {
              font-family: '${fontName}';
              font-style: ${style};
              font-weight: ${weight};
              src: url(data:font/woff2;base64,${base64Font}) format('woff2');
            }
          `;
        }
      }
    }

    // Cache the result
    if (embeddedCss) {
      fontCache.set(cacheKey, embeddedCss);
    }

    return embeddedCss;
  } catch (error) {
    console.error("Error fetching font:", error);
    // Return empty string on error - will fall back to system fonts
    return "";
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
  // Approximate character width based on font size and weight
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

// Create SVG for the word mark
function createWordMarkSvg(config: WordMarkConfig, embeddedFontCss: string): {
  svg: string;
  width: number;
  height: number;
} {

  // Transform the text
  const transformedText = transformText(config.text, config.textTransform);

  // Calculate main text dimensions
  const textDimensions = calculateTextDimensions(
    transformedText,
    config.fontSize,
    config.fontWeight,
    config.letterSpacing,
    config.lineHeight,
    config.layout
  );

  // Calculate tagline dimensions if present
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

  // For stacked layout, split text into lines
  const isStacked = config.layout === "stacked" && transformedText.includes(" ");
  const lines = isStacked ? transformedText.split(" ") : [transformedText];

  // Calculate line height and vertical positioning
  const lineHeightPx = config.fontSize * config.lineHeight;

  // Build stroke attributes for text
  const strokeAttrs = config.strokeEnabled
    ? `stroke="${config.strokeColor}" stroke-width="${config.strokeWidth}" paint-order="stroke fill"`
    : "";

  // Create text elements
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
          font-family="'${config.fontFamily}', sans-serif"
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
        font-family="'${config.fontFamily}', sans-serif"
        font-size="${config.fontSize}px"
        font-weight="${config.fontWeight}"
        font-style="${config.fontStyle}"
        letter-spacing="${config.letterSpacing}px"
        ${strokeAttrs}
      >${escapeXml(transformedText)}</text>`;
  }

  // Add tagline if present
  if (config.tagline) {
    const taglineY = config.padding + textDimensions.height + taglineSpacing + config.taglineFontSize * 0.85;
    textElements += `
      <text
        x="50%"
        y="${taglineY}"
        text-anchor="middle"
        dominant-baseline="auto"
        fill="${config.taglineColor}"
        font-family="'${config.fontFamily}', sans-serif"
        font-size="${config.taglineFontSize}px"
        font-weight="400"
        letter-spacing="${config.taglineLetterSpacing}px"
        text-transform="uppercase"
      >${escapeXml(config.tagline.toUpperCase())}</text>`;
  }

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style type="text/css">
          ${embeddedFontCss}
        </style>
      </defs>
      ${textElements}
    </svg>
  `;

  return { svg, width, height };
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

    // Fetch and embed the font
    const embeddedFontCss = await getEmbeddedFontCss(
      config.fontFamily,
      config.fontWeight,
      config.fontStyle
    );

    // Create SVG with embedded font
    const { svg, width, height } = createWordMarkSvg(config, embeddedFontCss);

    // Convert SVG to PNG using Sharp
    // Use a higher density for better quality (2x for retina)
    const scaleFactor = 2;
    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(width * scaleFactor, height * scaleFactor)
      .png()
      .toBuffer();

    // Get actual dimensions of the final image
    const metadata = await sharp(pngBuffer).metadata();

    return NextResponse.json({
      success: true,
      base64: pngBuffer.toString("base64"),
      width: metadata.width,
      height: metadata.height,
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
