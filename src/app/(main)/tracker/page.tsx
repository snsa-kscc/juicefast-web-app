"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsIcon, Droplets, FootprintsIcon, BedIcon, BrainIcon, ArrowRightIcon } from "lucide-react";

interface TrackingOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export default function TrackerPage() {
  const router = useRouter();

  const trackingOptions: TrackingOption[] = [
    {
      id: "meals",
      name: "Meal Tracker",
      description: "Log your meals and track nutrition",
      icon: <UtensilsIcon className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-600",
      href: "/tracker/meals",
    },
    {
      id: "water",
      name: "Water Intake",
      description: "Track your daily water consumption",
      icon: <Droplets className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      href: "/tracker/water",
    },
    {
      id: "steps",
      name: "Step Counter",
      description: "Monitor your daily activity level",
      icon: <FootprintsIcon className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      href: "/tracker/steps",
    },
    {
      id: "sleep",
      name: "Sleep Tracker",
      description: "Record your sleep duration and quality",
      icon: <BedIcon className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      href: "/tracker/sleep",
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      description: "Track meditation and mindfulness practices",
      icon: <BrainIcon className="h-6 w-6" />,
      color: "bg-indigo-100 text-indigo-600",
      href: "/tracker/mindfulness",
    },
  ];

  return (
    <div className="py-6 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Health Tracker</h1>
        <p className="text-gray-500 mt-1">What would you like to track today?</p>
      </div>

      <div className="space-y-4">
        {trackingOptions.map((option) => (
          <Card key={option.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(option.href)}>
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
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" className="text-sm" onClick={() => router.push("/dashboard")}>
          View Health Dashboard
        </Button>
      </div>
    </div>
  );
}
