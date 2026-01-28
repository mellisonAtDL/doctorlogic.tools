"use client";

import Link from "next/link";

export default function OverviewDiagram() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/engineering/architecture"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-cyan-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Platform Overview
            </h1>
            <p className="text-sm text-gray-500">
              High-level view of the DoctorLogic Platform
            </p>
          </div>
        </div>

        {/* Diagram */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-auto"
            style={{ maxHeight: "70vh" }}
          >
            {/* Title */}
            <text
              x="400"
              y="30"
              textAnchor="middle"
              className="text-xl font-bold"
              fill="#111827"
              fontSize="20"
            >
              DoctorLogic Platform
            </text>
            <text
              x="400"
              y="50"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              Healthcare Marketing Website Platform
            </text>

            {/* Main Platform Box */}
            <rect
              x="50"
              y="70"
              width="700"
              height="480"
              rx="12"
              fill="#f8fafc"
              stroke="#e2e8f0"
              strokeWidth="2"
            />

            {/* Users Row */}
            <g transform="translate(0, 90)">
              <text x="400" y="0" textAnchor="middle" fill="#6b7280" fontSize="11" fontWeight="600">
                USERS
              </text>

              {/* Patient */}
              <g transform="translate(120, 20)">
                <circle cx="40" cy="25" r="20" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="40" cy="18" r="8" fill="#3b82f6" />
                <path d="M25 40 Q40 50 55 40" fill="none" stroke="#3b82f6" strokeWidth="3" />
                <text x="40" y="60" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="600">Patient</text>
                <text x="40" y="72" textAnchor="middle" fill="#6b7280" fontSize="9">Website Viewer</text>
              </g>

              {/* Client */}
              <g transform="translate(320, 20)">
                <circle cx="40" cy="25" r="20" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <circle cx="40" cy="18" r="8" fill="#22c55e" />
                <path d="M25 40 Q40 50 55 40" fill="none" stroke="#22c55e" strokeWidth="3" />
                <text x="40" y="60" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="600">Client</text>
                <text x="40" y="72" textAnchor="middle" fill="#6b7280" fontSize="9">Practice Staff</text>
              </g>

              {/* DL Employee */}
              <g transform="translate(520, 20)">
                <circle cx="40" cy="25" r="20" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <circle cx="40" cy="18" r="8" fill="#6366f1" />
                <path d="M25 40 Q40 50 55 40" fill="none" stroke="#6366f1" strokeWidth="3" />
                <text x="40" y="60" textAnchor="middle" fill="#3730a3" fontSize="11" fontWeight="600">DL Team</text>
                <text x="40" y="72" textAnchor="middle" fill="#6b7280" fontSize="9">Internal</text>
              </g>
            </g>

            {/* Arrows from users */}
            <path d="M160 195 L160 230" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            <path d="M360 195 L360 230" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            <path d="M560 195 L560 230" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Core Applications Row */}
            <g transform="translate(0, 240)">
              <text x="400" y="0" textAnchor="middle" fill="#6b7280" fontSize="11" fontWeight="600">
                APPLICATIONS
              </text>

              {/* Websites */}
              <g transform="translate(80, 15)">
                <rect x="0" y="0" width="160" height="90" rx="8" fill="#cffafe" stroke="#06b6d4" strokeWidth="2" />
                <text x="80" y="25" textAnchor="middle" fill="#0e7490" fontSize="14" fontWeight="bold">Websites</text>
                <text x="80" y="45" textAnchor="middle" fill="#0e7490" fontSize="10">Client marketing sites</text>
                <text x="80" y="60" textAnchor="middle" fill="#6b7280" fontSize="9">www.clientsite.com</text>
                <rect x="10" y="70" width="140" height="14" rx="3" fill="#06b6d4" fillOpacity="0.2" />
                <text x="80" y="80" textAnchor="middle" fill="#0e7490" fontSize="8">Multi-tenant</text>
              </g>

              {/* Admin */}
              <g transform="translate(280, 15)">
                <rect x="0" y="0" width="160" height="90" rx="8" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <text x="80" y="25" textAnchor="middle" fill="#4338ca" fontSize="14" fontWeight="bold">Admin Portal</text>
                <text x="80" y="45" textAnchor="middle" fill="#4338ca" fontSize="10">Management dashboard</text>
                <text x="80" y="60" textAnchor="middle" fill="#6b7280" fontSize="9">admin.doctorlogic.com</text>
                <rect x="10" y="70" width="140" height="14" rx="3" fill="#6366f1" fillOpacity="0.2" />
                <text x="80" y="80" textAnchor="middle" fill="#4338ca" fontSize="8">Role-based access</text>
              </g>

              {/* Background Jobs */}
              <g transform="translate(480, 15)">
                <rect x="0" y="0" width="160" height="90" rx="8" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
                <text x="80" y="25" textAnchor="middle" fill="#7c3aed" fontSize="14" fontWeight="bold">Jobs</text>
                <text x="80" y="45" textAnchor="middle" fill="#7c3aed" fontSize="10">Background processing</text>
                <text x="80" y="60" textAnchor="middle" fill="#6b7280" fontSize="9">Azure Functions, SSIS, DAPI</text>
                <rect x="10" y="70" width="140" height="14" rx="3" fill="#a855f7" fillOpacity="0.2" />
                <text x="80" y="80" textAnchor="middle" fill="#7c3aed" fontSize="8">ETL &amp; Automation</text>
              </g>
            </g>

            {/* Arrows to database */}
            <path d="M160 350 L160 390 L350 390 L350 420" stroke="#94a3b8" strokeWidth="2" />
            <path d="M360 350 L360 390 L360 420" stroke="#94a3b8" strokeWidth="2" />
            <path d="M560 350 L560 390 L400 390 L400 420" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Database */}
            <g transform="translate(280, 420)">
              <ellipse cx="80" cy="15" rx="80" ry="15" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <rect x="0" y="15" width="160" height="50" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="0,160,50,0,50,160" />
              <ellipse cx="80" cy="65" rx="80" ry="15" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="80" y="45" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">SQL Server</text>
              <text x="80" y="58" textAnchor="middle" fill="#92400e" fontSize="9">All client data</text>
            </g>

            {/* Arrow Marker Definition */}
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Legend */}
            <g transform="translate(580, 520)">
              <text x="0" y="0" fill="#6b7280" fontSize="10" fontWeight="600">One Repository</text>
              <text x="0" y="14" fill="#9ca3af" fontSize="9">ASP.NET Monolith</text>
            </g>
          </svg>
        </div>

        {/* Description */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-3">About This View</h2>
          <p className="text-gray-600 text-sm">
            This diagram shows the high-level structure of the DoctorLogic platform.
            Three main user types interact with three core application areas, all
            sharing a single multi-tenant SQL Server database. The entire application
            is built as an ASP.NET monolith in one Git repository.
          </p>
        </div>
      </div>
    </main>
  );
}
