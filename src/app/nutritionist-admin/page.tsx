"use client";

import React, { useState } from "react";
import { NutritionistAdmin } from "@/components/nutritionist/nutritionist-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNutritionists } from "@/lib/nutritionist-service";

export default function NutritionistAdminPage() {
  const [selectedNutritionistId, setSelectedNutritionistId] = useState("1"); // Default to first nutritionist
  const nutritionists = getNutritionists();

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Nutritionist Admin Panel</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Nutritionist</label>
        <select 
          value={selectedNutritionistId}
          onChange={(e) => setSelectedNutritionistId(e.target.value)}
          className="w-full max-w-xs p-2 border rounded-md"
        >
          {nutritionists.map(nutritionist => (
            <option key={nutritionist.id} value={nutritionist.id}>
              {nutritionist.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-200px)]">
        <NutritionistAdmin nutritionistId={selectedNutritionistId} />
      </div>
    </div>
  );
}
