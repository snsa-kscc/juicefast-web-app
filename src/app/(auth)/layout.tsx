import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Juicefast - Sign In",
  description: "Sign in to your Juicefast account to track your nutrition and meals.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="layout props">{children}</div>;
}
