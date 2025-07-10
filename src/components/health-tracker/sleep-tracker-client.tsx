"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SleepEntry, DailyHealthMetrics } from "@/types/health-metrics";
import { formatDateKey } from "@/lib/date-utils";
import { ArrowLeft, BedIcon, MoonIcon, SunIcon, Settings } from "lucide-react";
import { SLEEP_TRACKER_CONFIG } from "@/data/sleep-tracker";
import { addSleep } from "@/app/actions/health-actions";

interface SleepTrackerClientProps {
  userId: string;
  initialSleepData: DailyHealthMetrics | null;
}

export function SleepTrackerClient({ userId, initialSleepData }: SleepTrackerClientProps) {
  const router = useRouter();
  const [sleepEntry, setSleepEntry] = useState<SleepEntry | null>(initialSleepData?.sleep || null);
  const [sleepHours, setSleepHours] = useState<number>(SLEEP_TRACKER_CONFIG.dailyGoal);
  const [displayedHours, setDisplayedHours] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(7);
  const [bedTime, setBedTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultBedtime);
  const [wakeTime, setWakeTime] = useState<string>(SLEEP_TRACKER_CONFIG.defaultWakeTime);
  const [dailyGoal] = useState<number>(SLEEP_TRACKER_CONFIG.dailyGoal); // Daily sleep goal
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(false);
  
  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const previousValueRef = useRef<number>(0);
  
  // Initialize form with data if available
  useEffect(() => {
    if (initialSleepData?.sleep) {
      setSleepEntry(initialSleepData.sleep);
      setSleepHours(initialSleepData.sleep.hoursSlept);
      setDisplayedHours(initialSleepData.sleep.hoursSlept);
      setSleepQuality(initialSleepData.sleep.quality);
      previousValueRef.current = initialSleepData.sleep.hoursSlept;
      
      // Format times for input
      const bedTimeDate = new Date(initialSleepData.sleep.startTime);
      const wakeTimeDate = new Date(initialSleepData.sleep.endTime);
      
      setBedTime(formatTimeForInput(bedTimeDate));
      setWakeTime(formatTimeForInput(wakeTimeDate));
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
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
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
      
      const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
      const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
      
      // Assume bedtime is from yesterday if it's after wake time
      const bedTimeDate = new Date(today);
      bedTimeDate.setHours(bedHours, bedMinutes, 0, 0);
      
      const wakeTimeDate = new Date(today);
      wakeTimeDate.setHours(wakeHours, wakeMinutes, 0, 0);
      
      // If bedtime is after wake time, assume bedtime was yesterday
      if (bedTimeDate > wakeTimeDate) {
        bedTimeDate.setDate(bedTimeDate.getDate() - 1);
      }
      
      const newSleepEntry: SleepEntry = {
        hoursSlept: sleepHours,
        quality: sleepQuality,
        startTime: bedTimeDate,
        endTime: wakeTimeDate
      };
      
      // Save to database
      await addSleep(userId, today, newSleepEntry);
      
      // Update local state
      setSleepEntry(newSleepEntry);
    } catch (error) {
      console.error("Failed to save sleep data:", error);
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
    <div className="flex flex-col min-h-screen bg-[#F5F3FF]">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-[#8B5CF6] text-white hover:bg-[#7C3AED] h-10 w-10" 
          onClick={() => router.push('/tracker')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Sleep Tracker</h1>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-transparent text-gray-400 hover:bg-gray-100 h-10 w-10" 
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Description */}
      <div className="px-6 py-2 text-center">
        <p className="text-sm text-gray-500">
          Quality sleep improves focus, mood,<br />
          and overall health. Track your rest.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-1">DAILY SLEEP</h2>
        <p className="text-sm text-gray-500 mb-6">
          {sleepEntry ? `${displayedHours} out of ${dailyGoal} hours goal` : "No sleep data recorded today"}
        </p>
        
        {/* Circular Progress */}
        <div className="relative w-52 h-52 mb-8">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="white" 
              stroke="#EDE9FE" 
              strokeWidth="10"
              className="drop-shadow-md"
            />
            
            {/* Progress circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercentage / 100)}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000"
            />
            
            {/* Percentage text */}
            <text 
              x="50" 
              y="50" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="28"
              fontWeight="bold"
              fill="#000"
            >
              {progressPercentage}
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
        <div className="w-full max-w-xs bg-[#EDE9FE] rounded-full h-2 mb-6">
          <div 
            className="bg-[#8B5CF6] h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Sleep fact */}
        <p className="text-sm text-center text-gray-600 mb-8">
          Estimated calories: 245 kcal
        </p>
      </div>
      
      {/* Add Steps Form */}
      <div className="w-full px-6">
        <h3 className="font-semibold mb-1">Add steps</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Steps</span>
          <span className="text-xs font-medium">{sleepHours * 1000} steps</span>
        </div>
        
        <div className="mb-4">
          <Slider
            value={[sleepHours]}
            min={1}
            max={10}
            step={0.5}
            onValueChange={(value) => setSleepHours(value[0])}
            className="w-full"
            disabled={isLoading || animationInProgress}
          />
        </div>
        
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800" 
          onClick={handleSaveSleep}
          disabled={isLoading || animationInProgress}
        >
          {isLoading ? "Saving..." : "Add steps"}
        </Button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
        <button className="flex flex-col items-center justify-center w-16 py-1">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 20V14H15V20H19V12H22L12 3L2 12H5V20H9Z" fill="#CCCCCC"/>
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-500">Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 py-1">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#8B5CF6"/>
            </svg>
          </div>
          <span className="text-xs mt-1 text-[#8B5CF6] font-medium">Tracker</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 py-1">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="#CCCCCC"/>
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-500">Store</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 py-1">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="#CCCCCC"/>
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-500">Chat</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 py-1">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#CCCCCC"/>
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-500">AI Gab</span>
        </button>
      </div>
    </div>
  );
}
