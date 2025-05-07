"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { features, sampleMeals, benefitsList } from "@/data/landing-page";

// Animation variants for features
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans">
      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-full h-full text-4xl md:text-5xl">
                🥤
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
          >
            <span className="text-green-600">Juice</span>fast
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-md mx-auto"
          >
            Your personal nutrition companion for tracking meals and maintaining a healthy lifestyle
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md mx-auto"
          >
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
              <Link href="/sign-up" className="w-full">
                Get Started
              </Link>
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full">
              <Link href="/sign-in" className="w-full">
                Login
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12"
        >
          Why Choose Juicefast?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Track Your Nutrition Journey</h2>
            <p className="text-gray-700 mb-6">
              Juicefast helps you monitor your daily nutrition intake with detailed macro breakdowns, meal analysis, and progress tracking.
            </p>

            <ul className="space-y-3">
              {benefitsList.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <span className="text-green-500">✓</span> {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-blue-100 rounded-3xl transform rotate-3 scale-95 -z-10"></div>
              <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-xl border-8 border-gray-800">
                <div className="pt-6 px-4 bg-gradient-to-b from-green-50 to-white">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold text-gray-900">Today's Meals</div>
                    <div className="text-sm text-green-600 font-medium">1,850 kcal</div>
                  </div>

                  <div className="space-y-3 pb-4">
                    {sampleMeals.map((meal, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">{meal.calories} kcal</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-blue-50 p-1 rounded text-center">
                            <span className="block font-medium text-blue-700">{meal.protein}g</span>
                            <span className="text-gray-600">Protein</span>
                          </div>
                          <div className="bg-amber-50 p-1 rounded text-center">
                            <span className="block font-medium text-amber-700">{meal.carbs}g</span>
                            <span className="text-gray-600">Carbs</span>
                          </div>
                          <div className="bg-orange-50 p-1 rounded text-center">
                            <span className="block font-medium text-orange-700">{meal.fat}g</span>
                            <span className="text-gray-600">Fat</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your nutrition?</h2>
          <p className="text-green-50 mb-8 max-w-lg mx-auto">
            Join thousands of users who have improved their health with Juicefast's nutrition tracking tools.
          </p>

          <Button className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6 h-auto">
            <Link href="/sign-up">Start Your Journey Today</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
