"use client";

import { WellnessItem } from "@/data/wellness-content";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";

interface SubcategoryDetailProps {
  title: string;
  subtitle?: string;
  description?: string;
  items: WellnessItem[];
  onBack?: () => void;
  onItemClick?: (itemId: string) => void;
  featuredImageUrl?: string;
}

export function SubcategoryDetail({ title, subtitle, description, items, onBack, onItemClick, featuredImageUrl }: SubcategoryDetailProps) {
  const router = useRouter();

  const handleItemClick = (item: WellnessItem) => {
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      router.push(`/wellness/content/${item.id}`);
    }
  };

  // Group items by their subtitle to create sections
  const groupedItems = items.reduce<Record<string, WellnessItem[]>>((acc, item) => {
    const group = item.subtitle || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {});

  // Use the first item's image as featured image if not provided
  const headerImageUrl = featuredImageUrl || (items.length > 0 ? items[0].imageUrl : "/images/wellness/default.jpg");

  return (
    <div className="font-sans bg-gray-50">
      {/* Featured Image Header */}
      <div className="relative w-full h-56 mb-4">
        <Image src={headerImageUrl || ""} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <button onClick={() => (onBack ? onBack() : router.back())} className="absolute top-6 left-4 flex items-center text-white">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-black">{title}</h1>
          {subtitle && <p className="text-black">{subtitle}</p>}
          {description && <p className="text-black text-sm mt-1 max-w-md">{description}</p>}
        </div>
      </div>

      {/* Display items grouped by subtitle */}
      <div className="space-y-6 px-4 pt-2">
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <div key={group} className="mb-6">
            <h2 className="text-amber-500 font-medium px-4 mb-2">{group}</h2>
            <div className="space-y-2">
              {groupItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white px-4 py-3 cursor-pointer border border-gray-200 rounded-sm"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <Image src={item.imageUrl || "/images/wellness/placeholder.jpg"} alt={item.title || ""} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col">
                    {item.duration && (
                      <div className="flex items-center text-amber-500 text-xs mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{item.duration}</span>
                      </div>
                    )}
                    <h3 className="font-medium">{item.title}</h3>
                  </div>
                  {item.type === "track" && (
                    <div className="ml-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#D1D5DB" strokeWidth="1.5" />
                        <path d="M15 12L10 15.5V8.5L15 12Z" fill="#D1D5DB" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
