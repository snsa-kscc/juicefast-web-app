"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { QuizAnswer } from "../onboarding-quiz";
import { quizQuestions } from "@/data/quiz-questions";

interface QuizCompleteProps {
  answers: QuizAnswer[];
  onReset: () => void;
  onAbort: () => void;
}

export function QuizComplete({ answers, onReset, onAbort }: QuizCompleteProps) {
  // Get question titles for display
  const getQuestionTitle = (questionId: string) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    return question?.title || questionId;
  };

  // Format answer for display
  const formatAnswer = (answer: string | string[], questionId: string) => {
    const question = quizQuestions.find((q) => q.id === questionId);

    if (!question) return answer;

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
      return option?.label || answer;
    }

    return answer;
  };

  // Generate personalized wellness recommendations based on answers
  const getRecommendations = () => {
    const recommendations: { title: string; description: string }[] = [];

    // Water intake recommendation
    const waterAnswer = answers.find((a) => a.questionId === "water_intake")?.answer as string;
    if (waterAnswer) {
      if (waterAnswer === "0_2" || waterAnswer === "3_5") {
        recommendations.push({
          title: "Increase your water intake",
          description: "Try to drink at least 8 cups of water daily for optimal hydration. Consider carrying a water bottle with you throughout the day.",
        });
      } else if (waterAnswer === "6_8" || waterAnswer === "9_plus") {
        recommendations.push({
          title: "Great hydration habits",
          description: "You're doing well with your water intake. Keep it up!",
        });
      }
    }

    // Activity level recommendation
    const activityAnswer = answers.find((a) => a.questionId === "activity_level")?.answer as string;
    if (activityAnswer) {
      if (activityAnswer === "sedentary" || activityAnswer === "light") {
        recommendations.push({
          title: "Consider increasing your activity level",
          description: "Try to incorporate at least 150 minutes of moderate exercise per week for better health outcomes.",
        });
      } else if (activityAnswer === "moderate" || activityAnswer === "very" || activityAnswer === "extra") {
        recommendations.push({
          title: "Great activity level",
          description: "You're maintaining an excellent level of physical activity. Keep up the good work!",
        });
      }
    }

    // Sleep quality recommendation
    const sleepAnswer = answers.find((a) => a.questionId === "sleep_quality")?.answer as string;
    if (sleepAnswer) {
      if (sleepAnswer === "poor" || sleepAnswer === "fair") {
        recommendations.push({
          title: "Improve your sleep quality",
          description: "Aim for 7-9 hours of quality sleep. Consider establishing a consistent sleep schedule and creating a relaxing bedtime routine.",
        });
      } else if (sleepAnswer === "good" || sleepAnswer === "excellent") {
        recommendations.push({
          title: "Excellent sleep habits",
          description: "You're getting good quality sleep, which is crucial for overall health and recovery.",
        });
      }
    }

    // Stress management recommendation
    const stressAnswer = answers.find((a) => a.questionId === "stress_level")?.answer as string;
    if (stressAnswer) {
      if (stressAnswer === "high" || stressAnswer === "very_high") {
        recommendations.push({
          title: "Focus on stress management",
          description: "Consider incorporating stress-reduction techniques like meditation, deep breathing, or mindfulness practices into your daily routine.",
        });
      } else if (stressAnswer === "low" || stressAnswer === "moderate") {
        recommendations.push({
          title: "Good stress management",
          description: "You're managing your stress levels well. Continue your current practices to maintain this balance.",
        });
      }
    }

    // Add a general nutrition recommendation based on dietary preferences
    const dietaryPrefs = answers.find((a) => a.questionId === "dietary_preferences")?.answer as string[];
    if (dietaryPrefs && dietaryPrefs.length > 0) {
      if (dietaryPrefs.includes("vegetarian") || dietaryPrefs.includes("vegan")) {
        recommendations.push({
          title: "Plant-based nutrition tips",
          description:
            "Ensure you're getting enough protein, vitamin B12, iron, and zinc through your plant-based diet. Consider tracking your nutrient intake with our meal tracker.",
        });
      } else if (dietaryPrefs.includes("keto") || dietaryPrefs.includes("paleo")) {
        recommendations.push({
          title: "Low-carb diet considerations",
          description:
            "Make sure you're getting adequate fiber and micronutrients while following your low-carb eating plan. Our meal tracker can help you maintain balance.",
        });
      }
    }

    // If somehow no recommendations were generated
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Start tracking your nutrition",
        description: "Use our meal tracker to monitor your nutritional intake and make informed choices about your diet.",
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Your Wellness Profile</CardTitle>
        <CardDescription className="text-lg mt-2">
          Thank you for completing the wellness quiz! Here's a summary of your responses and personalized recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Responses</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {answers.map((answer, index) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium text-sm text-muted-foreground">{getQuestionTitle(answer.questionId)}</h4>
                  <p className="mt-1 font-medium">{formatAnswer(answer.answer, answer.questionId)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Personalized Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex flex-col md:flex-row items-start gap-3">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm mt-1">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row gap-3 justify-between mt-6">
        <Button onClick={onReset} variant="outline" className="shadow-none cursor-pointer">
          Retake Quiz
        </Button>
        <Button>
          <Link href="/">Go Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
