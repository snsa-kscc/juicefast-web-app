// Wellness content data for the redesigned wellness section

export interface WellnessItem {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  category: string;
  subcategory?: string;
  duration?: string; // e.g., "9 minutes", "15 minutes"
  count?: string; // e.g., "140+ Meditations", "38 tracks"
  type: "meditation" | "workout" | "recipe" | "track" | "video" | "article";
}

// Main categories
export const WELLNESS_CATEGORIES = [
  { id: "trending", name: "Trending", icon: "TrendingUp" },
  { id: "mind", name: "Mind", icon: "Brain" },
  { id: "workouts", name: "Workouts", icon: "Dumbbell" },
  { id: "nutrition", name: "Nutrition", icon: "Apple" },
  { id: "beauty", name: "Beauty", icon: "Sparkles" },
];

// Mind subcategories interface
export interface SubcategoryItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  count?: number;
  countLabel?: string;
}

// Mind subcategories
export const MIND_SUBCATEGORIES: SubcategoryItem[] = [
  {
    id: "better-sleep",
    name: "Better Sleep",
    description: "Sleep Tracks",
    imageUrl: "/images/wellness/better-sleep.jpg",
    count: 12,
    countLabel: "tracks",
  },
  {
    id: "breathing-techniques",
    name: "Breathing Techniques",
    description: "16 guided videos",
    imageUrl: "/images/wellness/breathing.jpg",
    count: 16,
    countLabel: "guided videos",
  },
  {
    id: "guided-meditations",
    name: "Guided Meditations",
    description: "Meditations & Tracks",
    imageUrl: "/images/wellness/guided-meditation.jpg",
    count: 25,
    countLabel: "meditations",
  },
  {
    id: "guided-affirmations",
    name: "Guided Affirmations",
    description: "20 Affirmations",
    imageUrl: "/images/wellness/affirmations.jpg",
    count: 20,
    countLabel: "affirmations",
  },
  {
    id: "binaural-beats",
    name: "Binaural Beats",
    description: "38 tracks",
    imageUrl: "/images/wellness/binaural.jpg",
    count: 38,
    countLabel: "tracks",
  },
  {
    id: "relaxation-music",
    name: "Relaxation music",
    description: "41 tracks",
    imageUrl: "/images/wellness/relaxation.jpg",
    count: 41,
    countLabel: "tracks",
  },
  {
    id: "sounds-of-nature",
    name: "Sounds of Nature",
    description: "19 tracks",
    imageUrl: "/images/wellness/nature-sounds.jpg",
    count: 19,
    countLabel: "tracks",
  },
];

// Trending content
export const TRENDING_CONTENT: WellnessItem[] = [
  {
    id: "meditations-collection",
    imageUrl: "/images/wellness/meditation.jpg",
    category: "trending",
    type: "meditation",
  },
  {
    id: "recipes-collection",
    imageUrl: "/images/wellness/recipes.jpg",
    category: "trending",
    type: "recipe",
  },
  {
    id: "workouts-collection",
    imageUrl: "/images/wellness/workouts.jpg",
    category: "trending",
    type: "workout",
  },
];

// Daily content
export const DAILY_CONTENT: WellnessItem[] = [
  {
    id: "easy-flow",
    title: "Easy Flow III",
    imageUrl: "/images/wellness/easy-flow.jpg",
    category: "mind",
    subcategory: "better-sleep",
    duration: "12 minutes",
    type: "meditation",
  },
  {
    id: "apple-cider",
    title: "Apple Cider Vinegar and Honey Mask",
    imageUrl: "/images/wellness/apple-cider.jpg",
    category: "nutrition",
    duration: "15 minutes",
    type: "recipe",
  },
];

// Mind content
export const MIND_CONTENT: WellnessItem[] = [
  {
    id: "better-sleep",
    title: "Better Sleep",
    subtitle: "Sleep Tracks",
    imageUrl: "/images/wellness/better-sleep.jpg",
    category: "mind",
    subcategory: "better-sleep",
    type: "track",
  },
  {
    id: "breathing-techniques",
    title: "Breathing Techniques",
    subtitle: "16 guided videos",
    imageUrl: "/images/wellness/breathing.jpg",
    category: "mind",
    subcategory: "breathing-techniques",
    type: "video",
  },
  {
    id: "guided-meditations",
    title: "Guided Meditations",
    subtitle: "Meditations & Tracks",
    imageUrl: "/images/wellness/guided-meditation.jpg",
    category: "mind",
    subcategory: "guided-meditations",
    type: "meditation",
  },
  {
    id: "guided-affirmations",
    title: "Guided Affirmations",
    subtitle: "20 Affirmations",
    imageUrl: "/images/wellness/affirmations.jpg",
    category: "mind",
    subcategory: "guided-affirmations",
    type: "track",
  },
  {
    id: "binaural-beats",
    title: "Binaural Beats",
    subtitle: "38 tracks",
    imageUrl: "/images/wellness/binaural.jpg",
    category: "mind",
    subcategory: "binaural-beats",
    type: "track",
  },
  {
    id: "relaxation-music",
    title: "Relaxation music",
    subtitle: "41 tracks",
    imageUrl: "/images/wellness/relaxation.jpg",
    category: "mind",
    subcategory: "relaxation-music",
    type: "track",
  },
  {
    id: "sounds-of-nature",
    title: "Sounds of Nature",
    subtitle: "19 tracks",
    imageUrl: "/images/wellness/nature-sounds.jpg",
    category: "mind",
    subcategory: "sounds-of-nature",
    type: "track",
  },
];

// Sleep content
export const SLEEP_CONTENT: WellnessItem[] = [
  {
    id: "deep-sleep-1",
    title: "Deep Sleep I",
    imageUrl: "/images/wellness/deep-sleep-1.jpg",
    category: "mind",
    subcategory: "better-sleep",
    duration: "9 minutes",
    type: "track",
  },
  {
    id: "deep-sleep-2",
    title: "Deep Sleep II",
    imageUrl: "/images/wellness/deep-sleep-2.jpg",
    category: "mind",
    subcategory: "better-sleep",
    duration: "30 minutes",
    type: "track",
  },
];

// Breathing techniques content
export const BREATHING_CONTENT: WellnessItem[] = [
  {
    id: "breath-relaxation-beginner",
    title: "Breath for Relaxation : Beginner",
    imageUrl: "/images/wellness/breathing-beginner.jpg",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "9 minutes",
    type: "video",
  },
  {
    id: "breath-relaxation-interm",
    title: "Breath for Relaxation : Interm",
    imageUrl: "/images/wellness/breathing-intermediate.jpg",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "10 minutes",
    type: "video",
  },
  {
    id: "breath-relaxation-advanced",
    title: "Breath for Relaxation : Advanced",
    imageUrl: "/images/wellness/breathing-advanced.jpg",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "12 minutes",
    type: "video",
  },
];

// Nature sounds content
export const NATURE_SOUNDS_CONTENT: WellnessItem[] = [
  {
    id: "evening-sea",
    title: "Evening next to the Sea",
    imageUrl: "/images/wellness/sea.jpg",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "8 hours",
    type: "track",
  },
  {
    id: "birds-sing",
    title: "Listening to the Birds Sing",
    imageUrl: "/images/wellness/birds.jpg",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "8 hours",
    type: "track",
  },
];
