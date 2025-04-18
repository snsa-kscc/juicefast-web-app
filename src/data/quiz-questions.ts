export type QuizQuestionType = {
  id: string;
  type: "single" | "multiple" | "text" | "input";
  title: string;
  description?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  nextButtonText?: string;
};

export const quizQuestions: QuizQuestionType[] = [
  {
    id: "gender",
    type: "single",
    title: "What is your gender?",
    description: "This helps us personalize your wellness plan.",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "prefer_not_to_say", label: "Prefer not to say" },
    ],
  },
  {
    id: "age_range",
    type: "single",
    title: "What is your age range?",
    description: "Different age groups have different nutritional needs.",
    options: [
      { value: "18_24", label: "18-24 years" },
      { value: "25_34", label: "25-34 years" },
      { value: "35_44", label: "35-44 years" },
      { value: "45_54", label: "45-54 years" },
      { value: "55_plus", label: "55+ years" },
    ],
  },
  {
    id: "water_intake",
    type: "single",
    title: "How many cups of water do you typically drink daily?",
    description: "Proper hydration is essential for overall health.",
    options: [
      { value: "0_2", label: "0-2 cups" },
      { value: "3_5", label: "3-5 cups" },
      { value: "6_8", label: "6-8 cups" },
      { value: "9_plus", label: "9+ cups" },
    ],
  },
  {
    id: "activity_level",
    type: "single",
    title: "How would you describe your physical activity level?",
    options: [
      { value: "sedentary", label: "Sedentary (little to no exercise)" },
      { value: "light", label: "Lightly active (light exercise 1-3 days/week)" },
      { value: "moderate", label: "Moderately active (moderate exercise 3-5 days/week)" },
      { value: "very", label: "Very active (hard exercise 6-7 days/week)" },
      { value: "extra", label: "Extra active (very hard exercise & physical job)" },
    ],
  },
  {
    id: "sleep_quality",
    type: "single",
    title: "How would you rate your sleep quality?",
    description: "Good sleep is crucial for health and recovery.",
    options: [
      { value: "poor", label: "Poor (less than 5 hours or very disrupted)" },
      { value: "fair", label: "Fair (5-6 hours with some disruptions)" },
      { value: "good", label: "Good (7-8 hours with few disruptions)" },
      { value: "excellent", label: "Excellent (8+ hours of quality sleep)" },
    ],
  },
  {
    id: "stress_level",
    type: "single",
    title: "How would you describe your current stress level?",
    options: [
      { value: "low", label: "Low (rarely feel stressed)" },
      { value: "moderate", label: "Moderate (occasionally stressed)" },
      { value: "high", label: "High (frequently stressed)" },
      { value: "very_high", label: "Very high (constantly stressed)" },
    ],
    nextButtonText: "Complete",
  },
];
