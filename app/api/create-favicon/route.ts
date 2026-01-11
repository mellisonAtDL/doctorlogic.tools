import { NextRequest, NextResponse } from "next/server";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { readFile } from "fs/promises";
import { join } from "path";

interface CreateFaviconConfig {
  text: string;
  textColor: string;
  backgroundColor: string;
  shape: "square" | "rounded" | "circle";
  fontFamily: string;
}

interface FaviconVariant {
  size: number;
  name: string;
  description: string;
  base64: string;
}

// Standard favicon sizes
const SIZES = [
  { size: 16, name: "favicon-16x16.png", description: "Standard browser favicon" },
  { size: 32, name: "favicon-32x32.png", description: "Standard browser favicon (high-DPI)" },
  { size: 48, name: "favicon-48x48.png", description: "Windows site icon" },
  { size: 64, name: "favicon-64x64.png", description: "Windows site icon (high-DPI)" },
  { size: 180, name: "apple-touch-icon.png", description: "Apple Touch Icon (iOS)" },
  { size: 192, name: "android-chrome-192x192.png", description: "Android Chrome icon" },
  { size: 512, name: "android-chrome-512x512.png", description: "Android Chrome splash / PWA" },
];

// Font file mapping
const fontFileMap: Record<string, string> = {
  Inter: "Inter-Bold.ttf",
  Roboto: "Roboto-Bold.ttf",
  Montserrat: "Montserrat-Bold.ttf",
  Poppins: "Poppins-Bold.ttf",
  "Open Sans": "OpenSans-Bold.ttf",
  Lato: "Lato-Bold.ttf",
};

// WASM initialization
let wasmInitialized = false;

async function initResvgWasm() {
  if (wasmInitialized) return;

  try {
    const wasmPath = join(process.cwd(), "node_modules", "@resvg", "resvg-wasm", "index_bg.wasm");
    const wasmBuffer = await readFile(wasmPath);
    await initWasm(wasmBuffer);
    wasmInitialized = true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Already initialized")) {
      wasmInitialized = true;
      return;
    }
    throw error;
  }
}

// Load font buffer
async function loadFontBuffer(fontFamily: string): Promise<Buffer> {
  const fontFile = fontFileMap[fontFamily] || "Inter-Bold.ttf";

  // Try loading from public/fonts first
  try {
    const fontPath = join(process.cwd(), "public", "fonts", fontFile);
    return await readFile(fontPath);
  } catch {
    // Fallback to Inter if font not found
    const fallbackPath = join(process.cwd(), "public", "fonts", "Inter-Bold.ttf");
    return await readFile(fallbackPath);
  }
}

// Get border radius for shape
function getBorderRadius(shape: string, size: number): number {
  switch (shape) {
    case "circle":
      return size / 2;
    case "rounded":
      return size * 0.2;
    default:
      return 0;
  }
}

// Generate SVG for favicon
function generateSvg(config: CreateFaviconConfig, size: number): string {
  const borderRadius = getBorderRadius(config.shape, size);
  const fontSize = size * 0.6;

  // Calculate text positioning (center)
  const textY = size / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="${config.backgroundColor}"/>
    <text x="50%" y="${textY}" dominant-baseline="central" text-anchor="middle" font-family="${config.fontFamily}, sans-serif" font-size="${fontSize}" font-weight="700" fill="${config.textColor}">${escapeXml(config.text)}</text>
  </svg>`;
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

// Generate ICO file from PNG buffers
function generateIco(pngBuffers: { size: number; buffer: Buffer }[]): Buffer {
  const imageCount = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  const entriesSize = entrySize * imageCount;

  let totalDataSize = 0;
  for (const { buffer } of pngBuffers) {
    totalDataSize += buffer.length;
  }

  const totalSize = headerSize + entriesSize + totalDataSize;
  const ico = Buffer.alloc(totalSize);

  // ICONDIR header
  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(imageCount, 4);

  let dataOffset = headerSize + entriesSize;

  for (let i = 0; i < imageCount; i++) {
    const { size, buffer } = pngBuffers[i];
    const entryOffset = headerSize + (i * entrySize);

    ico.writeUInt8(size === 256 ? 0 : size, entryOffset);
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    ico.writeUInt8(0, entryOffset + 2);
    ico.writeUInt8(0, entryOffset + 3);
    ico.writeUInt16LE(1, entryOffset + 4);
    ico.writeUInt16LE(32, entryOffset + 6);
    ico.writeUInt32LE(buffer.length, entryOffset + 8);
    ico.writeUInt32LE(dataOffset, entryOffset + 12);

    buffer.copy(ico, dataOffset);
    dataOffset += buffer.length;
  }

  return ico;
}

export async function POST(request: NextRequest) {
  try {
    const config: CreateFaviconConfig = await request.json();

    if (!config.text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Limit text to 2 characters
    const text = config.text.slice(0, 2).toUpperCase();
    const sanitizedConfig = { ...config, text };

    // Initialize resvg-wasm
    await initResvgWasm();

    // Load font
    const fontBuffer = await loadFontBuffer(config.fontFamily);

    // Generate favicons for all sizes
    const variants: FaviconVariant[] = [];
    const icoBuffers: { size: number; buffer: Buffer }[] = [];

    for (const sizeInfo of SIZES) {
      const svg = generateSvg(sanitizedConfig, sizeInfo.size);

      const resvg = new Resvg(svg, {
        font: {
          fontBuffers: [fontBuffer],
          loadSystemFonts: false,
          defaultFontFamily: config.fontFamily,
        },
        fitTo: {
          mode: "width",
          value: sizeInfo.size,
        },
      });

      const pngData = resvg.render();
      const pngBuffer = Buffer.from(pngData.asPng());

      variants.push({
        size: sizeInfo.size,
        name: sizeInfo.name,
        description: sizeInfo.description,
        base64: pngBuffer.toString("base64"),
      });

      // Collect smaller sizes for ICO file
      if (sizeInfo.size <= 48) {
        icoBuffers.push({
          size: sizeInfo.size,
          buffer: pngBuffer,
        });
      }
    }

    // Generate ICO file
    let icoBase64: string | null = null;
    if (icoBuffers.length > 0) {
      const icoBuffer = generateIco(icoBuffers);
      icoBase64 = icoBuffer.toString("base64");
    }

    return NextResponse.json({
      success: true,
      variants,
      ico: icoBase64,
    });
  } catch (error) {
    console.error("Favicon creation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create favicons",
      },
      { status: 500 }
    );
  }
}
