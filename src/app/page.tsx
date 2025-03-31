"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ImageScanner } from "@/components/meal-tracker/image-scanner";
import { ManualEntryForm } from "@/components/meal-tracker/manual-entry-form";
import { MealLog } from "@/components/meal-tracker/meal-log";
import { MacroData } from "@/app/actions/analyze-meal";
import { Button } from "@/components/ui/button";
import { isValidToken, SECRET_TOKEN } from "@/lib/auth";

export default function Home() {
  const [meals, setMeals] = useState<MacroData[]>([]);
  const [activeTab, setActiveTab] = useState<"scan" | "manual">("scan");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();

  // Handler for when a meal is added (from either scanner or manual entry)
  const handleMealAdded = (mealData: MacroData) => {
    setMeals((prev) => [mealData, ...prev]);
  };

  // Check authentication on component mount and when search params change
  useEffect(() => {
    const authToken = searchParams.get("auth");
    setIsAuthenticated(isValidToken(authToken));
  }, [searchParams]);

  // If not authenticated, show login instructions
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Authentication Required</h1>
          <p className="text-red-500 mb-6">You need to provide a valid authentication token to access this application.</p>
          <p className="text-sm text-gray-600 mb-4">
            Add <code>?auth={SECRET_TOKEN}</code> to the URL to access the app.
          </p>
          <p className="text-xs text-gray-500">
            For example: <code>https://your-app-url.com/?auth={SECRET_TOKEN}</code>
          </p>
        </div>
      </div>
    );
  }

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
