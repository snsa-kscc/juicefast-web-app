"use client";

import { useParams, useRouter } from "next/navigation";
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
  
  // Find the subcategory information
  const subcategoryInfo = MIND_SUBCATEGORIES.find(
    (sub) => sub.id === subcategory
  );
  
  // Get content based on subcategory
  const getContentForSubcategory = () => {
    switch (subcategory) {
      case "better-sleep":
        return SLEEP_CONTENT;
      case "breathing-techniques":
        return BREATHING_CONTENT;
      case "sounds-of-nature":
        return NATURE_SOUNDS_CONTENT;
      default:
        return [];
    }
  };

  // If subcategory doesn't exist, show error
  if (!subcategoryInfo) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Subcategory Not Found</h1>
        <p>The subcategory you're looking for doesn't exist.</p>
        <button 
          onClick={() => router.push("/wellness")}
          className="mt-4 text-blue-600"
        >
          Back to Wellness
        </button>
      </div>
    );
  }

  // Get content items for this subcategory
  const contentItems = getContentForSubcategory();
  
  // Get description for better sleep subcategory
  const getDescription = () => {
    if (subcategory === "better-sleep") {
      return "Catch the z's you need to with the help of these sleep tracks. Play them in the background, focus on the sound, and slip into a slumber.";
    }
    return "";
  };

  return (
    <SubcategoryDetail
      title={subcategoryInfo.name}
      subtitle={subcategoryInfo.description}
      description={getDescription()}
      items={contentItems}
    />
  );
}
