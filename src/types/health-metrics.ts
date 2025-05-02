// Health metrics types for the tracking system

// Meal types
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Base macro data (from existing system)
export interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  name: string;
  description?: string;
}

// Extended meal data with meal type and timestamp
export interface MealEntry extends MacroData {
  mealType: MealType;
  timestamp: Date;
}

// Water intake tracking
export interface WaterIntake {
  amount: number; // in ml
  timestamp: Date;
}

// Step tracking
export interface StepEntry {
  count: number;
  timestamp: Date;
}

// Sleep tracking
export interface SleepEntry {
  hoursSlept: number;
  quality: number; // 1-10 scale
  startTime: Date;
  endTime: Date;
}

// Mindfulness tracking
export interface MindfulnessEntry {
  minutes: number;
  activity: string; // meditation, breathing, etc.
  timestamp: Date;
}

// User profile with height and other static measurements
export interface UserProfile {
  height: number; // in cm
  weight?: number; // in kg (optional)
  age?: number; // optional
  gender?: string; // optional
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

// Health score calculation weights
export const SCORE_WEIGHTS = {
  nutrition: 0.25,
  water: 0.15,
  steps: 0.2,
  sleep: 0.25,
  mindfulness: 0.15
};

// Daily health metrics
export interface DailyHealthMetrics {
  date: Date;
  meals: MealEntry[];
  waterIntake: WaterIntake[];
  steps: StepEntry[];
  sleep?: SleepEntry; // Optional as may not be recorded every day
  mindfulness?: MindfulnessEntry[]; // Optional
  totalScore?: number; // Calculated health score
}

// Health score breakdown
export interface HealthScore {
  total: number; // 0-100
  nutrition: number; // 0-100
  water: number; // 0-100
  steps: number; // 0-100
  sleep: number; // 0-100
  mindfulness: number; // 0-100
}

// Target values for health metrics
export const DAILY_TARGETS = {
  calories: 2000, // Adjustable based on user profile
  water: 2500, // ml
  steps: 10000,
  sleep: 8, // hours
  mindfulness: 20 // minutes
};

// Calculate health score based on daily metrics
export function calculateHealthScore(metrics: DailyHealthMetrics): HealthScore {
  // Initialize scores
  let nutritionScore = 0;
  let waterScore = 0;
  let stepsScore = 0;
  let sleepScore = 0;
  let mindfulnessScore = 0;

  // Calculate nutrition score
  if (metrics.meals.length > 0) {
    const totalCalories = metrics.meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = metrics.meals.reduce((sum, meal) => sum + meal.protein, 0);
    
    // Score based on calorie intake (80% if within 20% of target)
    const calorieScore = Math.min(100, 100 - Math.abs(totalCalories - DAILY_TARGETS.calories) / DAILY_TARGETS.calories * 100);
    
    // Score based on protein intake (ideal is 0.8g per kg of body weight, roughly 60g for average person)
    const proteinScore = Math.min(100, (totalProtein / 60) * 100);
    
    // Combine scores (weighted)
    nutritionScore = calorieScore * 0.6 + proteinScore * 0.4;
  }

  // Calculate water score
  const totalWater = metrics.waterIntake.reduce((sum, entry) => sum + entry.amount, 0);
  waterScore = Math.min(100, (totalWater / DAILY_TARGETS.water) * 100);

  // Calculate steps score
  const totalSteps = metrics.steps.reduce((sum, entry) => sum + entry.count, 0);
  stepsScore = Math.min(100, (totalSteps / DAILY_TARGETS.steps) * 100);

  // Calculate sleep score
  if (metrics.sleep) {
    const hoursSlept = metrics.sleep.hoursSlept;
    const sleepQuality = metrics.sleep.quality;
    
    // Score based on hours (100% if within 1 hour of target)
    const durationScore = Math.max(0, 100 - Math.abs(hoursSlept - DAILY_TARGETS.sleep) * 20);
    
    // Combine with quality score
    sleepScore = durationScore * 0.7 + sleepQuality * 10 * 0.3;
  }

  // Calculate mindfulness score
  if (metrics.mindfulness && metrics.mindfulness.length > 0) {
    const totalMinutes = metrics.mindfulness.reduce((sum, entry) => sum + entry.minutes, 0);
    mindfulnessScore = Math.min(100, (totalMinutes / DAILY_TARGETS.mindfulness) * 100);
  }

  // Calculate total score using weights
  const total = 
    nutritionScore * SCORE_WEIGHTS.nutrition +
    waterScore * SCORE_WEIGHTS.water +
    stepsScore * SCORE_WEIGHTS.steps +
    sleepScore * SCORE_WEIGHTS.sleep +
    mindfulnessScore * SCORE_WEIGHTS.mindfulness;

  return {
    total,
    nutrition: nutritionScore,
    water: waterScore,
    steps: stepsScore,
    sleep: sleepScore,
    mindfulness: mindfulnessScore
  };
}
