"use client";

import { useState } from "react";
import { StepEntry, DAILY_TARGETS } from "@/types/health-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { FootprintsIcon } from "lucide-react";

interface StepsTrackerProps {
  stepEntries: StepEntry[];
  onAddSteps: (count: number) => void;
}

export function StepsTracker({ stepEntries, onAddSteps }: StepsTrackerProps) {
  const [stepCount, setStepCount] = useState(1000);
  
  // Calculate total steps for the day
  const totalSteps = stepEntries.reduce((sum, entry) => sum + entry.count, 0);
  
  // Calculate percentage of daily target
  const percentComplete = Math.min(100, (totalSteps / DAILY_TARGETS.steps) * 100);
  
  const handleAddSteps = () => {
    if (stepCount > 0) {
      onAddSteps(stepCount);
      setStepCount(1000); // Reset to default
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FootprintsIcon className="h-5 w-5 text-green-500" />
          <span>Steps</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-3xl font-bold text-green-600">{totalSteps.toLocaleString()}</span>
            <span className="text-sm text-gray-500 ml-2">/ {DAILY_TARGETS.steps.toLocaleString()}</span>
          </div>
          
          <Progress value={percentComplete} className="h-2" />
          
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="number"
              min="1"
              value={stepCount}
              onChange={(e) => setStepCount(parseInt(e.target.value) || 0)}
              className="flex-1"
            />
            <Button 
              variant="default" 
              onClick={handleAddSteps}
              className="bg-green-500 hover:bg-green-600"
            >
              Add Steps
            </Button>
          </div>
          
          <div className="flex justify-center gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddSteps(500)}
              className="border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              +500
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddSteps(1000)}
              className="border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              +1,000
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddSteps(5000)}
              className="border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              +5,000
            </Button>
          </div>
          
          {stepEntries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Today's Entries</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {stepEntries.map((entry, index) => (
                  <div key={index} className="flex justify-between text-sm bg-green-50 p-2 rounded">
                    <span>{entry.count.toLocaleString()} steps</span>
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
