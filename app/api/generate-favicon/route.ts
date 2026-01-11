import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

interface FaviconConfig {
  imageBase64: string;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
  sizes?: number[];
}

interface FaviconVariant {
  size: number;
  name: string;
  description: string;
  base64: string;
}

// Standard favicon sizes and their purposes
const DEFAULT_SIZES = [
  { size: 16, name: "favicon-16x16.png", description: "Standard browser favicon" },
  { size: 32, name: "favicon-32x32.png", description: "Standard browser favicon (high-DPI)" },
  { size: 48, name: "favicon-48x48.png", description: "Windows site icon" },
  { size: 64, name: "favicon-64x64.png", description: "Windows site icon (high-DPI)" },
  { size: 180, name: "apple-touch-icon.png", description: "Apple Touch Icon (iOS)" },
  { size: 192, name: "android-chrome-192x192.png", description: "Android Chrome icon" },
  { size: 512, name: "android-chrome-512x512.png", description: "Android Chrome splash / PWA" },
];

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Generate a single favicon at a specific size
async function generateFavicon(
  imageBuffer: Buffer,
  size: number,
  config: {
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
  }
): Promise<Buffer> {
  const padding = config.padding ?? 0;
  const paddingPixels = Math.round((size * padding) / 100);
  const contentSize = size - paddingPixels * 2;

  // Resize image to fit within content area
  let resizedImage = await sharp(imageBuffer)
    .resize(contentSize, contentSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Create the base canvas
  let canvas: sharp.Sharp;

  if (config.backgroundColor && config.backgroundColor !== "transparent") {
    const bgColor = hexToRgb(config.backgroundColor);
    if (bgColor) {
      canvas = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: bgColor.r, g: bgColor.g, b: bgColor.b, alpha: 255 },
        },
      });
    } else {
      canvas = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      });
    }
  } else {
    canvas = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });
  }

  // Composite the resized image onto the canvas
  let result = await canvas
    .composite([
      {
        input: resizedImage,
        top: paddingPixels,
        left: paddingPixels,
      },
    ])
    .png()
    .toBuffer();

  // Apply border radius if specified
  if (config.borderRadius && config.borderRadius > 0) {
    const radiusPixels = Math.round((size * config.borderRadius) / 100);
    const roundedCornersSvg = `
      <svg width="${size}" height="${size}">
        <rect x="0" y="0" width="${size}" height="${size}" rx="${radiusPixels}" ry="${radiusPixels}" fill="white"/>
      </svg>
    `;

    const mask = await sharp(Buffer.from(roundedCornersSvg))
      .png()
      .toBuffer();

    // Extract just the alpha from the mask
    const maskData = await sharp(mask)
      .extractChannel("red")
      .raw()
      .toBuffer();

    // Get the current image data
    const imageData = await sharp(result)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Apply mask to alpha channel
    const maskedData = Buffer.alloc(imageData.data.length);
    for (let i = 0; i < size * size; i++) {
      maskedData[i * 4] = imageData.data[i * 4];     // R
      maskedData[i * 4 + 1] = imageData.data[i * 4 + 1]; // G
      maskedData[i * 4 + 2] = imageData.data[i * 4 + 2]; // B
      // Multiply alpha by mask value
      maskedData[i * 4 + 3] = Math.round(
        (imageData.data[i * 4 + 3] * maskData[i]) / 255
      );
    }

    result = await sharp(maskedData, {
      raw: { width: size, height: size, channels: 4 },
    })
      .png()
      .toBuffer();
  }

  return result;
}

// Generate ICO file from PNG buffers (supports multiple sizes)
function generateIco(pngBuffers: { size: number; buffer: Buffer }[]): Buffer {
  // ICO file format:
  // - ICONDIR header (6 bytes)
  // - ICONDIRENTRY for each image (16 bytes each)
  // - Image data

  const imageCount = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  const entriesSize = entrySize * imageCount;

  // Calculate total size
  let totalDataSize = 0;
  for (const { buffer } of pngBuffers) {
    totalDataSize += buffer.length;
  }

  const totalSize = headerSize + entriesSize + totalDataSize;
  const ico = Buffer.alloc(totalSize);

  // ICONDIR header
  ico.writeUInt16LE(0, 0);      // Reserved (must be 0)
  ico.writeUInt16LE(1, 2);      // Image type (1 = ICO)
  ico.writeUInt16LE(imageCount, 4); // Number of images

  // Write entries and data
  let dataOffset = headerSize + entriesSize;

  for (let i = 0; i < imageCount; i++) {
    const { size, buffer } = pngBuffers[i];
    const entryOffset = headerSize + (i * entrySize);

    // ICONDIRENTRY
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset);      // Width (0 means 256)
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);  // Height (0 means 256)
    ico.writeUInt8(0, entryOffset + 2);                         // Color palette (0 = no palette)
    ico.writeUInt8(0, entryOffset + 3);                         // Reserved
    ico.writeUInt16LE(1, entryOffset + 4);                      // Color planes
    ico.writeUInt16LE(32, entryOffset + 6);                     // Bits per pixel
    ico.writeUInt32LE(buffer.length, entryOffset + 8);          // Image data size
    ico.writeUInt32LE(dataOffset, entryOffset + 12);            // Offset to image data

    // Copy image data
    buffer.copy(ico, dataOffset);
    dataOffset += buffer.length;
  }

  return ico;
}

export async function POST(request: NextRequest) {
  try {
    const config: FaviconConfig = await request.json();

    if (!config.imageBase64) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(config.imageBase64, "base64");

    // Validate the image
    try {
      await sharp(imageBuffer).metadata();
    } catch {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    // Determine which sizes to generate
    const requestedSizes = config.sizes && config.sizes.length > 0
      ? DEFAULT_SIZES.filter(s => config.sizes!.includes(s.size))
      : DEFAULT_SIZES;

    // Generate favicons for all sizes
    const variants: FaviconVariant[] = [];
    const icoBuffers: { size: number; buffer: Buffer }[] = [];

    for (const sizeInfo of requestedSizes) {
      const faviconBuffer = await generateFavicon(imageBuffer, sizeInfo.size, {
        backgroundColor: config.backgroundColor,
        padding: config.padding,
        borderRadius: config.borderRadius,
      });

      variants.push({
        size: sizeInfo.size,
        name: sizeInfo.name,
        description: sizeInfo.description,
        base64: faviconBuffer.toString("base64"),
      });

      // Collect smaller sizes for ICO file (16, 32, 48)
      if (sizeInfo.size <= 48) {
        icoBuffers.push({
          size: sizeInfo.size,
          buffer: faviconBuffer,
        });
      }
    }

    // Generate ICO file with multiple sizes
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
    console.error("Favicon generation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate favicons",
      },
      { status: 500 }
    );
  }
}
