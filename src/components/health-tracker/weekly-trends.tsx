"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DailyHealthMetrics } from "@/types/health-metrics";
import { getWeeklyMetrics, getWeeklyAverageScore } from "@/app/actions/health-actions";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";

interface WeeklyTrendsProps {
  userId: string;
}

export function WeeklyTrends({ userId }: WeeklyTrendsProps) {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    if (userId) {
      loadWeeklyData(userId);
    }
  }, [userId]);

  const loadWeeklyData = async (userId: string) => {
    try {
      setIsLoading(true);
      const weeklyMetrics = await getWeeklyMetrics(userId);
      const formattedData = formatWeeklyData(weeklyMetrics);
      setWeeklyData(formattedData);
      
      const avgScore = await getWeeklyAverageScore(userId);
      setAverageScore(avgScore);
    } catch (error) {
      console.error("Failed to load weekly data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatWeeklyData = (metrics: DailyHealthMetrics[]) => {
    return metrics.map(day => {
      const date = new Date(day.date);
      return {
        name: format(date, "EEE"),
        date: format(date, "MMM d"),
        score: Math.round(day.totalScore || 0),
        nutrition: Math.round(day.totalScore ? day.totalScore * 0.25 : 0), // Using weight from score calculation
        water: Math.round(day.totalScore ? day.totalScore * 0.15 : 0),
        steps: Math.round(day.totalScore ? day.totalScore * 0.2 : 0),
        sleep: Math.round(day.totalScore ? day.totalScore * 0.25 : 0),
        mindfulness: Math.round(day.totalScore ? day.totalScore * 0.15 : 0),
      };
    }).reverse(); // Reverse to show oldest to newest (left to right)
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{payload[0]?.payload.date}</p>
          <p className="text-sm">Score: <span className="font-medium">{payload[0]?.value}</span></p>
        </div>
      );
    }
    return null;
  };

  // Don't render anything on the server to avoid hydration issues
  if (!isClient) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <span>Weekly Trends</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500">Weekly Average</div>
            <div className="text-2xl font-bold">{Math.round(averageScore)}</div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="score" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-1 text-center text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium">Nutrition</div>
              <div className="text-blue-600">25%</div>
            </div>
            <div className="bg-cyan-50 p-2 rounded">
              <div className="font-medium">Water</div>
              <div className="text-cyan-600">15%</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="font-medium">Steps</div>
              <div className="text-green-600">20%</div>
            </div>
            <div className="bg-indigo-50 p-2 rounded">
              <div className="font-medium">Sleep</div>
              <div className="text-indigo-600">25%</div>
            </div>
            <div className="bg-purple-50 p-2 rounded">
              <div className="font-medium">Mindful</div>
              <div className="text-purple-600">15%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
