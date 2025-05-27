// Default values and configuration for the mindfulness tracker
export const MINDFULNESS_TRACKER_CONFIG = {
  // Default session duration in minutes
  defaultDuration: 10,
  
  // Duration options in minutes
  durationOptions: [5, 10, 15, 20, 30, 45, 60],
  
  // Meditation types
  meditationTypes: [
    { id: "breathing", label: "Breathing", description: "Focus on your breath to calm the mind" },
    { id: "body-scan", label: "Body Scan", description: "Bring awareness to each part of your body" },
    { id: "loving-kindness", label: "Loving Kindness", description: "Cultivate compassion for yourself and others" },
    { id: "visualization", label: "Visualization", description: "Create mental images to promote relaxation" },
    { id: "mindful-walking", label: "Mindful Walking", description: "Practice awareness while walking" },
    { id: "guided", label: "Guided Meditation", description: "Follow along with audio instructions" }
  ],
  
  // Mood options for before/after tracking
  moodOptions: [
    { value: 1, label: "Stressed", icon: "Frown" },
    { value: 2, label: "Tense", icon: "Meh" },
    { value: 3, label: "Neutral", icon: "Smile" },
    { value: 4, label: "Calm", icon: "SmileRelaxed" },
    { value: 5, label: "Peaceful", icon: "Heart" }
  ],
  
  // Weekly goal in minutes
  weeklyGoal: 70
};
