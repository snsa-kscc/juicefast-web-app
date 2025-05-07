// Default values and configuration for the steps tracker
export const STEPS_TRACKER_CONFIG = {
  // Default daily step goal
  dailyGoal: 10000,
  
  // Step goal categories
  stepGoalCategories: [
    { value: 5000, label: "Lightly Active" },
    { value: 7500, label: "Moderately Active" },
    { value: 10000, label: "Active" },
    { value: 12500, label: "Very Active" },
    { value: 15000, label: "Super Active" }
  ],
  
  // Activity intensity levels
  activityLevels: [
    { id: "low", label: "Low Intensity", caloriesPerStep: 0.04 },
    { id: "moderate", label: "Moderate Intensity", caloriesPerStep: 0.05 },
    { id: "high", label: "High Intensity", caloriesPerStep: 0.06 }
  ],
  
  // Step milestones with achievements
  stepMilestones: [
    { steps: 5000, achievement: "Good Start" },
    { steps: 10000, achievement: "Active Day" },
    { steps: 15000, achievement: "Step Master" },
    { steps: 20000, achievement: "Walking Champion" }
  ]
};
