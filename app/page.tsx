import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          DoctorLogic Tools
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Internal tools for managing client assets and resources.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/logo-optimizer"
            className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Logo Optimizer
              </h2>
            </div>
            <p className="text-gray-600">
              Optimize client logos for both light and dark backgrounds.
              Automatically remove backgrounds and generate multiple variations.
            </p>
          </Link>

          <Link
            href="/word-mark-creator"
            className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Word Mark Creator
              </h2>
            </div>
            <p className="text-gray-600">
              Create simple text-based logos for clients without existing logos.
              Customize fonts, colors, and styles.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
