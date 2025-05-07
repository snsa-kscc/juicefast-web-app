"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAVIGATION_ITEMS } from "@/data/navigation";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="grid h-16 grid-cols-6 mx-auto max-w-lg">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-2 ${
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <IconComponent className={`w-6 h-6 ${isActive ? "text-primary" : ""}`} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
