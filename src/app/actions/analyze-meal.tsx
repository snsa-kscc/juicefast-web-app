"use server";

// Interface for meal macros data
export interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  name: string;
  description?: string;
}

// Function to analyze an image and extract macros using API
export async function analyzeMealImage(formData: FormData): Promise<MacroData> {
  // Get the auth token from the form data
  const authToken = formData.get("auth") as string;
  try {
    const file = formData.get("image") as File;

    if (!file) {
      throw new Error("No image file provided");
    }

    // Create a new FormData object for the API call
    const apiFormData = new FormData();
    apiFormData.append("image", file);

    // Call our API endpoint with an absolute URL
    // When running in a server action, we need to use an absolute URL
    // Get the base URL from headers or environment
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const host = process.env.VERCEL_URL || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Include the auth token in the request URL
    const url = new URL(`${baseUrl}/api/analyze-meal`);
    if (authToken) {
      url.searchParams.append("auth", authToken);
    }

    const response = await fetch(url, {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    // Parse the API response
    const macroData: MacroData = await response.json();

    // Just return the macro data, UI handling is done on the client
    return macroData;
  } catch (error) {
    console.error("Failed to analyze meal image:", error);
    throw new Error("Failed to analyze meal image. Please try again.");
  }
}
