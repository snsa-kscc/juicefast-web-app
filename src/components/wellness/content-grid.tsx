"use client";

import { WellnessItem } from "@/data/wellness-content";
import { ContentCard } from "./content-card";
import { useRouter } from "next/navigation";

interface ContentGridProps {
  items: WellnessItem[];
  title?: string;
  subtitle?: string;
  columns?: number;
  onItemClick?: (itemId: string) => void;
}

export function ContentGrid({ 
  items, 
  title, 
  subtitle,
  columns = 2,
  onItemClick 
}: ContentGridProps) {
  const router = useRouter();
  
  const handleItemClick = (item: WellnessItem) => {
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      if (item.subcategory) {
        router.push(`/wellness/categories/${item.category}/${item.subcategory}`);
      } else {
        router.push(`/wellness/content/${item.id}`);
      }
    }
  };

  return (
    <div className="mb-8">
      {title && (
        <div className="mb-4">
          <h2 className="font-bold text-xl">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
      )}
      
      <div className={`grid grid-cols-${columns} gap-4 mb-4`}>
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
