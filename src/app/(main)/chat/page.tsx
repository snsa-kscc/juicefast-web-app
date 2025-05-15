"use client";

import { useState, useEffect } from "react";
import { NutritionistChat } from "@/components/nutritionist/nutritionist-chat";
import { AIChat } from "@/components/ai/ai-chat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, UserRoundIcon, BrainCircuitIcon } from "lucide-react";
import { loadUserProfile } from "@/lib/daily-tracking-store";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ChatPage() {
  const { data, isPending, error } = authClient.useSession();
  const router = useRouter();
  const [userId, setUserId] = useState<string>("user-123"); // Default user ID
  const [activeTab, setActiveTab] = useState<string>("nutritionist");

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
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Health Chat</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="nutritionist" className="flex items-center gap-2">
            <UserRoundIcon className="h-4 w-4" />
            Nutritionist
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <BrainCircuitIcon className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nutritionist" className="flex-grow overflow-hidden mt-0">
          <NutritionistChat userId={userId} />
        </TabsContent>

        <TabsContent value="ai" className="flex-grow overflow-hidden mt-0">
          <AIChat userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
