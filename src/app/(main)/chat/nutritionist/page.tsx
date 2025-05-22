import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { NutritionistChat } from "@/components/nutritionist/nutritionist-chat";
import Link from "next/link";
import { getNutritionists, getUserActiveChatSession, getChatMessages } from "@/app/actions/nutritionist-actions";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function NutritionistChatPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fallback to a demo user ID if not authenticated
  const userId = session?.user?.id ?? "";

  // Fetch data needed for the chat
  const nutritionists = await getNutritionists();
  const activeSession = await getUserActiveChatSession(userId);

  // Get messages if there's an active session
  const messages = activeSession ? await getChatMessages(activeSession.id) : [];

  return (
    <div className="py-6 font-sans h-[calc(100vh-4rem)] flex flex-col">
      <p>{session?.user.email}</p>
      <div className="flex items-center mb-4">
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nutritionist Chat</h1>
      </div>

      <div className="flex-grow overflow-hidden">
        <NutritionistChat userId={userId} nutritionists={nutritionists} activeSession={activeSession} initialMessages={messages} />
      </div>
    </div>
  );
}
