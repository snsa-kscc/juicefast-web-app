import { Progress } from "@/components/ui/progress";
import type { QuizQuestionType } from "@/data/quiz-questions";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  currentQuestion?: QuizQuestionType;
}

export function QuizProgress({ currentStep, totalSteps, currentQuestion }: QuizProgressProps) {
  // Calculate progress percentage for questions only (excluding start and complete screens)
  const questionStep = Math.max(0, currentStep - 1);
  const totalQuestions = totalSteps - 2;
  const progressPercentage = Math.min(100, (questionStep / totalQuestions) * 100);
  
  // Use question numbering from the question object if available
  const questionNumber = currentQuestion?.questionNumber || questionStep;
  const totalQuestionsCount = currentQuestion?.totalQuestions || totalQuestions;

  return (
    <div className="w-full px-6 py-2">
      {/* Progress bar */}
      <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
        <div 
          className="bg-[#11B364] h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
