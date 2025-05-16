import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { NutritionistChat } from "@/components/nutritionist/nutritionist-chat";
import Link from "next/link";

const userId = "user-123";

export default function NutritionistChatPage() {
  return (
    <div className="py-6 font-sans h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center mb-4">
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nutritionist Chat</h1>
      </div>

      <div className="flex-grow overflow-hidden">
        <NutritionistChat userId={userId} />
      </div>
    </div>
  );
}
