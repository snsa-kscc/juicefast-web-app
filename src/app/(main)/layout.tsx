"use client";

import { MobileNavigation } from "@/components/navigation/mobile-navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <MobileNavigation />
    </div>
  );
}
