"use server";

import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { eq, and, desc, between } from "drizzle-orm";
import { userProfile, dailyHealthMetrics, mealEntry, waterIntake, stepEntry, sleepEntry, mindfulnessEntry } from "@/db/schema";
import { DailyHealthMetrics, MealEntry, WaterIntake, StepEntry, SleepEntry, MindfulnessEntry, UserProfile, calculateHealthScore } from "@/types/health-metrics";
import { revalidatePath } from "next/cache";
import { generateReferralCode } from "@/lib/referral-utils";

// ======== USER PROFILE OPERATIONS ========

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  try {
    // Check if profile already exists for this user
    const existingProfiles = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, profile.id || ""));

    const now = new Date();

    if (existingProfiles.length > 0) {
      // Update existing profile
      const existingProfile = existingProfiles[0];

      await db
        .update(userProfile)
        .set({
          height: profile.height,
          weight: profile.weight || null,
          age: profile.age || null,
          gender: profile.gender || null,
          activityLevel: profile.activityLevel || null,
          referralCode: profile.referralCode || null,
          referredBy: profile.referredBy || null,
          referralCount: profile.referralCount || 0,
          referrals: profile.referrals || [],
          updatedAt: now,
        })
        .where(eq(userProfile.id, existingProfile.id));

      return {
        ...profile,
        id: existingProfile.id,
      };
    } else {
      // Create new profile
      const id = uuidv4();

      await db.insert(userProfile).values({
        id,
        userId: profile.id || "",
        height: profile.height,
        weight: profile.weight || null,
        age: profile.age || null,
        gender: profile.gender || null,
        activityLevel: profile.activityLevel || null,
        referralCode: profile.referralCode || null,
        referredBy: profile.referredBy || null,
        referralCount: profile.referralCount || 0,
        referrals: profile.referrals || [],
        createdAt: now,
        updatedAt: now,
      });

      return {
        ...profile,
        id,
      };
    }
  } catch (error) {
    console.error("Failed to save user profile:", error);
    throw new Error("Failed to save user profile");
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const profiles = await db.select().from(userProfile).where(eq(userProfile.userId, userId));

    if (profiles.length === 0) {
      return null;
    }

    const profile = profiles[0];

    return {
      id: profile.userId,
      height: profile.height || 0,
      weight: profile.weight || undefined,
      age: profile.age || undefined,
      gender: profile.gender || undefined,
      activityLevel: (profile.activityLevel as any) || undefined,
      referralCode: profile.referralCode || undefined,
      referredBy: profile.referredBy || undefined,
      referralCount: profile.referralCount || 0,
      referrals: profile.referrals || [],
    };
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return null;
  }
}

// ======== DAILY METRICS OPERATIONS ========

// Helper function to format date as YYYY-MM-DD
function formatDateForDb(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Helper function to get or create daily metrics
async function getOrCreateDailyMetrics(userId: string, date: Date): Promise<string> {
  const dateStr = formatDateForDb(date);

  // Check if metrics exist for this day
  const existingMetrics = await db
    .select()
    .from(dailyHealthMetrics)
    .where(and(eq(dailyHealthMetrics.userId, userId), eq(dailyHealthMetrics.date, dateStr)));

  if (existingMetrics.length > 0) {
    return existingMetrics[0].id;
  }

  // Create new metrics for this day
  const id = uuidv4();
  const now = new Date();

  await db.insert(dailyHealthMetrics).values({
    id,
    userId,
    date: dateStr,
    totalScore: 0,
    createdAt: now,
    updatedAt: now,
  });

  return id;
}

// Function to save daily metrics and update score
async function updateDailyMetricsScore(userId: string, date: Date): Promise<void> {
  try {
    const dateStr = formatDateForDb(date);
    const metrics = await getDailyMetrics(userId, date);

    if (!metrics) return;

    const score = calculateHealthScore(metrics);

    // Find the metrics record
    const metricsRecords = await db
      .select()
      .from(dailyHealthMetrics)
      .where(and(eq(dailyHealthMetrics.userId, userId), eq(dailyHealthMetrics.date, dateStr)));

    if (metricsRecords.length > 0) {
      await db
        .update(dailyHealthMetrics)
        .set({
          totalScore: score.total,
          updatedAt: new Date(),
        })
        .where(eq(dailyHealthMetrics.id, metricsRecords[0].id));
    }
  } catch (error) {
    console.error("Failed to update daily metrics score:", error);
  }
}

// Get daily metrics for a specific day
export async function getDailyMetrics(userId: string, date: Date): Promise<DailyHealthMetrics | null> {
  try {
    const dateStr = formatDateForDb(date);

    // Get metrics record
    const metricsRecords = await db
      .select()
      .from(dailyHealthMetrics)
      .where(and(eq(dailyHealthMetrics.userId, userId), eq(dailyHealthMetrics.date, dateStr)));

    if (metricsRecords.length === 0) {
      // Return empty metrics
      return {
        date,
        meals: [],
        waterIntake: [],
        steps: [],
        sleep: undefined,
        mindfulness: [],
        totalScore: 0,
      };
    }

    const metricsId = metricsRecords[0].id;

    // Get all data for this day
    const meals = await db.select().from(mealEntry).where(eq(mealEntry.metricsId, metricsId));

    const waterEntries = await db.select().from(waterIntake).where(eq(waterIntake.metricsId, metricsId));

    const stepEntries = await db.select().from(stepEntry).where(eq(stepEntry.metricsId, metricsId));

    const sleepEntries = await db.select().from(sleepEntry).where(eq(sleepEntry.metricsId, metricsId));

    const mindfulnessEntries = await db.select().from(mindfulnessEntry).where(eq(mindfulnessEntry.metricsId, metricsId));

    // Map database records to application types
    const mappedMeals: MealEntry[] = meals.map((meal) => ({
      mealType: meal.mealType as any,
      timestamp: new Date(meal.timestamp),
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      name: meal.name,
      description: meal.description || undefined,
    }));

    const mappedWaterIntake: WaterIntake[] = waterEntries.map((entry) => ({
      amount: entry.amount,
      timestamp: new Date(entry.timestamp),
    }));

    const mappedSteps: StepEntry[] = stepEntries.map((entry) => ({
      count: entry.count,
      timestamp: new Date(entry.timestamp),
    }));

    let mappedSleep: SleepEntry | undefined = undefined;
    if (sleepEntries.length > 0) {
      const sleep = sleepEntries[0]; // Take the most recent one if multiple exist
      mappedSleep = {
        hoursSlept: sleep.hoursSlept,
        quality: sleep.quality,
        startTime: new Date(sleep.startTime),
        endTime: new Date(sleep.endTime),
      };
    }

    const mappedMindfulness: MindfulnessEntry[] = mindfulnessEntries.map((entry) => ({
      minutes: entry.minutes,
      activity: entry.activity,
      timestamp: new Date(entry.timestamp),
    }));

    return {
      date,
      meals: mappedMeals,
      waterIntake: mappedWaterIntake,
      steps: mappedSteps,
      sleep: mappedSleep,
      mindfulness: mappedMindfulness,
      totalScore: metricsRecords[0].totalScore || 0,
    };
  } catch (error) {
    console.error("Failed to get daily metrics:", error);
    return null;
  }
}

// Get available date keys (days with data)
export async function getAvailableDateKeys(userId: string): Promise<string[]> {
  try {
    const metrics = await db.select().from(dailyHealthMetrics).where(eq(dailyHealthMetrics.userId, userId)).orderBy(desc(dailyHealthMetrics.date));

    return metrics.map((m) => m.date);
  } catch (error) {
    console.error("Failed to get available date keys:", error);
    return [];
  }
}

// Get weekly metrics for trends
export async function getWeeklyMetrics(userId: string): Promise<DailyHealthMetrics[]> {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const startDate = formatDateForDb(sevenDaysAgo);
    const endDate = formatDateForDb(today);

    // Get metrics for the last 7 days
    const metricsRecords = await db
      .select()
      .from(dailyHealthMetrics)
      .where(and(eq(dailyHealthMetrics.userId, userId), between(dailyHealthMetrics.date, startDate, endDate)))
      .orderBy(desc(dailyHealthMetrics.date));

    const metrics: DailyHealthMetrics[] = [];

    // Fill in any missing days with empty metrics
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDateForDb(date);

      const existingMetrics = metricsRecords.find((m) => m.date === dateStr);

      if (existingMetrics) {
        const dailyMetrics = await getDailyMetrics(userId, date);
        if (dailyMetrics) {
          metrics.push(dailyMetrics);
        } else {
          metrics.push({
            date,
            meals: [],
            waterIntake: [],
            steps: [],
            sleep: undefined,
            mindfulness: [],
            totalScore: 0,
          });
        }
      } else {
        metrics.push({
          date,
          meals: [],
          waterIntake: [],
          steps: [],
          sleep: undefined,
          mindfulness: [],
          totalScore: 0,
        });
      }
    }

    return metrics;
  } catch (error) {
    console.error("Failed to get weekly metrics:", error);
    return [];
  }
}

// Calculate average score for the last 7 days
export async function getWeeklyAverageScore(userId: string): Promise<number> {
  try {
    const weeklyMetrics = await getWeeklyMetrics(userId);

    if (weeklyMetrics.length === 0) return 0;

    const totalScore = weeklyMetrics.reduce((sum, day) => {
      return sum + (day.totalScore || 0);
    }, 0);

    return totalScore / weeklyMetrics.length;
  } catch (error) {
    console.error("Failed to get weekly average score:", error);
    return 0;
  }
}

// ======== MEAL TRACKING OPERATIONS ========

export async function addMeal(userId: string, date: Date, meal: MealEntry): Promise<boolean> {
  try {
    const metricsId = await getOrCreateDailyMetrics(userId, date);
    const id = uuidv4();

    await db.insert(mealEntry).values({
      id,
      metricsId,
      userId,
      name: meal.name,
      description: meal.description || null,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      mealType: meal.mealType,
      timestamp: meal.timestamp,
      createdAt: new Date(),
    });

    // Update the score
    await updateDailyMetricsScore(userId, date);

    revalidatePath("/tracker");
    return true;
  } catch (error) {
    console.error("Failed to add meal:", error);
    return false;
  }
}

// ======== WATER TRACKING OPERATIONS ========

export async function addWaterIntake(userId: string, date: Date, water: WaterIntake): Promise<boolean> {
  try {
    const metricsId = await getOrCreateDailyMetrics(userId, date);
    const id = uuidv4();

    await db.insert(waterIntake).values({
      id,
      metricsId,
      userId,
      amount: water.amount,
      timestamp: water.timestamp,
      createdAt: new Date(),
    });

    // Update the score
    await updateDailyMetricsScore(userId, date);

    revalidatePath("/tracker");
    return true;
  } catch (error) {
    console.error("Failed to add water intake:", error);
    return false;
  }
}

// ======== STEP TRACKING OPERATIONS ========

export async function addSteps(userId: string, date: Date, steps: StepEntry): Promise<boolean> {
  try {
    const metricsId = await getOrCreateDailyMetrics(userId, date);
    const id = uuidv4();

    await db.insert(stepEntry).values({
      id,
      metricsId,
      userId,
      count: steps.count,
      timestamp: steps.timestamp,
      createdAt: new Date(),
    });

    // Update the score
    await updateDailyMetricsScore(userId, date);

    revalidatePath("/tracker");
    return true;
  } catch (error) {
    console.error("Failed to add steps:", error);
    return false;
  }
}

// ======== SLEEP TRACKING OPERATIONS ========

export async function addSleep(userId: string, date: Date, sleep: SleepEntry): Promise<boolean> {
  try {
    const metricsId = await getOrCreateDailyMetrics(userId, date);
    const id = uuidv4();

    // Check if sleep entry already exists for this day
    const existingSleep = await db.select().from(sleepEntry).where(eq(sleepEntry.metricsId, metricsId));

    if (existingSleep.length > 0) {
      // Update existing sleep entry
      await db
        .update(sleepEntry)
        .set({
          hoursSlept: sleep.hoursSlept,
          quality: sleep.quality,
          startTime: sleep.startTime,
          endTime: sleep.endTime,
        })
        .where(eq(sleepEntry.id, existingSleep[0].id));
    } else {
      // Create new sleep entry
      await db.insert(sleepEntry).values({
        id,
        metricsId,
        userId,
        hoursSlept: sleep.hoursSlept,
        quality: sleep.quality,
        startTime: sleep.startTime,
        endTime: sleep.endTime,
        createdAt: new Date(),
      });
    }

    // Update the score
    await updateDailyMetricsScore(userId, date);

    revalidatePath("/tracker");
    return true;
  } catch (error) {
    console.error("Failed to add sleep:", error);
    return false;
  }
}

// ======== MINDFULNESS TRACKING OPERATIONS ========

export async function addMindfulness(userId: string, date: Date, mindfulness: MindfulnessEntry): Promise<boolean> {
  try {
    const metricsId = await getOrCreateDailyMetrics(userId, date);
    const id = uuidv4();

    await db.insert(mindfulnessEntry).values({
      id,
      metricsId,
      userId,
      minutes: mindfulness.minutes,
      activity: mindfulness.activity,
      timestamp: mindfulness.timestamp,
      createdAt: new Date(),
    });

    // Update the score
    await updateDailyMetricsScore(userId, date);

    revalidatePath("/tracker");
    return true;
  } catch (error) {
    console.error("Failed to add mindfulness:", error);
    return false;
  }
}

// ======== REFERRAL SYSTEM OPERATIONS ========

// Generate a referral code for a user and save it to their profile
export async function generateAndSaveReferralCode(userId: string, name?: string): Promise<string | null> {
  try {
    // Get the user profile
    const userProf = await getUserProfile(userId);

    if (!userProf) {
      console.error("User profile not found");
      return null;
    }

    // Check if user already has a referral code
    if (userProf.referralCode) {
      return userProf.referralCode;
    }

    // Generate a new referral code
    const referralCode = generateReferralCode(name);

    // Update the user profile
    const updatedProfile = {
      ...userProf,
      referralCode,
      referralCount: 0,
      referrals: [],
    };

    // Save the updated profile
    await saveUserProfile(updatedProfile);

    return referralCode;
  } catch (error) {
    console.error("Failed to generate and save referral code:", error);
    return null;
  }
}

// Apply a referral code when a user signs up
export async function applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
  try {
    // Find the referrer's profile by referral code
    const referrerProfiles = await db.select().from(userProfile).where(eq(userProfile.referralCode, referralCode));

    if (referrerProfiles.length === 0) {
      console.error("Referrer not found with code:", referralCode);
      return false;
    }

    const referrerProfile = referrerProfiles[0];

    // Update the new user's profile with the referral info
    const newUserProf = await getUserProfile(userId);

    if (!newUserProf) {
      console.error("New user profile not found");
      return false;
    }

    const updatedNewUserProfile = {
      ...newUserProf,
      referredBy: referralCode,
    };

    await saveUserProfile(updatedNewUserProfile);

    // Update the referrer's profile with the new referral
    const currentReferrals = referrerProfile.referrals || [];
    const updatedReferrals = [...currentReferrals, userId];

    await db
      .update(userProfile)
      .set({
        referralCount: (referrerProfile.referralCount || 0) + 1,
        referrals: updatedReferrals,
        updatedAt: new Date(),
      })
      .where(eq(userProfile.id, referrerProfile.id));

    return true;
  } catch (error) {
    console.error("Failed to apply referral code:", error);
    return false;
  }
}

// Get referral statistics for a user
export async function getReferralStats(userId: string): Promise<{ count: number; referrals: string[] } | null> {
  try {
    const userProf = await getUserProfile(userId);

    if (!userProf) {
      return null;
    }

    return {
      count: userProf.referralCount || 0,
      referrals: userProf.referrals || [],
    };
  } catch (error) {
    console.error("Failed to get referral stats:", error);
    return null;
  }
}

// ======== DATA MIGRATION OPERATIONS ========

// Helper function to migrate data from localStorage to database
export async function migrateHealthData(userId: string, metrics: DailyHealthMetrics[]): Promise<boolean> {
  try {
    for (const metric of metrics) {
      const date = new Date(metric.date);
      const metricsId = await getOrCreateDailyMetrics(userId, date);

      // Add meals
      for (const meal of metric.meals) {
        await db.insert(mealEntry).values({
          id: uuidv4(),
          metricsId,
          userId,
          name: meal.name,
          description: meal.description || null,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          mealType: meal.mealType,
          timestamp: meal.timestamp,
          createdAt: new Date(),
        });
      }

      // Add water intake
      for (const water of metric.waterIntake) {
        await db.insert(waterIntake).values({
          id: uuidv4(),
          metricsId,
          userId,
          amount: water.amount,
          timestamp: water.timestamp,
          createdAt: new Date(),
        });
      }

      // Add steps
      for (const step of metric.steps) {
        await db.insert(stepEntry).values({
          id: uuidv4(),
          metricsId,
          userId,
          count: step.count,
          timestamp: step.timestamp,
          createdAt: new Date(),
        });
      }

      // Add sleep
      if (metric.sleep) {
        await db.insert(sleepEntry).values({
          id: uuidv4(),
          metricsId,
          userId,
          hoursSlept: metric.sleep.hoursSlept,
          quality: metric.sleep.quality,
          startTime: metric.sleep.startTime,
          endTime: metric.sleep.endTime,
          createdAt: new Date(),
        });
      }

      // Add mindfulness
      if (metric.mindfulness) {
        for (const mind of metric.mindfulness) {
          await db.insert(mindfulnessEntry).values({
            id: uuidv4(),
            metricsId,
            userId,
            minutes: mind.minutes,
            activity: mind.activity,
            timestamp: mind.timestamp,
            createdAt: new Date(),
          });
        }
      }

      // Update score
      await updateDailyMetricsScore(userId, date);
    }

    revalidatePath("/tracker");
    return true;
  } catch (error) {
    console.error("Failed to migrate health data:", error);
    return false;
  }
}
