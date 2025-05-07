import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PwaMeta } from "@/components/meta/pwa-meta";
import { ServiceWorkerRegistration } from "@/components/meta/service-worker-registration";
import { UnregisterServiceWorker } from "@/components/meta/unregister-sw";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juicefast Nutrition App",
  description:
    "Juicefast is a mobile app that helps you track your macronutrients and stay on top of your nutrition. It's the perfect tool for anyone looking to optimize their diet and reach their health and fitness goals.",
  // manifest: "/manifest.json",
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
        {/* <PwaMeta /> */}
        {/* <ServiceWorkerRegistration /> */}
        <UnregisterServiceWorker />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
