"use client";

import { useState } from "react";
import { SleepEntry, DAILY_TARGETS } from "@/types/health-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Moon } from "lucide-react";

interface SleepTrackerProps {
  sleepEntry?: SleepEntry;
  onAddSleep: (hours: number, quality: number, startTime: Date, endTime: Date) => void;
}

export function SleepTracker({ sleepEntry, onAddSleep }: SleepTrackerProps) {
  const [hours, setHours] = useState(8);
  const [quality, setQuality] = useState(7);
  const [startTime, setStartTime] = useState("22:00");
  const [endTime, setEndTime] = useState("06:00");
  
  const handleAddSleep = () => {
    // Create Date objects for start and end times
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDate = new Date(today);
    startDate.setHours(startHour, startMinute);
    
    // If end time is earlier than start time, it's the next day
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const endDate = new Date(today);
    endDate.setHours(endHour, endMinute);
    
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    onAddSleep(hours, quality, startDate, endDate);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo-500" />
          <span>Sleep</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sleepEntry ? (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-indigo-600">{sleepEntry.hoursSlept}h</span>
              <span className="text-sm text-gray-500 ml-2">/ {DAILY_TARGETS.sleep}h target</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Sleep Quality</div>
                <div className="font-medium">{sleepEntry.quality}/10</div>
              </div>
              
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Sleep Time</div>
                <div className="font-medium">
                  {new Date(sleepEntry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(sleepEntry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onAddSleep(0, 0, new Date(), new Date())} // Passing zeros will clear the entry
            >
              Reset Sleep Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hours Slept</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[hours]}
                  min={0}
                  max={12}
                  step={0.5}
                  onValueChange={(value) => setHours(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{hours}h</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sleep Quality (1-10)</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[quality]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setQuality(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{quality}/10</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedtime</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Wake Time</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              variant="default" 
              className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600"
              onClick={handleAddSleep}
            >
              Log Sleep
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
