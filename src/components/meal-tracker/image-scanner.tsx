"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { analyzeMealImage, MacroData } from "@/app/actions/analyze-meal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";

type InputMode = "upload" | "camera";

export function ImageScanner({ onScanComplete }: { onScanComplete?: (data: MacroData) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MacroData | null>(null);
  const [uiContent, setUiContent] = useState<React.ReactNode | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const searchParams = useSearchParams();
  const authToken = searchParams.get("auth");

  async function handleSubmit(formData: FormData) {
    // Add the auth token to the form data
    if (authToken) {
      formData.append("auth", authToken);
    }
    try {
      setIsScanning(true);
      setScanResult(null);
      setUiContent(<div className="text-sm text-gray-500">Analyzing your meal image...</div>);

      // Call the server action to analyze the meal image
      const macros = await analyzeMealImage(formData);
      setScanResult(macros);

      // Create UI component to display the results
      setUiContent(
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Analysis Complete</h3>
          <div className="text-sm">
            <p>
              <strong>Dish:</strong> {macros.name}
            </p>
            <p>
              <strong>Description:</strong> {macros.description}
            </p>
            <div className="mt-2">
              <p>
                <strong>Macros (per serving):</strong>
              </p>
              <ul className="list-disc pl-5">
                <li>Calories: {macros.calories} kcal</li>
                <li>Protein: {macros.protein}g</li>
                <li>Carbs: {macros.carbs}g</li>
                <li>Fat: {macros.fat}g</li>
              </ul>
            </div>
          </div>
        </div>
      );

      // Call the callback if provided
      if (onScanComplete) {
        onScanComplete(macros);
      }
    } catch (error) {
      console.error("Error scanning image:", error);
      setUiContent(<div className="text-red-500">Failed to analyze image. Please try again.</div>);
    } finally {
      setIsScanning(false);
    }
  }

  // Function to handle camera capture
  async function captureImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      // Create a FormData object to submit the captured image
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      
      // Add the auth token to the form data
      if (authToken) {
        formData.append("auth", authToken);
      }
      
      // Submit the form programmatically
      await handleSubmit(formData);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scan Meal Image</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Input mode toggle buttons */}
        <div className="flex gap-2 mb-4">
          <Button 
            type="button" 
            variant={inputMode === "upload" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setInputMode("upload")}
            disabled={isScanning}
          >
            Upload Image
          </Button>
          <Button 
            type="button" 
            variant={inputMode === "camera" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setInputMode("camera")}
            disabled={isScanning}
          >
            Use Camera
          </Button>
        </div>

        {inputMode === "upload" ? (
          /* File upload form */
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Upload Food Image
              </label>
              <FileInput id="image" name="image" accept="image/*" required disabled={isScanning} />
            </div>

            <SubmitButton isScanning={isScanning} />
          </form>
        ) : (
          /* Camera capture form */
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="camera-capture" className="text-sm font-medium">
                Take a Photo of Your Meal
              </label>
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  id="camera-capture"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={captureImage}
                  disabled={isScanning}
                />
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => document.getElementById("camera-capture")?.click()}
                  disabled={isScanning}
                >
                  {isScanning ? "Processing..." : "Take Photo"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  This will open your device camera to take a photo of your meal
                </p>
              </div>
            </div>
          </div>
        )}

        {uiContent && <div className="mt-4 p-4 border rounded-md">{uiContent}</div>}
      </CardContent>
    </Card>
  );
}

// Submit button with loading state
function SubmitButton({ isScanning }: { isScanning: boolean }) {
  const { pending } = useFormStatus();
  const isLoading = pending || isScanning;

  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? "Analyzing Image..." : "Analyze Image"}
    </Button>
  );
}
