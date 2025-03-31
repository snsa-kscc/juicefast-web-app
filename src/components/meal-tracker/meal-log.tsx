"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MacroData } from "@/app/actions/analyze-meal";

export function MealLog({ meals = [] }: { meals?: MacroData[] }) {
  const [mealEntries, setMealEntries] = useState<MacroData[]>(meals);

  // Update meals when the prop changes
  useEffect(() => {
    setMealEntries(meals);
  }, [meals]);

  // In a real app, we would fetch this data from a database

  if (mealEntries.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Meal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">No meal entries yet. Add a meal to see it here.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Meal History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mealEntries.map((meal, index) => (
            <div key={index} className="border rounded-md p-4 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{meal.name}</h3>
                <div className="text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">{meal.calories} kcal</div>
              </div>

              {meal.description && <p className="text-sm text-gray-600 mb-3">{meal.description}</p>}

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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
