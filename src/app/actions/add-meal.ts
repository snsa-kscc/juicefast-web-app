"use server";

import { z } from "zod";
import { MacroData } from "./analyze-meal";

// Schema for validating manual meal input
const mealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  calories: z.coerce.number().min(0, "Calories must be a positive number"),
  protein: z.coerce.number().min(0, "Protein must be a positive number"),
  carbs: z.coerce.number().min(0, "Carbs must be a positive number"),
  fat: z.coerce.number().min(0, "Fat must be a positive number"),
  description: z.string().optional(),
});

export type MealFormData = z.infer<typeof mealSchema>;

// Function to save meal data (would connect to a database in a real app)
export async function addMeal(formData: FormData): Promise<{ success: boolean; data?: MacroData; error?: string }> {
  try {
    // Extract values from form data
    const rawData = {
      name: formData.get("name") as string,
      calories: formData.get("calories") as string,
      protein: formData.get("protein") as string,
      carbs: formData.get("carbs") as string,
      fat: formData.get("fat") as string,
      description: formData.get("description") as string,
    };

    // Validate input data
    const validationResult = mealSchema.safeParse({
      name: rawData.name,
      calories: rawData.calories,
      protein: rawData.protein,
      carbs: rawData.carbs,
      fat: rawData.fat,
      description: rawData.description,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Convert to the correct data types
    const mealData: MacroData = {
      name: validationResult.data.name,
      calories: validationResult.data.calories,
      protein: validationResult.data.protein,
      carbs: validationResult.data.carbs,
      fat: validationResult.data.fat,
      description: validationResult.data.description || "",
    };

    // Here we would typically save to a database
    // For now, we just return the data
    return {
      success: true,
      data: mealData,
    };
  } catch (error) {
    console.error("Failed to add meal:", error);
    return {
      success: false,
      error: "Failed to add meal. Please try again.",
    };
  }
}
