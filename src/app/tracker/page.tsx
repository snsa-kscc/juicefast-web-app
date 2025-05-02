"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ImageScanner } from "@/components/meal-tracker/image-scanner";
import { ManualEntryForm } from "@/components/meal-tracker/manual-entry-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { isValidToken } from "@/lib/auth";
import {
  MacroData,
  MealEntry,
  MealType,
  WaterIntake,
  StepEntry,
  SleepEntry,
  MindfulnessEntry,
  UserProfile as UserProfileType,
  DailyHealthMetrics,
  calculateHealthScore,
  HealthScore,
  DAILY_TARGETS,
} from "@/types/health-metrics";
import { HealthScoreCard } from "@/components/health-tracker/health-score-card";
import { WaterTracker } from "@/components/health-tracker/water-tracker";
import { StepsTracker } from "@/components/health-tracker/steps-tracker";
import { SleepTracker } from "@/components/health-tracker/sleep-tracker";
import { MindfulnessTracker } from "@/components/health-tracker/mindfulness-tracker";
import { MealTrackerExtended } from "@/components/health-tracker/meal-tracker-extended";
import { UserProfile } from "@/components/health-tracker/user-profile";
import { DatePicker } from "@/components/health-tracker/date-picker";
import { WeeklyTrends } from "@/components/health-tracker/weekly-trends";
import { formatDateKey, getTodayKey, loadDailyMetrics, saveDailyMetrics, loadUserProfile, saveUserProfile } from "@/lib/daily-tracking-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Main component that uses search params - needs to be wrapped in Suspense
function HealthTrackerApp() {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "meals" | "activity" | "profile" | "trends">("dashboard");
  const [activeEntryTab, setActiveEntryTab] = useState<"scan" | "manual">("scan");

  // Selected date for tracking
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(getTodayKey());
  const [isToday, setIsToday] = useState<boolean>(true);

  // Health metrics state
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [waterIntake, setWaterIntake] = useState<WaterIntake[]>([]);
  const [steps, setSteps] = useState<StepEntry[]>([]);
  const [sleep, setSleep] = useState<SleepEntry | undefined>(undefined);
  const [mindfulness, setMindfulness] = useState<MindfulnessEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScore>({
    total: 0,
    nutrition: 0,
    water: 0,
    steps: 0,
    sleep: 0,
    mindfulness: 0,
  });

  // Check authentication on component mount and when search params change
  useEffect(() => {
    const authToken = searchParams.get("auth");
    setIsAuthenticated(isValidToken(authToken));
  }, [searchParams]);

  // Load user profile on mount
  useEffect(() => {
    const profile = loadUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  // Load data for the selected date
  useEffect(() => {
    const dateKey = formatDateKey(selectedDate);
    setSelectedDateKey(dateKey);
    setIsToday(dateKey === getTodayKey());

    const dailyMetrics = loadDailyMetrics(dateKey);

    // Update state with loaded metrics
    setMeals(dailyMetrics.meals || []);
    setWaterIntake(dailyMetrics.waterIntake || []);
    setSteps(dailyMetrics.steps || []);
    setSleep(dailyMetrics.sleep);
    setMindfulness(dailyMetrics.mindfulness || []);

    // Calculate health score
    const score = calculateHealthScore(dailyMetrics);
    setHealthScore(score);
  }, [selectedDate]);

  // Save metrics whenever they change
  useEffect(() => {
    const dailyMetrics: DailyHealthMetrics = {
      date: selectedDate,
      meals,
      waterIntake,
      steps,
      sleep,
      mindfulness,
    };

    // Calculate score
    const score = calculateHealthScore(dailyMetrics);
    setHealthScore(score);

    // Save to storage
    saveDailyMetrics(selectedDateKey, dailyMetrics);
  }, [meals, waterIntake, steps, sleep, mindfulness, selectedDateKey, selectedDate]);

  // Handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Handler for when a meal is added (from either scanner or manual entry)
  const handleMealAdded = (mealData: MacroData) => {
    // Only allow adding entries for today
    if (!isToday) {
      alert("You can only add entries for today. Please select today's date.");
      return;
    }

    // Convert MacroData to MealEntry with default meal type
    const mealEntry: MealEntry = {
      ...mealData,
      mealType: "lunch", // Default to lunch, can be changed later
      timestamp: new Date(),
    };

    setMeals((prev) => [mealEntry, ...prev]);
  };

  // Handler for adding a meal with specific meal type
  const handleAddMealByType = (mealType: MealType) => {
    // Only allow adding entries for today
    if (!isToday) {
      alert("You can only add entries for today. Please select today's date.");
      return;
    }

    // Switch to manual entry tab and set the active meal type
    setActiveTab("meals");
    setActiveEntryTab("manual");
    // The actual meal type selection would be handled in the form
  };

  // Handler for adding water
  const handleAddWater = (amount: number) => {
    // Only allow adding entries for today
    if (!isToday) {
      alert("You can only add entries for today. Please select today's date.");
      return;
    }

    const waterEntry: WaterIntake = {
      amount,
      timestamp: new Date(),
    };

    setWaterIntake((prev) => [waterEntry, ...prev]);
  };

  // Handler for adding steps
  const handleAddSteps = (count: number) => {
    // Only allow adding entries for today
    if (!isToday) {
      alert("You can only add entries for today. Please select today's date.");
      return;
    }

    const stepEntry: StepEntry = {
      count,
      timestamp: new Date(),
    };

    setSteps((prev) => [stepEntry, ...prev]);
  };

  // Handler for adding sleep
  const handleAddSleep = (hours: number, quality: number, startTime: Date, endTime: Date) => {
    // Only allow adding entries for today
    if (!isToday && hours !== 0) {
      alert("You can only add entries for today. Please select today's date.");
      return;
    }

    // If hours is 0, it means we're clearing the sleep entry
    if (hours === 0) {
      setSleep(undefined);
      return;
    }

    const sleepEntry: SleepEntry = {
      hoursSlept: hours,
      quality,
      startTime,
      endTime,
    };

    setSleep(sleepEntry);
  };

  // Handler for adding mindfulness
  const handleAddMindfulness = (minutes: number, activity: string) => {
    // Only allow adding entries for today
    if (!isToday) {
      alert("You can only add entries for today. Please select today's date.");
      return;
    }

    const mindfulnessEntry: MindfulnessEntry = {
      minutes,
      activity,
      timestamp: new Date(),
    };

    setMindfulness((prev) => [mindfulnessEntry, ...prev]);
  };

  // Handler for updating user profile
  const handleUpdateProfile = (profile: UserProfileType) => {
    setUserProfile(profile);
    saveUserProfile(profile);
  };

  // If not authenticated, show login instructions
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Authentication Required</h1>
          <p className="text-red-500 mb-6">You need to provide a valid authentication token to access this application.</p>
          <p className="text-sm text-gray-600 mb-4">
            Add <code>?auth=your-secret-token</code> to the URL to access the app.
          </p>
          <p className="text-xs text-gray-500">
            For example: <code>https://your-app-url.com/?auth=your-secret-token</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Health Tracker</h1>
            <p className="text-gray-500 mt-2">Track your nutrition, activity, and wellness</p>
          </div>

          <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
        </div>

        {!isToday && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            You are viewing data for {selectedDate.toLocaleDateString()}.
            <Button variant="link" className="p-0 h-auto text-amber-800 font-medium underline ml-1" onClick={() => setSelectedDate(new Date())}>
              Switch to today
            </Button>
          </div>
        )}
      </header>

      <main>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <HealthScoreCard score={healthScore} />
              </div>

              <MealTrackerExtended meals={meals} onAddMeal={handleAddMealByType} />

              <WaterTracker waterEntries={waterIntake} onAddWater={handleAddWater} />

              <StepsTracker stepEntries={steps} onAddSteps={handleAddSteps} />

              <SleepTracker sleepEntry={sleep} onAddSleep={handleAddSleep} />

              <MindfulnessTracker mindfulnessEntries={mindfulness} onAddMindfulness={handleAddMindfulness} />
            </div>
          </TabsContent>

          {/* Meals Tab */}
          <TabsContent value="meals" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {isToday && (
                  <>
                    {/* Meal Entry Tab buttons */}
                    <div className="flex border-b">
                      <Button
                        variant={activeEntryTab === "scan" ? "default" : "ghost"}
                        onClick={() => setActiveEntryTab("scan")}
                        className="flex-1 rounded-none rounded-tl-md"
                      >
                        Scan Meal
                      </Button>
                      <Button
                        variant={activeEntryTab === "manual" ? "default" : "ghost"}
                        onClick={() => setActiveEntryTab("manual")}
                        className="flex-1 rounded-none rounded-tr-md"
                      >
                        Manual Entry
                      </Button>
                    </div>

                    {/* Active tab content */}
                    {activeEntryTab === "scan" ? <ImageScanner onScanComplete={handleMealAdded} /> : <ManualEntryForm onMealAdded={handleMealAdded} />}
                  </>
                )}
              </div>

              {/* Meal tracker by meal type */}
              <div>
                <MealTrackerExtended meals={meals} onAddMeal={handleAddMealByType} />
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StepsTracker stepEntries={steps} onAddSteps={handleAddSteps} />

              <WaterTracker waterEntries={waterIntake} onAddWater={handleAddWater} />

              <SleepTracker sleepEntry={sleep} onAddSleep={handleAddSleep} />

              <MindfulnessTracker mindfulnessEntries={mindfulness} onAddMindfulness={handleAddMindfulness} />
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <WeeklyTrends />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Nutrition Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 py-12">Detailed nutrition trends will be available once you have more data.</p>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Activity Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 py-12">Detailed activity trends will be available once you have more data.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="max-w-md mx-auto">
              <UserProfile profile={userProfile} onUpdateProfile={handleUpdateProfile} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Juicefast Health Tracker App - project Taurus</p>
      </footer>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Loading...</h2>
        <p className="text-gray-500">Please wait while we initialize the app</p>
      </div>
    </div>
  );
}

// Export the main component wrapped in Suspense
export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HealthTrackerApp />
    </Suspense>
  );
}
