"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/client";
import { seedNutritionistData } from "@/app/actions/seed";
import { Button } from "@/components/ui/button";

// Initial nutritionist data for seeding with auth info
const INITIAL_NUTRITIONISTS = [
  {
    email: "sarah.johnson@example.com",
    password: "Nutrition123!",
    name: "Sarah Johnson",
    bio: "Registered dietitian with 8 years of experience specializing in weight management and sports nutrition.",
    specialties: ["Weight Management", "Sports Nutrition", "Meal Planning"],
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    availability: {
      available: true,
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
  {
    email: "michael.chen@example.com",
    password: "Nutrition456!",
    name: "Michael Chen",
    bio: "Clinical nutritionist specializing in diabetes management and heart-healthy diets.",
    specialties: ["Diabetes Management", "Heart Health", "Clinical Nutrition"],
    photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    availability: {
      available: true,
      workingHours: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "18:00" },
      },
    },
    averageResponseTime: 8,
  },
  {
    email: "amina.patel@example.com",
    password: "Nutrition789!",
    name: "Amina Patel",
    bio: "Plant-based nutrition expert with focus on holistic wellness and sustainable eating practices.",
    specialties: ["Plant-Based Nutrition", "Holistic Wellness", "Sustainable Eating"],
    photoUrl: "https://randomuser.me/api/portraits/women/67.jpg",
    availability: {
      available: true,
      workingHours: {
        monday: { start: "08:00", end: "16:00" },
        tuesday: { start: "08:00", end: "16:00" },
        wednesday: { start: "08:00", end: "16:00" },
        thursday: { start: "08:00", end: "16:00" },
        friday: { start: "08:00", end: "16:00" },
      },
    },
    averageResponseTime: 3,
  },
];

const authClient = createAuthClient();

export default function SeedNutritionistsPage() {
  const [status, setStatus] = useState<"idle" | "creating-users" | "seeding-data" | "completed" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [createdUsers, setCreatedUsers] = useState<{ id: string; email: string }[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const handleSeed = async () => {
    try {
      setStatus("creating-users");
      setError(null);
      addLog("Starting user creation process...");

      // Create users with BetterAuth client
      const users = [];
      for (const nutritionist of INITIAL_NUTRITIONISTS) {
        try {
          addLog(`Creating user for ${nutritionist.email}...`);
          const { data, error } = await authClient.signUp.email({
            email: nutritionist.email,
            password: nutritionist.password,
            name: nutritionist.name,
          });

          if (error) {
            throw new Error(`Error creating user for ${nutritionist.email}: ${error.message}`);
          }

          if (!data || !data.user || !data.user.id) {
            throw new Error(`Failed to create user for ${nutritionist.email}`);
          }

          users.push({
            id: data.user.id,
            email: nutritionist.email,
          });

          addLog(`Successfully created user for ${nutritionist.email} with ID: ${data.user.id}`);
        } catch (err: any) {
          // If user already exists, try to sign in to get the user ID
          if (err.message?.includes("already exists")) {
            addLog(`User ${nutritionist.email} already exists, trying to sign in...`);
            try {
              const { data, error } = await authClient.signIn.email({
                email: nutritionist.email,
                password: nutritionist.password,
              });

              if (error) {
                throw new Error(`Error signing in as ${nutritionist.email}: ${error.message}`);
              }

              if (!data || !data.user || !data.user.id) {
                throw new Error(`Failed to sign in as ${nutritionist.email}`);
              }

              users.push({
                id: data.user.id,
                email: nutritionist.email,
              });

              addLog(`Successfully signed in as ${nutritionist.email} with ID: ${data.user.id}`);
            } catch (signInErr: any) {
              addLog(`Error signing in as ${nutritionist.email}: ${signInErr.message}`);
              throw signInErr;
            }
          } else {
            addLog(`Error creating user for ${nutritionist.email}: ${err.message}`);
            throw err;
          }
        }
      }

      setCreatedUsers(users);

      // Now seed nutritionist profiles with the user IDs
      setStatus("seeding-data");
      addLog("All users created. Now seeding nutritionist profiles...");

      const result = await seedNutritionistData(users);

      addLog("Nutritionist data seeding complete!");
      setStatus("completed");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      setStatus("error");
      addLog(`Error: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Seed Nutritionist Data</h1>

      <div className="mb-6">
        <Button
          onClick={handleSeed}
          disabled={status === "creating-users" || status === "seeding-data"}
          className={`px-4 py-2 rounded ${
            status === "creating-users" || status === "seeding-data" ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {status === "idle"
            ? "Start Seeding"
            : status === "creating-users"
            ? "Creating Users..."
            : status === "seeding-data"
            ? "Seeding Data..."
            : status === "completed"
            ? "Seed Again"
            : "Try Again"}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {status === "completed" && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Success!</p>
          <p>All nutritionist data has been seeded successfully.</p>
        </div>
      )}

      <div className="border rounded p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Process Logs</h2>
        <div className="bg-black text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Click "Start Seeding" to begin.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
