import { DashboardClient } from "@/components/health-tracker/dashboard-client";
import { getWeeklyMetrics, getWeeklyAverageScore } from "@/app/actions/health-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Process metrics data for the dashboard display
 */
function processWeeklyMetricsForDashboard(weeklyMetrics: any[]) {
  return weeklyMetrics.map((metrics) => {
    // Calculate totals for the day
    const steps = metrics.steps?.reduce((sum: number, entry: any) => sum + entry.count, 0) || 0;
    const water = metrics.waterIntake?.reduce((sum: number, entry: any) => sum + entry.amount, 0) || 0;
    const calories = metrics.meals?.reduce((sum: number, meal: any) => sum + meal.calories, 0) || 0;
    const mindfulness = metrics.mindfulness?.reduce((sum: number, entry: any) => sum + entry.minutes, 0) || 0;
    const sleep = metrics.sleep?.hoursSlept || 0;

    return {
      date: metrics.date.toLocaleDateString("en-US", { weekday: "short" }),
      steps,
      water,
      calories,
      mindfulness,
      sleep,
      fullDate: metrics.date,
    };
  });
}

/**
 * Dashboard page component - server component that fetches data and passes it to client component
 */
export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id ?? "";
  const userName = session?.user?.name ?? "";
  // Fetch weekly metrics and average score from the database
  const weeklyMetrics = await getWeeklyMetrics(userId);
  const averageScore = await getWeeklyAverageScore(userId);

  // Process the data for the dashboard
  const processedData = processWeeklyMetricsForDashboard(weeklyMetrics);

  return <DashboardClient userId={userId} userName={userName} initialWeeklyData={processedData} initialAverageScore={averageScore} />;
}
