// Landing page data for Juicefast nutrition app

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export const features: Feature[] = [
  {
    title: "Track Your Nutrition",
    description: "Log your meals and track your macros with ease",
    icon: "📊"
  },
  {
    title: "Meal Analysis",
    description: "Get detailed nutritional breakdown of your meals",
    icon: "🔍"
  },
  {
    title: "Find Healthy Stores",
    description: "Discover nutrition-focused stores near you",
    icon: "🏪"
  },
  {
    title: "Wellness Insights",
    description: "Monitor your health progress over time",
    icon: "❤️"
  },
  {
    title: "Nutrition Chat",
    description: "Get advice from nutrition experts",
    icon: "💬"
  }
];

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const sampleMeals: Meal[] = [
  { name: "Breakfast", calories: 450, protein: 22, carbs: 45, fat: 15 },
  { name: "Lunch", calories: 650, protein: 35, carbs: 60, fat: 20 },
  { name: "Snack", calories: 200, protein: 10, carbs: 25, fat: 5 }
];

export const benefitsList: string[] = [
  "Log meals with photo analysis",
  "Track protein, carbs, and fat intake",
  "Monitor calorie consumption",
  "Find nutrition-focused stores",
  "Get personalized wellness insights"
];
