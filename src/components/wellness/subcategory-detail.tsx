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
}

export function SubcategoryDetail({ title, subtitle, description, items, onBack, onItemClick }: SubcategoryDetailProps) {
  const router = useRouter();

  const handleItemClick = (item: WellnessItem) => {
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      router.push(`/wellness/content/${item.id}`);
    }
  };

  return (
    <div className="py-6 font-sans">
      <button onClick={() => (onBack ? onBack() : router.back())} className="flex items-center mb-6 text-gray-600">
        <ArrowLeft className="h-5 w-5 mr-1" />
        <span>Back</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>

      {description && (
        <div className="mb-6 text-gray-600 text-sm">
          <p>{description}</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center bg-white rounded-xl p-3 shadow-sm cursor-pointer" onClick={() => handleItemClick(item)}>
            <div className="relative h-16 w-16 rounded-lg overflow-hidden mr-4">
              <Image src={item.imageUrl} alt={item.title || ""} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <h3 className="font-medium">{item.title}</h3>
              {item.subtitle && <p className="text-gray-500 text-sm">{item.subtitle}</p>}
            </div>

            {item.duration && (
              <div className="flex items-center text-amber-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
