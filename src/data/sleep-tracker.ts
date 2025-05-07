// Default values and configuration for the sleep tracker
export const SLEEP_TRACKER_CONFIG = {
  // Default sleep goal in hours
  dailyGoal: 8,
  
  // Sleep quality ratings
  qualityRatings: [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" }
  ],
  
  // Sleep factors that might affect sleep quality
  sleepFactors: [
    { id: "stress", label: "Stress" },
    { id: "caffeine", label: "Caffeine" },
    { id: "exercise", label: "Exercise" },
    { id: "screen", label: "Screen Time" },
    { id: "alcohol", label: "Alcohol" },
    { id: "noise", label: "Noise" },
    { id: "temperature", label: "Room Temperature" }
  ],
  
  // Default bedtime and wake time
  defaultBedtime: "22:30",
  defaultWakeTime: "06:30"
};
