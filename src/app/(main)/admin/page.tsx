import { redirect } from "next/navigation";
import {
  isUserAdmin,
  getNutritionistActiveSessions,
  getChatMessages,
  getNutritionistPendingSessionRequests,
  getNutritionistByUserId,
} from "@/app/actions/nutritionist-actions";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NutritionistAdmin } from "@/components/nutritionist/nutritionist-admin";
import { ChatSession } from "@/types/nutritionist";
import { MessageType } from "@/components/nutritionist/chat-message";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session?.user?.id ?? "";
  const isAdmin = await isUserAdmin(userId);

  if (!isAdmin) {
    redirect("/");
  }

  const nutritionist = await getNutritionistByUserId(userId);

  // Fetch all required data server-side
  const activeSessions = await getNutritionistActiveSessions(nutritionist?.id ?? "");
  const pendingRequests = await getNutritionistPendingSessionRequests(nutritionist?.id ?? "");

  // For completed sessions, filter from active sessions
  const completedSessions = activeSessions.filter((s: ChatSession) => s.status === "ended");
  const activeSessionsList = activeSessions.filter((s: ChatSession) => s.status !== "ended");

  // Pre-fetch messages for all active sessions
  const allSessionMessages: Record<string, MessageType[]> = {};

  // Only fetch messages for active sessions to keep it simple
  for (const session of activeSessionsList) {
    try {
      const messages = await getChatMessages(session.id);
      allSessionMessages[session.id] = messages;
    } catch (error) {
      console.error(`Error fetching messages for session ${session.id}:`, error);
      allSessionMessages[session.id] = [];
    }
  }

  return (
    <div className="container mx-auto py-8">
      <p>{session?.user.email}</p>
      <NutritionistAdmin
        nutritionistId={nutritionist?.id ?? ""}
        initialActiveSessions={activeSessionsList}
        initialPendingRequests={pendingRequests}
        initialCompletedSessions={completedSessions}
        initialSessionMessages={allSessionMessages}
      />
    </div>
  );
}
