"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ActivityIcon, 
  Droplets, 
  FootprintsIcon, 
  BedIcon, 
  BrainIcon,
  HeartIcon,
  TrendingUpIcon,
  CalendarIcon,
  UtensilsIcon,
  MessageSquareIcon
} from "lucide-react";
import { 
  DailyHealthMetrics, 
  HealthScore, 
  calculateHealthScore, 
  DAILY_TARGETS 
} from "@/types/health-metrics";
import { formatDateKey, getTodayKey, loadDailyMetrics } from "@/lib/daily-tracking-store";
import { DatePicker } from "@/components/health-tracker/date-picker";
import { HealthScoreCard } from "@/components/health-tracker/health-score-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Generate activity data for the past week
const generateActivityData = (days = 7) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDateKey(date);
    const dailyMetrics = loadDailyMetrics(dateKey);
    
    // Calculate totals for the day
    const steps = dailyMetrics?.steps?.reduce((sum, entry) => sum + entry.count, 0) || 0;
    const water = dailyMetrics?.waterIntake?.reduce((sum, entry) => sum + entry.amount, 0) || 0;
    const calories = dailyMetrics?.meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
    const mindfulness = dailyMetrics?.mindfulness?.reduce((sum, entry) => sum + entry.minutes, 0) || 0;
    const sleep = dailyMetrics?.sleep?.hoursSlept || 0;
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      steps,
      water,
      calories,
      mindfulness,
      sleep,
      fullDate: date
    });
  }
  
  return data;
};

export default function Dashboard() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<DailyHealthMetrics | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [activityTab, setActivityTab] = useState<string>("steps");
  const [activityData, setActivityData] = useState<any[]>([]);
  
  // Load metrics for the selected day
  useEffect(() => {
    const dateKey = formatDateKey(date);
    const dailyMetrics = loadDailyMetrics(dateKey);
    setMetrics(dailyMetrics);
    
    // Calculate health score
    const score = calculateHealthScore(dailyMetrics);
    setHealthScore(score);
    
    // Generate activity data for the graph
    setActivityData(generateActivityData());
  }, [date]);
  
  // Format date for display
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Calculate totals
  const totalWater = metrics?.waterIntake?.reduce((sum, entry) => sum + entry.amount, 0) || 0;
  const totalSteps = metrics?.steps?.reduce((sum, entry) => sum + entry.count, 0) || 0;
  const totalMindfulness = metrics?.mindfulness?.reduce((sum, entry) => sum + entry.minutes, 0) || 0;
  const totalCalories = metrics?.meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
  
  // Calculate percentages for progress bars
  const waterPercentage = Math.min(100, (totalWater / DAILY_TARGETS.water) * 100);
  const stepsPercentage = Math.min(100, (totalSteps / DAILY_TARGETS.steps) * 100);
  const sleepPercentage = metrics?.sleep 
    ? Math.min(100, (metrics.sleep.hoursSlept / DAILY_TARGETS.sleep) * 100) 
    : 0;
  const mindfulnessPercentage = Math.min(100, (totalMindfulness / DAILY_TARGETS.mindfulness) * 100);
  const caloriesPercentage = Math.min(100, (totalCalories / DAILY_TARGETS.calories) * 100);
  
  // Handle date change
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };
  
  return (
    <div className="py-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DatePicker 
            selectedDate={date} 
            onDateChange={handleDateChange} 
          />
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => router.push('/tracker')}
          >
            <TrendingUpIcon className="h-4 w-4" />
            Track
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => router.push('/nutritionist')}
          >
            <MessageSquareIcon className="h-4 w-4" />
            Chat with Nutritionist
          </Button>
        </div>
      </div>
      
      {/* Health Score Card */}
      {healthScore && (
        <HealthScoreCard score={healthScore} />
      )}
      
      {/* Activity Graph */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activityTab} onValueChange={setActivityTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="steps" className="text-xs">
                <FootprintsIcon className="h-4 w-4 mr-1" />
                Steps
              </TabsTrigger>
              <TabsTrigger value="water" className="text-xs">
                <Droplets className="h-4 w-4 mr-1" />
                Water
              </TabsTrigger>
              <TabsTrigger value="calories" className="text-xs">
                <UtensilsIcon className="h-4 w-4 mr-1" />
                Calories
              </TabsTrigger>
              <TabsTrigger value="sleep" className="text-xs">
                <BedIcon className="h-4 w-4 mr-1" />
                Sleep
              </TabsTrigger>
              <TabsTrigger value="mindfulness" className="text-xs">
                <BrainIcon className="h-4 w-4 mr-1" />
                Mind
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="steps" className="mt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="steps" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="water" className="mt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="calories" className="mt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="sleep" className="mt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sleep" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="mindfulness" className="mt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="mindfulness" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Nutrition Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/tracker/meals')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <UtensilsIcon className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium">{totalCalories} / {DAILY_TARGETS.calories}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Calories</span>
                <span>{Math.round(caloriesPercentage)}%</span>
              </div>
              <Progress value={caloriesPercentage} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        {/* Water Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/tracker/water')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">{totalWater} / {DAILY_TARGETS.water} ml</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hydration</span>
                <span>{Math.round(waterPercentage)}%</span>
              </div>
              <Progress value={waterPercentage} className="h-1.5 bg-blue-100" />
            </div>
          </CardContent>
        </Card>
        
        {/* Steps Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/tracker/steps')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FootprintsIcon className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium">{totalSteps.toLocaleString()} / {DAILY_TARGETS.steps.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Steps</span>
                <span>{Math.round(stepsPercentage)}%</span>
              </div>
              <Progress value={stepsPercentage} className="h-1.5 bg-green-100" />
            </div>
          </CardContent>
        </Card>
        
        {/* Sleep Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/tracker/sleep')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <BedIcon className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium">
                {metrics?.sleep ? `${metrics.sleep.hoursSlept} / ${DAILY_TARGETS.sleep} hrs` : 'Not logged'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sleep</span>
                <span>{metrics?.sleep ? `${Math.round(sleepPercentage)}%` : '--'}</span>
              </div>
              <Progress value={sleepPercentage} className="h-1.5 bg-purple-100" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Mindfulness Card */}
      <Card className="mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/tracker/mindfulness')}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <BrainIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium">Mindfulness</h3>
                <p className="text-xs text-gray-500">Daily meditation practice</p>
              </div>
            </div>
            <span className="text-sm font-medium">{totalMindfulness} / {DAILY_TARGETS.mindfulness} min</span>
          </div>
          <Progress value={mindfulnessPercentage} className="h-1.5 bg-indigo-100" />
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-3 justify-start"
          onClick={() => router.push('/tracker/meals')}
        >
          <UtensilsIcon className="h-5 w-5 mr-2 text-orange-600" />
          <div className="text-left">
            <div className="font-medium">Log Meal</div>
            <div className="text-xs text-gray-500">Track your nutrition</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-3 justify-start"
          onClick={() => router.push('/tracker/water')}
        >
          <Droplets className="h-5 w-5 mr-2 text-blue-600" />
          <div className="text-left">
            <div className="font-medium">Add Water</div>
            <div className="text-xs text-gray-500">Track hydration</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-3 justify-start"
          onClick={() => router.push('/tracker/steps')}
        >
          <FootprintsIcon className="h-5 w-5 mr-2 text-green-600" />
          <div className="text-left">
            <div className="font-medium">Log Steps</div>
            <div className="text-xs text-gray-500">Track activity</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-3 justify-start"
          onClick={() => router.push('/wellness')}
        >
          <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
          <div className="text-left">
            <div className="font-medium">Wellness</div>
            <div className="text-xs text-gray-500">Health articles</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
