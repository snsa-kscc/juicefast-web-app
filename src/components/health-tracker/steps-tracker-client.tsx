"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StepEntry, DailyHealthMetrics } from "@/types/health-metrics";
import { ArrowLeft, Settings } from "lucide-react";
import { STEPS_TRACKER_CONFIG } from "@/data/steps-tracker";
import { addSteps } from "@/app/actions/health-actions";
import { cn } from "@/lib/utils";

interface StepsTrackerClientProps {
  userId: string;
  initialStepsData: DailyHealthMetrics | null;
}

export function StepsTrackerClient({ userId, initialStepsData }: StepsTrackerClientProps) {
  const router = useRouter();
  const [stepCount, setStepCount] = useState<number>(1000);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>(initialStepsData?.steps || []);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [displayedSteps, setDisplayedSteps] = useState<number>(0);
  const [dailyGoal] = useState<number>(STEPS_TRACKER_CONFIG.dailyGoal); // Daily step goal
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(false);

  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const previousStepsRef = useRef<number>(0);

  // Initialize with data if available
  useEffect(() => {
    if (initialStepsData?.steps) {
      setStepEntries(initialStepsData.steps);

      // Calculate total
      const total = initialStepsData.steps.reduce((sum, entry) => sum + entry.count, 0);

      // Set the actual total steps value
      setTotalSteps(total);

      // For initial animation, start from 0
      setDisplayedSteps(0);
      previousStepsRef.current = 0;

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
          setDisplayedSteps(currentValue);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateCounter);
          } else {
            previousStepsRef.current = total;
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
      setStepEntries([]);
      setTotalSteps(0);
      setDisplayedSteps(0);
      previousStepsRef.current = 0;
    }
  }, [initialStepsData]);

  // Counter animation effect for when steps are added (not for initial load)
  useEffect(() => {
    // Skip initial render and only animate when steps are added
    if (totalSteps === displayedSteps || totalSteps === 0) return;

    // Only animate if this is not the initial animation
    if (previousStepsRef.current !== 0 || displayedSteps !== 0) {
      setAnimationInProgress(true);
      const startValue = previousStepsRef.current;
      const endValue = totalSteps;
      const duration = 1000; // Animation duration in ms
      const startTime = performance.now();

      const animateCounter = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
        setDisplayedSteps(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateCounter);
        } else {
          previousStepsRef.current = endValue;
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
  }, [totalSteps]);

  const handleAddSteps = async () => {
    if (stepCount <= 0 || !userId || isLoading || animationInProgress) return;

    try {
      setIsLoading(true);

      const newEntry: StepEntry = {
        count: stepCount,
        timestamp: new Date(),
      };

      // Save to database
      await addSteps(userId, new Date(), newEntry);

      // Update local state
      const updatedEntries = [...stepEntries, newEntry];
      const newTotal = totalSteps + stepCount;

      setStepEntries(updatedEntries);
      setTotalSteps(newTotal);
    } catch (error) {
      console.error("Failed to save steps data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.min(100, Math.round((displayedSteps / dailyGoal) * 100));

  // Format step count for display
  const formatStepCount = (count: number): string => {
    return count.toLocaleString();
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
            className="rounded-full bg-[#FFC856] text-white hover:bg-[#F5B73C] h-10 w-10"
            onClick={() => router.push("/tracker")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Step Tracker</h1>
          <Button variant="ghost" size="icon" className="rounded-full bg-transparent text-gray-400 hover:bg-gray-100 h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 py-2 text-center relative z-10">
          <p className="text-sm text-gray-500">
            Move your body, clear your mind —
            <br />
            the rest will follow.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-1">DAILY STEPS</h2>
        <p className="text-sm text-gray-500 mb-6">
          {formatStepCount(displayedSteps)} out of {formatStepCount(dailyGoal)} steps
        </p>

        {/* Circular Progress */}
        <div className="relative w-52 h-52 mb-8">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" fill="white" stroke="#FFF0D0" strokeWidth="5" className="drop-shadow-md" />

            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#FFC856"
              strokeWidth="5"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercentage) / 100}
              transform="rotate(-90 60 60)"
              className="transition-all duration-1000"
            />

            {/* Step count text */}
            <text x="60" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="36" fontWeight="bold" fill="#FFC856">
              {Math.round(displayedSteps / 100)}
            </text>
          </svg>
        </div>

        {/* Progress markers */}
        <div className="w-full max-w-xs flex justify-between items-center mb-4">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-gray-500">2.5k</span>
          <span className="text-xs text-gray-500">5k</span>
          <span className="text-xs text-gray-500">7.5k</span>
          <span className="text-xs text-gray-500">10k</span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-[#FFF0D0] rounded-full h-2 mb-6">
          <div className="bg-[#FFC856] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Estimated calories */}
        <p className="text-sm text-center text-gray-600 mb-8">
          Estimated calories burned: {Math.round(displayedSteps * STEPS_TRACKER_CONFIG.activityLevels[0].caloriesPerStep)} kcal
        </p>
      </div>

      {/* Add Steps Form */}
      <div className="w-full px-6">
        <h3 className="font-semibold mb-1">Add steps</h3>
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">Step count</span>
          <span className="text-xs font-medium">{stepCount} steps</span>
        </div>

        <div className="mb-4">
          <Input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={stepCount}
            onChange={(e) => setStepCount(parseInt(e.target.value))}
            className="w-full"
            disabled={isLoading || animationInProgress}
          />
        </div>

        {/* Quick add buttons */}
        <div className="flex justify-between mb-4">
          {[1000, 2500, 5000].map((count) => (
            <Button
              key={count}
              variant="outline"
              size="sm"
              className="px-3 py-1 h-auto"
              onClick={() => {
                setStepCount(count);
              }}
              disabled={isLoading || animationInProgress}
            >
              {count} steps
            </Button>
          ))}
        </div>

        <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleAddSteps} disabled={isLoading || animationInProgress}>
          {isLoading ? "Adding..." : "Add steps"}
        </Button>
      </div>

      {/* Tips Card */}
      <div className="px-6">
        <Card className="w-full mt-6 mb-20">
          <CardContent className="pt-4">
            <h3 className="font-semibold mb-2">Step Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="bg-amber-100 text-amber-600 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5 5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span>Take the stairs instead of the elevator</span>
              </li>
              <li className="flex items-start">
                <div className="bg-amber-100 text-amber-600 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5 5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span>Park farther away from your destination</span>
              </li>
              <li className="flex items-start">
                <div className="bg-amber-100 text-amber-600 rounded-full p-1 mr-2 mt-0.5">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5 5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span>Set a reminder to walk for 5 minutes every hour</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="h-10"></div>
    </div>
  );
}
