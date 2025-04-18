"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { QuizQuestionType } from "@/data/quiz-questions";

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentAnswer?: string | string[];
  onNext: (questionId: string, answer: string | string[]) => void;
  onPrevious: () => void;
  onAbort: () => void;
  showPrevious: boolean;
}

export function QuizQuestion({ question, currentAnswer, onNext, onPrevious, onAbort, showPrevious }: QuizQuestionProps) {
  const [answer, setAnswer] = useState<string | string[]>(() => {
    // Initialize based on currentAnswer or default for the question type
    return currentAnswer !== undefined ? currentAnswer : question.type === "multiple" ? [] : "";
  });

  // Update local state when the question or currentAnswer prop changes
  useEffect(() => {
    // Always reset/set the answer based on the current props
    setAnswer(currentAnswer !== undefined ? currentAnswer : question.type === "multiple" ? [] : "");
  }, [question.id, currentAnswer, question.type]);

  const handleSingleOptionChange = (value: string) => {
    setAnswer(value);
  };

  const handleMultipleOptionChange = (value: string) => {
    if (Array.isArray(answer)) {
      const updatedAnswer = answer.includes(value) ? answer.filter((item) => item !== value) : [...answer, value];
      setAnswer(updatedAnswer);
    }
  };

  const handleTextChange = (value: string) => {
    setAnswer(value);
  };

  const handleSubmit = () => {
    onNext(question.id, answer);
  };

  const isNextDisabled = () => {
    let disabled = false;
    if (question.type === "multiple") {
      disabled = Array.isArray(answer) && answer.length === 0;
    } else {
      disabled = !answer || (typeof answer === "string" && answer.trim() === "");
    }
    return disabled;
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">{question.title}</CardTitle>
        {question.description && <CardDescription className="text-base mt-2">{question.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {question.type === "single" && (
          <RadioGroup value={answer as string} onValueChange={handleSingleOptionChange} className="space-y-3">
            {question.options?.map((option: { value: string; label: string }) => (
              <div key={option.value} className="flex items-center space-x-2 rounded-md border p-4 transition-colors hover:bg-muted/50">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "multiple" && (
          <div className="space-y-3">
            {question.options?.map((option: { value: string; label: string }) => (
              <div key={option.value} className="flex items-center space-x-2 rounded-md border p-4 transition-colors hover:bg-muted/50">
                <Checkbox
                  id={option.value}
                  checked={Array.isArray(answer) && answer.includes(option.value)}
                  onCheckedChange={() => handleMultipleOptionChange(option.value)}
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <Textarea
            placeholder={question.placeholder || "Type your answer here..."}
            value={answer as string}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[120px]"
          />
        )}

        {question.type === "input" && (
          <Input placeholder={question.placeholder || "Type your answer here..."} value={answer as string} onChange={(e) => handleTextChange(e.target.value)} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {showPrevious ? (
            <Button variant="outline" onClick={onPrevious} className="shadow-none cursor-pointer">
              Previous
            </Button>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onAbort} className="text-muted-foreground hover:text-destructive hidden sm:inline-flex border-1 cursor-pointer">
            Abort
          </Button>
          <Button onClick={handleSubmit} disabled={isNextDisabled()} className="cursor-pointer">
            {question.nextButtonText || "Next"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
