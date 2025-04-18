"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizStartProps {
  onStart: () => void;
  onAbort: () => void;
}

export function QuizStart({ onStart, onAbort }: QuizStartProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome to Our Onboarding Quiz</CardTitle>
        <CardDescription className="text-lg mt-2">Help us personalize your experience by answering a few questions</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>This quiz will take approximately 2-3 minutes to complete. Your answers will help us tailor our services to your specific needs and preferences.</p>
        <div className="flex justify-center gap-4 mt-6">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-3 mb-2 inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h2" />
                <path d="M8 17h2" />
                <path d="M14 13h2" />
                <path d="M14 17h2" />
              </svg>
            </div>
            <h3 className="font-medium">6 Questions</h3>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-3 mb-2 inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="font-medium">1 Minute</h3>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <Button variant="ghost" onClick={onAbort} className="text-muted-foreground hover:text-destructive cursor-pointer">
          Cancel
        </Button>
        <Button size="lg" onClick={onStart} className="cursor-pointer">
          Start Quiz
        </Button>
        <div className="w-[70px]"></div> {/* Empty div for balance */}{" "}
      </CardFooter>
    </Card>
  );
}
