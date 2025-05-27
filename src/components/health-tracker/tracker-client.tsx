"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsIcon, Droplets, FootprintsIcon, BedIcon, BrainIcon, ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProfile, DailyHealthMetrics } from "@/types/health-metrics";
import { getUserProfile } from "@/app/actions/health-actions";

interface TrackingOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

interface TrackerClientProps {
  userId?: string;
  weeklyMetrics?: DailyHealthMetrics[];
  weeklyAverageScore?: number;
}

export function TrackerClient({ userId = "", weeklyMetrics = [], weeklyAverageScore = 0 }: TrackerClientProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (userId) {
        try {
          const profile = await getUserProfile(userId);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to load user profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  const trackingOptions: TrackingOption[] = [
    {
      id: "meals",
      name: "Meal Tracker",
      description: "Log your meals and track nutrition",
      icon: <UtensilsIcon className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-600",
      href: `/tracker/meals?userId=${userId}`,
    },
    {
      id: "water",
      name: "Water Intake",
      description: "Track your daily water consumption",
      icon: <Droplets className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      href: `/tracker/water?userId=${userId}`,
    },
    {
      id: "steps",
      name: "Step Counter",
      description: "Monitor your daily activity level",
      icon: <FootprintsIcon className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      href: `/tracker/steps?userId=${userId}`,
    },
    {
      id: "sleep",
      name: "Sleep Tracker",
      description: "Record your sleep duration and quality",
      icon: <BedIcon className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      href: `/tracker/sleep?userId=${userId}`,
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      description: "Track meditation and mindfulness practices",
      icon: <BrainIcon className="h-6 w-6" />,
      color: "bg-indigo-100 text-indigo-600",
      href: `/tracker/mindfulness?userId=${userId}`,
    },
  ];

  if (loading) {
    return <div className="py-6 text-center">Loading health tracker...</div>;
  }

  return (
    <div className="py-6 font-sans">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Health Tracker</h1>
      </div>

      {/* Weekly Health Score Summary */}
      {weeklyMetrics.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Weekly Health Score</h2>
                <p className="text-sm text-gray-500">Your average health score for the past week</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-primary">{Math.round(weeklyAverageScore)}</span>
                </div>
                <div>
                  <p className="text-sm">
                    {weeklyAverageScore >= 80 ? "Excellent" : weeklyAverageScore >= 60 ? "Good" : weeklyAverageScore >= 40 ? "Average" : "Needs Improvement"}
                  </p>
                  <p className="text-xs text-gray-500">{weeklyMetrics.length} days tracked</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center mb-6">
        <p className="text-gray-500 mt-1">What would you like to track today?</p>
      </div>

      <div className="space-y-4">
        {trackingOptions.map((option) => (
          <Link key={option.id} href={option.href} className="block">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${option.color}`}>{option.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/dashboard">
          <Button variant="outline" className="text-sm">
            View Health Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
