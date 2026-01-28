"use client";

import Link from "next/link";

export default function ValueFlowDiagram() {
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customer Value Flow
            </h1>
            <p className="text-sm text-gray-500">
              How DoctorLogic creates value for healthcare practices
            </p>
          </div>
        </div>

        {/* Diagram */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <svg
            viewBox="0 0 900 650"
            className="w-full h-auto"
            style={{ maxHeight: "75vh" }}
          >
            {/* Title */}
            <text
              x="450"
              y="30"
              textAnchor="middle"
              className="text-xl font-bold"
              fill="#111827"
              fontSize="20"
            >
              Customer Value Flow
            </text>
            <text
              x="450"
              y="50"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
            >
              From Practice Investment to Patient Acquisition
            </text>

            {/* Flow Step 1: Client Investment */}
            <g transform="translate(50, 80)">
              <rect
                x="0"
                y="0"
                width="180"
                height="100"
                rx="12"
                fill="#dcfce7"
                stroke="#22c55e"
                strokeWidth="2"
              />
              <text x="90" y="30" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">
                1. CLIENT INVESTS
              </text>
              <text x="90" y="50" textAnchor="middle" fill="#166534" fontSize="11">
                Healthcare Practice
              </text>
              <text x="90" y="68" textAnchor="middle" fill="#6b7280" fontSize="10">
                Subscribes to DoctorLogic
              </text>
              <text x="90" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">
                Monthly subscription fee
              </text>
            </g>

            {/* Arrow 1 */}
            <path d="M240 130 L290 130" stroke="#22c55e" strokeWidth="3" markerEnd="url(#greenArrow)" />

            {/* Flow Step 2: DL Builds */}
            <g transform="translate(300, 80)">
              <rect
                x="0"
                y="0"
                width="180"
                height="100"
                rx="12"
                fill="#e0e7ff"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <text x="90" y="30" textAnchor="middle" fill="#3730a3" fontSize="12" fontWeight="bold">
                2. DL BUILDS
              </text>
              <text x="90" y="50" textAnchor="middle" fill="#3730a3" fontSize="11">
                Professional Website
              </text>
              <text x="90" y="68" textAnchor="middle" fill="#6b7280" fontSize="10">
                Custom design & content
              </text>
              <text x="90" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">
                SEO optimization
              </text>
            </g>

            {/* Arrow 2 */}
            <path d="M490 130 L540 130" stroke="#6366f1" strokeWidth="3" markerEnd="url(#indigoArrow)" />

            {/* Flow Step 3: Website Attracts */}
            <g transform="translate(550, 80)">
              <rect
                x="0"
                y="0"
                width="180"
                height="100"
                rx="12"
                fill="#cffafe"
                stroke="#06b6d4"
                strokeWidth="2"
              />
              <text x="90" y="30" textAnchor="middle" fill="#0e7490" fontSize="12" fontWeight="bold">
                3. WEBSITE ATTRACTS
              </text>
              <text x="90" y="50" textAnchor="middle" fill="#0e7490" fontSize="11">
                Patient Traffic
              </text>
              <text x="90" y="68" textAnchor="middle" fill="#6b7280" fontSize="10">
                Google search results
              </text>
              <text x="90" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">
                Local SEO visibility
              </text>
            </g>

            {/* Arrow 3 - down */}
            <path d="M730 180 L730 220 L640 220 L640 260" stroke="#06b6d4" strokeWidth="3" markerEnd="url(#cyanArrow)" />

            {/* Flow Step 4: Leads Generated */}
            <g transform="translate(550, 270)">
              <rect
                x="0"
                y="0"
                width="180"
                height="100"
                rx="12"
                fill="#fef3c7"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text x="90" y="30" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">
                4. LEADS GENERATED
              </text>
              <text x="90" y="50" textAnchor="middle" fill="#92400e" fontSize="11">
                Contact Forms & Calls
              </text>
              <text x="90" y="68" textAnchor="middle" fill="#6b7280" fontSize="10">
                Appointment requests
              </text>
              <text x="90" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">
                Tracked via CTM/Forms
              </text>
            </g>

            {/* Arrow 4 - left */}
            <path d="M540 320 L490 320" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#amberArrow)" />

            {/* Flow Step 5: Practice Converts */}
            <g transform="translate(300, 270)">
              <rect
                x="0"
                y="0"
                width="180"
                height="100"
                rx="12"
                fill="#fce7f3"
                stroke="#ec4899"
                strokeWidth="2"
              />
              <text x="90" y="30" textAnchor="middle" fill="#9d174d" fontSize="12" fontWeight="bold">
                5. PRACTICE CONVERTS
              </text>
              <text x="90" y="50" textAnchor="middle" fill="#9d174d" fontSize="11">
                Leads to Patients
              </text>
              <text x="90" y="68" textAnchor="middle" fill="#6b7280" fontSize="10">
                Practice schedules</text>
              <text x="90" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">
                appointments
              </text>
            </g>

            {/* Arrow 5 - left */}
            <path d="M290 320 L240 320" stroke="#ec4899" strokeWidth="3" markerEnd="url(#pinkArrow)" />

            {/* Flow Step 6: Revenue Growth */}
            <g transform="translate(50, 270)">
              <rect
                x="0"
                y="0"
                width="180"
                height="100"
                rx="12"
                fill="#d1fae5"
                stroke="#10b981"
                strokeWidth="2"
              />
              <text x="90" y="30" textAnchor="middle" fill="#065f46" fontSize="12" fontWeight="bold">
                6. REVENUE GROWTH
              </text>
              <text x="90" y="50" textAnchor="middle" fill="#065f46" fontSize="11">
                Practice Grows
              </text>
              <text x="90" y="68" textAnchor="middle" fill="#6b7280" fontSize="10">
                More patients = More revenue
              </text>
              <text x="90" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">
                ROI on DL subscription
              </text>
            </g>

            {/* Loop back arrow */}
            <path
              d="M50 320 L20 320 L20 130 L40 130"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              markerEnd="url(#greenArrow)"
            />
            <text x="10" y="220" fill="#10b981" fontSize="9" transform="rotate(-90, 10, 220)">
              Reinvest in marketing
            </text>

            {/* Divider */}
            <line x1="50" y1="420" x2="850" y2="420" stroke="#e5e7eb" strokeWidth="2" />

            {/* Key Metrics Section */}
            <text x="450" y="450" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
              Key Value Metrics
            </text>

            {/* Metric boxes */}
            <g transform="translate(80, 470)">
              <rect x="0" y="0" width="150" height="60" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <text x="75" y="25" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">Website Traffic</text>
              <text x="75" y="45" textAnchor="middle" fill="#6b7280" fontSize="10">Google Analytics (GA4)</text>
            </g>

            <g transform="translate(260, 470)">
              <rect x="0" y="0" width="150" height="60" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <text x="75" y="25" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">Lead Volume</text>
              <text x="75" y="45" textAnchor="middle" fill="#6b7280" fontSize="10">Forms + Call Tracking</text>
            </g>

            <g transform="translate(440, 470)">
              <rect x="0" y="0" width="150" height="60" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <text x="75" y="25" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">SEO Rankings</text>
              <text x="75" y="45" textAnchor="middle" fill="#6b7280" fontSize="10">BrightLocal Tracking</text>
            </g>

            <g transform="translate(620, 470)">
              <rect x="0" y="0" width="150" height="60" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <text x="75" y="25" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">Conversion Rate</text>
              <text x="75" y="45" textAnchor="middle" fill="#6b7280" fontSize="10">Visitors to Leads</text>
            </g>

            {/* What DL Provides section */}
            <text x="450" y="570" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
              What DoctorLogic Provides
            </text>

            <g transform="translate(100, 585)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">Professional website design</text>
            </g>

            <g transform="translate(300, 585)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">Content management</text>
            </g>

            <g transform="translate(480, 585)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">SEO optimization</text>
            </g>

            <g transform="translate(640, 585)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">Lead tracking</text>
            </g>

            <g transform="translate(100, 610)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">Hosting & infrastructure</text>
            </g>

            <g transform="translate(300, 610)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">Analytics & reporting</text>
            </g>

            <g transform="translate(480, 610)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">Ongoing support</text>
            </g>

            <g transform="translate(640, 610)">
              <circle cx="8" cy="8" r="6" fill="#6366f1" />
              <text x="20" y="12" fill="#4b5563" fontSize="11">Review management</text>
            </g>

            {/* Arrow Marker Definitions */}
            <defs>
              <marker id="greenArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
              </marker>
              <marker id="indigoArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
              </marker>
              <marker id="cyanArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
              </marker>
              <marker id="amberArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
              </marker>
              <marker id="pinkArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Description */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-3">About This View</h2>
          <p className="text-gray-600 text-sm">
            This diagram illustrates the value chain that DoctorLogic creates for healthcare
            practices. Starting with a subscription investment, DoctorLogic builds and maintains
            professional marketing websites that attract potential patients through search
            engines. These visitors convert to leads through contact forms and phone calls,
            which the practice then converts into patients, generating revenue that justifies
            and exceeds their marketing investment.
          </p>
        </div>
      </div>
    </main>
  );
}
