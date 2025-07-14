"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MIND_SUBCATEGORIES, MIND_CONTENT, SLEEP_CONTENT, BREATHING_CONTENT } from "@/data/wellness-content";
import { ContentGrid } from "@/components/wellness/content-grid";
import { ContentCard } from "@/components/wellness/content-card";
import Image from "next/image";

export default function MindPage() {
  const router = useRouter();
  
  const handleItemClick = (itemId: string) => {
    router.push(`/wellness/content/${itemId}`);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    router.push(`/wellness/categories/mind/${subcategoryId}`);
  };
  
  return (
    <div className="py-6 font-sans">
      <div className="px-4">
        <button 
          onClick={() => router.push("/wellness")} 
          className="flex items-center mb-6 text-gray-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-bold mb-6">Mind</h1>
        
        {/* Subcategories Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {MIND_SUBCATEGORIES.map((subcategory) => (
            <div 
              key={subcategory.id} 
              className="flex flex-col cursor-pointer"
              onClick={() => handleSubcategoryClick(subcategory.id)}
            >
              <div className="relative rounded-xl overflow-hidden aspect-square">
                <Image 
                  src={subcategory.imageUrl || "/images/wellness/placeholder.jpg"} 
                  alt={subcategory.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-bold">{subcategory.name}</h3>
                {subcategory.count && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {subcategory.count} {subcategory.countLabel || "items"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Featured Content */}
        <h2 className="text-xl font-bold mb-4">Featured</h2>
        <ContentGrid 
          items={MIND_CONTENT.slice(0, 4)}
          columns={2}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
}
