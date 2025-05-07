"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { WaterIntake } from "@/types/health-metrics";
import { formatDateKey, getTodayKey, loadDailyMetrics, saveDailyMetrics } from "@/lib/daily-tracking-store";
import { ArrowLeft, Droplets, Plus, Minus } from "lucide-react";
import { WATER_TRACKER_CONFIG } from "@/data/water-tracker";

export default function WaterTrackerPage() {
  const router = useRouter();
  const [waterAmount, setWaterAmount] = useState<number>(WATER_TRACKER_CONFIG.defaultAmount);
  const [waterEntries, setWaterEntries] = useState<WaterIntake[]>([]);
  const [totalWater, setTotalWater] = useState<number>(0);
  const [dailyGoal] = useState<number>(WATER_TRACKER_CONFIG.dailyGoal);
  
  // Load water entries on mount
  useEffect(() => {
    const todayKey = getTodayKey();
    const dailyMetrics = loadDailyMetrics(todayKey);
    setWaterEntries(dailyMetrics.waterIntake || []);
    
    // Calculate total
    const total = (dailyMetrics.waterIntake || []).reduce((sum, entry) => sum + entry.amount, 0);
    setTotalWater(total);
  }, []);
  
  const handleAddWater = () => {
    const todayKey = getTodayKey();
    const dailyMetrics = loadDailyMetrics(todayKey);
    
    const newEntry: WaterIntake = {
      amount: waterAmount,
      timestamp: new Date()
    };
    
    const updatedEntries = [...(dailyMetrics.waterIntake || []), newEntry];
    const newTotal = totalWater + waterAmount;
    
    setWaterEntries(updatedEntries);
    setTotalWater(newTotal);
    
    // Update storage
    saveDailyMetrics(todayKey, {
      ...dailyMetrics,
      waterIntake: updatedEntries
    });
  };
  
  const progressPercentage = Math.min(100, (totalWater / dailyGoal) * 100);
  
  return (
    <div className="py-6 font-sans">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2 p-0 h-9 w-9" 
          onClick={() => router.push('/tracker')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Water Tracker</h1>
      </div>
      
      {/* Water Progress Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-blue-500" />
            Water Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Daily Progress</span>
            <span className="text-sm font-medium">{totalWater} / {dailyGoal} ml</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Water bottle visualization */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-48 border-2 border-blue-400 rounded-b-xl overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-500"
                style={{ height: `${progressPercentage}%` }}
              ></div>
              
              {/* Water level marks */}
              <div className="absolute inset-0">
                {[0, 25, 50, 75].map((level) => (
                  <div 
                    key={level} 
                    className="absolute w-2 h-0.5 bg-blue-200 left-0"
                    style={{ bottom: `${level}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Water Form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add Water</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Amount (ml)</span>
                <span className="text-sm font-medium">{waterAmount} ml</span>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setWaterAmount(Math.max(WATER_TRACKER_CONFIG.minAmount, waterAmount - WATER_TRACKER_CONFIG.stepSize))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <Slider
                  value={[waterAmount]}
                  min={WATER_TRACKER_CONFIG.minAmount}
                  max={WATER_TRACKER_CONFIG.maxAmount}
                  step={WATER_TRACKER_CONFIG.stepSize}
                  onValueChange={(value) => setWaterAmount(value[0])}
                  className="flex-1"
                />
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setWaterAmount(Math.min(WATER_TRACKER_CONFIG.maxAmount, waterAmount + WATER_TRACKER_CONFIG.stepSize))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Quick add buttons */}
            <div className="grid grid-cols-3 gap-2">
              {WATER_TRACKER_CONFIG.quickAddAmounts.map((amount) => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setWaterAmount(amount)}
                  className={waterAmount === amount ? "border-blue-500 text-blue-500" : ""}
                >
                  {amount} ml
                </Button>
              ))}
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleAddWater}
            >
              Add Water
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Water History */}
      {waterEntries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Today's History</h2>
          <div className="space-y-2">
            {waterEntries.slice().reverse().map((entry, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{entry.amount} ml</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
