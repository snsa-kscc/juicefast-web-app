import { Metadata } from "next";
import Image from "next/image";
import logo from "../../../public/jf-logo.png";

export const metadata: Metadata = {
  title: "Juicefast - Sign In",
  description: "Sign in to your Juicefast account to track your nutrition and meals.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center">
          <Image src={logo} alt="juice" width={80} height={80} />
        </div>
        {children}
      </div>
    </div>
  );
}
