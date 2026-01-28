import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Yapi &amp; DoctorLogic Tools
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Internal tools for managing client assets and resources.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/marketing"
            className="block p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Marketing</h2>
            </div>
            <p className="text-gray-600">
              Marketing tools for campaigns, content, and brand management.
            </p>
          </Link>

          <Link
            href="/design-tools"
            className="block p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Design Tools
              </h2>
            </div>
            <p className="text-gray-600">
              Design tools for creating and managing visual assets.
            </p>
          </Link>

          <Link
            href="/engineering"
            className="block p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-cyan-300 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-cyan-600"
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
              <h2 className="text-2xl font-semibold text-gray-900">
                Engineering
              </h2>
            </div>
            <p className="text-gray-600">
              Engineering tools for architecture docs, system design, and
              technical resources.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
