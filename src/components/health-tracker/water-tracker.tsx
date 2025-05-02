"use client";

import { useState } from "react";
import { WaterIntake, DAILY_TARGETS } from "@/types/health-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Minus, Droplets } from "lucide-react";

interface WaterTrackerProps {
  waterEntries: WaterIntake[];
  onAddWater: (amount: number) => void;
}

export function WaterTracker({ waterEntries, onAddWater }: WaterTrackerProps) {
  const [customAmount, setCustomAmount] = useState(250); // Default 250ml
  
  // Calculate total water intake for the day
  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);
  
  // Calculate percentage of daily target
  const percentComplete = Math.min(100, (totalWater / DAILY_TARGETS.water) * 100);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <span>Water Intake</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-600">{totalWater}ml</span>
            <span className="text-sm text-gray-500 ml-2">/ {DAILY_TARGETS.water}ml</span>
          </div>
          
          <Progress value={percentComplete} className="h-2" />
          
          <div className="flex justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddWater(250)}
              className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              +250ml
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddWater(500)}
              className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              +500ml
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddWater(1000)}
              className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              +1L
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCustomAmount(prev => Math.max(50, prev - 50))}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <span className="text-sm font-medium">{customAmount}ml</span>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCustomAmount(prev => prev + 50)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onAddWater(customAmount)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Add
            </Button>
          </div>
          
          {waterEntries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Today's Entries</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {waterEntries.map((entry, index) => (
                  <div key={index} className="flex justify-between text-sm bg-blue-50 p-2 rounded">
                    <span>{entry.amount}ml</span>
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
