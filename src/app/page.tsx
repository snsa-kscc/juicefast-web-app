"use client";

import Image from "next/image";
import { useState, Suspense } from "react";
import { ImageScanner } from "@/components/meal-tracker/image-scanner";
import { ManualEntryForm } from "@/components/meal-tracker/manual-entry-form";
import { MealLog } from "@/components/meal-tracker/meal-log";
import { MacroData } from "@/app/actions/analyze-meal";
import { Button } from "@/components/ui/button";

// Main component for the meal tracker app
function MealTrackerApp() {
  const [meals, setMeals] = useState<MacroData[]>([]);
  const [activeTab, setActiveTab] = useState<"scan" | "manual">("scan");

  // Handler for when a meal is added (from either scanner or manual entry)
  const handleMealAdded = (mealData: MacroData) => {
    setMeals((prev) => [mealData, ...prev]);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Meal Tracker</h1>
        <p className="text-gray-500 mt-2">Track your food intake and macros</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Tab buttons */}
          <div className="flex border-b">
            <Button variant={activeTab === "scan" ? "default" : "ghost"} onClick={() => setActiveTab("scan")} className="flex-1 rounded-none rounded-tl-md">
              Scan Meal
            </Button>
            <Button variant={activeTab === "manual" ? "default" : "ghost"} onClick={() => setActiveTab("manual")} className="flex-1 rounded-none rounded-tr-md">
              Manual Entry
            </Button>
          </div>

          {/* Active tab content */}
          {activeTab === "scan" ? <ImageScanner onScanComplete={handleMealAdded} /> : <ManualEntryForm onMealAdded={handleMealAdded} />}
        </div>

        {/* Meal history */}
        <div>
          <MealLog meals={meals} />
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Juicefast Meal Tracker App - project Taurus</p>
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
      <MealTrackerApp />
    </Suspense>
  );
}
