"use client";

import { useState } from "react";
import Image from "next/image";
import type { ClientLogo } from "@/app/logos/page";

interface LogoCardProps {
  logo: ClientLogo;
  onDelete: (id: string) => void;
}

export default function LogoCard({ logo, onDelete }: LogoCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(logo.logoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = logo.logoUrl;
    link.download = `${logo.clientName.toLowerCase().replace(/\s+/g, "-")}-logo`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Logo Preview */}
      <div className="relative flex h-40 items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-800">
        <Image
          src={logo.logoUrl}
          alt={`${logo.clientName} logo`}
          width={120}
          height={60}
          className="max-h-24 w-auto object-contain dark:invert"
        />

        {/* Action Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-2 bg-black/50 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleCopyUrl}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Download
          </button>
        </div>
      </div>

      {/* Logo Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-white">
              {logo.clientName}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Added {logo.uploadedAt}
            </p>
          </div>
          <button
            onClick={() => onDelete(logo.id)}
            className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
            title="Delete logo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
