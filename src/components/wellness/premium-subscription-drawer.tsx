"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface PremiumSubscriptionDrawerProps {
  children: React.ReactNode;
  ctaButton?: React.ReactNode;
}

export function PremiumSubscriptionDrawer({
  children,
  ctaButton = <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6">START FREE TRIAL & SUBSCRIBE</Button>,
}: PremiumSubscriptionDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-gradient-to-br from-purple-50 to-blue-50">
        <DrawerHeader className="text-center">
          <div className="absolute top-4 right-4">
            <DrawerClose>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-full h-48 mb-4">
              <Image src="/images/wellness/cardio-fat-burn.jpg" alt="Juicefast Club" fill className="object-cover" />
            </div>
            <DrawerTitle className="text-xl font-semibold mb-1">Juicefast Club</DrawerTitle>
            <DrawerDescription className="text-sm text-gray-600 max-w-xs">
              Start a healthier lifestyle today! Join Juicefast & get access to our exclusive library of recipes.
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="px-4 py-2">
          <p className="text-sm font-medium text-center mb-4">Choose your plan & start your journey</p>

          {/* Subscription Options */}
          <div className="space-y-3 mb-6">
            {/* Annual Plan */}
            <div className="border border-blue-500 rounded-xl p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">112,81 €</p>
                  <p className="text-xs text-gray-500">7 days for free</p>
                  <p className="text-xs text-gray-400">Billed annually at 112,81 € after free trial</p>
                </div>
                <Button className="rounded-full bg-blue-500 hover:bg-blue-600">Select</Button>
              </div>
            </div>

            {/* Monthly Plan */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">11,28 €</p>
                  <p className="text-xs text-gray-500">1-month</p>
                  <p className="text-xs text-gray-400">No cancellation fee</p>
                </div>
                <Button variant="outline" className="rounded-full">
                  Select
                </Button>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-1">
                <Check className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm">Special discount on all Juicefast products</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-1">
                <Check className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm">10% off on all products</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-1">
                <Check className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm">All-inclusive personalized goal-oriented programs</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-1">
                <Check className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm">1:1 talks with our nutritionist and health experts</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-1">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm">Free gifts on every delivery</p>
            </div>
          </div>
        </div>
        <DrawerFooter>
          {ctaButton}
          <p className="text-xs text-center text-gray-500">Terms & conditions apply</p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
