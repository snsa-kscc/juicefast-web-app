"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageScanner } from "@/components/meal-tracker/image-scanner";
import { ManualEntryForm } from "@/components/meal-tracker/manual-entry-form";
import { MealTrackerExtended } from "@/components/health-tracker/meal-tracker-extended";
import { MacroData, MealEntry, MealType } from "@/types/health-metrics";
import { formatDateKey, getTodayKey, loadDailyMetrics, saveDailyMetrics } from "@/lib/daily-tracking-store";

export default function MealsPage() {
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
      mealType: "breakfast", // Default type
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
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Meal Tracker</h1>
      
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
