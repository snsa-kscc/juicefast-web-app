"use client";

import { useState } from "react";
import { MindfulnessEntry, DAILY_TARGETS } from "@/types/health-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain } from "lucide-react";

interface MindfulnessTrackerProps {
  mindfulnessEntries: MindfulnessEntry[];
  onAddMindfulness: (minutes: number, activity: string) => void;
}

export function MindfulnessTracker({ mindfulnessEntries, onAddMindfulness }: MindfulnessTrackerProps) {
  const [minutes, setMinutes] = useState(10);
  const [activity, setActivity] = useState("meditation");
  
  // Calculate total mindfulness minutes for the day
  const totalMinutes = mindfulnessEntries.reduce((sum, entry) => sum + entry.minutes, 0);
  
  // Calculate percentage of daily target
  const percentComplete = Math.min(100, (totalMinutes / DAILY_TARGETS.mindfulness) * 100);
  
  const handleAddMindfulness = () => {
    if (minutes > 0) {
      onAddMindfulness(minutes, activity);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <span>Mindfulness</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-600">{totalMinutes}</span>
            <span className="text-sm text-gray-500 ml-2">/ {DAILY_TARGETS.mindfulness} minutes</span>
          </div>
          
          <Progress value={percentComplete} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minutes</label>
              <Input
                type="number"
                min="1"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity</label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="breathing">Breathing Exercise</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="journaling">Journaling</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            variant="default" 
            className="w-full mt-2 bg-purple-500 hover:bg-purple-600"
            onClick={handleAddMindfulness}
          >
            Log Mindfulness
          </Button>
          
          {mindfulnessEntries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Today's Entries</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mindfulnessEntries.map((entry, index) => (
                  <div key={index} className="flex justify-between text-sm bg-purple-50 p-2 rounded">
                    <div>
                      <span className="font-medium">{entry.minutes} min</span>
                      <span className="text-gray-600 ml-2">{entry.activity}</span>
                    </div>
                    <span className="text-gray-500">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
