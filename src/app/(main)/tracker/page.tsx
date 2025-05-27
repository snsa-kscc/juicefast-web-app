import { TrackerClient } from "@/components/health-tracker/tracker-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWeeklyMetrics, getWeeklyAverageScore } from "@/app/actions/health-actions";

/**
 * Main Tracker Dashboard Page - Server Component
 * Fetches weekly metrics and passes them to the client component
 */
export default async function TrackerPage() {
  // Get the authenticated user ID
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id ?? "";
  
  // Fetch weekly metrics and average score
  const weeklyMetrics = await getWeeklyMetrics(userId);
  const weeklyAverageScore = await getWeeklyAverageScore(userId);
  
  return (
    <TrackerClient 
      userId={userId} 
      weeklyMetrics={weeklyMetrics} 
      weeklyAverageScore={weeklyAverageScore} 
    />
  );
}
