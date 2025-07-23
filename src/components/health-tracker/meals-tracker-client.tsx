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

  const handleMealAdded = async (mealData: MacroData, mealType?: MealType) => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const newMeal: MealEntry = {
        mealType: mealType || activeTab, // Use provided meal type or current active tab
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
    setActiveTab(mealType);
    setActiveEntryTab("manual");
  };

  // Calculate daily nutrition totals
  const calculateDailyTotals = () => {
    return meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  // Filter meals by type
  const getMealsByType = (mealType: MealType) => {
    return meals.filter(meal => meal.mealType === mealType);
  };

  const dailyTotals = calculateDailyTotals();
  const currentMeals = getMealsByType(activeTab);

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

        {/* Active tab content */}
        <div className="mt-4">
          {activeEntryTab === "scan" ? (
            <ImageScanner onScanComplete={(data) => handleMealAdded(data, activeTab)} />
          ) : (
            <ManualEntryForm onMealAdded={(data) => handleMealAdded(data, activeTab)} />
          )}
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

        {currentMeals.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500">No meals logged yet</div>
        ) : (
          <div className="space-y-3 mb-4">
            {currentMeals.map((meal, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{meal.name}</h3>
                  <div className="text-sm font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {meal.calories} kcal
                  </div>
                </div>
                
                {meal.description && (
                  <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                )}
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <span className="block font-medium text-blue-700">{meal.protein}g</span>
                    <span className="text-xs text-gray-600">Protein</span>
                  </div>
                  <div className="bg-amber-50 p-2 rounded text-center">
                    <span className="block font-medium text-amber-700">{meal.carbs}g</span>
                    <span className="text-xs text-gray-600">Carbs</span>
                  </div>
                  <div className="bg-orange-50 p-2 rounded text-center">
                    <span className="block font-medium text-orange-700">{meal.fat}g</span>
                    <span className="text-xs text-gray-600">Fat</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-2 text-right">
                  {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-md py-6" onClick={() => handleAddMealByType(activeTab)}>
          {currentMeals.length === 0 ? 'Add your first meal' : `Add another ${activeTab}`}
        </Button>
      </div>

      {/* Daily nutrition totals */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">Daily nutrition totals</h2>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">{dailyTotals.calories}</div>
            <div className="text-xs text-gray-500">Calories</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">{dailyTotals.protein}g</div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">{dailyTotals.carbs}g</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-500">{dailyTotals.fat}g</div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
