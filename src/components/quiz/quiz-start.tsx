"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BodyFigure from "@/components/shapes/body-figure";
import Scale from "@/components/shapes/scale";
import Star from "@/components/shapes/star";
import Dumbbell from "@/components/shapes/dumbbell";
import Image from "next/image";
import logo from "../../../public/jf-pictogram.png";

interface QuizStartProps {
  onStart: () => void;
  onSkip: () => void;
}

export function QuizStart({ onStart, onSkip }: QuizStartProps) {
  return (
    <div className="min-h-screen bg-[#F8F6F2] relative flex items-center justify-center p-6">
      {/* Background decorative vectors - subtle gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-br from-[#F8F6F2] via-[#F8F6F2] to-[#F8E6D8]/30"></div>

      {/* Main card */}
      <Card className="w-full max-w-sm border-none shadow-none bg-transparent relative z-10" style={{ borderRadius: "24px" }}>
        <CardHeader className="text-center space-y-6 pt-12 pb-6 px-8">
          {/* App logo */}
          <div className="mx-auto w-20 h-20 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6">
            <Image src={logo} alt="juicefast" width={65} height={65} />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold text-[#1A1A1A] leading-tight">
              Daily habits,
              <br />
              lasting change
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-12 space-y-12">
          {/* Statistics grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BodyFigure />
              </div>
              <div className="font-bold text-xl">30.000+</div>
              <div className="text-sm text-gray-700">Transformations</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Scale />
              </div>
              <div className="font-bold text-xl">4.2kg</div>
              <div className="text-sm text-gray-700">Avg. weightloss</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Star />
              </div>
              <div className="font-bold text-xl">4.000.000+</div>
              <div className="text-sm text-gray-700">Sold products</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Dumbbell />
              </div>
              <div className="font-bold text-xl">12.000+</div>
              <div className="text-sm text-gray-700">
                Following our
                <br />
                plans
              </div>
            </div>
          </div>

          {/* Description text */}
          <div className="text-center">
            <p className="text-base text-gray-800 leading-relaxed">
              We'll ask you a few short questions to personalize your experience, you can skip at any time
            </p>
          </div>

          {/* Start button */}
          <div>
            <Button onClick={onStart} className="w-full h-14 bg-[#1A1A1A] hover:bg-[#333333] text-white font-medium text-base transition-colors rounded-full">
              Start your journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
