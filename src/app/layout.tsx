import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import { PwaMeta } from "@/components/meta/pwa-meta";
import { ServiceWorkerRegistration } from "@/components/meta/service-worker-registration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Taurus",
  description: "This is a project to help you track your macros.",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PwaMeta />
        {/* <ServiceWorkerRegistration /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pb-16`}>
        <main className="container mx-auto px-4 sm:px-6 max-w-7xl">{children}</main>
        <MobileNavigation />
        <Toaster />
      </body>
    </html>
  );
}
