"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageScanner } from "@/components/meal-tracker/image-scanner";
import { ManualEntryForm } from "@/components/meal-tracker/manual-entry-form";
import { MealTrackerExtended } from "@/components/health-tracker/meal-tracker-extended";
import { MacroData, MealEntry, MealType, DailyHealthMetrics } from "@/types/health-metrics";
import { ArrowLeft, Settings, Home, ShoppingCart, MessageCircle, Users } from "lucide-react";
import { MEALS_TRACKER_CONFIG } from "@/data/meals-tracker";
import { addMeal } from "@/app/actions/health-actions";
import { cn } from "@/lib/utils";

interface MealsTrackerClientProps {
  userId: string;
  initialMealsData: DailyHealthMetrics | null;
}

export function MealsTrackerClient({ userId, initialMealsData }: MealsTrackerClientProps) {
  const router = useRouter();
  const [activeEntryTab, setActiveEntryTab] = useState<"scan" | "manual">("scan");
  const [activeInputMethod, setActiveInputMethod] = useState<"camera" | "photos" | "files">("camera");
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");

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
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      {/* Header and blob */}
      <div className="relative overflow-hidden py-6">
        <div className="absolute w-64 h-64 rounded-full bg-[#4CC3FF]/40 blur-[80px] -top-5 z-0" />
        <div className="flex items-center justify-between px-4 relative z-10">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-2 p-0 h-12 w-12 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={() => router.push("/tracker")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Meal Tracker</h1>
              <p className="text-gray-500 text-sm">What you eat builds your energy, mood and body. Let's track it.</p>
            </div>
          </div>
          <Button variant="ghost" className="p-2 rounded-full" onClick={() => {}}>
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Scan meal image section */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Scan meal image</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button
            variant={activeEntryTab === "scan" ? "default" : "outline"}
            onClick={() => setActiveEntryTab("scan")}
            className="rounded-md bg-emerald-500 hover:bg-emerald-600 text-white h-14"
          >
            Upload image
          </Button>
          <Button
            variant={activeEntryTab === "manual" ? "default" : "outline"}
            onClick={() => setActiveEntryTab("manual")}
            className="rounded-md border-2 border-black/10 bg-white text-black h-14"
          >
            Manual entry
          </Button>
        </div>

        {activeEntryTab === "scan" && (
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 rounded-lg border-2",
                activeInputMethod === "camera" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
              )}
              onClick={() => setActiveInputMethod("camera")}
            >
              <span className="text-sm">Camera</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 rounded-lg border-2",
                activeInputMethod === "photos" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
              )}
              onClick={() => setActiveInputMethod("photos")}
            >
              <span className="text-sm">Photos</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-24 rounded-lg border-2",
                activeInputMethod === "files" ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
              )}
              onClick={() => setActiveInputMethod("files")}
            >
              <span className="text-sm">Files</span>
            </Button>
          </div>
        )}

        {/* Active tab content - hidden for now to match the design */}
        <div className="hidden">
          {activeEntryTab === "scan" ? <ImageScanner onScanComplete={handleMealAdded} /> : <ManualEntryForm onMealAdded={handleMealAdded} />}
        </div>
      </div>

      {/* Meals section */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Meals</h2>

        <div className="grid grid-cols-4 gap-1 mb-4">
          <Button
            variant="ghost"
            className={cn("text-sm py-2", activeTab === "breakfast" ? "border-b-2 border-black font-medium" : "text-gray-500")}
            onClick={() => setActiveTab("breakfast")}
          >
            Breakfast
          </Button>
          <Button
            variant="ghost"
            className={cn("text-sm py-2", activeTab === "snack" ? "border-b-2 border-black font-medium" : "text-gray-500")}
            onClick={() => setActiveTab("snack")}
          >
            Snack
          </Button>
          <Button
            variant="ghost"
            className={cn("text-sm py-2", activeTab === "lunch" ? "border-b-2 border-black font-medium" : "text-gray-500")}
            onClick={() => setActiveTab("lunch")}
          >
            Lunch
          </Button>
          <Button
            variant="ghost"
            className={cn("text-sm py-2", activeTab === "dinner" ? "border-b-2 border-black font-medium" : "text-gray-500")}
            onClick={() => setActiveTab("dinner")}
          >
            Dinner
          </Button>
        </div>

        <div className="flex items-center justify-center py-8 text-gray-500">No meals logged yet</div>

        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-md py-6" onClick={() => handleAddMealByType(activeTab)}>
          Add your first meal
        </Button>
      </div>

      {/* Daily nutrition totals */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">Daily nutrition totals</h2>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">0</div>
            <div className="text-xs text-gray-500">Calories</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">0g</div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">0g</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">0g</div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
