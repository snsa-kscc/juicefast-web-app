"use client";

import { HealthScore } from "@/types/health-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HealthScoreCardProps {
  score: HealthScore;
}

export function HealthScoreCard({ score }: HealthScoreCardProps) {
  // Function to get color based on score value
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Function to get progress color based on score value
  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-600";
    if (value >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };
  
  // Custom styled Progress component based on score
  const ScoreProgress = ({ value }: { value: number }) => {
    const colorClass = getProgressColor(value);
    return (
      <Progress 
        value={value} 
        className={cn("h-2", {
          "[--progress-background:theme(colors.green.100)]" : value >= 80,
          "[--progress-background:theme(colors.yellow.100)]" : value >= 60 && value < 80,
          "[--progress-background:theme(colors.red.100)]" : value < 60
        })}
        style={{
          "--progress-foreground": `var(--${colorClass.replace('bg-', '')})`,
        } as React.CSSProperties}
      />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Health Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score.total)}`}>
            {Math.round(score.total)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nutrition</span>
              <span className={getScoreColor(score.nutrition)}>
                {Math.round(score.nutrition)}
              </span>
            </div>
            <ScoreProgress value={score.nutrition} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Water</span>
              <span className={getScoreColor(score.water)}>
                {Math.round(score.water)}
              </span>
            </div>
            <ScoreProgress value={score.water} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Steps</span>
              <span className={getScoreColor(score.steps)}>
                {Math.round(score.steps)}
              </span>
            </div>
            <ScoreProgress value={score.steps} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sleep</span>
              <span className={getScoreColor(score.sleep)}>
                {Math.round(score.sleep)}
              </span>
            </div>
            <ScoreProgress value={score.sleep} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mindfulness</span>
              <span className={getScoreColor(score.mindfulness)}>
                {Math.round(score.mindfulness)}
              </span>
            </div>
            <ScoreProgress value={score.mindfulness} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
