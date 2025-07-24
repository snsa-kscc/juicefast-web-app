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
      const total = initialMindfulnessData.mindfulness.reduce((sum, entry) => sum + entry.minutes, 0);

      // Set the actual total minutes value
      setTotalMinutes(total);

      // For initial animation, start from 0
      setDisplayedMinutes(0);
      previousValueRef.current = 0;

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
          setDisplayedMinutes(currentValue);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateCounter);
          } else {
            previousValueRef.current = total;
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
      setMindfulnessEntries([]);
      setTotalMinutes(0);
      setDisplayedMinutes(0);
      previousValueRef.current = 0;
    }
  }, [initialMindfulnessData]);

  // Counter animation effect for when minutes are added (not for initial load)
  useEffect(() => {
    // Skip initial render and only animate when minutes are added
    if (totalMinutes === displayedMinutes || totalMinutes === 0) return;

    // Only animate if this is not the initial animation
    if (previousValueRef.current !== 0 || displayedMinutes !== 0) {
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
    }
  }, [totalMinutes]);

  const handleAddMindfulness = async () => {
    if (minutes <= 0 || !userId || isLoading || animationInProgress) return;

    setIsLoading(true);

    try {
      const today = new Date();
      const dateKey = formatDateKey(today);

      const activity = MINDFULNESS_TRACKER_CONFIG.meditationTypes.find((act: { id: string; label: string }) => act.id === selectedActivity);

      if (!activity) {
        throw new Error("Invalid activity selected");
      }

      const newEntry: MindfulnessEntry = {
        minutes: minutes,
        activity: selectedActivity,
        timestamp: today,
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
    <div className="flex flex-col min-h-screen bg-[#FCFBF8]">
      {/* Header and blob */}
      <div className="relative overflow-hidden py-6">
        <div className="absolute w-64 h-64 rounded-full bg-[#4CC3FF]/40 blur-[80px] -top-5 z-0" />
        <div className="flex items-center justify-between p-4 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-[#FE8E77] text-white hover:bg-[#FFEFEB] h-10 w-10"
            onClick={() => router.push("/tracker")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Mindfulness Tracker</h1>
          <Button variant="ghost" size="icon" className="rounded-full bg-transparent text-gray-400 hover:bg-gray-100 h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 py-2 text-center relative z-10">
          <p className="text-sm text-gray-500">
            Mindfulness practice improves mental clarity,
            <br />
            reduces stress, and enhances well-being.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-1">DAILY MINDFULNESS</h2>
        <p className="text-sm text-gray-500 mb-6">
          {displayedMinutes} out of {dailyGoal} minutes goal
        </p>

        {/* Circular Progress */}
        <div className="relative w-[250px] h-[250px] mb-8">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 250 250">
            <circle cx="125" cy="125" r="110" fill="white" stroke="#FFEFEB" strokeWidth="10" className="drop-shadow-md" />

            {/* Progress circle */}
            <circle
              cx="125"
              cy="125"
              r="110"
              fill="none"
              stroke="#FE8E77"
              strokeWidth="10"
              strokeDasharray="628"
              strokeDashoffset={628 - (628 * progressPercentage) / 100}
              transform="rotate(-90 125 125)"
              className="transition-all duration-1000"
            />

            {/* Percentage text - improved centering for iOS */}
            <text x="125" y="125" textAnchor="middle" dominantBaseline="central" fontSize="52" fontWeight="bold" fill="#000" dy="0.1em">
              {progressPercentage}
            </text>
          </svg>
        </div>

        {/* Progress markers */}
        <div className="w-full max-w-xs flex justify-between items-center mb-4">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-gray-500">5</span>
          <span className="text-xs text-gray-500">10</span>
          <span className="text-xs text-gray-500">15</span>
          <span className="text-xs text-gray-500">20</span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-[#FFEFEB] rounded-full h-2 mb-6">
          <div className="bg-[#FE8E77] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Mindfulness fact */}
        <p className="text-sm text-center text-gray-600 mb-8">Mindfulness improves focus and reduces stress</p>
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
              className={cn("h-auto py-2 px-3 justify-start", selectedActivity === activity.id ? "bg-[#FE8E77] text-white" : "bg-white")}
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

        <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleAddMindfulness} disabled={isLoading || animationInProgress}>
          {isLoading ? "Logging..." : "Add minutes"}
        </Button>
      </div>

      {/* Tips Card */}
      <div className="px-6">
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
      </div>
      <div className="h-10"></div>
    </div>
  );
}
