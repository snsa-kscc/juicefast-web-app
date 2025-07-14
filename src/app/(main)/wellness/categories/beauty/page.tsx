"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BeautyPage() {
  const router = useRouter();
  
  return (
    <div className="py-6 font-sans">
      <div className="px-4">
        <button 
          onClick={() => router.push("/wellness")} 
          className="flex items-center mb-6 text-gray-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-bold mb-6">Beauty</h1>
        
        <div className="text-center py-8">
          <p className="text-gray-500">Beauty content coming soon!</p>
          <p className="text-sm text-gray-400 mt-2">Check back for skincare routines, beauty tips, and self-care guides.</p>
        </div>
      </div>
    </div>
  );
}
