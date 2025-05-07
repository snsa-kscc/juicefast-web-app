"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageScanner } from "@/components/meal-tracker/image-scanner";
import { ManualEntryForm } from "@/components/meal-tracker/manual-entry-form";
import { MealTrackerExtended } from "@/components/health-tracker/meal-tracker-extended";
import { MacroData, MealEntry, MealType } from "@/types/health-metrics";
import { formatDateKey, getTodayKey, loadDailyMetrics, saveDailyMetrics } from "@/lib/daily-tracking-store";
import { ArrowLeft } from "lucide-react";
import { MEALS_TRACKER_CONFIG } from "@/data/meals-tracker";

export default function MealsTrackerPage() {
  const router = useRouter();
  const [activeEntryTab, setActiveEntryTab] = useState<"scan" | "manual">("scan");
  const [meals, setMeals] = useState<MealEntry[]>(() => {
    const todayKey = getTodayKey();
    const dailyMetrics = loadDailyMetrics(todayKey);
    return dailyMetrics.meals || [];
  });

  const handleMealAdded = (mealData: MacroData) => {
    const todayKey = getTodayKey();
    const dailyMetrics = loadDailyMetrics(todayKey);
    
    const newMeal: MealEntry = {
      mealType: MEALS_TRACKER_CONFIG.mealTypes[0].id as MealType, // Default to first meal type
      timestamp: new Date(),
      ...mealData,
    };
    
    const updatedMeals = [...(dailyMetrics.meals || []), newMeal];
    setMeals(updatedMeals);
    
    // Update storage
    saveDailyMetrics(todayKey, {
      ...dailyMetrics,
      meals: updatedMeals,
    });
  };

  const handleAddMealByType = (mealType: MealType) => {
    setActiveEntryTab("manual");
    // The actual meal will be added through the ManualEntryForm
  };

  return (
    <div className="py-6 font-sans">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2 p-0 h-9 w-9" 
          onClick={() => router.push('/tracker')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Meal Tracker</h1>
      </div>
      
      <div className="space-y-6">
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
        {activeEntryTab === "scan" ? (
          <ImageScanner onScanComplete={handleMealAdded} />
        ) : (
          <ManualEntryForm onMealAdded={handleMealAdded} />
        )}
      </div>

      {/* Meal tracker by meal type */}
      <div className="mt-8">
        <MealTrackerExtended meals={meals} onAddMeal={handleAddMealByType} />
      </div>
    </div>
  );
}
