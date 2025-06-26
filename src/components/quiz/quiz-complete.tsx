"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { QuizAnswer } from "../onboarding-quiz";
import { quizQuestions } from "@/data/quiz-questions";

interface QuizCompleteProps {
  answers: QuizAnswer[];
  onReset: () => void;
  onSkip: () => void;
  onComplete?: () => void;
}

export function QuizComplete({ answers, onReset, onSkip, onComplete }: QuizCompleteProps) {
  // Get question titles for display
  const getQuestionTitle = (questionId: string) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    return question?.title || questionId;
  };

  // Format answer for display
  const formatAnswer = (answer: string | string[] | number, questionId: string) => {
    const question = quizQuestions.find((q) => q.id === questionId);

    if (!question) return String(answer);

    // Handle slider values
    if (question.type === "slider" && typeof answer === "number") {
      return `${answer} ${question.unit || ""}`;
    }

    if (Array.isArray(answer)) {
      if (question.type === "multiple" && question.options) {
        return answer
          .map((a) => {
            const option = question.options?.find((o) => o.value === a);
            return option?.label || a;
          })
          .join(", ");
      }
      return answer.join(", ");
    }

    if (question.type === "single" && question.options) {
      const option = question.options.find((o) => o.value === answer);
      return option?.label || String(answer);
    }

    return String(answer);
  };

  // Generate personalized wellness recommendations based on answers
  const getRecommendations = () => {
    const recommendations: { title: string; description: string; icon: string }[] = [];

    // Goal-based recommendation
    const goalAnswer = answers.find((a) => a.questionId === "goal")?.answer as string;
    if (goalAnswer) {
      switch (goalAnswer) {
        case "lose_weight":
          recommendations.push({
            title: "Weight Loss Journey",
            description: "Focus on creating a sustainable calorie deficit through balanced nutrition and regular exercise. Track your meals to stay on target.",
            icon: "⬇️"
          });
          break;
        case "gain_weight":
          recommendations.push({
            title: "Healthy Weight Gain",
            description: "Increase your caloric intake with nutrient-dense foods. Include protein-rich meals and strength training exercises.",
            icon: "⬆️"
          });
          break;
        case "build_muscle":
          recommendations.push({
            title: "Muscle Building Plan",
            description: "Prioritize protein intake (1.6-2.2g per kg body weight) and incorporate progressive strength training 3-4 times per week.",
            icon: "💪"
          });
          break;
        default:
          recommendations.push({
            title: "Wellness Optimization",
            description: "Focus on balanced nutrition, regular exercise, and consistent healthy habits to improve your overall well-being.",
            icon: "❤️"
          });
      }
    }

    // Water intake recommendation
    const waterAnswer = answers.find((a) => a.questionId === "water_intake")?.answer;
    if (waterAnswer !== undefined && typeof waterAnswer === "number") {
      if (waterAnswer < 6) {
        recommendations.push({
          title: "Hydration Boost",
          description: "Aim for 8-10 glasses of water daily. Set reminders or use a water tracking app to build this healthy habit.",
          icon: "💧"
        });
      } else {
        recommendations.push({
          title: "Great Hydration",
          description: "You're maintaining excellent hydration levels! Keep up this healthy habit for optimal body function.",
          icon: "✨"
        });
      }
    }

    // Activity level recommendation
    const activityAnswer = answers.find((a) => a.questionId === "activity_level")?.answer as string;
    if (activityAnswer) {
      if (activityAnswer === "sedentary" || activityAnswer === "light") {
        recommendations.push({
          title: "Movement Matters",
          description: "Start with 150 minutes of moderate exercise per week. Even a 10-minute daily walk can make a significant difference!",
          icon: "🚶"
        });
      } else {
        recommendations.push({
          title: "Active Lifestyle",
          description: "You're maintaining an excellent activity level! Continue your current routine and consider varying your workouts.",
          icon: "🏃"
        });
      }
    }

    // Sleep recommendation
    const sleepAnswer = answers.find((a) => a.questionId === "sleep_hours")?.answer;
    if (sleepAnswer !== undefined && typeof sleepAnswer === "number") {
      if (sleepAnswer < 7) {
        recommendations.push({
          title: "Sleep Optimization",
          description: "Aim for 7-9 hours of quality sleep. Create a bedtime routine and limit screen time before bed for better rest.",
          icon: "😴"
        });
      } else {
        recommendations.push({
          title: "Sleep Champion",
          description: "You're getting adequate sleep! Quality rest is crucial for recovery, mood, and overall health.",
          icon: "🌙"
        });
      }
    }

    // Dietary preferences recommendation
    const dietaryPrefs = answers.find((a) => a.questionId === "dietary_preferences")?.answer as string[];
    if (dietaryPrefs && dietaryPrefs.length > 0 && !dietaryPrefs.includes("none")) {
      recommendations.push({
        title: "Nutrition Guidance",
        description: "We'll help you track meals that align with your dietary preferences and ensure you're meeting all nutritional needs.",
        icon: "🥗"
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl border-none shadow-none bg-transparent">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-4xl font-bold leading-tight">
            Your Wellness Profile is Ready!
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, we've created a personalized wellness plan just for you.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Recommendations */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">Your Personalized Recommendations</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-muted/30 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rec.icon}</span>
                    <h4 className="font-semibold text-lg">{rec.title}</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary of responses */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Your Responses Summary</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {answers.map((answer, index) => (
                <div key={index} className="bg-muted/20 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground line-clamp-2">
                    {getQuestionTitle(answer.questionId)}
                  </h4>
                  <p className="font-semibold text-sm">
                    {formatAnswer(answer.answer, answer.questionId)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button 
            onClick={onReset} 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto h-12 rounded-xl"
          >
            Retake Quiz
          </Button>
          
          <Button 
            onClick={onComplete} 
            size="lg"
            className="w-full sm:w-auto h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Complete Setup
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
