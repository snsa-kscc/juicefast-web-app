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
  MessageSquareIcon,
} from "lucide-react";
import { DailyHealthMetrics, HealthScore, DAILY_TARGETS } from "@/types/health-metrics";
import { DatePicker } from "@/components/health-tracker/date-picker";
import { HealthScoreCard } from "@/components/health-tracker/health-score-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDateKey } from "@/lib/date-utils";

interface DashboardClientProps {
  userId: string;
  initialWeeklyData: any[];
  initialAverageScore: number;
}

export function DashboardClient({ userId, initialWeeklyData, initialAverageScore }: DashboardClientProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activityData, setActivityData] = useState(initialWeeklyData);
  const [averageScore, setAverageScore] = useState(initialAverageScore);
  const [activeTab, setActiveTab] = useState("overview");

  // Navigate to specific tracker
  const navigateToTracker = (tracker: string) => {
    router.push(`/tracker/${tracker}?userId=${userId}`);
  };

  // Format percentage for progress bars
  const formatPercentage = (value: number, target: number) => {
    return Math.min(100, Math.round((value / target) * 100));
  };

  // Get today's data
  const todayData = activityData.find(
    (day) => formatDateKey(day.fullDate) === formatDateKey(new Date())
  ) || {
    steps: 0,
    water: 0,
    calories: 0,
    mindfulness: 0,
    sleep: 0,
  };

  return (
    <div className="container py-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
          <p className="text-gray-500">Track your daily health metrics and progress</p>
        </div>
        <div className="mt-4 md:mt-0">
          <DatePicker 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
            userId={userId}
          />
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview">
            <HeartIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="nutrition">
            <UtensilsIcon className="h-4 w-4 mr-2" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="activity">
            <ActivityIcon className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUpIcon className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HealthScoreCard score={{
              total: averageScore,
              nutrition: Math.round(averageScore * 0.8),
              water: Math.round(averageScore * 0.9),
              steps: Math.round(averageScore * 0.7),
              sleep: Math.round(averageScore * 0.85),
              mindfulness: Math.round(averageScore * 0.75)
            }} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Steps</span>
                    <span className="text-sm text-gray-500">
                      {todayData.steps} / {DAILY_TARGETS.steps}
                    </span>
                  </div>
                  <Progress value={formatPercentage(todayData.steps, DAILY_TARGETS.steps)} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Water</span>
                    <span className="text-sm text-gray-500">
                      {todayData.water}ml / {DAILY_TARGETS.water}ml
                    </span>
                  </div>
                  <Progress value={formatPercentage(todayData.water, DAILY_TARGETS.water)} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Sleep</span>
                    <span className="text-sm text-gray-500">
                      {todayData.sleep}hrs / {DAILY_TARGETS.sleep}hrs
                    </span>
                  </div>
                  <Progress value={formatPercentage(todayData.sleep, DAILY_TARGETS.sleep)} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Mindfulness</span>
                    <span className="text-sm text-gray-500">
                      {todayData.mindfulness}min / {DAILY_TARGETS.mindfulness}min
                    </span>
                  </div>
                  <Progress value={formatPercentage(todayData.mindfulness, DAILY_TARGETS.mindfulness)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToTracker("meals")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <UtensilsIcon className="h-8 w-8 text-orange-500 mb-2" />
                <h3 className="font-medium">Meals</h3>
                <p className="text-sm text-gray-500">{todayData.calories} kcal</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToTracker("water")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium">Water</h3>
                <p className="text-sm text-gray-500">{todayData.water} ml</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToTracker("steps")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <FootprintsIcon className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium">Steps</h3>
                <p className="text-sm text-gray-500">{todayData.steps} steps</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigateToTracker("sleep")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <BedIcon className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-medium">Sleep</h3>
                <p className="text-sm text-gray-500">{todayData.sleep} hours</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="steps"
                      stroke="#10b981"
                      name="Steps"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="water"
                      stroke="#3b82f6"
                      name="Water (ml)"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="sleep"
                      stroke="#8b5cf6"
                      name="Sleep (hrs)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="#f97316"
                      name="Calories"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="steps"
                      stroke="#10b981"
                      name="Steps"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="mindfulness"
                      stroke="#6366f1"
                      name="Mindfulness (min)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.push("/tracker")}
        >
          <CalendarIcon className="h-4 w-4" />
          Go to Trackers
        </Button>
      </div>
    </div>
  );
}
