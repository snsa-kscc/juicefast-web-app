"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageScanner } from "@/components/meal-tracker/image-scanner";
import { ManualEntryForm } from "@/components/meal-tracker/manual-entry-form";
import { MealTrackerExtended } from "@/components/health-tracker/meal-tracker-extended";
import { MacroData, MealEntry, MealType, DailyHealthMetrics } from "@/types/health-metrics";
import { ArrowLeft } from "lucide-react";
import { MEALS_TRACKER_CONFIG } from "@/data/meals-tracker";
import { addMeal } from "@/app/actions/health-actions";

interface MealsTrackerClientProps {
  userId: string;
  initialMealsData: DailyHealthMetrics | null;
}

export function MealsTrackerClient({ userId, initialMealsData }: MealsTrackerClientProps) {
  const router = useRouter();
  const [activeEntryTab, setActiveEntryTab] = useState<"scan" | "manual">("scan");
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Initialize with data if available
  useEffect(() => {
    if (initialMealsData?.meals) {
      setMeals(initialMealsData.meals);
    }
  }, [initialMealsData]);

  const handleMealAdded = async (mealData: MacroData) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      const newMeal: MealEntry = {
        mealType: MEALS_TRACKER_CONFIG.mealTypes[0].id as MealType, // Default to first meal type
        timestamp: new Date(),
        ...mealData,
      };
      
      // Save to database
      await addMeal(userId, new Date(), newMeal);
      
      // Update local state
      const updatedMeals = [...meals, newMeal];
      setMeals(updatedMeals);
    } catch (error) {
      console.error("Failed to save meal data:", error);
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
          >
            Scan Meal
          </Button>
          <Button
            variant={activeEntryTab === "manual" ? "default" : "ghost"}
            onClick={() => setActiveEntryTab("manual")}
            className="flex-1 rounded-none rounded-tr-md"
            disabled={isLoading}
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
