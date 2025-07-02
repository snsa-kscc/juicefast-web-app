"use client";

import { MobileNavigation } from "@/components/navigation/mobile-navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16">
      <main className="container mx-auto max-w-7xl">{children}</main>
      <MobileNavigation />
    </div>
  );
}
