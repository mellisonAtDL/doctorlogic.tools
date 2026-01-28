"use client";

import Link from "next/link";

export default function InfrastructureDiagram() {
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
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Infrastructure Stack
            </h1>
            <p className="text-sm text-gray-500">
              Technical infrastructure and hosting architecture
            </p>
          </div>
        </div>

        {/* Diagram */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <svg
            viewBox="0 0 900 750"
            className="w-full h-auto"
            style={{ maxHeight: "80vh" }}
          >
            {/* Title */}
            <text
              x="450"
              y="30"
              textAnchor="middle"
              fill="#111827"
              fontSize="20"
              fontWeight="bold"
            >
              Infrastructure Stack
            </text>
            <text
              x="450"
              y="50"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              Azure-hosted multi-tier architecture
            </text>

            {/* Internet/Users Layer */}
            <g transform="translate(0, 70)">
              <rect x="50" y="0" width="800" height="60" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
              <text x="80" y="35" fill="#166534" fontSize="12" fontWeight="bold">INTERNET</text>

              {/* User icons */}
              <g transform="translate(200, 10)">
                <circle cx="20" cy="20" r="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <text x="20" y="24" textAnchor="middle" fill="#166534" fontSize="10">P</text>
                <text x="20" y="50" textAnchor="middle" fill="#6b7280" fontSize="9">Patients</text>
              </g>
              <g transform="translate(350, 10)">
                <circle cx="20" cy="20" r="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <text x="20" y="24" textAnchor="middle" fill="#166534" fontSize="10">C</text>
                <text x="20" y="50" textAnchor="middle" fill="#6b7280" fontSize="9">Clients</text>
              </g>
              <g transform="translate(500, 10)">
                <circle cx="20" cy="20" r="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <text x="20" y="24" textAnchor="middle" fill="#166534" fontSize="10">DL</text>
                <text x="20" y="50" textAnchor="middle" fill="#6b7280" fontSize="9">Team</text>
              </g>
            </g>

            {/* Arrow down */}
            <path d="M450 135 L450 155" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Cloudflare Layer */}
            <g transform="translate(0, 160)">
              <rect x="100" y="0" width="700" height="80" rx="8" fill="#fff7ed" stroke="#f97316" strokeWidth="2" />
              <text x="130" y="25" fill="#c2410c" fontSize="12" fontWeight="bold">CLOUDFLARE ENTERPRISE</text>

              <g transform="translate(130, 35)">
                <rect x="0" y="0" width="120" height="35" rx="4" fill="#ffedd5" stroke="#fb923c" strokeWidth="1" />
                <text x="60" y="15" textAnchor="middle" fill="#c2410c" fontSize="10" fontWeight="600">CDN</text>
                <text x="60" y="28" textAnchor="middle" fill="#9a3412" fontSize="8">Edge Caching</text>
              </g>

              <g transform="translate(280, 35)">
                <rect x="0" y="0" width="120" height="35" rx="4" fill="#ffedd5" stroke="#fb923c" strokeWidth="1" />
                <text x="60" y="15" textAnchor="middle" fill="#c2410c" fontSize="10" fontWeight="600">WAF</text>
                <text x="60" y="28" textAnchor="middle" fill="#9a3412" fontSize="8">Security</text>
              </g>

              <g transform="translate(430, 35)">
                <rect x="0" y="0" width="120" height="35" rx="4" fill="#ffedd5" stroke="#fb923c" strokeWidth="1" />
                <text x="60" y="15" textAnchor="middle" fill="#c2410c" fontSize="10" fontWeight="600">DNS</text>
                <text x="60" y="28" textAnchor="middle" fill="#9a3412" fontSize="8">Domain Routing</text>
              </g>

              <g transform="translate(580, 35)">
                <rect x="0" y="0" width="120" height="35" rx="4" fill="#ffedd5" stroke="#fb923c" strokeWidth="1" />
                <text x="60" y="15" textAnchor="middle" fill="#c2410c" fontSize="10" fontWeight="600">Workers</text>
                <text x="60" y="28" textAnchor="middle" fill="#9a3412" fontSize="8">Edge Functions</text>
              </g>
            </g>

            {/* Arrow down */}
            <path d="M450 245 L450 265" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Azure Cloud Container */}
            <rect x="50" y="270" width="800" height="420" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
            <text x="80" y="295" fill="#1e40af" fontSize="12" fontWeight="bold">MICROSOFT AZURE</text>

            {/* Load Balancer */}
            <g transform="translate(0, 310)">
              <rect x="300" y="0" width="300" height="50" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
              <text x="450" y="20" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="bold">Azure Load Balancer</text>
              <text x="450" y="38" textAnchor="middle" fill="#3b82f6" fontSize="10">Traffic distribution across VMs</text>
            </g>

            {/* Arrow down to VMs */}
            <path d="M350 365 L200 395" stroke="#3b82f6" strokeWidth="2" />
            <path d="M400 365 L350 395" stroke="#3b82f6" strokeWidth="2" />
            <path d="M500 365 L550 395" stroke="#3b82f6" strokeWidth="2" />
            <path d="M550 365 L700 395" stroke="#3b82f6" strokeWidth="2" />

            {/* Production VMs */}
            <g transform="translate(0, 400)">
              <text x="450" y="0" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="600">PRODUCTION WEB SERVERS</text>

              <g transform="translate(100, 10)">
                <rect x="0" y="0" width="140" height="70" rx="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
                <text x="70" y="20" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="bold">Web VM 1</text>
                <text x="70" y="35" textAnchor="middle" fill="#3b82f6" fontSize="9">Windows Server</text>
                <text x="70" y="48" textAnchor="middle" fill="#3b82f6" fontSize="9">IIS + ASP.NET</text>
                <text x="70" y="61" textAnchor="middle" fill="#6b7280" fontSize="8">Active</text>
              </g>

              <g transform="translate(270, 10)">
                <rect x="0" y="0" width="140" height="70" rx="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
                <text x="70" y="20" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="bold">Web VM 2</text>
                <text x="70" y="35" textAnchor="middle" fill="#3b82f6" fontSize="9">Windows Server</text>
                <text x="70" y="48" textAnchor="middle" fill="#3b82f6" fontSize="9">IIS + ASP.NET</text>
                <text x="70" y="61" textAnchor="middle" fill="#6b7280" fontSize="8">Active</text>
              </g>

              <g transform="translate(440, 10)">
                <rect x="0" y="0" width="140" height="70" rx="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
                <text x="70" y="20" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="bold">Web VM 3</text>
                <text x="70" y="35" textAnchor="middle" fill="#3b82f6" fontSize="9">Windows Server</text>
                <text x="70" y="48" textAnchor="middle" fill="#3b82f6" fontSize="9">IIS + ASP.NET</text>
                <text x="70" y="61" textAnchor="middle" fill="#6b7280" fontSize="8">Active</text>
              </g>

              <g transform="translate(610, 10)">
                <rect x="0" y="0" width="140" height="70" rx="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
                <text x="70" y="20" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="bold">Web VM 4</text>
                <text x="70" y="35" textAnchor="middle" fill="#3b82f6" fontSize="9">Windows Server</text>
                <text x="70" y="48" textAnchor="middle" fill="#3b82f6" fontSize="9">IIS + ASP.NET</text>
                <text x="70" y="61" textAnchor="middle" fill="#6b7280" fontSize="8">Active</text>
              </g>
            </g>

            {/* Arrows to database */}
            <path d="M170 490 L170 530 L300 530" stroke="#94a3b8" strokeWidth="2" />
            <path d="M340 490 L340 530 L340 530" stroke="#94a3b8" strokeWidth="2" />
            <path d="M510 490 L510 530 L510 530" stroke="#94a3b8" strokeWidth="2" />
            <path d="M680 490 L680 530 L540 530" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Database Layer */}
            <g transform="translate(0, 540)">
              <text x="450" y="0" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="600">DATA LAYER</text>

              {/* Primary DB */}
              <g transform="translate(220, 15)">
                <ellipse cx="80" cy="12" rx="80" ry="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <rect x="0" y="12" width="160" height="45" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="0,160,45,0,45,160" />
                <ellipse cx="80" cy="57" rx="80" ry="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <text x="80" y="35" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="bold">SQL Server</text>
                <text x="80" y="48" textAnchor="middle" fill="#b45309" fontSize="9">Primary</text>
              </g>

              {/* Replication arrow */}
              <path d="M465 50 L495 50" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#amberArrow)" />
              <text x="480" y="42" textAnchor="middle" fill="#f59e0b" fontSize="8">Replication</text>

              {/* Backup DB */}
              <g transform="translate(500, 15)">
                <ellipse cx="80" cy="12" rx="80" ry="12" fill="#fef9c3" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" />
                <rect x="0" y="12" width="160" height="45" fill="#fef9c3" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" />
                <ellipse cx="80" cy="57" rx="80" ry="12" fill="#fef9c3" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" />
                <text x="80" y="35" textAnchor="middle" fill="#a16207" fontSize="11" fontWeight="bold">SQL Server</text>
                <text x="80" y="48" textAnchor="middle" fill="#ca8a04" fontSize="9">Backup</text>
              </g>
            </g>

            {/* Supporting Services - Right side */}
            <g transform="translate(750, 400)">
              <rect x="0" y="0" width="90" height="200" rx="6" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
              <text x="45" y="20" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="bold">JOBS</text>

              <rect x="10" y="35" width="70" height="35" rx="4" fill="#ede9fe" stroke="#a855f7" strokeWidth="1" />
              <text x="45" y="50" textAnchor="middle" fill="#7c3aed" fontSize="8">Azure</text>
              <text x="45" y="60" textAnchor="middle" fill="#7c3aed" fontSize="8">Functions</text>

              <rect x="10" y="80" width="70" height="35" rx="4" fill="#ede9fe" stroke="#a855f7" strokeWidth="1" />
              <text x="45" y="95" textAnchor="middle" fill="#7c3aed" fontSize="8">SSIS</text>
              <text x="45" y="105" textAnchor="middle" fill="#7c3aed" fontSize="8">ETL Jobs</text>

              <rect x="10" y="125" width="70" height="35" rx="4" fill="#ede9fe" stroke="#a855f7" strokeWidth="1" />
              <text x="45" y="140" textAnchor="middle" fill="#7c3aed" fontSize="8">DAPI</text>
              <text x="45" y="150" textAnchor="middle" fill="#7c3aed" fontSize="8">Custom Jobs</text>

              <rect x="10" y="165" width="70" height="30" rx="4" fill="#ede9fe" stroke="#a855f7" strokeWidth="1" />
              <text x="45" y="183" textAnchor="middle" fill="#7c3aed" fontSize="8">Scheduled</text>
            </g>

            {/* Dev/Asset Servers - Left side */}
            <g transform="translate(60, 400)">
              <rect x="0" y="0" width="90" height="100" rx="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" />
              <text x="45" y="20" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">OTHER</text>

              <rect x="10" y="30" width="70" height="30" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
              <text x="45" y="48" textAnchor="middle" fill="#166534" fontSize="8">Dev Server</text>

              <rect x="10" y="65" width="70" height="30" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
              <text x="45" y="83" textAnchor="middle" fill="#166534" fontSize="8">Asset Server</text>
            </g>

            {/* Legend */}
            <g transform="translate(60, 700)">
              <text x="0" y="0" fill="#374151" fontSize="10" fontWeight="bold">Legend:</text>
              <rect x="60" y="-10" width="15" height="15" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
              <text x="80" y="2" fill="#6b7280" fontSize="9">Production</text>
              <rect x="150" y="-10" width="15" height="15" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
              <text x="170" y="2" fill="#6b7280" fontSize="9">Database</text>
              <rect x="240" y="-10" width="15" height="15" rx="2" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1" />
              <text x="260" y="2" fill="#6b7280" fontSize="9">Background Jobs</text>
              <rect x="360" y="-10" width="15" height="15" rx="2" fill="#ffedd5" stroke="#f97316" strokeWidth="1" />
              <text x="380" y="2" fill="#6b7280" fontSize="9">CDN/Edge</text>
            </g>

            {/* Arrow Marker Definitions */}
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
              <marker id="amberArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Description */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-3">About This View</h2>
          <p className="text-gray-600 text-sm mb-4">
            This diagram shows the physical infrastructure that powers the DoctorLogic platform.
            All traffic enters through Cloudflare Enterprise for CDN, security, and edge
            processing. Requests are then load-balanced across four production Windows VMs
            running IIS and ASP.NET. All VMs connect to a primary SQL Server database with
            replication to a backup instance.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Key Infrastructure</h3>
              <ul className="text-gray-600 space-y-1">
                <li>4 Production Windows VMs (IIS)</li>
                <li>1 Development Server</li>
                <li>1 Asset Server</li>
                <li>Primary + Backup SQL Server</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Background Processing</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Azure Functions (serverless)</li>
                <li>SSIS ETL jobs</li>
                <li>DAPI custom job system</li>
                <li>Scheduled tasks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
