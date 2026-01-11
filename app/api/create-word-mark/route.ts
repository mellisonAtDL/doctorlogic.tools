import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

interface WordMarkConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  letterSpacing: number;
  padding: number;
  layout: "single" | "stacked";
}

// Map font family to Google Fonts URL-friendly name
function getFontFileName(fontFamily: string): string {
  const fontMap: Record<string, string> = {
    "Inter, sans-serif": "Inter",
    "Playfair Display, serif": "Playfair Display",
    "Montserrat, sans-serif": "Montserrat",
    "Roboto, sans-serif": "Roboto",
    "Open Sans, sans-serif": "Open Sans",
    "Lato, sans-serif": "Lato",
    "Oswald, sans-serif": "Oswald",
    "Raleway, sans-serif": "Raleway",
    "Poppins, sans-serif": "Poppins",
    "Merriweather, serif": "Merriweather",
  };
  return fontMap[fontFamily] || "Inter";
}

// Get Google Fonts CSS import
function getGoogleFontImport(fontName: string, fontWeight: string): string {
  const encodedFont = fontName.replace(/ /g, "+");
  return `@import url('https://fonts.googleapis.com/css2?family=${encodedFont}:wght@${fontWeight}&display=swap');`;
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

// Calculate text dimensions (approximate)
function calculateTextDimensions(
  text: string,
  fontSize: number,
  fontWeight: string,
  letterSpacing: number,
  layout: "single" | "stacked"
): { width: number; height: number } {
  // Approximate character width based on font size and weight
  const weightMultiplier =
    parseInt(fontWeight) >= 600 ? 0.65 : parseInt(fontWeight) >= 500 ? 0.6 : 0.55;
  const charWidth = fontSize * weightMultiplier;
  const lineHeight = fontSize * 1.2;

  if (layout === "stacked" && text.includes(" ")) {
    const lines = text.split(" ");
    const maxLineLength = Math.max(...lines.map((line) => line.length));
    const width =
      maxLineLength * charWidth + (maxLineLength - 1) * letterSpacing;
    const height = lines.length * lineHeight;
    return { width: Math.ceil(width), height: Math.ceil(height) };
  }

  const width = text.length * charWidth + (text.length - 1) * letterSpacing;
  return { width: Math.ceil(width), height: Math.ceil(lineHeight) };
}

// Create SVG for the word mark
function createWordMarkSvg(config: WordMarkConfig): {
  svg: string;
  width: number;
  height: number;
} {
  const fontName = getFontFileName(config.fontFamily);
  const fontImport = getGoogleFontImport(fontName, config.fontWeight);
  const escapedText = escapeXml(config.text);

  // Calculate dimensions
  const textDimensions = calculateTextDimensions(
    config.text,
    config.fontSize,
    config.fontWeight,
    config.letterSpacing,
    config.layout
  );

  const width = textDimensions.width + config.padding * 2;
  const height = textDimensions.height + config.padding * 2;

  // For stacked layout, split text into lines
  const isStacked = config.layout === "stacked" && config.text.includes(" ");
  const lines = isStacked ? config.text.split(" ") : [config.text];

  // Calculate line height and vertical positioning
  const lineHeight = config.fontSize * 1.2;

  // Create text elements
  let textElements = "";
  if (isStacked) {
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + config.fontSize * 0.85;

    lines.forEach((line, index) => {
      textElements += `
        <text
          x="50%"
          y="${startY + index * lineHeight}"
          text-anchor="middle"
          dominant-baseline="auto"
          fill="${config.color}"
          font-family="'${fontName}', ${config.fontFamily.split(",")[1]?.trim() || "sans-serif"}"
          font-size="${config.fontSize}px"
          font-weight="${config.fontWeight}"
          letter-spacing="${config.letterSpacing}px"
        >${escapeXml(line)}</text>`;
    });
  } else {
    textElements = `
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="central"
        fill="${config.color}"
        font-family="'${fontName}', ${config.fontFamily.split(",")[1]?.trim() || "sans-serif"}"
        font-size="${config.fontSize}px"
        font-weight="${config.fontWeight}"
        letter-spacing="${config.letterSpacing}px"
      >${escapedText}</text>`;
  }

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style type="text/css">
          ${fontImport}
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

    // Create SVG
    const { svg, width, height } = createWordMarkSvg(config);

    // Convert SVG to PNG using Sharp
    // Use a higher density for better quality
    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(width * 2, height * 2) // 2x for retina quality
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
