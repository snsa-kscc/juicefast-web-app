import { Metadata } from "next";
import Image from "next/image";
import logo from "../../../public/jf-pictogram.png";

export const metadata: Metadata = {
  title: "Juicefast - Sign In",
  description: "Sign in to your Juicefast account to track your nutrition and meals.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white pt-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center">
          <Image src={logo} alt="juicefast" width={65} height={65} />
        </div>
        {children}
      </div>
    </div>
  );
}
