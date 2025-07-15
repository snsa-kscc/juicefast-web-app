"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Clock, BookmarkIcon, Share2Icon, HeartIcon } from "lucide-react";
import Image from "next/image";
import { TRENDING_CONTENT, DAILY_CONTENT, MIND_CONTENT, SLEEP_CONTENT, BREATHING_CONTENT, NATURE_SOUNDS_CONTENT } from "@/data/wellness-content";

export default function WellnessItemPage() {
  const router = useRouter();
  const { id } = useParams();

  // Find the item from all content collections
  const allContent = [...TRENDING_CONTENT, ...DAILY_CONTENT, ...MIND_CONTENT, ...SLEEP_CONTENT, ...BREATHING_CONTENT, ...NATURE_SOUNDS_CONTENT];

  const item = allContent.find((item) => item.id === id);

  if (!item) {
    return (
      <div className="py-6 text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
        <p className="mb-6">The wellness content you're looking for doesn't exist.</p>
        <button onClick={() => router.push("/wellness")} className="flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
          <ArrowLeft className="h-4 w-4" /> Back to Wellness
        </button>
      </div>
    );
  }

  // Find related items (same category or subcategory)
  const relatedItems = allContent
    .filter((relatedItem) => relatedItem.id !== item.id && (relatedItem.category === item.category || relatedItem.subcategory === item.subcategory))
    .slice(0, 4);

  return (
    <div className="pb-6 font-sans">
      {/* Header with background image */}
      <div className="relative h-64 w-full">
        <Image src={item.imageUrl || ""} alt={item.title || ""} fill className="object-cover" />

        {/* Back button */}
        <button onClick={() => router.back()} className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        {/* Content info */}
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          {item.subtitle && <p className="text-white/80">{item.subtitle}</p>}

          {/* Duration badge */}
          {item.duration && (
            <div className="flex items-center mt-2 bg-white/20 rounded-full px-3 py-1 text-sm backdrop-blur-sm w-fit">
              <Clock className="h-4 w-4 mr-2" />
              <span>{item.duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content actions */}
      <div className="p-4">
        {/* Play button */}
        <button className="w-full bg-green-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 mb-4">
          <Play className="h-5 w-5 fill-current" />
          {item.type === "meditation" && "Start Meditation"}
          {item.type === "workout" && "Start Workout"}
          {item.type === "track" && "Play Track"}
          {item.type === "video" && "Watch Video"}
          {item.type === "recipe" && "View Recipe"}
          {item.type === "article" && "Read Article"}
        </button>

        {/* Secondary actions */}
        <div className="flex gap-2 mb-6">
          <button className="flex-1 border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-1">
            <BookmarkIcon className="h-4 w-4" /> Save
          </button>
          <button className="flex-1 border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-1">
            <Share2Icon className="h-4 w-4" /> Share
          </button>
          <button className="flex-1 border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-1">
            <HeartIcon className="h-4 w-4" /> Like
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold mb-2">About</h2>
        <p className="text-gray-600">
          {item.type === "meditation" &&
            "This meditation helps you relax and focus on your breath. Find a comfortable position, close your eyes, and follow along."}
          {item.type === "workout" && "This workout is designed to improve your strength and flexibility. Make sure to warm up properly before starting."}
          {item.type === "track" && "This audio track is designed to help you relax and unwind. Find a quiet space, put on headphones for the best experience."}
          {item.type === "video" && "This video guide will walk you through the process step by step. Follow along at your own pace."}
          {item.type === "recipe" && "This healthy recipe is easy to prepare and packed with nutrients. Perfect for a balanced diet."}
          {item.type === "article" && "This article provides valuable insights and tips to improve your wellness journey."}
        </p>
      </div>
    </div>
  );
}
