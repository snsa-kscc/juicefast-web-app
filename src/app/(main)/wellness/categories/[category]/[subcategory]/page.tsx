"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { 
  MIND_SUBCATEGORIES, 
  SLEEP_CONTENT, 
  BREATHING_CONTENT, 
  NATURE_SOUNDS_CONTENT 
} from "@/data/wellness-content";
import { SubcategoryDetail } from "@/components/wellness/subcategory-detail";

export default function SubcategoryPage() {
  const router = useRouter();
  const { category, subcategory } = useParams();
  
  // Map subcategory to content
  const getSubcategoryContent = () => {
    switch(subcategory) {
      case "better-sleep":
        return {
          title: "Better Sleep",
          items: SLEEP_CONTENT
        };
      case "breathing-techniques":
        return {
          title: "Breathing Techniques",
          items: BREATHING_CONTENT
        };
      case "sounds-of-nature":
        return {
          title: "Sounds of Nature",
          items: NATURE_SOUNDS_CONTENT
        };
      default:
        return null;
    }
  };
  
  const subcategoryData = getSubcategoryContent();
  
  if (!subcategoryData) {
    return (
      <div className="py-6 text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Subcategory Not Found</h1>
        <p className="mb-6">The wellness subcategory you're looking for doesn't exist.</p>
        <button 
          onClick={() => router.push("/wellness")}
          className="flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Wellness
        </button>
      </div>
    );
  }
  
  const handleItemClick = (itemId: string) => {
    router.push(`/wellness/content/${itemId}`);
  };
  
  return (
    <SubcategoryDetail
      title={subcategoryData.title}
      items={subcategoryData.items}
      onBack={() => router.back()}
      onItemClick={handleItemClick}
    />
  );
}
