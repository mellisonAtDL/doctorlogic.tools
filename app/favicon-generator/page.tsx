"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface FaviconVariant {
  size: number;
  name: string;
  description: string;
  base64: string;
}

interface FaviconConfig {
  backgroundColor: string;
  padding: number;
  borderRadius: number;
}

interface CreateConfig {
  text: string;
  textColor: string;
  backgroundColor: string;
  shape: "square" | "rounded" | "circle";
  fontFamily: string;
}

type Mode = "choose" | "upload" | "create";
type Step = "choose" | "upload" | "configure" | "processing" | "download";

const PRESET_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Red", value: "#ef4444" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Yellow", value: "#eab308" },
];

const FONTS = [
  { name: "Inter", value: "Inter" },
  { name: "Roboto", value: "Roboto" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Poppins", value: "Poppins" },
  { name: "Open Sans", value: "Open Sans" },
  { name: "Lato", value: "Lato" },
];

export default function FaviconGeneratorPage() {
  const [mode, setMode] = useState<Mode>("choose");
  const [step, setStep] = useState<Step>("choose");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [config, setConfig] = useState<FaviconConfig>({
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 0,
  });
  const [createConfig, setCreateConfig] = useState<CreateConfig>({
    text: "A",
    textColor: "#ffffff",
    backgroundColor: "#3b82f6",
    shape: "rounded",
    fontFamily: "Inter",
  });
  const [variants, setVariants] = useState<FaviconVariant[]>([]);
  const [icoBase64, setIcoBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setError(null);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setUploadedImage(base64);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleSelectMode = (selectedMode: "upload" | "create") => {
    setMode(selectedMode);
    if (selectedMode === "upload") {
      setStep("upload");
    } else {
      setStep("configure");
    }
  };

  const handleGenerateFromUpload = async () => {
    if (!uploadedImage) return;

    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/generate-favicon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          backgroundColor: config.backgroundColor,
          padding: config.padding,
          borderRadius: config.borderRadius,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate favicons");
      }

      setVariants(data.variants);
      setIcoBase64(data.ico);
      setStep("download");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("configure");
    }
  };

  const handleGenerateFromScratch = async () => {
    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/create-favicon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createConfig),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create favicons");
      }

      setVariants(data.variants);
      setIcoBase64(data.ico);
      setStep("download");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("configure");
    }
  };

  const handleDownload = (variant: FaviconVariant) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${variant.base64}`;
    link.download = variant.name;
    link.click();
  };

  const handleDownloadIco = () => {
    if (!icoBase64) return;
    const link = document.createElement("a");
    link.href = `data:image/x-icon;base64,${icoBase64}`;
    link.download = "favicon.ico";
    link.click();
  };

  const handleDownloadAll = () => {
    variants.forEach((variant, index) => {
      setTimeout(() => handleDownload(variant), index * 100);
    });
    if (icoBase64) {
      setTimeout(() => handleDownloadIco(), variants.length * 100);
    }
  };

  const handleReset = () => {
    setMode("choose");
    setStep("choose");
    setUploadedImage(null);
    setUploadedFileName("");
    setVariants([]);
    setIcoBase64(null);
    setError(null);
    setConfig({
      backgroundColor: "transparent",
      padding: 10,
      borderRadius: 0,
    });
    setCreateConfig({
      text: "A",
      textColor: "#ffffff",
      backgroundColor: "#3b82f6",
      shape: "rounded",
      fontFamily: "Inter",
    });
  };

  const getStepLabels = () => {
    if (mode === "create") {
      return ["Choose", "Configure", "Processing", "Download"];
    }
    return ["Choose", "Upload", "Configure", "Processing", "Download"];
  };

  const getStepIndex = () => {
    if (mode === "create") {
      const steps = ["choose", "configure", "processing", "download"];
      return steps.indexOf(step);
    }
    const steps = ["choose", "upload", "configure", "processing", "download"];
    return steps.indexOf(step);
  };

  const getBorderRadius = () => {
    switch (createConfig.shape) {
      case "circle":
        return "50%";
      case "rounded":
        return "20%";
      default:
        return "0";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Favicon Generator
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {getStepLabels().map((label, i) => {
            const isActive = getStepIndex() >= i;
            const isCurrent = getStepIndex() === i;

            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm hidden sm:inline ${
                    isCurrent ? "text-gray-900 font-medium" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {i < getStepLabels().length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${isActive ? "bg-blue-200" : "bg-gray-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step: Choose Mode */}
        {step === "choose" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
              How would you like to create your favicon?
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Upload an existing logo or create one from scratch
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => handleSelectMode("upload")}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upload Logo
                </h3>
                <p className="text-sm text-gray-500">
                  Use an existing logo or icon image to generate favicons
                </p>
              </button>

              <button
                onClick={() => handleSelectMode("create")}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Create from Scratch
                </h3>
                <p className="text-sm text-gray-500">
                  Design a simple favicon with a letter, colors, and shape
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step: Upload */}
        {step === "upload" && mode === "upload" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : uploadedImage
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={`data:image/png;base64,${uploadedImage}`}
                      alt="Uploaded image"
                      className="max-h-40 max-w-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{uploadedFileName}</p>
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedFileName("");
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Choose a different file
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <svg
                      className="mx-auto w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your logo or icon here, or
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      browse files
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-400 mt-4">
                    For best results, use a square image (PNG or SVG recommended)
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  setStep("choose");
                  setMode("choose");
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              {uploadedImage && (
                <button
                  onClick={() => setStep("configure")}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Configure
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step: Configure (Upload Mode) */}
        {step === "configure" && mode === "upload" && uploadedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Customize Your Favicon
              </h2>

              <div className="space-y-6">
                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      onClick={() =>
                        setConfig({ ...config, backgroundColor: "transparent" })
                      }
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        config.backgroundColor === "transparent"
                          ? "border-blue-500 scale-110"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{
                        background:
                          "repeating-conic-gradient(#d1d5db 0% 25%, transparent 0% 50%) 50%/8px 8px",
                      }}
                      title="Transparent"
                    />
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setConfig({ ...config, backgroundColor: color.value })
                        }
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          config.backgroundColor === color.value
                            ? "border-blue-500 scale-110"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{ background: color.value }}
                        title={color.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={
                        config.backgroundColor === "transparent"
                          ? "#ffffff"
                          : config.backgroundColor
                      }
                      onChange={(e) =>
                        setConfig({ ...config, backgroundColor: e.target.value })
                      }
                      className="w-8 h-8 rounded-lg border-2 border-gray-200 cursor-pointer"
                      title="Custom color"
                    />
                  </div>
                </div>

                {/* Padding */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Padding: {config.padding}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={config.padding}
                    onChange={(e) =>
                      setConfig({ ...config, padding: parseInt(e.target.value) })
                    }
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Radius: {config.borderRadius}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={config.borderRadius}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        borderRadius: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Square</span>
                    <span>Circle</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep("upload")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateFromUpload}
                  className="flex-1 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Favicons
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Preview</h2>

              <div className="space-y-4">
                {/* Light Background Preview */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">On light background</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center gap-6">
                    {[128, 64, 32].map((size) => (
                      <div
                        key={size}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="flex items-center justify-center overflow-hidden"
                          style={{
                            width: size,
                            height: size,
                            borderRadius: `${(size * config.borderRadius) / 100}px`,
                            background:
                              config.backgroundColor === "transparent"
                                ? "repeating-conic-gradient(#d1d5db 0% 25%, transparent 0% 50%) 50%/4px 4px"
                                : config.backgroundColor,
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${uploadedImage}`}
                            alt="Preview"
                            style={{
                              width: size - (size * config.padding * 2) / 100,
                              height: size - (size * config.padding * 2) / 100,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{size}px</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dark Background Preview */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">On dark background</p>
                  <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center gap-6">
                    {[128, 64, 32].map((size) => (
                      <div
                        key={size}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="flex items-center justify-center overflow-hidden"
                          style={{
                            width: size,
                            height: size,
                            borderRadius: `${(size * config.borderRadius) / 100}px`,
                            background:
                              config.backgroundColor === "transparent"
                                ? "transparent"
                                : config.backgroundColor,
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${uploadedImage}`}
                            alt="Preview"
                            style={{
                              width: size - (size * config.padding * 2) / 100,
                              height: size - (size * config.padding * 2) / 100,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{size}px</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browser Tab Preview */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Browser tab preview</p>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="bg-white rounded-t-lg shadow-sm">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
                        <div
                          className="w-4 h-4 flex items-center justify-center overflow-hidden flex-shrink-0"
                          style={{
                            borderRadius: `${(16 * config.borderRadius) / 100}px`,
                            background:
                              config.backgroundColor === "transparent"
                                ? "transparent"
                                : config.backgroundColor,
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${uploadedImage}`}
                            alt="Favicon"
                            className="w-full h-full object-contain"
                            style={{
                              width: 16 - (16 * config.padding * 2) / 100,
                              height: 16 - (16 * config.padding * 2) / 100,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-700 truncate">
                          Your Website
                        </span>
                        <span className="text-gray-400 ml-auto">x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Configure (Create Mode) */}
        {step === "configure" && mode === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Design Your Favicon
              </h2>

              <div className="space-y-6">
                {/* Text/Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Letter or Text (1-2 characters)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={createConfig.text}
                    onChange={(e) =>
                      setCreateConfig({
                        ...createConfig,
                        text: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl font-bold text-center"
                    placeholder="A"
                  />
                </div>

                {/* Font */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font
                  </label>
                  <select
                    value={createConfig.fontFamily}
                    onChange={(e) =>
                      setCreateConfig({
                        ...createConfig,
                        fontFamily: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {FONTS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shape */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shape
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "square", label: "Square", radius: "0" },
                      { value: "rounded", label: "Rounded", radius: "20%" },
                      { value: "circle", label: "Circle", radius: "50%" },
                    ].map((shape) => (
                      <button
                        key={shape.value}
                        onClick={() =>
                          setCreateConfig({
                            ...createConfig,
                            shape: shape.value as "square" | "rounded" | "circle",
                          })
                        }
                        className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                          createConfig.shape === shape.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className="w-8 h-8 mx-auto mb-2 bg-gray-300"
                          style={{ borderRadius: shape.radius }}
                        />
                        <span className="text-sm text-gray-700">
                          {shape.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setCreateConfig({
                            ...createConfig,
                            backgroundColor: color.value,
                          })
                        }
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          createConfig.backgroundColor === color.value
                            ? "border-blue-500 scale-110"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{ background: color.value }}
                        title={color.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={createConfig.backgroundColor}
                      onChange={(e) =>
                        setCreateConfig({
                          ...createConfig,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded-lg border-2 border-gray-200 cursor-pointer"
                      title="Custom color"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setCreateConfig({
                            ...createConfig,
                            textColor: color.value,
                          })
                        }
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          createConfig.textColor === color.value
                            ? "border-blue-500 scale-110"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{ background: color.value }}
                        title={color.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={createConfig.textColor}
                      onChange={(e) =>
                        setCreateConfig({
                          ...createConfig,
                          textColor: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded-lg border-2 border-gray-200 cursor-pointer"
                      title="Custom color"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    setStep("choose");
                    setMode("choose");
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateFromScratch}
                  disabled={!createConfig.text}
                  className="flex-1 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Favicons
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Preview</h2>

              <div className="space-y-4">
                {/* Light Background Preview */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">On light background</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center gap-6">
                    {[128, 64, 32].map((size) => (
                      <div
                        key={size}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: size,
                            height: size,
                            borderRadius: getBorderRadius(),
                            backgroundColor: createConfig.backgroundColor,
                            color: createConfig.textColor,
                            fontFamily: createConfig.fontFamily,
                            fontSize: size * 0.6,
                            fontWeight: 700,
                          }}
                        >
                          {createConfig.text || "A"}
                        </div>
                        <span className="text-xs text-gray-400">{size}px</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dark Background Preview */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">On dark background</p>
                  <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center gap-6">
                    {[128, 64, 32].map((size) => (
                      <div
                        key={size}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: size,
                            height: size,
                            borderRadius: getBorderRadius(),
                            backgroundColor: createConfig.backgroundColor,
                            color: createConfig.textColor,
                            fontFamily: createConfig.fontFamily,
                            fontSize: size * 0.6,
                            fontWeight: 700,
                          }}
                        >
                          {createConfig.text || "A"}
                        </div>
                        <span className="text-xs text-gray-500">{size}px</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browser Tab Preview */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Browser tab preview</p>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="bg-white rounded-t-lg shadow-sm">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
                        <div
                          className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                          style={{
                            borderRadius: getBorderRadius(),
                            backgroundColor: createConfig.backgroundColor,
                            color: createConfig.textColor,
                            fontFamily: createConfig.fontFamily,
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {createConfig.text?.charAt(0) || "A"}
                        </div>
                        <span className="text-sm text-gray-700 truncate">
                          Your Website
                        </span>
                        <span className="text-gray-400 ml-auto">x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Processing */}
        {step === "processing" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Generating favicons...
            </h2>
            <p className="text-gray-500">
              Creating all sizes for different devices and platforms
            </p>
          </div>
        )}

        {/* Step: Download */}
        {step === "download" && variants.length > 0 && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Favicons Generated!
              </h2>
              <p className="text-gray-500 mb-4">
                {variants.length} sizes created for all platforms
              </p>
              <button
                onClick={handleDownloadAll}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download All Files
              </button>
            </div>

            {/* Favicon Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Individual Files
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* ICO File */}
                {icoBase64 && (
                  <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors">
                    <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center h-32">
                      <img
                        src={`data:image/png;base64,${variants.find((v) => v.size === 32)?.base64}`}
                        alt="favicon.ico"
                        className="max-h-full max-w-full object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      favicon.ico
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Multi-size (16, 32, 48)
                    </p>
                    <button
                      onClick={handleDownloadIco}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Download
                    </button>
                  </div>
                )}

                {/* PNG Files */}
                {variants.map((variant) => (
                  <div
                    key={variant.name}
                    className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors"
                  >
                    <div className="bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center h-32">
                      <img
                        src={`data:image/png;base64,${variant.base64}`}
                        alt={variant.name}
                        className="max-h-full max-w-full object-contain"
                        style={{
                          maxWidth: Math.min(variant.size, 96),
                          maxHeight: Math.min(variant.size, 96),
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {variant.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {variant.size}x{variant.size}
                    </p>
                    <button
                      onClick={() => handleDownload(variant)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Over */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Generate favicons for another image
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
