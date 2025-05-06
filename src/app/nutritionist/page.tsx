"use client";

import { useState, useEffect } from "react";
import { NutritionistChat } from "@/components/nutritionist/nutritionist-chat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { loadUserProfile } from "@/lib/daily-tracking-store";

export default function NutritionistPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('user-123'); // Default user ID
  
  // Load user profile to get user ID
  useEffect(() => {
    const userProfile = loadUserProfile();
    if (userProfile && userProfile.id) {
      setUserId(userProfile.id);
    }
  }, []);
  
  return (
    <div className="py-6 font-sans h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Nutritionist Chat</h1>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <NutritionistChat userId={userId} />
      </div>
    </div>
  );
}
