"use client";

import { useState } from "react";
import Link from "next/link";

interface WordMarkResult {
  base64: string;
  width: number;
  height: number;
}

type Step = "configure" | "processing" | "preview" | "download";

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

const FONT_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Oswald, sans-serif", label: "Oswald" },
  { value: "Raleway, sans-serif", label: "Raleway" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Merriweather, serif", label: "Merriweather" },
];

const FONT_WEIGHTS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

const PRESET_COLORS = [
  "#000000",
  "#1a1a1a",
  "#374151",
  "#1e40af",
  "#1d4ed8",
  "#0891b2",
  "#059669",
  "#7c3aed",
  "#be185d",
  "#dc2626",
];

export default function WordMarkCreatorPage() {
  const [step, setStep] = useState<Step>("configure");
  const [config, setConfig] = useState<WordMarkConfig>({
    text: "",
    fontFamily: "Inter, sans-serif",
    fontSize: 72,
    fontWeight: "600",
    color: "#1a1a1a",
    backgroundColor: "transparent",
    letterSpacing: 0,
    padding: 40,
    layout: "single",
  });
  const [result, setResult] = useState<WordMarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateConfig = <K extends keyof WordMarkConfig>(
    key: K,
    value: WordMarkConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!config.text.trim()) {
      setError("Please enter text for the word mark");
      return;
    }

    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/create-word-mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create word mark");
      }

      setResult(data);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("configure");
    }
  };

  const handleDownload = (format: "png" | "svg") => {
    if (!result) return;

    const link = document.createElement("a");
    if (format === "png") {
      link.href = `data:image/png;base64,${result.base64}`;
      link.download = `${config.text.replace(/\s+/g, "-").toLowerCase()}-wordmark.png`;
    }
    link.click();
  };

  const handleReset = () => {
    setStep("configure");
    setResult(null);
    setError(null);
  };

  // Get display name for the font
  const getFontLabel = (fontFamily: string) => {
    const font = FONT_OPTIONS.find((f) => f.value === fontFamily);
    return font?.label || fontFamily;
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
              Word Mark Creator
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Configure", "Processing", "Preview", "Download"].map((label, i) => {
            const stepNames: Step[] = [
              "configure",
              "processing",
              "preview",
              "download",
            ];
            const isActive = stepNames.indexOf(step) >= i;
            const isCurrent = step === stepNames[i];

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
                {i < 3 && (
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

        {/* Step 1: Configure */}
        {step === "configure" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Configure Your Word Mark
              </h2>

              {/* Text Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={config.text}
                  onChange={(e) => updateConfig("text", e.target.value)}
                  placeholder="Enter business name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Layout */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateConfig("layout", "single")}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      config.layout === "single"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Single Line
                  </button>
                  <button
                    onClick={() => updateConfig("layout", "stacked")}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      config.layout === "stacked"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Stacked
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateConfig("fontFamily", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Weight */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Weight
                </label>
                <select
                  value={config.fontWeight}
                  onChange={(e) => updateConfig("fontWeight", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {FONT_WEIGHTS.map((weight) => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {config.fontSize}px
                </label>
                <input
                  type="range"
                  min="24"
                  max="200"
                  value={config.fontSize}
                  onChange={(e) =>
                    updateConfig("fontSize", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Letter Spacing */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Letter Spacing: {config.letterSpacing}px
                </label>
                <input
                  type="range"
                  min="-5"
                  max="20"
                  value={config.letterSpacing}
                  onChange={(e) =>
                    updateConfig("letterSpacing", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Text Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateConfig("color", color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          config.color === color
                            ? "border-blue-500 scale-110"
                            : "border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={config.color}
                    onChange={(e) => updateConfig("color", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                </div>
              </div>

              {/* Padding */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Padding: {config.padding}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.padding}
                  onChange={(e) =>
                    updateConfig("padding", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  Preview on Light Background
                </h3>
                <div
                  className="border border-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[200px] bg-white"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      fontFamily: config.fontFamily,
                      fontSize: `${Math.min(config.fontSize, 48)}px`,
                      fontWeight: config.fontWeight,
                      color: config.color,
                      letterSpacing: `${config.letterSpacing}px`,
                      textAlign: "center",
                      whiteSpace:
                        config.layout === "stacked" ? "pre-wrap" : "nowrap",
                      lineHeight: config.layout === "stacked" ? 1.2 : 1,
                    }}
                  >
                    {config.layout === "stacked" && config.text.includes(" ")
                      ? config.text.split(" ").join("\n")
                      : config.text || "Your Business Name"}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">
                  Preview on Dark Background
                </h3>
                <div
                  className="rounded-lg p-8 flex items-center justify-center min-h-[200px]"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      fontFamily: config.fontFamily,
                      fontSize: `${Math.min(config.fontSize, 48)}px`,
                      fontWeight: config.fontWeight,
                      color: config.color,
                      letterSpacing: `${config.letterSpacing}px`,
                      textAlign: "center",
                      whiteSpace:
                        config.layout === "stacked" ? "pre-wrap" : "nowrap",
                      lineHeight: config.layout === "stacked" ? 1.2 : 1,
                    }}
                  >
                    {config.layout === "stacked" && config.text.includes(" ")
                      ? config.text.split(" ").join("\n")
                      : config.text || "Your Business Name"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!config.text.trim()}
                className="w-full px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Generate Word Mark
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === "processing" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Generating your word mark...
            </h2>
            <p className="text-gray-500">
              Creating high-resolution PNG with your settings
            </p>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === "preview" && result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
              Your Word Mark is Ready
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Preview how it looks on different backgrounds
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Light Background
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                  <img
                    src={`data:image/png;base64,${result.base64}`}
                    alt="Word mark preview"
                    className="max-w-full max-h-[180px] object-contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Dark Background
                </h3>
                <div className="bg-slate-800 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                  <img
                    src={`data:image/png;base64,${result.base64}`}
                    alt="Word mark preview"
                    className="max-w-full max-h-[180px] object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mb-6">
              Dimensions: {result.width} × {result.height}px
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStep("download")}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Download
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit Settings
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Download */}
        {step === "download" && result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
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
                Word Mark Created Successfully
              </h2>
              <p className="text-gray-500">
                Download your word mark in high resolution
              </p>
            </div>

            {/* Final Preview */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center h-40">
                <img
                  src={`data:image/png;base64,${result.base64}`}
                  alt="Preview on light"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center h-40">
                <img
                  src={`data:image/png;base64,${result.base64}`}
                  alt="Preview on dark"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* Settings Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Settings Used
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Font:</span>
                  <span className="ml-1 text-gray-900">
                    {getFontLabel(config.fontFamily)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Weight:</span>
                  <span className="ml-1 text-gray-900">{config.fontWeight}</span>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <span className="ml-1 text-gray-900">{config.fontSize}px</span>
                </div>
                <div>
                  <span className="text-gray-500">Color:</span>
                  <span
                    className="ml-1 inline-block w-4 h-4 rounded border border-gray-300 align-middle"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleDownload("png")}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
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
                Download PNG
              </button>
              <button
                onClick={() => setStep("preview")}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Preview
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Create another word mark
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
