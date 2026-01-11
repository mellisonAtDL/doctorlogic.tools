"use client";

import { useState } from "react";
import LogoCard from "@/components/LogoCard";
import LogoUpload from "@/components/LogoUpload";

export interface ClientLogo {
  id: string;
  clientName: string;
  logoUrl: string;
  uploadedAt: string;
}

// Sample data for demonstration
const initialLogos: ClientLogo[] = [
  {
    id: "1",
    clientName: "Acme Dental",
    logoUrl: "/next.svg",
    uploadedAt: "2024-01-10",
  },
  {
    id: "2",
    clientName: "Smith Family Practice",
    logoUrl: "/vercel.svg",
    uploadedAt: "2024-01-09",
  },
  {
    id: "3",
    clientName: "Metro Healthcare",
    logoUrl: "/globe.svg",
    uploadedAt: "2024-01-08",
  },
];

export default function LogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>(initialLogos);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const filteredLogos = logos.filter((logo) =>
    logo.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLogo = (newLogo: Omit<ClientLogo, "id" | "uploadedAt">) => {
    const logo: ClientLogo = {
      ...newLogo,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    setLogos([logo, ...logos]);
    setShowUpload(false);
  };

  const handleDeleteLogo = (id: string) => {
    setLogos(logos.filter((logo) => logo.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <a
                href="/"
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                &larr; Back to Home
              </a>
              <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                Client Logo Manager
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Manage and organize client logos in one place
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Add Logo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          />
        </div>

        {/* Stats */}
        <div className="mb-6 flex gap-4">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {logos.length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Logos
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {filteredLogos.length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing
            </p>
          </div>
        </div>

        {/* Logo Grid */}
        {filteredLogos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLogos.map((logo) => (
              <LogoCard
                key={logo.id}
                logo={logo}
                onDelete={handleDeleteLogo}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? "No logos match your search"
                : "No logos uploaded yet"}
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Upload your first logo
            </button>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <LogoUpload
          onAdd={handleAddLogo}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}
