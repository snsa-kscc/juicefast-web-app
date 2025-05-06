"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartIcon, BookOpenIcon, BrainIcon } from "lucide-react";

// Sample wellness articles data
const WELLNESS_ARTICLES = [
  {
    id: 1,
    title: "The Benefits of Tracking Your Meals",
    excerpt: "Learn how tracking your daily meals can lead to better nutrition and overall health.",
    date: "May 5, 2025",
    author: "Nutrition Team",
    category: "Nutrition",
    content:
      "Tracking your meals is one of the most effective ways to improve your diet and overall health. By keeping a record of what you eat, you become more aware of your eating patterns and can make more informed decisions about your nutrition...",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "5 Ways to Increase Your Daily Step Count",
    excerpt: "Simple strategies to help you move more throughout the day and reach your step goals.",
    date: "May 2, 2025",
    author: "Fitness Team",
    category: "Activity",
    content:
      "Increasing your daily step count doesn't have to involve drastic changes to your routine. Small adjustments throughout your day can add up to significant improvements in your overall activity level...",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Mindfulness and Nutrition: The Connection",
    excerpt: "How practicing mindfulness can transform your relationship with food and improve eating habits.",
    date: "April 28, 2025",
    author: "Wellness Team",
    category: "Mindfulness",
    content:
      "Mindfulness isn't just for meditation—it can also play a crucial role in your nutrition. By bringing awareness to your eating habits, you can develop a healthier relationship with food...",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2731&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Understanding Sleep Cycles for Better Rest",
    excerpt: "Learn how sleep cycles work and how to optimize your sleep for better health.",
    date: "April 25, 2025",
    author: "Sleep Expert",
    category: "Sleep",
    content:
      "Quality sleep is essential for overall health and wellbeing. Understanding your sleep cycles can help you optimize your rest and wake up feeling more refreshed...",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2942&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Hydration: Why Water is Your Best Friend",
    excerpt: "Discover the many benefits of staying properly hydrated throughout the day.",
    date: "April 22, 2025",
    author: "Nutrition Team",
    category: "Hydration",
    content:
      "Water is essential for nearly every bodily function. Staying properly hydrated can improve energy levels, cognitive function, and overall health...",
    imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2736&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Creating a Sustainable Wellness Routine",
    excerpt: "Tips for building healthy habits that last a lifetime.",
    date: "April 18, 2025",
    author: "Wellness Team",
    category: "Lifestyle",
    content:
      "The key to long-term health is creating sustainable wellness routines. Small, consistent actions over time lead to significant improvements in overall wellbeing...",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2920&auto=format&fit=crop",
  }
];

export default function WellnessPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory ? WELLNESS_ARTICLES.filter((article) => article.category === selectedCategory) : WELLNESS_ARTICLES;

  const categories = Array.from(new Set(WELLNESS_ARTICLES.map((article) => article.category)));

  return (
    <div className="py-6 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Wellness Center</h1>
        <p className="text-gray-500 mt-2">Articles and tips for your health journey</p>
      </div>

      {/* Featured wellness programs */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Featured Programs</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-2 rounded-full mb-2">
                  <BrainIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-700">7-Day Mindfulness</h3>
                <p className="text-xs text-blue-600 mt-1">Begin your journey</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-2 rounded-full mb-2">
                  <HeartIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-green-700">Healthy Habits</h3>
                <p className="text-xs text-green-600 mt-1">30-day challenge</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Wellness Articles</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)}>
            All
          </Button>
          {categories.map((category) => (
            <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden h-full flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">{article.date}</span>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">{article.category}</span>
              </div>
              <CardTitle className="text-xl">{article.title}</CardTitle>
              <CardDescription>{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-3 text-gray-600">{article.content}</p>
            </CardContent>
            <div className="p-4 pt-0 mt-auto">
              <Button variant="outline" className="w-full" onClick={() => router.push(`/wellness/${article.id}`)}>
                Read More
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Daily wellness tip */}
      <Card className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BookOpenIcon className="h-5 w-5 mr-2 text-amber-500" />
            Daily Wellness Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-800">
            "Take a few minutes each day to practice deep breathing. Inhale slowly for 4 counts, hold for 4, and exhale for 6. This simple practice can help reduce stress and improve focus."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
