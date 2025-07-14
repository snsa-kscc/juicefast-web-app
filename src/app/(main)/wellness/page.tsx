"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import Image from "next/image";
import { WELLNESS_CATEGORIES, TRENDING_CONTENT, DAILY_CONTENT, MIND_CONTENT } from "@/data/wellness-content";
import { CategorySelector } from "@/components/wellness/category-selector";
import { ContentGrid } from "@/components/wellness/content-grid";
import { DailyContent } from "@/components/wellness/daily-content";

export default function WellnessPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("trending");
  const [selectedCategory, setSelectedCategory] = useState<string>("trending");

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCategory(tab === "trending" ? "trending" : selectedCategory);
  };

  // Handle item click
  const handleItemClick = (itemId: string) => {
    router.push(`/wellness/content/${itemId}`);
  };

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    if (category === "trending") {
      setActiveTab("trending");
      setSelectedCategory("trending");
    } else {
      // Navigate to category page for Mind, Workouts, Nutrition, Beauty
      if (["mind", "workouts", "nutrition", "beauty"].includes(category)) {
        router.push(`/wellness/categories/${category.toLowerCase()}`);
      } else {
        setActiveTab("discover");
        setSelectedCategory(category);
      }
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    // If we're in discover tab and selecting trending, switch to trending tab
    if (activeTab === "discover" && category === "trending") {
      setActiveTab("trending");
    }
    // If we're in trending tab and selecting non-trending, switch to discover tab
    else if (activeTab === "trending" && category !== "trending") {
      setActiveTab("discover");
    }
  };

  // Determine which content to show based on selected category
  const getContentForCategory = () => {
    switch (selectedCategory) {
      case "trending":
        return TRENDING_CONTENT;
      case "mind":
        return MIND_CONTENT;
      default:
        return [];
    }
  };

  return (
    <div className="pb-6 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-b from-cyan-50 to-transparent p-4 pb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">JF Club</h1>
          <button className="p-2">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Workouts, recipes and relevant articles come to you every day, and are all based on your current state, logged results and overall wellness goals.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => handleTabChange("trending")}
            className={`px-6 py-3 font-medium text-sm ${activeTab === "trending" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"}`}
          >
            Trending
          </button>
          <button
            onClick={() => handleTabChange("discover")}
            className={`px-6 py-3 font-medium text-sm ${activeTab === "discover" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"}`}
          >
            Discover
          </button>
        </div>
      </div>

      {/* Category Selector */}
      <div className="p-4">
        <CategorySelector categories={WELLNESS_CATEGORIES} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
      </div>

      {/* Content Section */}
      <div className="px-4">
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory === "trending" ? "Trending" : WELLNESS_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
        </h2>

        {/* Content Grid */}
        <ContentGrid items={getContentForCategory()} columns={2} onItemClick={handleItemClick} />

        {/* Premium Banner - Only show on trending */}
        {selectedCategory === "trending" && (
          <div className="mb-8">
            <p className="text-xs text-center text-gray-500 mb-2">
              *Premium also includes detail analytics, premium insights, PDF data export and better wellness predictions
            </p>
            <button className="w-full bg-blue-600 text-white py-3 rounded-full font-bold">GO PREMIUM</button>
          </div>
        )}

        {/* Daily Content - Only show on trending */}
        {selectedCategory === "trending" && <DailyContent items={DAILY_CONTENT} onItemClick={handleItemClick} />}
      </div>
    </div>
  );
}
