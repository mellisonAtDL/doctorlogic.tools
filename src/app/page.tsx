import Link from "next/link";
import { Image, Settings, Users } from "lucide-react";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome to DoctorLogic Tools
      </h1>
      <p className="text-gray-600 mb-8">
        Internal tools and utilities for the DoctorLogic team.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/logos" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Image className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Client Logos
            </h2>
          </div>
          <p className="text-gray-600">
            Upload, manage, and organize client logos for various uses.
          </p>
        </Link>

        <div className="card opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-400">
              Clients
            </h2>
          </div>
          <p className="text-gray-400">Coming soon...</p>
        </div>

        <div className="card opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-400">
              Settings
            </h2>
          </div>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
