import Link from "next/link";

export default function Engineering() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
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
          <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-cyan-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Engineering</h1>
        </div>
        <p className="text-lg text-gray-600 mb-12">
          Engineering tools for architecture documentation, system design, and
          technical resources.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/engineering/architecture"
            className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-cyan-300 transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Architecture Diagram
              </h2>
            </div>
            <p className="text-gray-600">
              Interactive visualization of our system architecture. View
              relationships between services, databases, and external systems
              using C4 model diagrams.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
