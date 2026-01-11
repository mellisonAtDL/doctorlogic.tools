"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface Variation {
  id: string;
  label: string;
  description: string;
  base64: string;
}

type Step = "upload" | "processing" | "select" | "download";

export default function LogoOptimizerPage() {
  const [step, setStep] = useState<Step>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setError(null);
    setUploadedFileName(file.name);

    // Convert to base64
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

  const handleOptimize = async () => {
    if (!uploadedImage) return;

    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/optimize-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: uploadedImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to optimize logo");
      }

      setVariations(data.variations);
      setStep("select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("upload");
    }
  };

  const handleSelectVariation = (variation: Variation) => {
    setSelectedVariation(variation);
    setStep("download");
  };

  const handleDownload = () => {
    if (!selectedVariation) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${selectedVariation.base64}`;
    const baseName = uploadedFileName.replace(/\.[^/.]+$/, "");
    link.download = `${baseName}-optimized-${selectedVariation.id}.png`;
    link.click();
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedImage(null);
    setUploadedFileName("");
    setVariations([]);
    setSelectedVariation(null);
    setError(null);
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
              Logo Optimizer
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Upload", "Processing", "Select", "Download"].map((label, i) => {
            const stepNames: Step[] = [
              "upload",
              "processing",
              "select",
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

        {/* Step 1: Upload */}
        {step === "upload" && (
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
                      alt="Uploaded logo"
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your logo here, or
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
                    Supports PNG, JPEG, WebP, and more
                  </p>
                </>
              )}
            </div>

            {uploadedImage && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleOptimize}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Optimize Logo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Processing */}
        {step === "processing" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Generating options...
            </h2>
            <p className="text-gray-500">
              Removing background and creating variations
            </p>
          </div>
        )}

        {/* Step 3: Select Variation */}
        {step === "select" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
              Choose your preferred version
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Each variation is optimized for different use cases
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => handleSelectVariation(variation)}
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left"
                >
                  {/* Light background preview */}
                  <div className="bg-white border border-gray-100 rounded-lg p-4 mb-2 flex items-center justify-center h-24">
                    <img
                      src={`data:image/png;base64,${variation.base64}`}
                      alt={variation.label}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Dark background preview */}
                  <div className="bg-slate-800 rounded-lg p-4 mb-3 flex items-center justify-center h-24">
                    <img
                      src={`data:image/png;base64,${variation.base64}`}
                      alt={variation.label}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {variation.label}
                  </h3>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    {variation.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Start over with a different logo
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Download */}
        {step === "download" && selectedVariation && (
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
                {selectedVariation.label} selected
              </h2>
              <p className="text-gray-500">
                Your optimized logo is ready to download
              </p>
            </div>

            {/* Preview on both backgrounds */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center h-40">
                <img
                  src={`data:image/png;base64,${selectedVariation.base64}`}
                  alt="Preview on light"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center h-40">
                <img
                  src={`data:image/png;base64,${selectedVariation.base64}`}
                  alt="Preview on dark"
                  className="max-h-full max-w-full object-contain"
                />
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
                onClick={() => setStep("select")}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Choose Different Version
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Optimize another logo
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
