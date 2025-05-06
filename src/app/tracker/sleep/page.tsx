"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SleepEntry } from "@/types/health-metrics";
import { formatDateKey, getTodayKey, loadDailyMetrics, saveDailyMetrics } from "@/lib/daily-tracking-store";
import { ArrowLeft, BedIcon, MoonIcon, SunIcon } from "lucide-react";

export default function SleepTrackerPage() {
  const router = useRouter();
  const [sleepEntry, setSleepEntry] = useState<SleepEntry | null>(null);
  const [sleepHours, setSleepHours] = useState<number>(8);
  const [sleepQuality, setSleepQuality] = useState<number>(7);
  const [bedTime, setBedTime] = useState<string>("22:30");
  const [wakeTime, setWakeTime] = useState<string>("06:30");
  const [dailyGoal] = useState<number>(8); // 8 hours daily goal
  
  // Load sleep entry on mount
  useEffect(() => {
    const todayKey = getTodayKey();
    const dailyMetrics = loadDailyMetrics(todayKey);
    
    if (dailyMetrics.sleep) {
      setSleepEntry(dailyMetrics.sleep);
      setSleepHours(dailyMetrics.sleep.hoursSlept);
      setSleepQuality(dailyMetrics.sleep.quality);
      
      // Format times for input
      const bedTimeDate = new Date(dailyMetrics.sleep.startTime);
      const wakeTimeDate = new Date(dailyMetrics.sleep.endTime);
      
      setBedTime(formatTimeForInput(bedTimeDate));
      setWakeTime(formatTimeForInput(wakeTimeDate));
    }
  }, []);
  
  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const handleSaveSleep = () => {
    const todayKey = getTodayKey();
    const dailyMetrics = loadDailyMetrics(todayKey);
    
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
    
    setSleepEntry(newSleepEntry);
    
    // Update storage
    saveDailyMetrics(todayKey, {
      ...dailyMetrics,
      sleep: newSleepEntry
    });
  };
  
  const calculateSleepScore = (): number => {
    if (!sleepEntry) return 0;
    
    // Score based on hours (100% if within 1 hour of target)
    const durationScore = Math.max(0, 100 - Math.abs(sleepEntry.hoursSlept - dailyGoal) * 20);
    
    // Combine with quality score
    return Math.round(durationScore * 0.7 + sleepEntry.quality * 10 * 0.3);
  };
  
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
        <h1 className="text-2xl font-bold">Sleep Tracker</h1>
      </div>
      
      {/* Sleep Summary Card */}
      {sleepEntry && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <BedIcon className="h-5 w-5 mr-2 text-purple-500" />
              Sleep Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-500 mb-2">{sleepEntry.hoursSlept}</div>
                <div className="text-sm text-gray-500">hours of sleep</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Quality</div>
                <div className="font-medium">{sleepEntry.quality}/10</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Score</div>
                <div className="font-medium">{calculateSleepScore()}/100</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Goal</div>
                <div className="font-medium">{dailyGoal} hrs</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <MoonIcon className="h-4 w-4 mr-1 text-indigo-400" />
                <span>{new Date(sleepEntry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="h-0.5 flex-grow mx-2 bg-gray-200 relative">
                <div className="absolute inset-y-0 left-0 bg-purple-400" style={{ width: `${(sleepEntry.hoursSlept / 12) * 100}%` }}></div>
              </div>
              <div className="flex items-center">
                <SunIcon className="h-4 w-4 mr-1 text-amber-400" />
                <span>{new Date(sleepEntry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Sleep Entry Form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Log Your Sleep</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Hours of Sleep
              </label>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm">{sleepHours} hours</span>
                <Slider
                  value={[sleepHours]}
                  min={1}
                  max={12}
                  step={0.5}
                  onValueChange={(value) => setSleepHours(value[0])}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Sleep Quality (1-10)
              </label>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm">{sleepQuality}/10</span>
                <Slider
                  value={[sleepQuality]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setSleepQuality(value[0])}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bedtime" className="text-sm text-gray-500 mb-1 block">
                  Bed Time
                </label>
                <div className="flex items-center">
                  <MoonIcon className="h-4 w-4 mr-2 text-indigo-400" />
                  <Input
                    id="bedtime"
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="waketime" className="text-sm text-gray-500 mb-1 block">
                  Wake Time
                </label>
                <div className="flex items-center">
                  <SunIcon className="h-4 w-4 mr-2 text-amber-400" />
                  <Input
                    id="waketime"
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleSaveSleep}
            >
              Save Sleep Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Sleep Tips */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sleep Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-0.5">
                <BedIcon className="h-3 w-3" />
              </div>
              <span>Aim for 7-9 hours of sleep consistently</span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-0.5">
                <BedIcon className="h-3 w-3" />
              </div>
              <span>Keep a consistent sleep schedule, even on weekends</span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-0.5">
                <BedIcon className="h-3 w-3" />
              </div>
              <span>Avoid screens 1 hour before bedtime</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
