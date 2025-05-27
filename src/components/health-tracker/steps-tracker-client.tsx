"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StepEntry, DailyHealthMetrics } from "@/types/health-metrics";
import { ArrowLeft, FootprintsIcon } from "lucide-react";
import { STEPS_TRACKER_CONFIG } from "@/data/steps-tracker";
import { addSteps } from "@/app/actions/health-actions";

interface StepsTrackerClientProps {
  userId: string;
  initialStepsData: DailyHealthMetrics | null;
}

export function StepsTrackerClient({ userId, initialStepsData }: StepsTrackerClientProps) {
  const router = useRouter();
  const [stepCount, setStepCount] = useState<number>(0);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>(initialStepsData?.steps || []);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [dailyGoal] = useState<number>(STEPS_TRACKER_CONFIG.dailyGoal); // Daily step goal
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Initialize with data if available
  useEffect(() => {
    if (initialStepsData?.steps) {
      setStepEntries(initialStepsData.steps);
      
      // Calculate total
      const total = initialStepsData.steps.reduce((sum, entry) => sum + entry.count, 0);
      setTotalSteps(total);
    }
  }, [initialStepsData]);
  
  const handleAddSteps = async () => {
    if (stepCount <= 0 || !userId) return;
    
    try {
      setIsLoading(true);
      
      const newEntry: StepEntry = {
        count: stepCount,
        timestamp: new Date()
      };
      
      // Save to database
      await addSteps(userId, new Date(), newEntry);
      
      // Update local state
      const updatedEntries = [...stepEntries, newEntry];
      const newTotal = totalSteps + stepCount;
      
      setStepEntries(updatedEntries);
      setTotalSteps(newTotal);
      setStepCount(0); // Reset input
    } catch (error) {
      console.error("Failed to save steps data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const progressPercentage = Math.min(100, (totalSteps / dailyGoal) * 100);
  
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
        <h1 className="text-2xl font-bold">Step Tracker</h1>
      </div>
      
      {/* Steps Progress Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <FootprintsIcon className="h-5 w-5 mr-2 text-green-500" />
            Daily Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Daily Progress</span>
            <span className="text-sm font-medium">{totalSteps.toLocaleString()} / {dailyGoal.toLocaleString()} steps</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Steps visualization */}
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-500 mb-2">{totalSteps.toLocaleString()}</div>
              <div className="text-sm text-gray-500">steps today</div>
              
              {/* Step milestone indicators */}
              <div className="flex justify-between mt-4 text-xs text-gray-500">
                <div>0</div>
                {STEPS_TRACKER_CONFIG.stepMilestones.map((milestone, index) => (
                  <div key={index}>{(milestone.steps / 1000).toFixed(1)}k</div>
                ))}
              </div>
              <div className="h-1 bg-gray-200 rounded-full mt-1 mb-2">
                <div 
                  className="h-1 bg-green-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              {/* Estimated calories */}
              <div className="mt-4 text-sm">
                <span className="text-gray-500">Estimated calories: </span>
                <span className="font-medium">{Math.round(totalSteps * STEPS_TRACKER_CONFIG.activityLevels[0].caloriesPerStep)} kcal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Steps Form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="steps" className="text-sm text-gray-500 mb-1 block">
                Enter step count
              </label>
              <div className="flex gap-2">
                <Input
                  id="steps"
                  type="number"
                  min="0"
                  placeholder="Number of steps"
                  value={stepCount || ''}
                  onChange={(e) => setStepCount(parseInt(e.target.value) || 0)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddSteps} 
                  disabled={stepCount <= 0 || isLoading}
                >
                  {isLoading ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
            
            {/* Quick add buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[1000, 2500, 5000].map((count) => (
                <Button 
                  key={count}
                  variant="outline" 
                  size="sm"
                  onClick={() => setStepCount(count)}
                >
                  {count.toLocaleString()} steps
                </Button>
              ))}
            </div>
            
            {/* Achievement indicators */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Today's Progress</h3>
              <div className="space-y-2">
                {STEPS_TRACKER_CONFIG.stepMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${totalSteps >= milestone.steps ? 'bg-green-500' : 'bg-gray-300'}`}
                    ></div>
                    <span className="text-sm">{milestone.achievement}: {milestone.steps.toLocaleString()} steps</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Steps History */}
      {stepEntries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Today's History</h2>
          <div className="space-y-2">
            {stepEntries.slice().reverse().map((entry, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  <FootprintsIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>{entry.count.toLocaleString()} steps</span>
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
