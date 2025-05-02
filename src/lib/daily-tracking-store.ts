// Daily tracking store for health metrics
import { 
  DailyHealthMetrics,
  MealEntry,
  WaterIntake,
  StepEntry,
  SleepEntry,
  MindfulnessEntry,
  calculateHealthScore
} from "@/types/health-metrics";

// Local storage keys
const STORAGE_KEY_PREFIX = "health-tracker";
const DAILY_METRICS_KEY = `${STORAGE_KEY_PREFIX}-daily-metrics`;
const USER_PROFILE_KEY = `${STORAGE_KEY_PREFIX}-user-profile`;

// Format date as YYYY-MM-DD for storage keys
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get today's date key
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

// Parse date from storage key
export function parseDateFromKey(key: string): Date {
  return new Date(key);
}

// Get empty metrics for a day
export function getEmptyDailyMetrics(date: Date): DailyHealthMetrics {
  return {
    date,
    meals: [],
    waterIntake: [],
    steps: [],
    sleep: undefined,
    mindfulness: [],
    totalScore: 0
  };
}

// Save daily metrics to local storage
export function saveDailyMetrics(dateKey: string, metrics: DailyHealthMetrics): void {
  try {
    // Calculate score before saving
    const score = calculateHealthScore(metrics);
    metrics.totalScore = score.total;
    
    // Get existing stored metrics
    const storedMetricsJSON = localStorage.getItem(DAILY_METRICS_KEY);
    const storedMetrics = storedMetricsJSON ? JSON.parse(storedMetricsJSON) : {};
    
    // Update the specific day
    storedMetrics[dateKey] = metrics;
    
    // Save back to localStorage
    localStorage.setItem(DAILY_METRICS_KEY, JSON.stringify(storedMetrics));
  } catch (error) {
    console.error("Failed to save daily metrics:", error);
  }
}

// Load daily metrics from local storage
export function loadDailyMetrics(dateKey: string): DailyHealthMetrics {
  try {
    const storedMetricsJSON = localStorage.getItem(DAILY_METRICS_KEY);
    const storedMetrics = storedMetricsJSON ? JSON.parse(storedMetricsJSON) : {};
    
    // If we have data for this day, return it
    if (storedMetrics[dateKey]) {
      const metrics = storedMetrics[dateKey];
      
      // Convert string dates back to Date objects
      metrics.date = new Date(metrics.date);
      
      if (metrics.meals) {
        metrics.meals.forEach((meal: MealEntry) => {
          meal.timestamp = new Date(meal.timestamp);
        });
      }
      
      if (metrics.waterIntake) {
        metrics.waterIntake.forEach((entry: WaterIntake) => {
          entry.timestamp = new Date(entry.timestamp);
        });
      }
      
      if (metrics.steps) {
        metrics.steps.forEach((entry: StepEntry) => {
          entry.timestamp = new Date(entry.timestamp);
        });
      }
      
      if (metrics.sleep) {
        metrics.sleep.startTime = new Date(metrics.sleep.startTime);
        metrics.sleep.endTime = new Date(metrics.sleep.endTime);
      }
      
      if (metrics.mindfulness) {
        metrics.mindfulness.forEach((entry: MindfulnessEntry) => {
          entry.timestamp = new Date(entry.timestamp);
        });
      }
      
      return metrics;
    }
    
    // Otherwise return empty metrics for this day
    return getEmptyDailyMetrics(parseDateFromKey(dateKey));
  } catch (error) {
    console.error("Failed to load daily metrics:", error);
    return getEmptyDailyMetrics(parseDateFromKey(dateKey));
  }
}

// Get all available date keys (days with data)
export function getAvailableDateKeys(): string[] {
  try {
    const storedMetricsJSON = localStorage.getItem(DAILY_METRICS_KEY);
    const storedMetrics = storedMetricsJSON ? JSON.parse(storedMetricsJSON) : {};
    
    return Object.keys(storedMetrics).sort((a, b) => {
      // Sort in reverse chronological order (newest first)
      return new Date(b).getTime() - new Date(a).getTime();
    });
  } catch (error) {
    console.error("Failed to get available date keys:", error);
    return [];
  }
}

// Save user profile to local storage
export function saveUserProfile(profile: any): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save user profile:", error);
  }
}

// Load user profile from local storage
export function loadUserProfile(): any {
  try {
    const profileJSON = localStorage.getItem(USER_PROFILE_KEY);
    return profileJSON ? JSON.parse(profileJSON) : null;
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return null;
  }
}

// Get metrics for the last 7 days for trends
export function getWeeklyMetrics(): DailyHealthMetrics[] {
  const metrics: DailyHealthMetrics[] = [];
  const today = new Date();
  
  // Get data for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDateKey(date);
    
    metrics.push(loadDailyMetrics(dateKey));
  }
  
  return metrics;
}

// Calculate average score for the last 7 days
export function getWeeklyAverageScore(): number {
  const weeklyMetrics = getWeeklyMetrics();
  
  if (weeklyMetrics.length === 0) return 0;
  
  const totalScore = weeklyMetrics.reduce((sum, day) => {
    return sum + (day.totalScore || 0);
  }, 0);
  
  return totalScore / weeklyMetrics.length;
}
