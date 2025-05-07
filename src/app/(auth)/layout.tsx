import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Juicefast - Sign In",
  description: "Sign in to your Juicefast account to track your nutrition and meals.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 text-4xl flex items-center justify-center">
            🥤
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            <span className="text-green-600">Juice</span>fast
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}
