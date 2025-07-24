"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SleepEntry, DailyHealthMetrics } from "@/types/health-metrics";
import { formatDateKey } from "@/lib/date-utils";
import { ArrowLeft, BedIcon, MoonIcon, SunIcon, Settings, Clock } from "lucide-react";
import { SLEEP_TRACKER_CONFIG } from "@/data/sleep-tracker";
import { addSleep } from "@/app/actions/health-actions";
import { cn } from "@/lib/utils";

interface SleepTrackerClientProps {
  userId: string;
  initialSleepData: DailyHealthMetrics | null;
}

export function SleepTrackerClient({ userId, initialSleepData }: SleepTrackerClientProps) {
  const router = useRouter();
  const [sleepEntry, setSleepEntry] = useState<SleepEntry | null>(initialSleepData?.sleep || null);
  const [hoursSlept, setHoursSlept] = useState<number>(sleepEntry?.hoursSlept || SLEEP_TRACKER_CONFIG.dailyGoal);
  const [displayedHours, setDisplayedHours] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(sleepEntry?.quality || 3);
  const [bedTime, setBedTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultBedtime);
  const [wakeTime, setWakeTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultWakeTime);
  const [dailyGoal] = useState<number>(SLEEP_TRACKER_CONFIG.dailyGoal); // Daily sleep goal
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const previousValueRef = useRef<number>(0);

  // Initialize form with data if available
  useEffect(() => {
    if (initialSleepData?.sleep) {
      setSleepEntry(initialSleepData.sleep);
      setHoursSlept(initialSleepData.sleep.hoursSlept);
      setDisplayedHours(initialSleepData.sleep.hoursSlept);
      setSleepQuality(initialSleepData.sleep.quality);
      previousValueRef.current = initialSleepData.sleep.hoursSlept;

      // Format times for input
      const bedTimeDate = new Date(initialSleepData.sleep.startTime);
      const wakeTimeDate = new Date(initialSleepData.sleep.endTime);

      setBedTime(formatTimeForInput(bedTimeDate));
      setWakeTime(formatTimeForInput(wakeTimeDate));
    } else {
      // Set default values if no data
      setDisplayedHours(0);
      previousValueRef.current = 0;
    }
  }, [initialSleepData]);

  // Counter animation effect
  useEffect(() => {
    if (!sleepEntry || sleepEntry.hoursSlept === displayedHours) return;

    setAnimationInProgress(true);
    const startValue = previousValueRef.current;
    const endValue = sleepEntry.hoursSlept;
    const duration = 1000; // 1 second animation
    const startTime = performance.now();

    const animateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayedHours(Math.round(currentValue * 10) / 10); // Round to 1 decimal place

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateCounter);
      } else {
        setDisplayedHours(endValue);
        previousValueRef.current = endValue;
        setAnimationInProgress(false);
      }
    };

    animationRef.current = requestAnimationFrame(animateCounter);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sleepEntry, displayedHours]);

  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSaveSleep = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Parse times
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Parse bedtime (assumed to be the previous day)
      const [bedHours, bedMinutes] = bedTime.split(":").map(Number);
      const bedDateTime = new Date(yesterday);
      bedDateTime.setHours(bedHours, bedMinutes, 0, 0);

      // Parse wake time (assumed to be today)
      const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number);
      const wakeDateTime = new Date(today);
      wakeDateTime.setHours(wakeHours, wakeMinutes, 0, 0);

      // If bedtime is after wake time, adjust the day
      if (bedDateTime >= wakeDateTime) {
        bedDateTime.setDate(bedDateTime.getDate() - 1);
      }

      // Calculate hours slept
      const sleepDuration = (wakeDateTime.getTime() - bedDateTime.getTime()) / (1000 * 60 * 60);
      const calculatedHours = parseFloat(sleepDuration.toFixed(1));

      // Create sleep entry
      const newSleepEntry: SleepEntry = {
        hoursSlept: calculatedHours,
        quality: sleepQuality,
        startTime: bedDateTime,
        endTime: wakeDateTime,
      };

      // Save to database
      const success = await addSleep(userId, today, newSleepEntry);

      if (success) {
        // Update local state
        setSleepEntry(newSleepEntry);
        setHoursSlept(calculatedHours);
        setDisplayedHours(calculatedHours);
        previousValueRef.current = calculatedHours;
      }
    } catch (error) {
      console.error("Error saving sleep data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSleepScore = (): number => {
    if (!sleepEntry) return 0;

    // Score based on hours (100% if within 1 hour of target)
    const durationScore = Math.max(0, 100 - Math.abs(sleepEntry.hoursSlept - dailyGoal) * 20);

    // Combine with quality score
    return Math.round(durationScore * 0.7 + sleepEntry.quality * 10 * 0.3);
  };

  const progressPercentage = sleepEntry ? Math.min(100, Math.round((displayedHours / dailyGoal) * 100)) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      {/* Header and blob */}
      <div className="relative overflow-hidden py-6">
        <div className="absolute w-64 h-64 rounded-full bg-[#4CC3FF]/40 blur-[80px] -top-5 z-0" />
        <div className="flex items-center justify-between p-4 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-[#8B5CF6] text-white hover:bg-[#7C3AED] h-10 w-10"
            onClick={() => router.push("/tracker")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Sleep Tracker</h1>
          <Button variant="ghost" size="icon" className="rounded-full bg-transparent text-gray-400 hover:bg-gray-100 h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 py-2 text-center relative z-10">
          <p className="text-sm text-gray-500">
            Quality sleep improves focus, mood,
            <br />
            and overall health. Track your rest.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-1">DAILY SLEEP</h2>
        <p className="text-sm text-gray-500 mb-6">{sleepEntry ? `${displayedHours} out of ${dailyGoal} hours goal` : "No sleep data recorded today"}</p>

        {/* Circular Progress */}
        <div className="relative w-[250px] h-[250px] mb-8">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 250 250">
            <circle cx="125" cy="125" r="110" fill="white" stroke="#EDE9FE" strokeWidth="8" className="drop-shadow-md" />

            {/* Progress circle */}
            <circle
              cx="125"
              cy="125"
              r="110"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="8"
              strokeDasharray="628"
              strokeDashoffset={628 - (628 * progressPercentage) / 100}
              transform="rotate(-90 125 125)"
              className="transition-all duration-1000"
            />

            {/* Percentage text - improved centering for iOS */}
            <text x="125" y="125" textAnchor="middle" dominantBaseline="central" fontSize="44" fontWeight="bold" fill="#000" dy="0.1em">
              {progressPercentage}
            </text>
          </svg>
        </div>

        {/* Progress markers */}
        <div className="w-full max-w-xs flex justify-between items-center mb-4">
          <span className="text-xs text-gray-500">0h</span>
          <span className="text-xs text-gray-500">2h</span>
          <span className="text-xs text-gray-500">4h</span>
          <span className="text-xs text-gray-500">6h</span>
          <span className="text-xs text-gray-500">8h</span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-[#EDE9FE] rounded-full h-2 mb-6">
          <div className="bg-[#8B5CF6] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Sleep quality indicator */}
        <p className="text-sm text-center text-gray-600 mb-8">{sleepEntry ? `Sleep quality: ${sleepQuality}/5` : "No sleep data recorded"}</p>
      </div>

      {/* Sleep Entry Form */}
      <div className="w-full px-6">
        <h3 className="font-semibold mb-3">Log your sleep</h3>

        {/* Bed time and wake time */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bed time</label>
            <div className="relative">
              <MoonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} className="pl-9" disabled={isLoading || animationInProgress} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Wake time</label>
            <div className="relative">
              <SunIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="pl-9" disabled={isLoading || animationInProgress} />
            </div>
          </div>
        </div>

        {/* Sleep quality */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="text-xs text-gray-500">Sleep quality</label>
            <span className="text-xs font-medium">{sleepQuality}/5</span>
          </div>
          <Slider
            value={[sleepQuality]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setSleepQuality(value[0])}
            className="w-full"
            disabled={isLoading || animationInProgress}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Poor</span>
            <span className="text-xs text-gray-500">Excellent</span>
          </div>
        </div>

        <Button className="w-full bg-[#8B5CF6] text-white hover:bg-[#7C3AED]" onClick={handleSaveSleep} disabled={isLoading || animationInProgress}>
          {isLoading ? "Saving..." : "Save sleep data"}
        </Button>
      </div>
      <div className="h-26"></div>
    </div>
  );
}
