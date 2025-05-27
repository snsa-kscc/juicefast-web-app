// Wellness programs data for the wellness section
export interface WellnessProgram {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
  color: string; // Color theme
  duration: string;
}

export const WELLNESS_PROGRAMS: WellnessProgram[] = [
  {
    id: "mindfulness",
    title: "7-Day Mindfulness",
    description: "Begin your journey",
    icon: "Brain",
    color: "blue",
    duration: "7 days"
  },
  {
    id: "healthy-habits",
    title: "Healthy Habits",
    description: "30-day challenge",
    icon: "Heart",
    color: "green",
    duration: "30 days"
  }
];
