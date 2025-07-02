"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizStart } from "./quiz/quiz-start";
import { QuizQuestion } from "./quiz/quiz-question";
import { QuizComplete } from "./quiz/quiz-complete";
import { quizQuestions } from "@/data/quiz-questions";

export type QuizAnswer = {
  questionId: string;
  answer: string | string[] | number;
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

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.push("/");
    }
  };

  const isAnswerValid = (question: any, answer: string | string[] | number) => {
    if (!question) return false;

    if (question.type === "multiple") {
      // For multiple choice questions, ensure at least one option is selected
      return Array.isArray(answer) && answer.length > 0;
    }

    if (question.type === "single") {
      // For single choice questions, ensure an option is selected
      return !!answer && answer !== "";
    }

    if (question.type === "slider") {
      // For slider questions, ensure it's a number
      return typeof answer === "number";
    }

    // For text and input questions, ensure non-empty string
    return !!answer && (typeof answer !== "string" || answer.trim() !== "");
  };

  const handleNext = (questionId: string, answer: string | string[] | number) => {
    const questionIndex = currentStep - 1;
    const question = quizQuestions[questionIndex];

    // Strict validation - do not advance if answer is invalid
    if (!isAnswerValid(question, answer)) {
      console.log("Invalid answer detected in parent component:", { questionId, answer });
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
      return <QuizStart onStart={handleStart} onSkip={handleSkip} />;
    } else if (currentStep === totalSteps - 1) {
      return <QuizComplete answers={answers} onReset={handleReset} onSkip={handleSkip} onComplete={handleComplete} />;
    } else {
      const questionIndex = currentStep - 1;
      const question = quizQuestions[questionIndex];

      // Make sure question has the correct questionNumber and totalQuestions
      if (!question.questionNumber) {
        question.questionNumber = questionIndex + 1;
      }
      if (!question.totalQuestions) {
        question.totalQuestions = quizQuestions.length;
      }

      const existingAnswer = answers.find((a) => a.questionId === question.id);

      return (
        <QuizQuestion
          key={`question-${question.id}`} // Add key to force re-mount when question changes
          question={question}
          currentAnswer={existingAnswer?.answer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          showPrevious={currentStep > 1}
        />
      );
    }
  };

  return (
    <div className="w-full">
      {/* We no longer need the progress bar here since it's included in the QuizQuestion component */}
      {renderStep()}
    </div>
  );
}
