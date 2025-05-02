"use client";

import { useState } from "react";
import { MealEntry, MealType } from "@/types/health-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Utensils, Coffee, Pizza } from "lucide-react";

interface MealTrackerExtendedProps {
  meals: MealEntry[];
  onAddMeal: (mealType: MealType) => void;
}

export function MealTrackerExtended({ meals, onAddMeal }: MealTrackerExtendedProps) {
  const [activeTab, setActiveTab] = useState<MealType>("breakfast");
  
  // Filter meals by type
  const breakfastMeals = meals.filter(meal => meal.mealType === "breakfast");
  const lunchMeals = meals.filter(meal => meal.mealType === "lunch");
  const dinnerMeals = meals.filter(meal => meal.mealType === "dinner");
  const snackMeals = meals.filter(meal => meal.mealType === "snack");
  
  // Calculate totals for each meal type
  const calculateTotals = (mealList: MealEntry[]) => {
    return {
      calories: mealList.reduce((sum, meal) => sum + meal.calories, 0),
      protein: mealList.reduce((sum, meal) => sum + meal.protein, 0),
      carbs: mealList.reduce((sum, meal) => sum + meal.carbs, 0),
      fat: mealList.reduce((sum, meal) => sum + meal.fat, 0),
    };
  };
  
  const breakfastTotals = calculateTotals(breakfastMeals);
  const lunchTotals = calculateTotals(lunchMeals);
  const dinnerTotals = calculateTotals(dinnerMeals);
  const snackTotals = calculateTotals(snackMeals);
  
  // Calculate daily totals
  const dailyTotals = calculateTotals(meals);
  
  // Render meal list for a specific meal type
  const renderMealList = (mealList: MealEntry[], totals: { calories: number, protein: number, carbs: number, fat: number }) => {
    if (mealList.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          No meals logged yet.
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium">{totals.calories}</div>
            <div className="text-xs text-gray-500">Calories</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-700">{totals.protein}g</div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
          <div className="bg-amber-50 p-2 rounded">
            <div className="font-medium text-amber-700">{totals.carbs}g</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="bg-orange-50 p-2 rounded">
            <div className="font-medium text-orange-700">{totals.fat}g</div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {mealList.map((meal, index) => (
            <div key={index} className="border rounded-md p-3 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{meal.name}</h3>
                <div className="text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
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
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-rose-500" />
          <span>Meals</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MealType)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="breakfast" className="flex items-center gap-1">
              <Coffee className="h-4 w-4" />
              <span className="hidden sm:inline">Breakfast</span>
            </TabsTrigger>
            <TabsTrigger value="lunch">
              <span className="hidden sm:inline">Lunch</span>
            </TabsTrigger>
            <TabsTrigger value="dinner">
              <Pizza className="h-4 w-4" />
              <span className="hidden sm:inline">Dinner</span>
            </TabsTrigger>
            <TabsTrigger value="snack">
              <span className="hidden sm:inline">Snacks</span>
            </TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddMeal(activeTab)}
            className="mb-4 w-full"
          >
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Button>
          
          <TabsContent value="breakfast">
            {renderMealList(breakfastMeals, breakfastTotals)}
          </TabsContent>
          
          <TabsContent value="lunch">
            {renderMealList(lunchMeals, lunchTotals)}
          </TabsContent>
          
          <TabsContent value="dinner">
            {renderMealList(dinnerMeals, dinnerTotals)}
          </TabsContent>
          
          <TabsContent value="snack">
            {renderMealList(snackMeals, snackTotals)}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">Daily Nutrition Totals</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-100 p-3 rounded">
              <div className="font-bold">{dailyTotals.calories}</div>
              <div className="text-xs text-gray-500">Calories</div>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <div className="font-bold text-blue-700">{dailyTotals.protein}g</div>
              <div className="text-xs text-gray-500">Protein</div>
            </div>
            <div className="bg-amber-100 p-3 rounded">
              <div className="font-bold text-amber-700">{dailyTotals.carbs}g</div>
              <div className="text-xs text-gray-500">Carbs</div>
            </div>
            <div className="bg-orange-100 p-3 rounded">
              <div className="font-bold text-orange-700">{dailyTotals.fat}g</div>
              <div className="text-xs text-gray-500">Fat</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
