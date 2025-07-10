"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { MindfulnessEntry, DailyHealthMetrics, DAILY_TARGETS } from "@/types/health-metrics";
import { formatDateKey } from "@/lib/date-utils";
import { ArrowLeft, BrainIcon, TimerIcon, Settings } from "lucide-react";
import { MINDFULNESS_TRACKER_CONFIG } from "@/data/mindfulness-tracker";
import { addMindfulness } from "@/app/actions/health-actions";
import { cn } from "@/lib/utils";

interface MindfulnessTrackerClientProps {
  userId: string;
  initialMindfulnessData: DailyHealthMetrics | null;
}

export function MindfulnessTrackerClient({ userId, initialMindfulnessData }: MindfulnessTrackerClientProps) {
  const router = useRouter();
  const [minutes, setMinutes] = useState<number>(MINDFULNESS_TRACKER_CONFIG.defaultDuration);
  const [mindfulnessEntries, setMindfulnessEntries] = useState<MindfulnessEntry[]>([]);
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [displayedMinutes, setDisplayedMinutes] = useState<number>(0);
  const [selectedActivity, setSelectedActivity] = useState<string>(MINDFULNESS_TRACKER_CONFIG.meditationTypes[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyGoal] = useState<number>(DAILY_TARGETS.mindfulness);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(false);

  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const previousValueRef = useRef<number>(0);

  // Load initial data
  useEffect(() => {
    if (initialMindfulnessData?.mindfulness) {
      setMindfulnessEntries(initialMindfulnessData.mindfulness);

      // Calculate total minutes
      const total = initialMindfulnessData.mindfulness.reduce(
        (sum, entry) => sum + entry.minutes, 0
      );
      setTotalMinutes(total);
      setDisplayedMinutes(total);
      previousValueRef.current = total;
    }
  }, [initialMindfulnessData]);

  // Counter animation effect
  useEffect(() => {
    if (totalMinutes === displayedMinutes) return;

    setAnimationInProgress(true);
    const startValue = previousValueRef.current;
    const endValue = totalMinutes;
    const duration = 1000; // 1 second animation
    const startTime = performance.now();

    const animateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayedMinutes(Math.round(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateCounter);
      } else {
        setDisplayedMinutes(endValue);
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
  }, [totalMinutes, displayedMinutes]);

  const handleAddMindfulness = async () => {
    if (minutes <= 0 || !userId || isLoading || animationInProgress) return;

    setIsLoading(true);

    try {
      const today = new Date();
      const dateKey = formatDateKey(today);

      const activity = MINDFULNESS_TRACKER_CONFIG.meditationTypes.find(
        (act: { id: string; label: string }) => act.id === selectedActivity
      );

      if (!activity) {
        throw new Error("Invalid activity selected");
      }

      const newEntry: MindfulnessEntry = {
        minutes: minutes,
        activity: selectedActivity,
        timestamp: today
      };

      await addMindfulness(userId, today, newEntry);

      // Update local state
      const updatedEntries = [...mindfulnessEntries, newEntry];
      setMindfulnessEntries(updatedEntries);
      setTotalMinutes(totalMinutes + minutes);

      // Reset form
      setMinutes(MINDFULNESS_TRACKER_CONFIG.defaultDuration);
    } catch (error) {
      console.error("Error adding mindfulness entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.min(100, Math.round((displayedMinutes / dailyGoal) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F7FF]">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-[#3B82F6] text-white hover:bg-[#2563EB] h-10 w-10" 
          onClick={() => router.push('/tracker')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Mindfulness Tracker</h1>
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
          Mindfulness practice improves mental clarity,<br />
          reduces stress, and enhances well-being.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-1">DAILY MINDFULNESS</h2>
        <p className="text-sm text-gray-500 mb-6">
          {displayedMinutes} out of {dailyGoal} minutes goal
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
              stroke="#DBEAFE" 
              strokeWidth="10"
              className="drop-shadow-md"
            />

            {/* Progress circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#3B82F6" 
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
        <div className="w-full max-w-xs bg-[#DBEAFE] rounded-full h-2 mb-6">
          <div 
            className="bg-[#3B82F6] h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Mindfulness fact */}
        <p className="text-sm text-center text-gray-600 mb-8">
          Mindfulness improves focus and reduces stress
        </p>
      </div>

      {/* Add Minutes Form */}
      <div className="w-full px-6">
        <h3 className="font-semibold mb-1">Add minutes</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Minutes</span>
          <span className="text-xs font-medium">{minutes} min</span>
        </div>

        <div className="mb-4">
          <Slider
            value={[minutes]}
            min={1}
            max={60}
            step={1}
            onValueChange={(value) => setMinutes(value[0])}
            className="w-full"
            disabled={isLoading || animationInProgress}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {MINDFULNESS_TRACKER_CONFIG.meditationTypes.slice(0, 4).map((activity: { id: string; label: string; icon?: any }) => (
            <Button
              key={activity.id}
              variant={selectedActivity === activity.id ? "default" : "outline"}
              className={cn(
                "h-auto py-2 px-3 justify-start",
                selectedActivity === activity.id ? "bg-[#3B82F6] text-white" : "bg-white"  
              )}
              onClick={() => setSelectedActivity(activity.id)}
              disabled={isLoading || animationInProgress}
            >
              <div className="flex items-center">
                <BrainIcon className="h-4 w-4 mr-2" />
                <span>{activity.label}</span>
              </div>
            </Button>
          ))}
        </div>

        <Button 
          className="w-full bg-black text-white hover:bg-gray-800" 
          onClick={handleAddMindfulness}
          disabled={isLoading || animationInProgress}
        >
          {isLoading ? "Logging..." : "Add minutes"}
        </Button>
      </div>

      {/* Tips Card */}
      <Card className="w-full mt-6 mb-20">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-2">Mindfulness Tips</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                <BrainIcon className="h-3 w-3" />
              </div>
              <span>Start with just 5 minutes a day and gradually increase</span>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                <BrainIcon className="h-3 w-3" />
              </div>
              <span>Focus on your breath when your mind wanders</span>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                <BrainIcon className="h-3 w-3" />
              </div>
              <span>Practice at the same time each day to build a habit</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
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
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#3B82F6"/>
            </svg>
          </div>
          <span className="text-xs mt-1 text-[#3B82F6] font-medium">Tracker</span>
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
