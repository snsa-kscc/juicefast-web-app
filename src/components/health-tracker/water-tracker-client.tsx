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
      setTotalWater(total);
      setDisplayedTotal(total);
      previousTotalRef.current = total;
    }
  }, [initialWaterData]);
  
  // Counter animation effect
  useEffect(() => {
    if (totalWater === displayedTotal) return;
    
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
        setDisplayedTotal(endValue);
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
  }, [totalWater, displayedTotal]);
  
  const handleAddWater = async () => {
    if (!userId || isLoading || animationInProgress) return;
    
    try {
      setIsLoading(true);
      
      const newEntry: WaterIntake = {
        amount: waterAmount,
        timestamp: new Date()
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
    <div className="flex flex-col min-h-screen bg-[#F0F9FF]">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-[#3BB9FF] text-white hover:bg-[#2AA8EE] h-10 w-10" 
          onClick={() => router.push('/tracker')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Water Tracker</h1>
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
          Hydration fuels your focus, energy<br />
          and digestion. Keep it flowing.
        </p>
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
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="white" 
              stroke="#E6F4FF" 
              strokeWidth="10"
              className="drop-shadow-md"
            />
            
            {/* Progress circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#3BB9FF" 
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercentage / 100)}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000"
            />
            
            {/* Water amount text */}
            <text 
              x="50" 
              y="45" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="28"
              fontWeight="bold"
              fill="#000"
            >
              {formatWaterAmount(displayedTotal).replace('ml', '')}
            </text>
            
            {/* Unit text */}
            <text 
              x="50" 
              y="65" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="14"
              fill="#666"
            >
              {displayedTotal >= 1000 ? 'L' : 'ml'}
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
          <div 
            className="bg-[#3BB9FF] h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Water fact */}
        <p className="text-sm text-center text-gray-600 mb-8">
          Your body is {progressPercentage}% water. You're<br />
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
        
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800" 
          onClick={handleAddWater}
          disabled={isLoading || animationInProgress}
        >
          {isLoading ? "Adding..." : "Add water"}
        </Button>
      </div>
      
      {/* Tips Card */}
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
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#3BB9FF"/>
            </svg>
          </div>
          <span className="text-xs mt-1 text-[#3BB9FF] font-medium">Tracker</span>
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
