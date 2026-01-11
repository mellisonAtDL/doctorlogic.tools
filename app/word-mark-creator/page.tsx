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
  // Stroke/outline
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
  // Tagline settings
  taglineFontSize: number;
  taglineLetterSpacing: number;
  taglineColor: string;
}

const FONT_OPTIONS = [
  // Sans-serif - Modern/Clean
  { value: "Inter", label: "Inter", category: "Sans-serif" },
  { value: "Montserrat", label: "Montserrat", category: "Sans-serif" },
  { value: "Poppins", label: "Poppins", category: "Sans-serif" },
  { value: "Raleway", label: "Raleway", category: "Sans-serif" },
  { value: "Open Sans", label: "Open Sans", category: "Sans-serif" },
  { value: "Lato", label: "Lato", category: "Sans-serif" },
  { value: "Roboto", label: "Roboto", category: "Sans-serif" },
  { value: "Nunito", label: "Nunito", category: "Sans-serif" },
  { value: "Work Sans", label: "Work Sans", category: "Sans-serif" },
  { value: "DM Sans", label: "DM Sans", category: "Sans-serif" },
  { value: "Manrope", label: "Manrope", category: "Sans-serif" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans", category: "Sans-serif" },
  // Sans-serif - Bold/Display
  { value: "Oswald", label: "Oswald", category: "Display" },
  { value: "Bebas Neue", label: "Bebas Neue", category: "Display" },
  { value: "Anton", label: "Anton", category: "Display" },
  { value: "Archivo Black", label: "Archivo Black", category: "Display" },
  { value: "Righteous", label: "Righteous", category: "Display" },
  // Serif - Elegant/Classic
  { value: "Playfair Display", label: "Playfair Display", category: "Serif" },
  { value: "Merriweather", label: "Merriweather", category: "Serif" },
  { value: "Lora", label: "Lora", category: "Serif" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", category: "Serif" },
  { value: "Libre Baskerville", label: "Libre Baskerville", category: "Serif" },
  { value: "DM Serif Display", label: "DM Serif Display", category: "Serif" },
  { value: "Crimson Text", label: "Crimson Text", category: "Serif" },
  { value: "EB Garamond", label: "EB Garamond", category: "Serif" },
  // Script/Handwritten
  { value: "Great Vibes", label: "Great Vibes", category: "Script" },
  { value: "Pacifico", label: "Pacifico", category: "Script" },
  { value: "Dancing Script", label: "Dancing Script", category: "Script" },
  { value: "Satisfy", label: "Satisfy", category: "Script" },
  // Slab Serif
  { value: "Roboto Slab", label: "Roboto Slab", category: "Slab" },
  { value: "Arvo", label: "Arvo", category: "Slab" },
  { value: "Bitter", label: "Bitter", category: "Slab" },
];

const FONT_WEIGHTS = [
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" },
];

const PRESET_COLORS = [
  "#000000",
  "#1a1a1a",
  "#374151",
  "#6b7280",
  "#1e40af",
  "#1d4ed8",
  "#0891b2",
  "#0d9488",
  "#059669",
  "#16a34a",
  "#7c3aed",
  "#9333ea",
  "#be185d",
  "#e11d48",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#ca8a04",
];

const TEXT_TRANSFORMS = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

export default function WordMarkCreatorPage() {
  const [step, setStep] = useState<Step>("configure");
  const [activeTab, setActiveTab] = useState<"main" | "tagline" | "effects">("main");
  const [config, setConfig] = useState<WordMarkConfig>({
    text: "",
    tagline: "",
    fontFamily: "Inter",
    fontSize: 72,
    fontWeight: "600",
    fontStyle: "normal",
    textTransform: "none",
    color: "#1a1a1a",
    letterSpacing: 0,
    lineHeight: 1.2,
    padding: 40,
    layout: "single",
    strokeEnabled: false,
    strokeColor: "#ffffff",
    strokeWidth: 2,
    taglineFontSize: 18,
    taglineLetterSpacing: 2,
    taglineColor: "#6b7280",
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

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${result.base64}`;
    link.download = `${config.text.replace(/\s+/g, "-").toLowerCase()}-wordmark.png`;
    link.click();
  };

  const handleReset = () => {
    setStep("configure");
    setResult(null);
    setError(null);
  };

  // Transform text for display
  const transformText = (text: string): string => {
    switch (config.textTransform) {
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
  };

  // Get display text for preview
  const getDisplayText = () => {
    const transformed = transformText(config.text || "Your Business Name");
    if (config.layout === "stacked" && transformed.includes(" ")) {
      return transformed.split(" ").join("\n");
    }
    return transformed;
  };

  // Group fonts by category
  const fontsByCategory = FONT_OPTIONS.reduce(
    (acc, font) => {
      if (!acc[font.category]) {
        acc[font.category] = [];
      }
      acc[font.category].push(font);
      return acc;
    },
    {} as Record<string, typeof FONT_OPTIONS>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
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

      <div className="max-w-6xl mx-auto px-4 py-8">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("main")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "main"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Main Text
                </button>
                <button
                  onClick={() => setActiveTab("tagline")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "tagline"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Tagline
                </button>
                <button
                  onClick={() => setActiveTab("effects")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "effects"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Effects
                </button>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                {/* Main Text Tab */}
                {activeTab === "main" && (
                  <div className="space-y-6">
                    {/* Text Input */}
                    <div>
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
                    <div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Family
                      </label>
                      <select
                        value={config.fontFamily}
                        onChange={(e) => updateConfig("fontFamily", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      >
                        {Object.entries(fontsByCategory).map(([category, fonts]) => (
                          <optgroup key={category} label={category}>
                            {fonts.map((font) => (
                              <option key={font.value} value={font.value}>
                                {font.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Font Weight & Style Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Style
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateConfig("fontStyle", "normal")}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                              config.fontStyle === "normal"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            Normal
                          </button>
                          <button
                            onClick={() => updateConfig("fontStyle", "italic")}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors italic ${
                              config.fontStyle === "italic"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            Italic
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Text Transform */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Transform
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {TEXT_TRANSFORMS.map((transform) => (
                          <button
                            key={transform.value}
                            onClick={() =>
                              updateConfig(
                                "textTransform",
                                transform.value as WordMarkConfig["textTransform"]
                              )
                            }
                            className={`py-2 px-3 rounded-lg border-2 text-sm transition-colors ${
                              config.textTransform === transform.value
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {transform.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Letter Spacing: {config.letterSpacing}px
                      </label>
                      <input
                        type="range"
                        min="-5"
                        max="30"
                        value={config.letterSpacing}
                        onChange={(e) =>
                          updateConfig("letterSpacing", parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* Line Height (for stacked) */}
                    {config.layout === "stacked" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Line Height: {config.lineHeight.toFixed(1)}
                        </label>
                        <input
                          type="range"
                          min="0.8"
                          max="2"
                          step="0.1"
                          value={config.lineHeight}
                          onChange={(e) =>
                            updateConfig("lineHeight", parseFloat(e.target.value))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    )}

                    {/* Text Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2 flex-wrap flex-1">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              onClick={() => updateConfig("color", color)}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${
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
                    <div>
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
                )}

                {/* Tagline Tab */}
                {activeTab === "tagline" && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Add an optional tagline or descriptor below your main business name.
                      </p>
                    </div>

                    {/* Tagline Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tagline Text
                      </label>
                      <input
                        type="text"
                        value={config.tagline}
                        onChange={(e) => updateConfig("tagline", e.target.value)}
                        placeholder="e.g., Dental Care Excellence"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Tagline Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tagline Size: {config.taglineFontSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="48"
                        value={config.taglineFontSize}
                        onChange={(e) =>
                          updateConfig("taglineFontSize", parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* Tagline Letter Spacing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tagline Letter Spacing: {config.taglineLetterSpacing}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={config.taglineLetterSpacing}
                        onChange={(e) =>
                          updateConfig("taglineLetterSpacing", parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* Tagline Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tagline Color
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2 flex-wrap flex-1">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              onClick={() => updateConfig("taglineColor", color)}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${
                                config.taglineColor === color
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
                          value={config.taglineColor}
                          onChange={(e) => updateConfig("taglineColor", e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Effects Tab */}
                {activeTab === "effects" && (
                  <div className="space-y-6">
                    {/* Stroke/Outline */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">
                          Text Stroke / Outline
                        </label>
                        <button
                          onClick={() =>
                            updateConfig("strokeEnabled", !config.strokeEnabled)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.strokeEnabled ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.strokeEnabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {config.strokeEnabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              Stroke Width: {config.strokeWidth}px
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={config.strokeWidth}
                              onChange={(e) =>
                                updateConfig("strokeWidth", parseInt(e.target.value))
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              Stroke Color
                            </label>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateConfig("strokeColor", "#ffffff")}
                                className={`w-8 h-8 rounded-full border-2 bg-white ${
                                  config.strokeColor === "#ffffff"
                                    ? "border-blue-500"
                                    : "border-gray-300"
                                }`}
                                title="White"
                              />
                              <button
                                onClick={() => updateConfig("strokeColor", "#000000")}
                                className={`w-8 h-8 rounded-full border-2 bg-black ${
                                  config.strokeColor === "#000000"
                                    ? "border-blue-500"
                                    : "border-gray-300"
                                }`}
                                title="Black"
                              />
                              <input
                                type="color"
                                value={config.strokeColor}
                                onChange={(e) =>
                                  updateConfig("strokeColor", e.target.value)
                                }
                                className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">
                        More effects coming soon: shadows, gradients, and more.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  Preview on Light Background
                </h3>
                <div
                  className="border border-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] bg-white"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      fontFamily: `"${config.fontFamily}", sans-serif`,
                      fontSize: `${Math.min(config.fontSize, 48)}px`,
                      fontWeight: config.fontWeight,
                      fontStyle: config.fontStyle,
                      color: config.color,
                      letterSpacing: `${config.letterSpacing}px`,
                      textAlign: "center",
                      whiteSpace:
                        config.layout === "stacked" ? "pre-wrap" : "nowrap",
                      lineHeight: config.lineHeight,
                      WebkitTextStroke: config.strokeEnabled
                        ? `${config.strokeWidth}px ${config.strokeColor}`
                        : undefined,
                      paintOrder: config.strokeEnabled ? "stroke fill" : undefined,
                    }}
                  >
                    {getDisplayText()}
                  </div>
                  {config.tagline && (
                    <div
                      style={{
                        fontFamily: `"${config.fontFamily}", sans-serif`,
                        fontSize: `${Math.min(config.taglineFontSize, 24)}px`,
                        fontWeight: "400",
                        color: config.taglineColor,
                        letterSpacing: `${config.taglineLetterSpacing}px`,
                        textAlign: "center",
                        marginTop: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {config.tagline}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">
                  Preview on Dark Background
                </h3>
                <div
                  className="rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      fontFamily: `"${config.fontFamily}", sans-serif`,
                      fontSize: `${Math.min(config.fontSize, 48)}px`,
                      fontWeight: config.fontWeight,
                      fontStyle: config.fontStyle,
                      color: config.color,
                      letterSpacing: `${config.letterSpacing}px`,
                      textAlign: "center",
                      whiteSpace:
                        config.layout === "stacked" ? "pre-wrap" : "nowrap",
                      lineHeight: config.lineHeight,
                      WebkitTextStroke: config.strokeEnabled
                        ? `${config.strokeWidth}px ${config.strokeColor}`
                        : undefined,
                      paintOrder: config.strokeEnabled ? "stroke fill" : undefined,
                    }}
                  >
                    {getDisplayText()}
                  </div>
                  {config.tagline && (
                    <div
                      style={{
                        fontFamily: `"${config.fontFamily}", sans-serif`,
                        fontSize: `${Math.min(config.taglineFontSize, 24)}px`,
                        fontWeight: "400",
                        color: config.taglineColor,
                        letterSpacing: `${config.taglineLetterSpacing}px`,
                        textAlign: "center",
                        marginTop: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {config.tagline}
                    </div>
                  )}
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
              Dimensions: {result.width} x {result.height}px
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
                  <span className="ml-1 text-gray-900">{config.fontFamily}</span>
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
                onClick={handleDownload}
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
