import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsIcon, Droplets, FootprintsIcon, BedIcon, BrainIcon, ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { loadUserProfile } from "@/lib/daily-tracking-store";
import Link from "next/link";

interface TrackingOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export default function TrackerPage() {
  // Server-side data fetching
  const userProfile = loadUserProfile();
  const userId = userProfile?.id || "user-123"; // Default user ID if not found

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

  return (
    <div className="py-6 font-sans">
      <div className="flex items-center mb-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Health Tracker</h1>
      </div>

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
