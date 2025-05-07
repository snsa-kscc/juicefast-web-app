// Daily wellness tips for the wellness section
export interface WellnessTip {
  id: string;
  content: string;
  category: 'mindfulness' | 'nutrition' | 'fitness' | 'sleep' | 'general';
}

export const WELLNESS_TIPS: WellnessTip[] = [
  {
    id: "tip1",
    content: "Take a few minutes each day to practice deep breathing. Inhale slowly for 4 counts, hold for 4, and exhale for 6. This simple practice can help reduce stress and improve focus.",
    category: "mindfulness"
  },
  {
    id: "tip2",
    content: "Stay hydrated by drinking water throughout the day. A good rule of thumb is to drink half your body weight in ounces of water daily.",
    category: "nutrition"
  },
  {
    id: "tip3",
    content: "Take short movement breaks during long periods of sitting. Even 2-3 minutes of walking or stretching every hour can improve circulation and energy levels.",
    category: "fitness"
  },
  {
    id: "tip4",
    content: "Create a consistent sleep schedule by going to bed and waking up at the same time every day, even on weekends.",
    category: "sleep"
  },
  {
    id: "tip5",
    content: "Practice gratitude by writing down three things you're thankful for each day. This simple habit can significantly improve your mental wellbeing.",
    category: "mindfulness"
  },
  {
    id: "tip6",
    content: "Add more colorful vegetables to your meals. Different colors indicate different nutrients, so aim for a rainbow on your plate.",
    category: "nutrition"
  },
  {
    id: "tip7",
    content: "Set a reminder to check your posture throughout the day, especially when working at a desk. Good posture reduces strain on your body and can prevent pain.",
    category: "general"
  }
];
