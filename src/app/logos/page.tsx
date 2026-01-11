"use client";

import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import LogoCard from "@/components/LogoCard";
import LogoUploader from "@/components/LogoUploader";
import { Logo } from "@/types/logo";

// Demo data for initial display
const demoLogos: Logo[] = [
  {
    id: "1",
    clientName: "Smith Dental Practice",
    fileName: "smith-dental-logo.png",
    fileUrl: "https://placehold.co/400x200/3b82f6/ffffff?text=Smith+Dental",
    fileSize: 45678,
    fileType: "image/png",
    uploadedAt: new Date("2024-01-15"),
    tags: ["dental", "healthcare"],
  },
  {
    id: "2",
    clientName: "Johnson Orthodontics",
    fileName: "johnson-ortho-logo.svg",
    fileUrl: "https://placehold.co/400x200/10b981/ffffff?text=Johnson+Ortho",
    fileSize: 12345,
    fileType: "image/svg+xml",
    uploadedAt: new Date("2024-02-20"),
    tags: ["orthodontics", "healthcare"],
  },
  {
    id: "3",
    clientName: "Wellness Medical Center",
    fileName: "wellness-medical.png",
    fileUrl: "https://placehold.co/400x200/8b5cf6/ffffff?text=Wellness+Medical",
    fileSize: 89012,
    fileType: "image/png",
    uploadedAt: new Date("2024-03-10"),
    tags: ["medical", "wellness"],
  },
];

export default function LogosPage() {
  const [logos, setLogos] = useState<Logo[]>(demoLogos);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = Array.from(new Set(logos.flatMap((logo) => logo.tags)));

  // Filter logos based on search and tags
  const filteredLogos = logos.filter((logo) => {
    const matchesSearch =
      logo.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logo.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => logo.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleUpload = (file: File, clientName: string, tags: string[]) => {
    const newLogo: Logo = {
      id: Date.now().toString(),
      clientName,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date(),
      tags,
    };
    setLogos([newLogo, ...logos]);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this logo?")) {
      setLogos(logos.filter((logo) => logo.id !== id));
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Client Logos
          </h1>
          <p className="text-gray-600">
            Manage and organize logos from your clients.
          </p>
        </div>
        <LogoUploader onUpload={handleUpload} />
      </div>

      {/* Search and Filter Bar */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name or file name..."
              className="input pl-10"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Filter:</span>
              <div className="flex gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-l border-gray-200 pl-4 flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-100 text-primary-600"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-100 text-primary-600"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Grid/List */}
      {filteredLogos.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No logos found.</p>
          <p className="text-sm text-gray-400">
            {searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters."
              : "Upload your first logo to get started."}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredLogos.map((logo) => (
            <LogoCard key={logo.id} logo={logo} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-8 text-sm text-gray-500 text-center">
        Showing {filteredLogos.length} of {logos.length} logos
      </div>
    </div>
  );
}
