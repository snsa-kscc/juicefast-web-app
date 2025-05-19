"use server";

import { createNutritionistProfile } from "./db-actions";
import { NutritionistProfile } from "@/types/nutritionist";

type UserData = {
  id: string;
  email: string;
};

// Nutritionist data mapped by email
const NUTRITIONIST_DATA_MAP: Record<string, Omit<NutritionistProfile, "id" | "userId" | "email">> = {
  "sarah.johnson@example.com": {
    name: "Sarah Johnson",
    bio: "Registered dietitian with 8 years of experience specializing in weight management and sports nutrition.",
    specialties: ["Weight Management", "Sports Nutrition", "Meal Planning"],
    photoUrl: "/images/nutritionists/sarah.jpg",
    availability: {
      available: true,
      nextAvailableSlot: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
      workingHours: {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
      },
    },
    averageResponseTime: 5,
  },
  "michael.chen@example.com": {
    name: "Michael Chen",
    bio: "Clinical nutritionist specializing in diabetes management and heart-healthy diets.",
    specialties: ["Diabetes Management", "Heart Health", "Clinical Nutrition"],
    photoUrl: "/images/nutritionists/michael.jpg",
    availability: {
      available: true,
      nextAvailableSlot: new Date(Date.now() + 1000 * 60 * 120), // 2 hours from now
      workingHours: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "16:00" },
      },
    },
    averageResponseTime: 8,
  },
  "amina.patel@example.com": {
    name: "Amina Patel",
    bio: "Plant-based nutrition expert with focus on holistic wellness and sustainable eating practices.",
    specialties: ["Plant-Based Nutrition", "Holistic Wellness", "Sustainable Eating"],
    photoUrl: "/images/nutritionists/amina.jpg",
    availability: {
      available: true,
      nextAvailableSlot: new Date(Date.now() + 1000 * 60 * 180), // 3 hours from now
      workingHours: {
        monday: { start: "08:00", end: "16:00" },
        tuesday: { start: "08:00", end: "16:00" },
        wednesday: { start: "08:00", end: "16:00" },
        thursday: { start: "08:00", end: "16:00" },
        friday: { start: "08:00", end: "14:00" },
      },
    },
    averageResponseTime: 3,
  },
};

/**
 * Seeds the database with initial nutritionist data
 * @param users Array of user data with IDs and emails
 */
export async function seedNutritionistData(users: UserData[]) {
  try {
    console.log("Seeding initial nutritionist data...");

    // Create nutritionist profiles for each user
    for (const user of users) {
      try {
        // Get the nutritionist data for this email
        const nutritionistData = NUTRITIONIST_DATA_MAP[user.email];

        if (!nutritionistData) {
          console.error(`No nutritionist data found for email: ${user.email}`);
          continue;
        }

        // Create the nutritionist profile with the user ID
        const profile: Omit<NutritionistProfile, "id"> = {
          userId: user.id,
          email: user.email,
          name: nutritionistData.name,
          bio: nutritionistData.bio,
          specialties: nutritionistData.specialties,
          photoUrl: nutritionistData.photoUrl,
          availability: nutritionistData.availability,
          averageResponseTime: nutritionistData.averageResponseTime,
        };

        await createNutritionistProfile(profile);
        console.log(`Created nutritionist profile for ${nutritionistData.name} with user ID ${user.id}`);
      } catch (error) {
        console.error(`Error creating nutritionist profile for ${user.email}:`, error);
      }
    }

    console.log("Nutritionist data seeding complete.");
    return { success: true };
  } catch (error) {
    console.error("Error seeding nutritionist data:", error);
    return { success: false, error };
  }
}
