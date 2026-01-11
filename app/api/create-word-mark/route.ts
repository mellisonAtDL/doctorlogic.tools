import { Resvg } from "@resvg/resvg-js";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

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

// Get the fonts directory path
function getFontsDir(): string {
  // In production, fonts are in public/fonts
  // During development, use process.cwd()
  return path.join(process.cwd(), "public", "fonts");
}

// Get font file path
function getFontPath(fontFamily: string, fontWeight: string): string | null {
  const familyMap = fontFileMap[fontFamily];
  if (!familyMap) {
    // Try Inter as fallback
    return getFontPath("Inter", fontWeight);
  }

  // Find the closest available weight
  let fileName = familyMap[fontWeight];
  if (!fileName) {
    // Try to find closest weight
    const weights = Object.keys(familyMap).map(Number).sort((a, b) => a - b);
    const targetWeight = parseInt(fontWeight);
    const closestWeight = weights.reduce((prev, curr) =>
      Math.abs(curr - targetWeight) < Math.abs(prev - targetWeight) ? curr : prev
    );
    fileName = familyMap[closestWeight.toString()];
  }

  if (!fileName) {
    return null;
  }

  return path.join(getFontsDir(), fileName);
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

// Get the effective font family (map to available fonts or use fallback)
function getEffectiveFontFamily(fontFamily: string): string {
  if (fontFileMap[fontFamily]) {
    return fontFamily;
  }
  // Map similar fonts to available ones
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
  // Transform the text
  const transformedText = transformText(config.text, config.textTransform);

  // Get effective font family (mapped to available fonts)
  const effectiveFontFamily = getEffectiveFontFamily(config.fontFamily);

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
        font-family="${effectiveFontFamily}"
        font-size="${config.taglineFontSize}px"
        font-weight="400"
        letter-spacing="${config.taglineLetterSpacing}px"
      >${escapeXml(config.tagline.toUpperCase())}</text>`;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;

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

    // Get effective font family
    const effectiveFontFamily = getEffectiveFontFamily(config.fontFamily);

    // Get font file paths for resvg
    const mainFontPath = getFontPath(effectiveFontFamily, config.fontWeight);
    const regularFontPath = getFontPath(effectiveFontFamily, "400");

    if (!mainFontPath) {
      return NextResponse.json(
        { error: `Font ${config.fontFamily} not available` },
        { status: 400 }
      );
    }

    // Validate font files exist
    if (!fs.existsSync(mainFontPath)) {
      return NextResponse.json(
        { error: `Font file not found: ${mainFontPath}` },
        { status: 500 }
      );
    }

    // Create SVG
    const { svg, width, height } = createWordMarkSvg(config);

    // Use resvg to render SVG to PNG with fonts
    const scaleFactor = 2;
    const fontFiles: string[] = [mainFontPath];
    if (regularFontPath && regularFontPath !== mainFontPath && fs.existsSync(regularFontPath)) {
      fontFiles.push(regularFontPath);
    }

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: width * scaleFactor,
      },
      font: {
        fontFiles,
        loadSystemFonts: false,
        defaultFontFamily: effectiveFontFamily,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return NextResponse.json({
      success: true,
      base64: pngBuffer.toString("base64"),
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
