"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { MacroData } from "@/app/actions/analyze-meal";
import { addMeal } from "@/app/actions/add-meal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ManualEntryForm({ onMealAdded }: { onMealAdded?: (data: MacroData) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setError(null);
      setSuccess(false);

      const result = await addMeal(formData);
      
      if (result.success && result.data) {
        setSuccess(true);
        
        // Call the callback if provided
        if (onMealAdded) {
          onMealAdded(result.data);
        }
        
        // Reset the form
        const form = document.getElementById("manual-meal-form") as HTMLFormElement;
        if (form) form.reset();
      } else {
        setError(result.error || "Failed to add meal");
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manual Meal Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="manual-meal-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Meal Name
            </label>
            <Input id="name" name="name" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium">
                Calories
              </label>
              <Input id="calories" name="calories" type="number" min="0" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="protein" className="text-sm font-medium">
                Protein (g)
              </label>
              <Input id="protein" name="protein" type="number" min="0" step="0.1" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="carbs" className="text-sm font-medium">
                Carbs (g)
              </label>
              <Input id="carbs" name="carbs" type="number" min="0" step="0.1" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fat" className="text-sm font-medium">
                Fat (g)
              </label>
              <Input id="fat" name="fat" type="number" min="0" step="0.1" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea id="description" name="description" rows={3} />
          </div>
          
          <SubmitButton />
          
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          
          {success && (
            <div className="text-sm text-green-500">Meal added successfully!</div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full"
    >
      {pending ? "Adding Meal..." : "Add Meal"}
    </Button>
  );
}
