"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { 
  MIND_SUBCATEGORIES, 
  SLEEP_CONTENT, 
  BREATHING_CONTENT, 
  NATURE_SOUNDS_CONTENT,
  MEDITATION_CONTENT,
  RELAXATION_CONTENT
} from "@/data/wellness-content";
import { SubcategoryDetail } from "@/components/wellness/subcategory-detail";

export default function SubcategoryPage() {
  const router = useRouter();
  const { category, subcategory } = useParams();

  // Map subcategory to content
  const getSubcategoryContent = () => {
    switch (subcategory) {
      case "better-sleep":
        return {
          title: "Better Sleep",
          subtitle: "Sleep Tracks",
          description: "Catch the z's you need to with the help of these sleep tracks. Play them in the background, focus on the sound, and slip into a slumber.",
          items: SLEEP_CONTENT,
          featuredImageUrl: "/images/wellness/better-sleep.jpg"
        };
      case "breathing-techniques":
        return {
          title: "Breathing Techniques",
          subtitle: "16 guided videos",
          description: "Follow along with these guided breathing exercises. You can use them as you see fit or practice them a couple of times a day so you can feel all the benefits they bring.",
          items: BREATHING_CONTENT,
          featuredImageUrl: "/images/wellness/breathing.jpg"
        };
      case "sounds-of-nature":
        return {
          title: "Sounds of Nature",
          subtitle: "19 tracks",
          description: "Sounds of nature have a replenishing and restorative effect on the body. Listen to one of the several audios if you're looking to relieve stress and anxiety or help you focus on assigned tasks.",
          items: NATURE_SOUNDS_CONTENT,
          featuredImageUrl: "/images/wellness/nature-sounds.jpg"
        };
      case "guided-meditations":
        return {
          title: "Guided Meditations",
          subtitle: "25 meditations",
          description: "Through these meditations, you can achieve a mental, physical and emotional balance and reset. Find your inner peace with our guided meditation tracks.",
          items: MEDITATION_CONTENT,
          featuredImageUrl: "/images/wellness/guided-meditation.jpg"
        };
      case "relaxation-music":
        return {
          title: "Relaxation Music",
          subtitle: "41 tracks",
          description: "Here you'll find relaxing music that can help lower your heart rate, reduce stress and induce calmness. Take 20 minutes to relax and focus inwards.",
          items: RELAXATION_CONTENT,
          featuredImageUrl: "/images/wellness/relaxation.jpg"
        };
      case "binaural-beats":
        return {
          title: "Binaural Beats",
          subtitle: "38 tracks",
          description: "These specially designed audio tracks use different frequencies in each ear to help you focus, relax, or sleep. For best results, listen with headphones.",
          items: RELAXATION_CONTENT.filter(item => item.subtitle?.includes("Binaural")),
          featuredImageUrl: "/images/wellness/binaural.jpg"
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
        <button onClick={() => router.push("/wellness")} className="flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
          <ArrowLeft className="h-4 w-4" /> Back to Wellness
        </button>
      </div>
    );
  }

  const handleItemClick = (itemId: string) => {
    router.push(`/wellness/content/${itemId}`);
  };

  return (
    <>
      <SubcategoryDetail 
        title={subcategoryData.title}
        subtitle={subcategoryData.subtitle}
        description={subcategoryData.description}
        items={subcategoryData.items}
        featuredImageUrl={subcategoryData.featuredImageUrl}
        onBack={() => router.back()} 
        onItemClick={handleItemClick} 
      />
      <div className="h-24"></div>
    </>
  );
}
