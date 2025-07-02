import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Lufga } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Juicefast Nutrition App",
  description:
    "Juicefast is a mobile app that helps you track your macronutrients and stay on top of your nutrition. It's the perfect tool for anyone looking to optimize their diet and reach their health and fitness goals.",
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
      <body className={`${Lufga.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
