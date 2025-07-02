"use client";

import { OnboardingQuiz } from "@/components/onboarding-quiz";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    // Check if the user has already completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");

    if (hasCompletedOnboarding === "true") {
      // If onboarding is completed, redirect to dashboard
      router.push("/dashboard");
    } else {
      // Otherwise show the quiz
      setShowQuiz(true);
    }
  }, [router]);

  // Function to mark onboarding as completed
  const handleOnboardingComplete = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    router.push("/dashboard");
  };

  return <>{showQuiz && <OnboardingQuiz onComplete={handleOnboardingComplete} />}</>;
}
