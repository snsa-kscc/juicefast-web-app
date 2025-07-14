"use client";

import { WellnessItem } from "@/data/wellness-content";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

interface DailyContentProps {
  items: WellnessItem[];
  onItemClick?: (itemId: string) => void;
}

export function DailyContent({ items, onItemClick }: DailyContentProps) {
  const router = useRouter();

  const handleItemClick = (item: WellnessItem) => {
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      router.push(`/wellness/content/${item.id}`);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="font-bold text-xl">HAVE A TASTE</h2>
        <p className="text-gray-500 text-sm">of free daily content</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col cursor-pointer" onClick={() => handleItemClick(item)}>
            <div className="relative rounded-xl overflow-hidden w-full aspect-square">
              <Image src={item.imageUrl} alt={item.title || ""} fill className="object-cover" />
            </div>

            <div className="mt-2">
              <h3 className="font-bold text-sm">{item.title}</h3>
              {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}

              {/* Duration badge */}
              {item.duration && (
                <div className="flex items-center mt-1 text-amber-500 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{item.duration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
