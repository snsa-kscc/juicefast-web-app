import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDailyMetrics } from "@/app/actions/health-actions";
import { getTodayKey } from "@/lib/date-utils";
import { notFound } from "next/navigation";

// Import all tracker client components
import { WaterTrackerClient } from "@/components/health-tracker/water-tracker-client";
import { StepsTrackerClient } from "@/components/health-tracker/steps-tracker-client";
import { SleepTrackerClient } from "@/components/health-tracker/sleep-tracker-client";
import { MindfulnessTrackerClient } from "@/components/health-tracker/mindfulness-tracker-client";
import { MealsTrackerClient } from "@/components/health-tracker/meals-tracker-client";

// Define valid tracker types
const validTypes = ["water", "steps", "sleep", "mindfulness", "meals"];

interface TrackerPageProps {
  params: Promise<{ type: string }>;
}

/**
 * Dynamic Tracker Page - Server Component
 * Handles all health tracking types using dynamic routing
 */
export default async function TrackerPage({ params }: TrackerPageProps) {
  const { type } = await params;

  // Validate tracker type
  if (!validTypes.includes(type)) {
    notFound();
  }

  // Get the authenticated user ID
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id ?? "";

  // Get today's date
  const today = new Date(getTodayKey());

  // Fetch data for today
  const dailyMetrics = await getDailyMetrics(userId, today);

  // Render the appropriate tracker client based on type
  switch (type) {
    case "water":
      return <WaterTrackerClient userId={userId} initialWaterData={dailyMetrics} />;
    case "steps":
      return <StepsTrackerClient userId={userId} initialStepsData={dailyMetrics} />;
    case "sleep":
      return <SleepTrackerClient userId={userId} initialSleepData={dailyMetrics} />;
    case "mindfulness":
      return <MindfulnessTrackerClient userId={userId} initialMindfulnessData={dailyMetrics} />;
    case "meals":
      return <MealsTrackerClient userId={userId} initialMealsData={dailyMetrics} />;
    default:
      notFound();
  }
}
