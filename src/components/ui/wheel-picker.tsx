"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

interface WheelPickerProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

export function WheelPicker({ min, max, step, value, onChange, unit }: WheelPickerProps) {
  // Generate all possible values based on min, max, and step
  const values: number[] = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const index = values.findIndex(v => v === value);
    return index >= 0 ? index : 0;
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    axis: "y",
    align: "center",
  });

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Initialize with the current value
  useEffect(() => {
    if (emblaApi) {
      const index = values.findIndex(v => v === value);
      if (index >= 0) {
        scrollTo(index);
      }
    }
  }, [emblaApi, scrollTo, value, values]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(selectedIndex);
    onChange(values[selectedIndex]);
  }, [emblaApi, onChange, values]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("settle", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("settle", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative h-[200px] overflow-hidden">
      {/* Highlight for the selected item */}
      <div className="absolute left-0 right-0 top-1/2 h-[40px] -translate-y-1/2 bg-[#E7F6EF] z-0 rounded-md pointer-events-none" />
      
      {/* Gradient overlays for fading effect */}
      <div className="absolute left-0 right-0 top-0 h-[80px] bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute left-0 right-0 bottom-0 h-[80px] bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex flex-col">
          {values.map((val, index) => (
            <div 
              key={val} 
              className={cn(
                "embla__slide flex items-center justify-center h-[40px] text-2xl font-medium transition-all duration-200",
                selectedIndex === index ? "text-[#11B364]" : "text-gray-400"
              )}
            >
              {val}{unit && <span className="text-lg ml-1">{unit}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
