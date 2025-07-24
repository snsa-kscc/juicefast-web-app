"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { ActivityIcon, Settings, Plus, Info } from "lucide-react";

// SVG Components for the tracker icons
const MealIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44" fill="none">
    <path d="M16.5 13.7497H5.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.1359 38.5V22" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.9999 13.75V5.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M38.5 38.5C29.3873 38.5 22 31.1127 22 22C22 12.8873 29.3873 5.5 38.5 5.5"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38.4999 31.1663C33.4373 31.1663 29.3333 27.0623 29.3333 21.9997C29.3333 16.9371 33.4373 12.833 38.4999 12.833"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 5.5V16.5C16.5 19.5376 14.0376 22 11 22V22C7.96243 22 5.5 19.5376 5.5 16.5V5.5"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StepsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.4999 22L27.4999 22C26.4874 22 25.6666 21.1792 25.6666 20.1667L25.6666 12.8333C25.6666 8.78324 28.9498 5.5 32.9999 5.5V5.5C37.05 5.5 40.3333 8.78324 40.3333 12.8333L40.3333 20.1667C40.3333 21.1792 39.5124 22 38.4999 22Z"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33 33V33C29.9624 33 27.5 30.5376 27.5 27.5L27.5 22L38.5 22L38.5 27.5C38.5 30.5376 36.0376 33 33 33Z"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.4999 27.5L5.49992 27.5C4.4874 27.5 3.66658 26.6792 3.66658 25.6667L3.66658 18.3333C3.66658 14.2832 6.94983 11 10.9999 11V11C15.05 11 18.3333 14.2832 18.3333 18.3333L18.3333 25.6667C18.3333 26.6792 17.5124 27.5 16.4999 27.5Z"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 38.5V38.5C7.96243 38.5 5.5 36.0376 5.5 33L5.5 27.5L16.5 27.5L16.5 33C16.5 36.0376 14.0376 38.5 11 38.5Z"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MindfulnessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44" fill="none">
    <path
      d="M12.8333 18.3331C13.5574 17.4439 14.5474 16.9397 15.5833 16.9397C16.6191 16.9397 17.5816 17.4439 18.3333 18.3331"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.6667 18.3331C26.3909 17.4439 27.3809 16.9397 28.4167 16.9397C29.4526 16.9397 30.4151 17.4439 31.1667 18.3331"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.6672 10.3327C40.1109 16.7764 40.1109 27.2236 33.6672 33.6672C27.2236 40.1109 16.7764 40.1109 10.3327 33.6672C3.88909 27.2236 3.88909 16.7764 10.3327 10.3327C16.7764 3.88909 27.2236 3.88909 33.6672 10.3327"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.4166 26.9277C28.4166 26.9277 26.0094 29.3331 21.9999 29.3331C17.9886 29.3331 15.5833 26.9277 15.5833 26.9277"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SleepIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.0346 22.0351C25.9791 17.9799 26.9151 11.868 24.3647 6.81817C24.2096 6.4998 24.2521 6.12051 24.4738 5.84433C24.6955 5.56815 25.0566 5.44464 25.401 5.52721C28.4396 6.25758 31.2176 7.81267 33.4288 10.0211C40.0647 16.485 40.2048 27.1043 33.7417 33.741C27.1054 40.2042 16.4865 40.0651 10.0216 33.4305C7.81354 31.2193 6.25834 28.4417 5.52723 25.4035C5.44463 25.0591 5.56813 24.698 5.8443 24.4763C6.12047 24.2546 6.49976 24.2121 6.81813 24.3672C11.868 26.9181 17.9804 25.9813 22.0346 22.0351Z"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WaterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44" fill="none">
    <path
      d="M30.5909 15.9248C35.3356 20.6695 35.3356 28.3621 30.5909 33.1086C25.8463 37.8551 18.1536 37.8533 13.4071 33.1086C8.66059 28.364 8.66242 20.6713 13.4071 15.9248"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13.4016 15.9313L21.9999 7.33301" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30.5983 15.9313L22 7.33301" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
import { DailyHealthMetrics, HealthScore, DAILY_TARGETS } from "@/types/health-metrics";
import { formatDateKey } from "@/lib/date-utils";
import { getDailyMetrics } from "@/app/actions/health-actions";
import { MIND_SUBCATEGORIES, MIND_CONTENT } from "@/data/wellness-content";

interface DashboardClientProps {
  userId: string;
  userName?: string;
  initialWeeklyData: any[];
  initialAverageScore: number;
}

export function DashboardClient({ userId, userName, initialWeeklyData, initialAverageScore }: DashboardClientProps) {
  const router = useRouter();
  const [activityData, setActivityData] = useState(initialWeeklyData);
  const [averageScore, setAverageScore] = useState(initialAverageScore);
  const [selectedDateData, setSelectedDateData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Generate array of dates for the current week (Monday to Sunday)
  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dates = [];

    // Calculate Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    // Generate array for Monday to Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, []);

  // Fetch data for selected date
  useEffect(() => {
    async function fetchDateData() {
      if (!userId) return;

      setIsLoading(true);
      try {
        const metrics = await getDailyMetrics(userId, selectedDate);

        if (metrics) {
          // Process the metrics data for display
          const processedData = {
            date: metrics.date,
            steps: metrics.steps?.reduce((sum, entry) => sum + entry.count, 0) || 0,
            water: metrics.waterIntake?.reduce((sum, entry) => sum + entry.amount, 0) || 0,
            calories: metrics.meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0,
            mindfulness: metrics.mindfulness?.reduce((sum, entry) => sum + entry.minutes, 0) || 0,
            sleep: metrics.sleep?.hoursSlept || 0,
            totalScore: metrics.totalScore || 0,
            healthyMeals: metrics.meals?.filter((meal) => meal.protein > 15 && meal.calories < 600).length || 0, // Consider meals with good protein and moderate calories as healthy
          };
          setSelectedDateData(processedData);
        } else {
          // Set empty data if no metrics found
          setSelectedDateData({
            date: new Date(),
            steps: 0,
            water: 0,
            calories: 0,
            mindfulness: 0,
            sleep: 0,
            totalScore: 0,
            healthyMeals: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data for today:", error);
        setSelectedDateData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDateData();
  }, [userId, selectedDate]);

  // Format date for display
  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 1);
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  };

  // Navigate to specific tracker
  const navigateToTracker = (tracker: string) => {
    router.push(`/tracker/${tracker}?userId=${userId}`);
  };

  // Format percentage for progress bars
  const formatPercentage = (value: number, target: number) => {
    return Math.min(100, Math.round((value / target) * 100));
  };

  // Use today's data for the dashboard display
  const displayData = selectedDateData || {
    steps: 0,
    water: 0,
    calories: 0,
    mindfulness: 0,
    sleep: 0,
    totalScore: 0,
    healthyMeals: 0,
  };

  return (
    <div className="font-sans bg-[#FCFBF8]">
      {/* Header with welcome message and settings */}
      <div className="px-6 pt-6 pb-2 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium">Hi, {userName ? userName.split(" ")[0] : "there"}!</h1>
          <p className="text-gray-500 text-sm">What are we doing today?</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/profile")}>
          <Settings className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Day selector */}
      <div className="px-6 pb-4">
        <div className="flex justify-between space-x-1">
          {weekDates.map((date: Date, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center p-1 rounded-full w-10 h-10 ${
                isToday(date) ? "border border-[#F2E9D8] text-black" : isSameDate(selectedDate, date) ? "bg-gray-100" : ""
              }`}
            >
              <span className="text-[10px] font-medium">{formatDay(date)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wellness Score Card */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold tracking-wider uppercase flex-grow text-center">Wellness Score</h2>
            <Info className="h-4 w-4 text-gray-400 ml-2" />
          </div>

          {/* Circular Progress */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-[250px] h-[250px] mb-2">
              {/* Background circle */}
              <svg className="w-full h-full" viewBox="0 0 250 250">
                <circle cx="125" cy="125" r="110" fill="white" stroke="#F2E9D8" strokeWidth="10" className="drop-shadow-md" />

                {/* Progress circle */}
                <circle
                  cx="125"
                  cy="125"
                  r="110"
                  fill="none"
                  stroke="#E8D5B0"
                  strokeWidth="10"
                  strokeDasharray="628"
                  strokeDashoffset={628 - (628 * Math.min(100, averageScore)) / 100}
                  transform="rotate(-90 125 125)"
                  className="transition-all duration-1000"
                />

                {/* Score text - improved centering for iOS */}
                <text x="125" y="125" textAnchor="middle" dominantBaseline="central" fontSize="52" fontWeight="bold" fill="#000" dy="0.1em">
                  {Math.round(averageScore)}
                </text>
              </svg>
            </div>
            <p className="text-sm text-gray-500">One step and one goal at a time.</p>
          </div>

          {/* Daily Progress Summary */}
          <div className="px-3 pt-4 mb-2">
            <h3 className=" text-center font-semibold mb-4">DAILY PROGRESS SUMMARY (%)</h3>
            <div className="flex justify-between pt-4">
              {/* Steps Progress */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-20 rounded-3xl bg-[#FFF8E7] flex flex-col items-center justify-center mb-1 relative overflow-hidden">
                  {/* Progress fill */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#FFC856] transition-all duration-500" style={{ height: `${Math.min(100, 70)}%` }}></div>
                  <div className="flex flex-col items-center justify-center z-10 space-y-1">
                    <div>
                      <StepsIcon />
                    </div>
                    <span className="font-semibold">70</span>
                  </div>
                </div>
              </div>

              {/* Mindfulness Progress */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-20 rounded-3xl bg-[#FFF0F0] flex flex-col items-center justify-center mb-1 relative overflow-hidden">
                  {/* Progress fill */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#FF8080] transition-all duration-500" style={{ height: `${Math.min(100, 64)}%` }}></div>
                  <div className="flex flex-col items-center justify-center z-10 space-y-1">
                    <div>
                      <MindfulnessIcon />
                    </div>
                    <span className="font-semibold">64</span>
                  </div>
                </div>
              </div>

              {/* Meals Progress */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-20 rounded-3xl bg-[#F0FFF4] flex flex-col items-center justify-center mb-1 relative overflow-hidden">
                  {/* Progress fill - capped at 100% but showing 114% */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#11B364] transition-all duration-500" style={{ height: `100%` }}></div>
                  <div className="flex flex-col items-center justify-center z-10 space-y-1">
                    <div>
                      <MealIcon />
                    </div>
                    <span className="font-semibold text-white">114</span>
                  </div>
                </div>
              </div>

              {/* Water Progress */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-20 rounded-3xl bg-[#EBF9FF] flex flex-col items-center justify-center mb-1 relative overflow-hidden">
                  {/* Progress fill - 0% */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#4CC3FF] transition-all duration-500" style={{ height: `${Math.min(100, 0)}%` }}></div>
                  <div className="flex flex-col items-center justify-center z-10 space-y-1">
                    <div>
                      <WaterIcon />
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wellness Cards - Horizontal Scrollable */}
        <div className="mb-6 pt-4">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {/* Wellness Cards from Mind subcategory */}
            <Link href="/wellness/categories/mind/guided-meditations" className="flex-shrink-0">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image src="/images/wellness/guided-meditation.jpg" alt="Guided Meditations" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                  <span>
                    Guided
                    <br />
                    Meditations
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/wellness/categories/mind/guided-affirmations" className="flex-shrink-0">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image src="/images/wellness/affirmations.jpg" alt="Guided Affirmations" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                  <span>
                    Guided
                    <br />
                    Affirmations
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/wellness/categories/workouts" className="flex-shrink-0">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                <Image src="/images/wellness/weight-loss-fitness.jpg" alt="Strength exercises" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                  <span>
                    Strength
                    <br />
                    exercises
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Daily Overview */}
        <div className="mb-6">
          <h3 className="font-semibold text-center mb-4">DAILY OVERVIEW</h3>

          {/* Daily Tasks List */}
          <div className="space-y-4">
            {/* Healthy Meals */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <Link href="/tracker/meals">
                <div className="flex items-center">
                  <div className="mr-3">
                    <MealIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Eat 2 healthy meals</p>
                    <p className="text-xs text-gray-500">{displayData.healthyMeals} healthy meals today</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <Link href="/tracker/steps">
                <div className="flex items-center">
                  <div className="mr-3">
                    <StepsIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Take 10,000 steps</p>
                    <p className="text-xs text-gray-500">{displayData.steps} steps today</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Mindfulness */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <Link href="/tracker/mindfulness">
                <div className="flex items-center">
                  <div className="mr-3">
                    <MindfulnessIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Spend 20 quiet minutes</p>
                    <p className="text-xs text-gray-500">{displayData.mindfulness} minutes today</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Sleep */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <Link href="/tracker/sleep">
                <div className="flex items-center">
                  <div className="mr-3">
                    <SleepIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sleep 8 hours</p>
                    <p className="text-xs text-gray-500">{displayData.sleep} hours today</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Water */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <Link href="/tracker/water">
                <div className="flex items-center">
                  <div className="mr-3">
                    <WaterIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drink 2.2L of water</p>
                    <p className="text-xs text-gray-500">{displayData.water / 1000} liters today</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Challenge Banner */}
        <div className="w-full relative">
          {/* <h3 className="absolute top-4 left-4 text-black text-sm font-medium">JF Challenge Started</h3> */}
          <Link href="/stores">
            <Image className="w-full" src="/images/wellness/banner-1.png" alt="Challenge" width={390} height={240} />
          </Link>
        </div>

        <div className="w-full relative mt-6">
          {/* <h3 className="absolute top-4 right-4 text-black text-sm font-medium">Fasting programs 10% off</h3> */}
          <Link href="/stores">
            <Image className="w-full" src="/images/wellness/banner-2.png" alt="Programs" width={390} height={240} />
          </Link>
        </div>

        {/* Fasting Programs Banner */}
        {/* <div className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center">
          <div>
            <h4 className="font-medium text-sm">Fasting programs</h4>
            <p className="text-xs font-bold text-[#11B364]">10fgg% off</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-8">
            Redeem
          </Button>
        </div> */}
      </div>
      <div className="h-40"></div>
    </div>
  );
}
