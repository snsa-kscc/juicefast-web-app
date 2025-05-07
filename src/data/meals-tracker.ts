// Default values and configuration for the meals tracker
export const MEALS_TRACKER_CONFIG = {
  // Meal types
  mealTypes: [
    { id: "breakfast", label: "Breakfast", icon: "Sunrise", timeRange: "6:00 AM - 10:00 AM" },
    { id: "lunch", label: "Lunch", icon: "Sun", timeRange: "11:00 AM - 2:00 PM" },
    { id: "dinner", label: "Dinner", icon: "Sunset", timeRange: "5:00 PM - 9:00 PM" },
    { id: "snack", label: "Snack", icon: "Apple", timeRange: "Any time" }
  ],
  
  // Default macro nutrient goals
  defaultMacroGoals: {
    calories: 2000,
    protein: 100, // grams
    carbs: 250,   // grams
    fat: 65,      // grams
    fiber: 25     // grams
  },
  
  // Food categories for manual entry
  foodCategories: [
    { id: "protein", label: "Protein", examples: "Meat, fish, eggs, tofu" },
    { id: "grains", label: "Grains", examples: "Bread, rice, pasta, oats" },
    { id: "vegetables", label: "Vegetables", examples: "Broccoli, spinach, carrots" },
    { id: "fruits", label: "Fruits", examples: "Apples, bananas, berries" },
    { id: "dairy", label: "Dairy", examples: "Milk, cheese, yogurt" },
    { id: "fats", label: "Healthy Fats", examples: "Avocado, nuts, olive oil" },
    { id: "sweets", label: "Sweets & Treats", examples: "Desserts, candy, soda" }
  ],
  
  // Portion size references
  portionReferences: [
    { description: "Palm of hand", equivalent: "3-4 oz protein" },
    { description: "Fist", equivalent: "1 cup vegetables/fruits/grains" },
    { description: "Thumb", equivalent: "1 tbsp oils/nut butter" },
    { description: "Thumb tip", equivalent: "1 tsp oils/butter" },
    { description: "Cupped hand", equivalent: "1-2 oz nuts/seeds" }
  ]
};
