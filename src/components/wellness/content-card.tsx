"use client";

import { WellnessItem } from "@/data/wellness-content";
import Image from "next/image";
import { Clock } from "lucide-react";

interface ContentCardProps {
  item: WellnessItem;
  onClick?: () => void;
  variant?: "large" | "medium" | "small";
}

export function ContentCard({ item, onClick, variant = "medium" }: ContentCardProps) {
  const sizeClasses = {
    large: "w-full aspect-[1.5/1]",
    medium: "w-full aspect-square",
    small: "w-full aspect-[3/2]",
  };

  return (
    <div className="flex flex-col cursor-pointer" onClick={onClick}>
      {/* Image container */}
      <div className={`relative rounded-xl overflow-hidden ${sizeClasses[variant]}`}>
        <Image src={item.imageUrl || ""} alt={item.title || ""} fill className="object-cover" />
      </div>

      {/* Content below image */}
      <div className="mt-2">
        {item.count ? (
          <h3 className="font-bold text-lg">{item.title}</h3>
        ) : (
          <>
            <h3 className="font-bold">{item.title}</h3>
            {item.subtitle && <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>}
          </>
        )}

        {/* Duration badge */}
        {item.duration && (
          <div className="flex items-center mt-1 text-amber-500 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <span>{item.duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}
