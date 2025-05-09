"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizStart } from "./quiz/quiz-start";
import { QuizQuestion } from "./quiz/quiz-question";
import { QuizComplete } from "./quiz/quiz-complete";
import { QuizProgress } from "./quiz/quiz-progress";
import { quizQuestions } from "@/data/quiz-questions";

export type QuizAnswer = {
  questionId: string;
  answer: string | string[];
};

interface OnboardingQuizProps {
  onComplete?: () => void;
}

export function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const totalSteps = quizQuestions.length + 2; // +2 for start and complete screens

  const handleStart = () => {
    setCurrentStep(1);
  };

  const isAnswerValid = (question: any, answer: string | string[]) => {
    if (!question) return false;
    if (question.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer && (typeof answer !== "string" || answer.trim() !== "");
  };

  const handleNext = (questionId: string, answer: string | string[]) => {
    const questionIndex = currentStep - 1;
    const question = quizQuestions[questionIndex];
    if (!isAnswerValid(question, answer)) {
      // Do not advance if answer is invalid
      return;
    }
    // Save the answer
    const existingAnswerIndex = answers.findIndex((a) => a.questionId === questionId);

    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = { questionId, answer };
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, { questionId, answer }]);
    }

    // Move to next question
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
  };

  const handleAbort = () => {
    // Navigate back to the home page
    router.push("/");
  };

  const handleComplete = () => {
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    } else {
      // Default behavior if no callback is provided
      router.push("/");
    }
  };

  // Render the appropriate step
  const renderStep = () => {
    if (currentStep === 0) {
      return <QuizStart onStart={handleStart} onAbort={handleAbort} />;
    } else if (currentStep === totalSteps - 1) {
      return <QuizComplete answers={answers} onReset={handleReset} onAbort={handleAbort} onComplete={handleComplete} />;
    } else {
      const questionIndex = currentStep - 1;
      const question = quizQuestions[questionIndex];
      const existingAnswer = answers.find((a) => a.questionId === question.id);

      return (
        <QuizQuestion
          question={question}
          currentAnswer={existingAnswer?.answer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onAbort={handleAbort}
          showPrevious={currentStep > 1}
        />
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      <div className="bg-white rounded-lg border p-6">{renderStep()}</div>
    </div>
  );
}
