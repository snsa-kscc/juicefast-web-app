"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { UserProfile, DailyHealthMetrics } from "@/types/health-metrics";
import { getUserProfile } from "@/app/actions/health-actions";

interface TrackingOption {
  id: string;
  name: string;
  target: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  progress: number;
  unit: string;
}

interface TrackerClientProps {
  userId?: string;
  weeklyMetrics?: DailyHealthMetrics[];
  weeklyAverageScore?: number;
}

export function TrackerClient({ userId = "", weeklyMetrics = [], weeklyAverageScore = 71 }: TrackerClientProps) {
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

  // SVG Components for the tracker icons
  const MealIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 44 44" fill="none">
      <path d="M16.5 13.7497H5.5" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.1359 38.5V22" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.9999 13.75V5.5" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M38.5 38.5C29.3873 38.5 22 31.1127 22 22C22 12.8873 29.3873 5.5 38.5 5.5"
        stroke="#0DC99B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38.4999 31.1663C33.4373 31.1663 29.3333 27.0623 29.3333 21.9997C29.3333 16.9371 33.4373 12.833 38.4999 12.833"
        stroke="#0DC99B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 5.5V16.5C16.5 19.5376 14.0376 22 11 22V22C7.96243 22 5.5 19.5376 5.5 16.5V5.5"
        stroke="#0DC99B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const StepsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 44 44" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38.4999 22L27.4999 22C26.4874 22 25.6666 21.1792 25.6666 20.1667L25.6666 12.8333C25.6666 8.78324 28.9498 5.5 32.9999 5.5V5.5C37.05 5.5 40.3333 8.78324 40.3333 12.8333L40.3333 20.1667C40.3333 21.1792 39.5124 22 38.4999 22Z"
        stroke="#FFC856"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33 33V33C29.9624 33 27.5 30.5376 27.5 27.5L27.5 22L38.5 22L38.5 27.5C38.5 30.5376 36.0376 33 33 33Z"
        stroke="#FFC856"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4999 27.5L5.49992 27.5C4.4874 27.5 3.66658 26.6792 3.66658 25.6667L3.66658 18.3333C3.66658 14.2832 6.94983 11 10.9999 11V11C15.05 11 18.3333 14.2832 18.3333 18.3333L18.3333 25.6667C18.3333 26.6792 17.5124 27.5 16.4999 27.5Z"
        stroke="#FFC856"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 38.5V38.5C7.96243 38.5 5.5 36.0376 5.5 33L5.5 27.5L16.5 27.5L16.5 33C16.5 36.0376 14.0376 38.5 11 38.5Z"
        stroke="#FFC856"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const MindfulnessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 44 44" fill="none">
      <path
        d="M12.8333 18.3331C13.5574 17.4439 14.5474 16.9397 15.5833 16.9397C16.6191 16.9397 17.5816 17.4439 18.3333 18.3331"
        stroke="#FE8E77"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.6667 18.3331C26.3909 17.4439 27.3809 16.9397 28.4167 16.9397C29.4526 16.9397 30.4151 17.4439 31.1667 18.3331"
        stroke="#FE8E77"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33.6672 10.3327C40.1109 16.7764 40.1109 27.2236 33.6672 33.6672C27.2236 40.1109 16.7764 40.1109 10.3327 33.6672C3.88909 27.2236 3.88909 16.7764 10.3327 10.3327C16.7764 3.88909 27.2236 3.88909 33.6672 10.3327"
        stroke="#FE8E77"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.4166 26.9277C28.4166 26.9277 26.0094 29.3331 21.9999 29.3331C17.9886 29.3331 15.5833 26.9277 15.5833 26.9277"
        stroke="#FE8E77"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const SleepIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 44 44" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.0346 22.0351C25.9791 17.9799 26.9151 11.868 24.3647 6.81817C24.2096 6.4998 24.2521 6.12051 24.4738 5.84433C24.6955 5.56815 25.0566 5.44464 25.401 5.52721C28.4396 6.25758 31.2176 7.81267 33.4288 10.0211C40.0647 16.485 40.2048 27.1043 33.7417 33.741C27.1054 40.2042 16.4865 40.0651 10.0216 33.4305C7.81354 31.2193 6.25834 28.4417 5.52723 25.4035C5.44463 25.0591 5.56813 24.698 5.8443 24.4763C6.12047 24.2546 6.49976 24.2121 6.81813 24.3672C11.868 26.9181 17.9804 25.9813 22.0346 22.0351Z"
        stroke="#625FD3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const WaterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 44 44" fill="none">
      <path
        d="M30.5909 15.9248C35.3356 20.6695 35.3356 28.3621 30.5909 33.1086C25.8463 37.8551 18.1536 37.8533 13.4071 33.1086C8.66059 28.364 8.66242 20.6713 13.4071 15.9248"
        stroke="#4CC3FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.4016 15.9313L21.9999 7.33301" stroke="#4CC3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.5983 15.9313L22 7.33301" stroke="#4CC3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const trackingOptions: TrackingOption[] = [
    {
      id: "meals",
      name: "Eat 2 healthy meals",
      target: "2",
      icon: <MealIcon />,
      color: "bg-[#E8F8F3] border-[#0DC99B]",
      href: `/tracker/meals?userId=${userId}`,
      progress: 0,
      unit: "healthy meals today",
    },
    {
      id: "steps",
      name: "Take 10 000 steps",
      target: "10000",
      icon: <StepsIcon />,
      color: "bg-[#FFF8E8] border-[#FFC856]",
      href: `/tracker/steps?userId=${userId}`,
      progress: 0,
      unit: "steps today",
    },
    {
      id: "mindfulness",
      name: "Spend 20 quiet minutes",
      target: "20",
      icon: <MindfulnessIcon />,
      color: "bg-[#FFEFEB] border-[#FE8E77]",
      href: `/tracker/mindfulness?userId=${userId}`,
      progress: 0,
      unit: "minutes today",
    },
    {
      id: "sleep",
      name: "Sleep 8 hours",
      target: "8",
      icon: <SleepIcon />,
      color: "bg-[#EEEDFF] border-[#625FD3]",
      href: `/tracker/sleep?userId=${userId}`,
      progress: 0,
      unit: "hours today",
    },
    {
      id: "water",
      name: "Drink 2.2L of water",
      target: "2.2",
      icon: <WaterIcon />,
      color: "bg-[#EBF9FF] border-[#4CC3FF]",
      href: `/tracker/water?userId=${userId}`,
      progress: 0,
      unit: "liters today",
    },
  ];

  if (loading) {
    return <div className="py-6 text-center">Loading health tracker...</div>;
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-[#E8F8F3] to-[#F8FFFD]">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-medium">Wellness Tracker</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Today's Plan */}
      <div className="px-6 pb-4">
        <p className="text-gray-600 text-lg">Today I'm going to....</p>
      </div>

      {/* Wellness Score */}
      <div className="px-6 py-4 bg-white">
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full mb-2">
            <h2 className="text-lg font-semibold uppercase">WELLNESS SCORE</h2>
            <div className="rounded-full bg-gray-100 p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="#64748B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">Average wellness score for the last 7 days</p>

          {/* Circular Progress */}
          <div className="relative w-48 h-48 mb-6">
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full border-[5px] border-[#F2E9D8]"></div>

            {/* Progress Circle - We're using a pseudo SVG approach for the circular progress */}
            <div className="absolute inset-0 rounded-full border-[5px] border-transparent"></div>

            {/* Center with Score */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-light text-[#E8D5B0]">{Math.round(weeklyAverageScore)}</span>
            </div>

            {/* No target indicator */}
          </div>
        </div>
      </div>

      {/* Tracking Options */}
      <div className="px-6 py-4 bg-white">
        <h3 className="font-medium mb-4">What would you like to track today?</h3>

        <div className="space-y-3">
          {trackingOptions.map((option) => (
            <Link key={option.id} href={option.href} className="block">
              <Card className={`border ${option.color} rounded-xl overflow-hidden`}>
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="mr-3">{option.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{option.name}</h4>
                      <p className="text-sm text-gray-500">
                        {option.progress} {option.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
}
