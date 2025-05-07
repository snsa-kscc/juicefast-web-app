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
          "[--progress-background:theme(colors.green.100)]": value >= 80,
          "[--progress-background:theme(colors.yellow.100)]": value >= 60 && value < 80,
          "[--progress-background:theme(colors.red.100)]": value < 60,
        })}
        style={
          {
            "--progress-foreground": `var(--${colorClass.replace("bg-", "")})`,
          } as React.CSSProperties
        }
      />
    );
  };

  // Calculate the stroke-dashoffset for the circle visualization
  const circumference = 2 * Math.PI * 45; // 2πr where r=45
  const strokeDashoffset = circumference - (circumference * score.total) / 100;

  return (
    <Card className="w-full my-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Health Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Health Score Circle Visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={score.total >= 80 ? "#16a34a" : score.total >= 60 ? "#ca8a04" : "#dc2626"}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score.total)}`}>{Math.round(score.total)}</span>
              <span className="text-xs text-gray-500">score</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nutrition</span>
              <span className={getScoreColor(score.nutrition)}>{Math.round(score.nutrition)}</span>
            </div>
            <ScoreProgress value={score.nutrition} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Water</span>
              <span className={getScoreColor(score.water)}>{Math.round(score.water)}</span>
            </div>
            <ScoreProgress value={score.water} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Steps</span>
              <span className={getScoreColor(score.steps)}>{Math.round(score.steps)}</span>
            </div>
            <ScoreProgress value={score.steps} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sleep</span>
              <span className={getScoreColor(score.sleep)}>{Math.round(score.sleep)}</span>
            </div>
            <ScoreProgress value={score.sleep} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mindfulness</span>
              <span className={getScoreColor(score.mindfulness)}>{Math.round(score.mindfulness)}</span>
            </div>
            <ScoreProgress value={score.mindfulness} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
