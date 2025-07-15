// Wellness content data for the redesigned wellness section

export interface WellnessItem {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
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

// Subcategories interface
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

// Workout subcategories
export const WORKOUT_SUBCATEGORIES: SubcategoryItem[] = [
  {
    id: "pilates",
    name: "Pilates",
    description: "Pilates workouts",
    imageUrl: "/images/wellness/pilates.jpg",
    count: 30,
    countLabel: "workouts",
  },
  {
    id: "yoga",
    name: "Yoga",
    description: "Yoga workouts",
    imageUrl: "/images/wellness/yoga.jpg",
    count: 48,
    countLabel: "workouts",
  },
  {
    id: "mobility-stretching",
    name: "Mobility & Stretching",
    description: "Mobility and stretching exercises",
    imageUrl: "/images/wellness/mobility-stretching.jpg",
    count: 13,
    countLabel: "workouts",
  },
  {
    id: "cardio-fat-burn",
    name: "Cardio & Fat Burn",
    description: "Cardio and fat burning workouts",
    imageUrl: "/images/wellness/cardio-fat-burn.jpg",
    count: 20,
    countLabel: "Affirmations",
  },
  {
    id: "weight-loss-fitness",
    name: "Weight Loss Fitness",
    description: "Weight loss fitness programs",
    imageUrl: "/images/wellness/weight-loss-fitness.jpg",
    count: 25,
    countLabel: "workouts",
  },
];

// Workout content
export const WORKOUT_CONTENT: WellnessItem[] = [
  {
    id: "pilates-beginner",
    title: "Pilates for Beginners",
    subtitle: "30 min workout",
    imageUrl: "/images/wellness/pilates.jpg",
    category: "workouts",
    subcategory: "pilates",
    duration: "30 minutes",
    type: "workout",
  },
  {
    id: "yoga-flow",
    title: "Yoga Flow",
    subtitle: "45 min workout",
    imageUrl: "/images/wellness/yoga.jpg",
    category: "workouts",
    subcategory: "yoga",
    duration: "45 minutes",
    type: "workout",
  },
  {
    id: "mobility-routine",
    title: "Daily Mobility Routine",
    subtitle: "15 min workout",
    imageUrl: "/images/wellness/mobility-stretching.jpg",
    category: "workouts",
    subcategory: "mobility-stretching",
    duration: "15 minutes",
    type: "workout",
  },
  {
    id: "hiit-cardio",
    title: "HIIT Cardio Blast",
    subtitle: "20 min workout",
    imageUrl: "/images/wellness/cardio-fat-burn.jpg",
    category: "workouts",
    subcategory: "cardio-fat-burn",
    duration: "20 minutes",
    type: "workout",
  },
  {
    id: "weight-loss-program",
    title: "28-Day Weight Loss Program",
    subtitle: "Daily workouts",
    imageUrl: "/images/wellness/weight-loss-fitness.jpg",
    category: "workouts",
    subcategory: "weight-loss-fitness",
    duration: "28 days",
    type: "workout",
  },
];

// Trending content
export const TRENDING_CONTENT: WellnessItem[] = [
  {
    id: "meditations-collection",
    title: "140+",
    subtitle: "Meditations",
    imageUrl: "/images/wellness/meditation.jpg",
    category: "trending",
    type: "meditation",
  },
  {
    id: "recipes-collection",
    title: "100+",
    subtitle: "Recipes",
    imageUrl: "/images/wellness/recipes.jpg",
    category: "trending",
    type: "recipe",
  },
  {
    id: "workouts-collection",
    title: "160+",
    subtitle: "Workouts",
    imageUrl: "/images/wellness/workouts.jpg",
    category: "trending",
    type: "workout",
  },
  {
    id: "articles-collection",
    title: "100+",
    subtitle: "Health Tips",
    imageUrl: "/images/wellness/articles.jpg",
    category: "trending",
    type: "article",
  },
];

// Nutrition subcategories
export const NUTRITION_SUBCATEGORIES: SubcategoryItem[] = [
  {
    id: "postpartum-nutrition",
    name: "Postpartum Nutrition",
    description: "Nutrition for postpartum recovery",
    imageUrl: "/images/wellness/postpartum-nutrition.jpg",
    count: 25,
    countLabel: "recipes",
  },
  {
    id: "smoothies",
    name: "Smoothies",
    description: "Healthy smoothie recipes",
    imageUrl: "/images/wellness/smoothies.jpg",
    count: 14,
    countLabel: "recipes",
  },
  {
    id: "snacks",
    name: "Snacks",
    description: "Healthy snack recipes",
    imageUrl: "/images/wellness/snacks.jpg",
    count: 12,
    countLabel: "recipes",
  },
  {
    id: "bowls",
    name: "Bowls",
    description: "Nutritious bowl recipes",
    imageUrl: "/images/wellness/bowls.jpg",
    count: 12,
    countLabel: "recipes",
  },
  {
    id: "oven-baked",
    name: "Oven Baked",
    description: "Oven baked recipes",
    imageUrl: "/images/wellness/oven-baked.jpg",
    count: 15,
    countLabel: "recipes",
  },
  {
    id: "mocktails",
    name: "Mocktails",
    description: "Non-alcoholic drink recipes",
    imageUrl: "/images/wellness/mocktails.jpg",
    count: 24,
    countLabel: "recipes",
  },
];

// Nutrition content
export const NUTRITION_CONTENT: WellnessItem[] = [
  {
    id: "postpartum-meal-plan",
    title: "Postpartum Meal Plan",
    subtitle: "7-day plan",
    imageUrl: "/images/wellness/postpartum-nutrition.jpg",
    category: "nutrition",
    subcategory: "postpartum-nutrition",
    duration: "30 minutes prep",
    type: "recipe",
  },
  {
    id: "berry-smoothie",
    title: "Berry Protein Smoothie",
    subtitle: "Quick breakfast",
    imageUrl: "/images/wellness/smoothies.jpg",
    category: "nutrition",
    subcategory: "smoothies",
    duration: "5 minutes",
    type: "recipe",
  },
  {
    id: "healthy-snack-box",
    title: "Healthy Snack Box",
    subtitle: "Prep ahead",
    imageUrl: "/images/wellness/snacks.jpg",
    category: "nutrition",
    subcategory: "snacks",
    duration: "15 minutes",
    type: "recipe",
  },
  {
    id: "buddha-bowl",
    title: "Buddha Bowl",
    subtitle: "Balanced meal",
    imageUrl: "/images/wellness/bowls.jpg",
    category: "nutrition",
    subcategory: "bowls",
    duration: "20 minutes",
    type: "recipe",
  },
];

// Beauty subcategories
export const BEAUTY_SUBCATEGORIES: SubcategoryItem[] = [
  {
    id: "face-yoga",
    name: "Face Yoga Mini Class",
    description: "Facial exercises",
    imageUrl: "/images/wellness/face-yoga.jpg",
    count: 15,
    countLabel: "sessions",
  },
  {
    id: "diy-hair-masks",
    name: "DIY Hair Masks",
    description: "Natural hair treatments",
    imageUrl: "/images/wellness/hair-masks.jpg",
    count: 10,
    countLabel: "recipes",
  },
  {
    id: "diy-face-masks",
    name: "DIY Face Masks",
    description: "Natural face treatments",
    imageUrl: "/images/wellness/face-masks.jpg",
    count: 12,
    countLabel: "recipes",
  },
  {
    id: "diy-bath-bombs",
    name: "DIY Bath Bombs",
    description: "Homemade bath products",
    imageUrl: "/images/wellness/bath-bombs.jpg",
    count: 12,
    countLabel: "recipes",
  },
];

// Beauty content
export const BEAUTY_CONTENT: WellnessItem[] = [
  {
    id: "face-yoga-routine",
    title: "Daily Face Yoga Routine",
    subtitle: "5 minute routine",
    imageUrl: "/images/wellness/face-yoga.jpg",
    category: "beauty",
    subcategory: "face-yoga",
    duration: "5 minutes",
    type: "video",
  },
  {
    id: "avocado-hair-mask",
    title: "Avocado Hair Mask",
    subtitle: "Deep conditioning",
    imageUrl: "/images/wellness/hair-masks.jpg",
    category: "beauty",
    subcategory: "diy-hair-masks",
    duration: "30 minutes",
    type: "recipe",
  },
  {
    id: "honey-face-mask",
    title: "Honey & Oatmeal Face Mask",
    subtitle: "Soothing treatment",
    imageUrl: "/images/wellness/face-masks.jpg",
    category: "beauty",
    subcategory: "diy-face-masks",
    duration: "15 minutes",
    type: "recipe",
  },
  {
    id: "lavender-bath-bomb",
    title: "Lavender Bath Bomb",
    subtitle: "Relaxing soak",
    imageUrl: "/images/wellness/bath-bombs.jpg",
    category: "beauty",
    subcategory: "diy-bath-bombs",
    duration: "45 minutes",
    type: "recipe",
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
    category: "beauty",
    subcategory: "diy-face-masks",
    duration: "15 minutes",
    type: "recipe",
  },
  {
    id: "neck-shoulder",
    title: "Neck and Shoulder Relaxation",
    imageUrl: "/images/wellness/neck-shoulder.jpg",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "17 minutes",
    type: "track",
  },
];

// Better Sleep content
export const SLEEP_CONTENT: WellnessItem[] = [
  {
    id: "deep-sleep-1",
    title: "Deep Sleep I",
    subtitle: "Guided Meditation",
    category: "mind",
    subcategory: "better-sleep",
    duration: "9 minutes",
    type: "meditation",
  },
  {
    id: "deep-sleep-2",
    title: "Deep Sleep II",
    subtitle: "Guided Meditation",
    category: "mind",
    subcategory: "better-sleep",
    duration: "30 minutes",
    type: "meditation",
  },
  {
    id: "evening-sea",
    title: "Evening next to the Sea",
    subtitle: "8 hour nature sounds",
    category: "mind",
    subcategory: "better-sleep",
    duration: "8 hours",
    type: "track",
  },
  {
    id: "birds-sing",
    title: "Listening to the Birds Sing",
    subtitle: "8 hour nature sounds",
    category: "mind",
    subcategory: "better-sleep",
    duration: "8 hours",
    type: "track",
  },
];

// Breathing Techniques content
export const BREATHING_CONTENT: WellnessItem[] = [
  {
    id: "double-breathing",
    title: "Double Breathing",
    subtitle: "Uplifting Techniques",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "9 minutes",
    type: "meditation",
  },
  {
    id: "energizing-breath",
    title: "Energizing Breath",
    subtitle: "Uplifting Techniques",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "30 minutes",
    type: "meditation",
  },
  {
    id: "balanced-breath",
    title: "Balanced Breath",
    subtitle: "Unwinding Techniques",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "9 minutes",
    type: "meditation",
  },
  {
    id: "box-breathing-low",
    title: "Box Breathing: Low Intensity",
    subtitle: "Unwinding Techniques",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "10 minutes",
    type: "meditation",
  },
  {
    id: "box-breathing-high",
    title: "Box Breathing: High Intensity",
    subtitle: "Unwinding Techniques",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "12 minutes",
    type: "meditation",
  },
  {
    id: "4-7-8-low",
    title: "4-7-8: Low Intensity",
    subtitle: "Breathing for better sleep",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "8 hours",
    type: "meditation",
  },
  {
    id: "4-7-8-high",
    title: "4-7-8: High Intensity",
    subtitle: "Breathing for better sleep",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "8 hours",
    type: "meditation",
  },
  {
    id: "relaxation-beginner",
    title: "For Relaxation: Beginner",
    subtitle: "Breathing for Relaxation",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "8 hours",
    type: "meditation",
  },
  {
    id: "relaxation-advanced",
    title: "For Relaxation: Advanced",
    subtitle: "Breathing for Relaxation",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "8 hours",
    type: "meditation",
  },
];

// Guided Meditations content
export const MEDITATION_CONTENT: WellnessItem[] = [
  {
    id: "encompassing-calmness",
    title: "Encompassing Calmness",
    subtitle: "Newest Additions",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "9 minutes",
    type: "meditation",
  },
  {
    id: "feel-empowered",
    title: "Feel Empowered",
    subtitle: "Newest Additions",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "30 minutes",
    type: "meditation",
  },
  {
    id: "deep-sleep-meditation-1",
    title: "Deep Sleep I",
    subtitle: "Better Sleep",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "9 minutes",
    type: "meditation",
  },
  {
    id: "deep-sleep-meditation-2",
    title: "Deep Sleep II",
    subtitle: "Better Sleep",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "10 minutes",
    type: "meditation",
  },
  {
    id: "walking-meditation",
    title: "Walking Meditation",
    subtitle: "Better Sleep",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "6 minutes",
    type: "meditation",
  },
  {
    id: "body-scan-1",
    title: "Body Scan I",
    subtitle: "De-Stress",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "10 min",
    type: "meditation",
  },
  {
    id: "body-scan-2",
    title: "Body Scan II",
    subtitle: "De-Stress",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "10 min",
    type: "meditation",
  },
  {
    id: "inner-peace-1",
    title: "Inner Peace I",
    subtitle: "De-Stress",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "8 min",
    type: "meditation",
  },
  {
    id: "inner-peace-2",
    title: "Inner Peace II",
    subtitle: "De-Stress",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "9 min",
    type: "meditation",
  },
];

// Nature Sounds content
export const NATURE_CONTENT: WellnessItem[] = [
  {
    id: "light-rain",
    title: "Light Rain",
    subtitle: "Rain & Storm",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "9 minutes",
    type: "track",
  },
  {
    id: "heavy-rain",
    title: "Heavy Rain",
    subtitle: "Rain & Storm",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "30 minutes",
    type: "track",
  },
  {
    id: "crickets-night",
    title: "Crickets at Night",
    subtitle: "Wandering in Nature",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "9 minutes",
    type: "track",
  },
  {
    id: "calm-jungle",
    title: "Calm Jungle",
    subtitle: "Wandering in Nature",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "10 minutes",
    type: "track",
  },
  {
    id: "walking-forest",
    title: "Walking through the Forrest",
    subtitle: "Wandering in Nature",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "12 minutes",
    type: "track",
  },
  {
    id: "walking-beach",
    title: "Walking on the Beach",
    subtitle: "At the Beach",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "8 hours",
    type: "track",
  },
  {
    id: "ocean-waves",
    title: "Soft Ocean Waves",
    subtitle: "At the Beach",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "8 hours",
    type: "track",
  },
];

// Relaxation Music content
export const RELAXATION_CONTENT: WellnessItem[] = [
  {
    id: "winds-positivity",
    title: "Winds of Positivity",
    subtitle: "Binaural Nature Sounds",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "30 minutes",
    type: "track",
  },
  {
    id: "waves-contemplation",
    title: "Waves of Contemplation",
    subtitle: "Binaural Nature Sounds",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "60 minutes",
    type: "track",
  },
  {
    id: "falling-asleep",
    title: "Falling Asleep",
    subtitle: "Delta",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "30 minutes",
    type: "track",
  },
  {
    id: "baby-deep-sleep",
    title: "Baby Deep Sleep",
    subtitle: "Delta",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "30 minutes",
    type: "track",
  },
  {
    id: "restorative-healing",
    title: "Restorative Healing",
    subtitle: "Delta",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "30 minutes",
    type: "track",
  },
  {
    id: "finding-answer",
    title: "Finding the answer",
    subtitle: "Theta",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "8 hours",
    type: "track",
  },
  {
    id: "relaxed-happy",
    title: "Relaxed & Happy",
    subtitle: "Theta",
    category: "mind",
    subcategory: "relaxation-music",
    duration: "8 hours",
    type: "track",
  },
];

// Mind content
export const MIND_CONTENT: WellnessItem[] = [
  {
    id: "better-sleep-meditation",
    title: "Better Sleep Meditation",
    subtitle: "Fall asleep faster",
    category: "mind",
    subcategory: "better-sleep",
    duration: "15 minutes",
    type: "meditation",
  },
  {
    id: "breathing-techniques",
    title: "Breathing Techniques",
    subtitle: "Calm your mind",
    category: "mind",
    subcategory: "breathing-techniques",
    duration: "10 minutes",
    type: "meditation",
  },
  {
    id: "nature-sounds",
    title: "Sounds of Nature",
    subtitle: "Relaxing ambience",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "30 minutes",
    type: "track",
  },
  {
    id: "guided-meditation",
    title: "Guided Meditation",
    subtitle: "Find your center",
    category: "mind",
    subcategory: "guided-meditations",
    duration: "20 minutes",
    type: "meditation",
  },
  {
    id: "binaural-beats",
    title: "Binaural Beats",
    subtitle: "38 tracks",
    category: "mind",
    subcategory: "binaural-beats",
    type: "track",
  },
  {
    id: "relaxation-music",
    title: "Relaxation music",
    subtitle: "41 tracks",
    category: "mind",
    subcategory: "relaxation-music",
    type: "track",
  },
  {
    id: "sounds-of-nature",
    title: "Sounds of Nature",
    subtitle: "19 tracks",
    category: "mind",
    subcategory: "sounds-of-nature",
    type: "track",
  },
];

// Additional content items for subcategories
// These are already defined above, so we're removing the duplicate declarations

// Nature sounds content
export const NATURE_SOUNDS_CONTENT: WellnessItem[] = [
  {
    id: "evening-sea",
    title: "Evening next to the Sea",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "8 hours",
    type: "track",
  },
  {
    id: "birds-sing",
    title: "Listening to the Birds Sing",
    category: "mind",
    subcategory: "sounds-of-nature",
    duration: "8 hours",
    type: "track",
  },
];
