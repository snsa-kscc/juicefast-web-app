"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { WaterIntake, DailyHealthMetrics } from "@/types/health-metrics";
import { ArrowLeft, Droplets, Plus, Minus, Settings } from "lucide-react";
import { WATER_TRACKER_CONFIG } from "@/data/water-tracker";
import { addWaterIntake } from "@/app/actions/health-actions";

interface WaterTrackerClientProps {
  userId: string;
  initialWaterData: DailyHealthMetrics | null;
}

export function WaterTrackerClient({ userId, initialWaterData }: WaterTrackerClientProps) {
  const router = useRouter();

  const [waterAmount, setWaterAmount] = useState<number>(WATER_TRACKER_CONFIG.defaultAmount);
  const [waterEntries, setWaterEntries] = useState<WaterIntake[]>([]);
  const [totalWater, setTotalWater] = useState<number>(0);
  const [displayedTotal, setDisplayedTotal] = useState<number>(0);
  const [dailyGoal] = useState<number>(WATER_TRACKER_CONFIG.dailyGoal);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(false);

  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const previousTotalRef = useRef<number>(0);

  // Initialize with data if available
  useEffect(() => {
    if (initialWaterData?.waterIntake) {
      setWaterEntries(initialWaterData.waterIntake);

      // Calculate total
      const total = initialWaterData.waterIntake.reduce((sum, entry) => sum + entry.amount, 0);

      // Set the actual total water value
      setTotalWater(total);

      // For initial animation, start from 0
      setDisplayedTotal(0);
      previousTotalRef.current = 0;

      // Trigger animation manually once
      const startAnimation = () => {
        setAnimationInProgress(true);
        const duration = 1500; // Animation duration in ms
        const startTime = performance.now();

        const animateCounter = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          // Easing function for smoother animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);

          const currentValue = Math.round(0 + (total - 0) * easeOutQuart);
          setDisplayedTotal(currentValue);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateCounter);
          } else {
            previousTotalRef.current = total;
            setAnimationInProgress(false);
          }
        };

        animationRef.current = requestAnimationFrame(animateCounter);
      };

      // Delay the animation slightly to ensure component is fully mounted
      const timeoutId = setTimeout(startAnimation, 300);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      // If no data, just set everything to 0
      setWaterEntries([]);
      setTotalWater(0);
      setDisplayedTotal(0);
      previousTotalRef.current = 0;
    }
  }, [initialWaterData]);

  // Counter animation effect for when water is added (not for initial load)
  useEffect(() => {
    // Skip initial render and only animate when water is added
    if (totalWater === displayedTotal || totalWater === 0) return;

    // Only animate if this is not the initial animation
    if (previousTotalRef.current !== 0 || displayedTotal !== 0) {
      setAnimationInProgress(true);
      const startValue = previousTotalRef.current;
      const endValue = totalWater;
      const duration = 1000; // 1 second animation
      const startTime = performance.now();

      const animateCounter = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
        setDisplayedTotal(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateCounter);
        } else {
          previousTotalRef.current = endValue;
          setAnimationInProgress(false);
        }
      };

      animationRef.current = requestAnimationFrame(animateCounter);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [totalWater]);

  const handleAddWater = async () => {
    if (!userId || isLoading || animationInProgress) return;

    try {
      setIsLoading(true);

      const newEntry: WaterIntake = {
        amount: waterAmount,
        timestamp: new Date(),
      };

      // Save to database
      await addWaterIntake(userId, new Date(), newEntry);

      // Update local state
      const updatedEntries = [...waterEntries, newEntry];
      const newTotal = totalWater + waterAmount;

      setWaterEntries(updatedEntries);
      setTotalWater(newTotal);
    } catch (error) {
      console.error("Failed to save water data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.min(100, Math.round((displayedTotal / dailyGoal) * 100));

  // Format water amount for display
  const formatWaterAmount = (amount: number): string => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}L`;
    }
    return `${amount}ml`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      {/* Header and blob */}
      <div className="relative overflow-hidden py-6">
        <div className="absolute w-64 h-64 rounded-full bg-[#4CC3FF]/40 blur-[80px] -top-5 z-0" />
        <div className="flex items-center justify-between p-4 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-[#3BB9FF] text-white hover:bg-[#0DA2FF] h-10 w-10"
            onClick={() => router.push("/tracker")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Water Tracker</h1>
          <Button variant="ghost" size="icon" className="rounded-full bg-transparent text-gray-400 hover:bg-gray-100 h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 py-2 text-center relative z-10">
          <p className="text-sm text-gray-500">
            Hydration fuels your focus, energy
            <br />
            and digestion. Keep it flowing.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-1">DAILY HYDRATION</h2>
        <p className="text-sm text-gray-500 mb-6">
          {formatWaterAmount(displayedTotal)} out of {formatWaterAmount(dailyGoal)} goal achieved
        </p>

        {/* Circular Progress */}
        <div className="relative w-52 h-52 mb-8">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" fill="white" stroke="#E6F4FF" strokeWidth="5" className="drop-shadow-md" />

            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#3BB9FF"
              strokeWidth="5"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercentage) / 100}
              transform="rotate(-90 60 60)"
              className="transition-all duration-1000"
            />

            {/* Water amount text */}
            <text x="60" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="bold" fill="#000">
              {formatWaterAmount(displayedTotal).replace("ml", "")}
            </text>
          </svg>
        </div>

        {/* Progress markers */}
        <div className="w-full max-w-xs flex justify-between items-center mb-4">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-gray-500">500ml</span>
          <span className="text-xs text-gray-500">1L</span>
          <span className="text-xs text-gray-500">1.5L</span>
          <span className="text-xs text-gray-500">2L</span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-[#E6F4FF] rounded-full h-2 mb-6">
          <div className="bg-[#3BB9FF] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Water fact */}
        <p className="text-sm text-center text-gray-600 mb-8">
          Your body is {progressPercentage}% water. You're
          <br />
          giving it what it needs.
        </p>
      </div>

      {/* Add Water Form */}
      <div className="w-full px-6">
        <h3 className="font-semibold mb-1">Add water</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Amount (ml)</span>
          <span className="text-xs font-medium">{waterAmount}ml</span>
        </div>

        <div className="mb-4">
          <Slider
            value={[waterAmount]}
            min={WATER_TRACKER_CONFIG.minAmount}
            max={WATER_TRACKER_CONFIG.maxAmount}
            step={WATER_TRACKER_CONFIG.stepSize}
            onValueChange={(value) => setWaterAmount(value[0])}
            className="w-full"
            disabled={isLoading || animationInProgress}
          />
        </div>

        {/* Quick add buttons */}
        <div className="flex justify-between mb-4">
          {WATER_TRACKER_CONFIG.quickAddAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              className="px-3 py-1 h-auto"
              onClick={() => {
                setWaterAmount(amount);
              }}
              disabled={isLoading || animationInProgress}
            >
              {amount} ml
            </Button>
          ))}
        </div>

        <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleAddWater} disabled={isLoading || animationInProgress}>
          {isLoading ? "Adding..." : "Add water"}
        </Button>
      </div>

      {/* Tips Card */}
      <div className="px-6">
        <Card className="w-full mt-6 mb-20">
          <CardContent className="pt-4">
            <h3 className="font-semibold mb-2">Hydration Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-0.5">
                  <Droplets className="h-3 w-3" />
                </div>
                <span>Drink a glass of water first thing in the morning</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-0.5">
                  <Droplets className="h-3 w-3" />
                </div>
                <span>Carry a reusable water bottle with you throughout the day</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-0.5">
                  <Droplets className="h-3 w-3" />
                </div>
                <span>Set reminders to drink water every hour</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="h-10"></div>
    </div>
  );
}
