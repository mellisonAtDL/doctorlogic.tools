import Link from "next/link";

const tools = [
  {
    title: "Client Logo Manager",
    description: "Upload, organize, and manage client logos in one centralized location.",
    href: "/logos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            DoctorLogic Internal Tools
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Welcome to the internal tools portal for DoctorLogic employees.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">
          Available Tools
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-600"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {tool.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {tool.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
