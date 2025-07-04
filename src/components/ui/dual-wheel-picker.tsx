"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

interface DualWheelPickerProps {
  value: number; // Value in grams
  onChange: (value: number) => void;
  minKg?: number;
  maxKg?: number;
  kgStep?: number;
  gramStep?: number;
  unit?: string;
}

export function DualWheelPicker({ value, onChange, minKg = 40, maxKg = 150, kgStep = 1, gramStep = 100, unit = "kg" }: DualWheelPickerProps) {
  // Convert initial value to kg and grams
  const initialValueGrams = value % 1000;
  const initialValueKg = Math.floor(value / 1000);

  // State for kg and grams
  const [selectedKg, setSelectedKg] = useState(initialValueKg);
  const [selectedGrams, setSelectedGrams] = useState(Math.round(initialValueGrams / gramStep) * gramStep);

  // Generate kg and gram values
  const kgValues: number[] = [];
  for (let i = minKg; i <= maxKg; i += kgStep) {
    kgValues.push(i);
  }

  const gramValues: number[] = [];
  for (let i = 0; i < 1000; i += gramStep) {
    gramValues.push(i);
  }

  // Find initial indexes
  const initialKgIndex = kgValues.findIndex((v) => v === initialValueKg);
  const initialGramIndex = gramValues.findIndex((v) => v === Math.round(initialValueGrams / gramStep) * gramStep);

  // Create carousel instances for kg and grams
  const [kgEmblaRef, kgEmblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    axis: "y",
    align: "center",
  });

  const [gramEmblaRef, gramEmblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    axis: "y",
    align: "center",
  });

  // Scroll to initial positions
  const scrollToKg = useCallback(
    (index: number) => {
      if (kgEmblaApi) kgEmblaApi.scrollTo(index >= 0 ? index : 0);
    },
    [kgEmblaApi]
  );

  const scrollToGram = useCallback(
    (index: number) => {
      if (gramEmblaApi) gramEmblaApi.scrollTo(index >= 0 ? index : 0);
    },
    [gramEmblaApi]
  );

  // Initialize with current values
  useEffect(() => {
    if (kgEmblaApi) {
      scrollToKg(initialKgIndex);
    }
  }, [kgEmblaApi, scrollToKg, initialKgIndex]);

  useEffect(() => {
    if (gramEmblaApi) {
      scrollToGram(initialGramIndex);
    }
  }, [gramEmblaApi, scrollToGram, initialGramIndex]);

  // Handle selection changes
  const onKgSelect = useCallback(() => {
    if (!kgEmblaApi) return;
    const selectedIndex = kgEmblaApi.selectedScrollSnap();
    const kg = kgValues[selectedIndex];
    setSelectedKg(kg);
    onChange(kg * 1000 + selectedGrams);
  }, [kgEmblaApi, kgValues, onChange, selectedGrams]);

  const onGramSelect = useCallback(() => {
    if (!gramEmblaApi) return;
    const selectedIndex = gramEmblaApi.selectedScrollSnap();
    const grams = gramValues[selectedIndex];
    setSelectedGrams(grams);
    onChange(selectedKg * 1000 + grams);
  }, [gramEmblaApi, gramValues, onChange, selectedKg]);

  // Set up event listeners
  useEffect(() => {
    if (!kgEmblaApi) return;
    kgEmblaApi.on("select", onKgSelect);
    kgEmblaApi.on("settle", onKgSelect);
    return () => {
      kgEmblaApi.off("select", onKgSelect);
      kgEmblaApi.off("settle", onKgSelect);
    };
  }, [kgEmblaApi, onKgSelect]);

  useEffect(() => {
    if (!gramEmblaApi) return;
    gramEmblaApi.on("select", onGramSelect);
    gramEmblaApi.on("settle", onGramSelect);
    return () => {
      gramEmblaApi.off("select", onGramSelect);
      gramEmblaApi.off("settle", onGramSelect);
    };
  }, [gramEmblaApi, onGramSelect]);

  return (
    <div className="flex justify-center items-center">
      <div className="flex space-x-2 bg-white rounded-lg shadow-sm">
        {/* Kg wheel */}
        <div className="relative w-24 h-[200px] overflow-hidden">
          {/* Highlight for selected item */}
          <div className="absolute left-0 right-0 top-1/2 h-[40px] -translate-y-1/2 bg-[#E7F6EF] z-0 rounded-md pointer-events-none" />

          {/* Gradient overlays */}
          <div className="absolute left-0 right-0 top-0 h-[80px] bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 right-0 bottom-0 h-[80px] bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

          <div className="embla h-full" ref={kgEmblaRef}>
            <div className="embla__container h-full flex flex-col">
              {kgValues.map((val, index) => (
                <div
                  key={val}
                  className={cn(
                    "embla__slide flex items-center justify-center h-[40px] text-2xl font-medium transition-all duration-200",
                    selectedKg === val ? "text-[#11B364]" : "text-gray-400"
                  )}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unit indicator */}
        <div className="flex items-center justify-center text-lg font-medium text-gray-500">{unit}</div>

        {/* Grams wheel */}
        <div className="relative w-24 h-[200px] overflow-hidden">
          {/* Highlight for selected item */}
          <div className="absolute left-0 right-0 top-1/2 h-[40px] -translate-y-1/2 bg-[#E7F6EF] z-0 rounded-md pointer-events-none" />

          {/* Gradient overlays */}
          <div className="absolute left-0 right-0 top-0 h-[80px] bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 right-0 bottom-0 h-[80px] bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

          <div className="embla h-full" ref={gramEmblaRef}>
            <div className="embla__container h-full flex flex-col">
              {gramValues.map((val, index) => (
                <div
                  key={val}
                  className={cn(
                    "embla__slide flex items-center justify-center h-[40px] text-2xl font-medium transition-all duration-200",
                    selectedGrams === val ? "text-[#11B364]" : "text-gray-400"
                  )}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Gram unit indicator */}
        <div className="flex items-center justify-center text-lg font-medium text-gray-500">
          g
        </div>
      </div>
    </div>
  );
}
