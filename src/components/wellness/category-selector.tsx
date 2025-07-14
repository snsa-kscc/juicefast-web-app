"use client";

import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({ categories, selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <div className="flex overflow-x-auto pb-2 no-scrollbar">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
              selectedCategory === category.id
                ? "bg-white text-black border border-gray-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
