import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="mx-auto py-10 px-4 md:px-6 grid font-sans place-content-center gap-2 max-w-xs min-h-[100vh]">
      <h1 className="text-7xl font-black">Project Taurus</h1>
      <Button variant="ghost" className="border border-gray-300">
        <Link href="/sign-in">Login</Link>
      </Button>
      <Button variant="ghost" className="border border-gray-300">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}
