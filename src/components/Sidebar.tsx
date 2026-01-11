"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, Users, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Client Logos", href: "/logos", icon: Image },
  { name: "Clients", href: "/clients", icon: Users, disabled: true },
  { name: "Settings", href: "/settings", icon: Settings, disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600">DoctorLogic</h1>
        <p className="text-sm text-gray-500">Tools</p>
      </div>

      <nav className="px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 px-4 py-3 mb-1 text-gray-400 cursor-not-allowed rounded-lg"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
