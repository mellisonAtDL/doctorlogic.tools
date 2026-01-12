"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

type Step = "upload" | "configure" | "processing" | "download";

interface CompressionConfig {
  quality: "low" | "medium" | "high";
  resolution: "original" | "1080p" | "720p" | "480p";
  format: "mp4" | "webm";
}

interface VideoInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  width: number;
  height: number;
}

interface CompressionResult {
  blob: Blob;
  size: number;
  url: string;
}

const QUALITY_PRESETS = {
  low: { crf: 35, label: "Low", description: "Smallest file size, lower quality" },
  medium: { crf: 28, label: "Medium", description: "Balanced size and quality" },
  high: { crf: 23, label: "High", description: "Best quality, larger file" },
};

const RESOLUTION_OPTIONS = {
  original: { label: "Original", scale: null },
  "1080p": { label: "1080p", scale: 1080 },
  "720p": { label: "720p", scale: 720 },
  "480p": { label: "480p", scale: 480 },
};

export default function VideoCompressorPage() {
  const [step, setStep] = useState<Step>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<CompressionConfig>({
    quality: "medium",
    resolution: "original",
    format: "mp4",
  });
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);

  const ffmpegRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load FFmpeg on mount
  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current || ffmpegLoading) return;

    setFfmpegLoading(true);
    setProgressMessage("Loading video compression engine...");

    try {
      // Dynamically import FFmpeg from CDN using variable URLs to bypass TypeScript module resolution
      const ffmpegUrl = "https://esm.sh/@ffmpeg/ffmpeg@0.12.10";
      const utilUrl = "https://esm.sh/@ffmpeg/util@0.12.1";

      const ffmpegModule = await import(/* webpackIgnore: true */ ffmpegUrl);
      const utilModule = await import(/* webpackIgnore: true */ utilUrl);

      const FFmpeg = ffmpegModule.FFmpeg;
      const fetchFile = utilModule.fetchFile;

      const ffmpeg = new FFmpeg();

      ffmpeg.on("progress", ({ progress }: { progress: number }) => {
        setProgress(Math.round(progress * 100));
      });

      ffmpeg.on("log", ({ message }: { message: string }) => {
        console.log("[FFmpeg]", message);
      });

      // Load FFmpeg WASM files from jsdelivr CDN using UMD build (works on mobile)
      const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
      });

      ffmpegRef.current = ffmpeg;
      (window as any).fetchFile = fetchFile;
      setFfmpegLoaded(true);
      setProgressMessage("");
    } catch (err) {
      console.error("Failed to load FFmpeg:", err);
      const message = err instanceof Error
        ? err.message
        : JSON.stringify(err) || "Unknown error";
      setError(`Failed to load video compression engine: ${message}`);
    } finally {
      setFfmpegLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    // Check file size (limit to 500MB for browser processing)
    if (file.size > 500 * 1024 * 1024) {
      setError("File size must be under 500MB for browser processing");
      return;
    }

    setError(null);
    setVideoFile(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);

    // Get video metadata
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      setVideoInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      setError("Could not read video metadata");
      URL.revokeObjectURL(video.src);
    };

    video.src = previewUrl;
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

  const handleCompress = async () => {
    if (!videoFile || !ffmpegRef.current) return;

    setStep("processing");
    setProgress(0);
    setError(null);

    try {
      const ffmpeg = ffmpegRef.current;
      const fetchFile = (window as any).fetchFile;

      setProgressMessage("Reading video file...");

      // Write input file to FFmpeg virtual filesystem
      const inputFileName = "input" + getExtension(videoFile.name);
      const outputFileName = `output.${config.format}`;

      await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));

      setProgressMessage("Compressing video...");

      // Build FFmpeg command
      const args = buildFFmpegArgs(inputFileName, outputFileName, config, videoInfo);

      console.log("FFmpeg args:", args);

      // Run compression
      await ffmpeg.exec(args);

      setProgressMessage("Finalizing...");

      // Read output file - FileData needs to be cast to Uint8Array for Blob
      const data = await ffmpeg.readFile(outputFileName);
      const blob = new Blob([new Uint8Array(data as Uint8Array)], {
        type: config.format === "mp4" ? "video/mp4" : "video/webm",
      });

      // Clean up
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      setResult({
        blob,
        size: blob.size,
        url: URL.createObjectURL(blob),
      });

      setStep("download");
    } catch (err) {
      console.error("Compression error:", err);
      const message = err instanceof Error
        ? err.message
        : JSON.stringify(err) || "Unknown compression error";
      setError(`Compression failed: ${message}`);
      setStep("configure");
    }
  };

  const getExtension = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? `.${ext}` : ".mp4";
  };

  const buildFFmpegArgs = (
    input: string,
    output: string,
    config: CompressionConfig,
    videoInfo: VideoInfo | null
  ): string[] => {
    const args = ["-i", input];

    // Video codec
    if (config.format === "mp4") {
      args.push("-c:v", "libx264");
      args.push("-preset", "fast"); // Use fast preset for better browser performance
    } else {
      args.push("-c:v", "libvpx-vp9");
    }

    // Quality (CRF)
    const crf = QUALITY_PRESETS[config.quality].crf;
    args.push("-crf", crf.toString());

    // Resolution - scale to max width while preserving aspect ratio
    if (config.resolution !== "original" && videoInfo) {
      const targetHeight = RESOLUTION_OPTIONS[config.resolution].scale;
      if (targetHeight && videoInfo.height > targetHeight) {
        // Scale to target height, -2 ensures width is divisible by 2
        args.push("-vf", `scale=-2:'min(${targetHeight},ih)'`);
      }
    }

    // Audio codec
    if (config.format === "mp4") {
      args.push("-c:a", "aac");
      args.push("-b:a", "128k");
    } else {
      args.push("-c:a", "libopus");
      args.push("-b:a", "128k");
    }

    // Optimize for web streaming
    if (config.format === "mp4") {
      args.push("-movflags", "+faststart");
    }

    args.push(output);

    return args;
  };

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result.url;
    link.download = `compressed_${videoFile?.name?.replace(/\.[^.]+$/, "")}.${config.format}`;
    link.click();
  };

  const handleReset = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setStep("upload");
    setVideoFile(null);
    setVideoInfo(null);
    setVideoPreviewUrl(null);
    setResult(null);
    setProgress(0);
    setProgressMessage("");
    setError(null);
    setConfig({
      quality: "medium",
      resolution: "original",
      format: "mp4",
    });
  };

  const getStepIndex = () => {
    const steps = ["upload", "configure", "processing", "download"];
    return steps.indexOf(step);
  };

  const compressionRatio = result && videoInfo
    ? Math.round((1 - result.size / videoInfo.size) * 100)
    : 0;

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
              Video Compressor
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Upload", "Configure", "Processing", "Download"].map((label, i) => {
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
                {i < 3 && (
                  <div
                    className={`w-8 h-0.5 ${isActive ? "bg-blue-200" : "bg-gray-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* FFmpeg Loading State */}
        {ffmpegLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            {progressMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : videoFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {videoFile && videoInfo ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <video
                      ref={videoRef}
                      src={videoPreviewUrl || undefined}
                      className="max-h-48 max-w-full rounded-lg"
                      controls
                      muted
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {videoInfo.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {videoInfo.width}x{videoInfo.height} &bull;{" "}
                      {formatDuration(videoInfo.duration)} &bull;{" "}
                      {formatFileSize(videoInfo.size)}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
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
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your video here, or
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      browse files
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-400 mt-4">
                    Supported formats: MP4, WebM, MOV, AVI (max 500MB)
                  </p>
                </>
              )}
            </div>

            {videoFile && videoInfo && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep("configure")}
                  disabled={!ffmpegLoaded}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ffmpegLoaded ? "Continue to Configure" : "Loading engine..."}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: Configure */}
        {step === "configure" && videoInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Compression Settings
              </h2>

              <div className="space-y-6">
                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quality
                  </label>
                  <div className="space-y-2">
                    {(Object.entries(QUALITY_PRESETS) as [keyof typeof QUALITY_PRESETS, typeof QUALITY_PRESETS.low][]).map(
                      ([key, preset]) => (
                        <button
                          key={key}
                          onClick={() => setConfig({ ...config, quality: key })}
                          className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                            config.quality === key
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {preset.label}
                            </span>
                            {config.quality === key && (
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {preset.description}
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Resolution
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(RESOLUTION_OPTIONS) as [keyof typeof RESOLUTION_OPTIONS, typeof RESOLUTION_OPTIONS.original][]).map(
                      ([key, option]) => {
                        const isDisabled =
                          key !== "original" &&
                          option.scale !== null &&
                          videoInfo.height <= option.scale;

                        return (
                          <button
                            key={key}
                            onClick={() =>
                              !isDisabled && setConfig({ ...config, resolution: key })
                            }
                            disabled={isDisabled}
                            className={`p-3 border-2 rounded-lg text-center transition-all ${
                              config.resolution === key
                                ? "border-blue-500 bg-blue-50"
                                : isDisabled
                                  ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                                  : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <span
                              className={`font-medium ${
                                isDisabled ? "text-gray-400" : "text-gray-900"
                              }`}
                            >
                              {option.label}
                            </span>
                            {key === "original" && (
                              <p className="text-xs text-gray-500 mt-1">
                                {videoInfo.width}x{videoInfo.height}
                              </p>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Output Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConfig({ ...config, format: "mp4" })}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        config.format === "mp4"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium text-gray-900">MP4</span>
                      <p className="text-xs text-gray-500 mt-1">
                        Best compatibility
                      </p>
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, format: "webm" })}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        config.format === "webm"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium text-gray-900">WebM</span>
                      <p className="text-xs text-gray-500 mt-1">
                        Modern browsers
                      </p>
                    </button>
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
                  onClick={handleCompress}
                  className="flex-1 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compress Video
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Video Preview
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    src={videoPreviewUrl || undefined}
                    className="w-full"
                    controls
                    muted
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    File Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">File name</span>
                      <p className="font-medium text-gray-900 truncate">
                        {videoInfo.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Size</span>
                      <p className="font-medium text-gray-900">
                        {formatFileSize(videoInfo.size)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Resolution</span>
                      <p className="font-medium text-gray-900">
                        {videoInfo.width}x{videoInfo.height}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration</span>
                      <p className="font-medium text-gray-900">
                        {formatDuration(videoInfo.duration)}
                      </p>
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
            <div className="max-w-md mx-auto">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#2563eb"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {progress}%
                  </span>
                </div>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Compressing your video...
              </h2>
              <p className="text-gray-500">{progressMessage}</p>
              <p className="text-sm text-gray-400 mt-4">
                This may take a few minutes depending on the video size
              </p>
            </div>
          </div>
        )}

        {/* Step: Download */}
        {step === "download" && result && videoInfo && (
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
                Video Compressed Successfully!
              </h2>
              <p className="text-gray-500 mb-6">
                Your video has been compressed and is ready to download
              </p>
              <button
                onClick={handleDownload}
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
                Download Compressed Video
              </button>
            </div>

            {/* Compression Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Compression Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Original Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatFileSize(videoInfo.size)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Compressed Size</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatFileSize(result.size)}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Size Reduction</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {compressionRatio > 0 ? `${compressionRatio}%` : "0%"}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Compressed Video */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Preview Compressed Video
              </h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <video src={result.url} className="w-full" controls />
              </div>
            </div>

            {/* Start Over */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Compress another video
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
