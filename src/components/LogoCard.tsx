"use client";

import { Logo } from "@/types/logo";
import { Download, Trash2, Tag } from "lucide-react";

interface LogoCardProps {
  logo: Logo;
  onDelete: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function LogoCard({ logo, onDelete }: LogoCardProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = logo.fileUrl;
    link.download = logo.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card group">
      <div className="aspect-video bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
        <img
          src={logo.fileUrl}
          alt={`${logo.clientName} logo`}
          className="max-w-full max-h-full object-contain p-4"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 truncate">
          {logo.clientName}
        </h3>
        <p className="text-sm text-gray-500 truncate">{logo.fileName}</p>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatFileSize(logo.fileSize)}</span>
          <span>•</span>
          <span>{formatDate(logo.uploadedAt)}</span>
        </div>

        {logo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {logo.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onDelete(logo.id)}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
