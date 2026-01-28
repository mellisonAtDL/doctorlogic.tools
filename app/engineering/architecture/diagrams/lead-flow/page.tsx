"use client";

import Link from "next/link";

export default function LeadFlowDiagram() {
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
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lead Capture Flow
            </h1>
            <p className="text-sm text-gray-500">
              How patient leads are captured and processed
            </p>
          </div>
        </div>

        {/* Diagram */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <svg
            viewBox="0 0 900 700"
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
              Lead Capture Flow
            </text>
            <text
              x="450"
              y="50"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              From website visitor to practice notification
            </text>

            {/* Patient Entry Point */}
            <g transform="translate(350, 70)">
              <circle cx="50" cy="30" r="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="50" cy="22" r="10" fill="#3b82f6" />
              <path d="M30 50 Q50 62 70 50" fill="none" stroke="#3b82f6" strokeWidth="4" />
              <text x="50" y="75" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="bold">Patient</text>
              <text x="50" y="90" textAnchor="middle" fill="#6b7280" fontSize="10">Website Visitor</text>
            </g>

            {/* Arrow down */}
            <path d="M400 165 L400 195" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Website Box */}
            <g transform="translate(280, 200)">
              <rect x="0" y="0" width="240" height="80" rx="8" fill="#cffafe" stroke="#06b6d4" strokeWidth="2" />
              <text x="120" y="25" textAnchor="middle" fill="#0e7490" fontSize="14" fontWeight="bold">Client Website</text>
              <text x="120" y="45" textAnchor="middle" fill="#0e7490" fontSize="11">www.clientpractice.com</text>
              <text x="120" y="62" textAnchor="middle" fill="#6b7280" fontSize="10">Patient browses, finds info</text>
            </g>

            {/* Split into two paths */}
            <path d="M340 285 L200 325" stroke="#06b6d4" strokeWidth="2" />
            <path d="M460 285 L600 325" stroke="#06b6d4" strokeWidth="2" />

            {/* Left Path - Contact Form */}
            <g transform="translate(80, 330)">
              <rect x="0" y="0" width="200" height="90" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
              <text x="100" y="25" textAnchor="middle" fill="#166534" fontSize="13" fontWeight="bold">Contact Form</text>
              <text x="100" y="45" textAnchor="middle" fill="#166534" fontSize="10">Patient fills out form</text>
              <line x1="20" y1="60" x2="180" y2="60" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,4" />
              <text x="100" y="75" textAnchor="middle" fill="#6b7280" fontSize="9">Name, Email, Phone, Message</text>
            </g>

            {/* Right Path - Phone Call */}
            <g transform="translate(520, 330)">
              <rect x="0" y="0" width="200" height="90" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="100" y="25" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="bold">Phone Call</text>
              <text x="100" y="45" textAnchor="middle" fill="#92400e" fontSize="10">Patient calls practice</text>
              <line x1="20" y1="60" x2="180" y2="60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />
              <text x="100" y="75" textAnchor="middle" fill="#6b7280" fontSize="9">Via tracking number (CTM)</text>
            </g>

            {/* Arrows down from form and phone */}
            <path d="M180 425 L180 465" stroke="#22c55e" strokeWidth="2" markerEnd="url(#greenArrow)" />
            <path d="M620 425 L620 465" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#amberArrow)" />

            {/* Processing Layer */}
            <g transform="translate(80, 470)">
              <rect x="0" y="0" width="200" height="70" rx="8" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              <text x="100" y="22" textAnchor="middle" fill="#4338ca" fontSize="12" fontWeight="bold">DL Form Handler</text>
              <text x="100" y="40" textAnchor="middle" fill="#6366f1" fontSize="10">Validates &amp; stores data</text>
              <text x="100" y="55" textAnchor="middle" fill="#6b7280" fontSize="9">Creates lead record</text>
            </g>

            <g transform="translate(520, 470)">
              <rect x="0" y="0" width="200" height="70" rx="8" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
              <text x="100" y="22" textAnchor="middle" fill="#9d174d" fontSize="12" fontWeight="bold">CTM (Optional)</text>
              <text x="100" y="40" textAnchor="middle" fill="#ec4899" fontSize="10">Call Tracking Metrics</text>
              <text x="100" y="55" textAnchor="middle" fill="#6b7280" fontSize="9">Records call details</text>
            </g>

            {/* Arrows to database */}
            <path d="M180 545 L180 575 L350 575" stroke="#6366f1" strokeWidth="2" />
            <path d="M620 545 L620 575 L450 575" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Database */}
            <g transform="translate(320, 570)">
              <ellipse cx="80" cy="12" rx="80" ry="12" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
              <rect x="0" y="12" width="160" height="40" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" strokeDasharray="0,160,40,0,40,160" />
              <ellipse cx="80" cy="52" rx="80" ry="12" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" />
              <text x="80" y="35" textAnchor="middle" fill="#7c3aed" fontSize="11" fontWeight="bold">Lead Database</text>
            </g>

            {/* Arrow down from database */}
            <path d="M400 635 L400 655" stroke="#a855f7" strokeWidth="2" markerEnd="url(#purpleArrow)" />

            {/* Notification Output */}
            <g transform="translate(200, 660)">
              <rect x="0" y="0" width="400" height="35" rx="6" fill="#fef9c3" stroke="#facc15" strokeWidth="2" />
              <text x="200" y="22" textAnchor="middle" fill="#a16207" fontSize="12" fontWeight="bold">
                Email Notification to Practice (SendGrid via DB Mail)
              </text>
            </g>

            {/* Side annotations */}
            <g transform="translate(720, 400)">
              <rect x="0" y="0" width="130" height="140" rx="6" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <text x="65" y="20" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="bold">Data Captured</text>
              <line x1="10" y1="28" x2="120" y2="28" stroke="#d1d5db" strokeWidth="1" />
              <text x="15" y="45" fill="#6b7280" fontSize="9">Patient Name</text>
              <text x="15" y="60" fill="#6b7280" fontSize="9">Email Address</text>
              <text x="15" y="75" fill="#6b7280" fontSize="9">Phone Number</text>
              <text x="15" y="90" fill="#6b7280" fontSize="9">Message/Inquiry</text>
              <text x="15" y="105" fill="#6b7280" fontSize="9">Source Page</text>
              <text x="15" y="120" fill="#6b7280" fontSize="9">Timestamp</text>
              <text x="15" y="135" fill="#6b7280" fontSize="9">Site ID (multi-tenant)</text>
            </g>

            {/* Left annotation - What happens next */}
            <g transform="translate(30, 550)">
              <rect x="0" y="0" width="120" height="100" rx="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1" />
              <text x="60" y="18" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">Practice Actions</text>
              <line x1="10" y1="26" x2="110" y2="26" stroke="#22c55e" strokeWidth="1" />
              <text x="15" y="42" fill="#6b7280" fontSize="9">View in Admin</text>
              <text x="15" y="56" fill="#6b7280" fontSize="9">Respond to patient</text>
              <text x="15" y="70" fill="#6b7280" fontSize="9">Schedule appt</text>
              <text x="15" y="84" fill="#6b7280" fontSize="9">Track conversion</text>
            </g>

            {/* Arrow Marker Definitions */}
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
              <marker id="greenArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
              </marker>
              <marker id="amberArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
              </marker>
              <marker id="purpleArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Description */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-3">About This View</h2>
          <p className="text-gray-600 text-sm mb-4">
            This diagram traces the journey of a patient lead from initial website contact
            to practice notification. Leads can come through two primary channels: contact
            forms submitted directly on the website, or phone calls tracked through Call
            Tracking Metrics (CTM) when enabled. Both paths converge in the lead database,
            triggering email notifications to the practice staff via SendGrid.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Lead Sources</h3>
              <ul className="text-gray-600 space-y-1">
                <li><span className="font-medium">Contact Forms:</span> Direct submission on website</li>
                <li><span className="font-medium">Phone Calls:</span> CTM tracking (when enabled)</li>
                <li><span className="font-medium">Chat:</span> Live chat integrations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Notification Flow</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Lead stored in SQL database</li>
                <li>SQL DB Mail triggers email job</li>
                <li>SendGrid delivers to practice</li>
                <li>Practice views in Admin Portal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
