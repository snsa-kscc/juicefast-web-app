"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Apple, ArrowRight, CheckCircle2, Flame, Heart, LineChart, Salad, Utensils, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-green-300 to-teal-300 opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-pink-300 to-orange-300 opacity-20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2">
              <Salad className="h-8 w-8 text-green-500" />
              <Image src="/jf-logo.png" alt="Juicefast" width={100} height={100} className="object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Button
                onClick={() => router.push("/sign-in")}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-full px-6"
              >
                Login
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section style={mounted ? { opacity, scale } : { opacity: 1, scale: 1 }} className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2 space-y-6 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Track Your Nutrition <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">For a Healthier You</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                Monitor your meals, track calories, and achieve your health goals with our intuitive nutrition tracking app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-green-500/20"
                >
                  Get Started
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden">
                      <Image src={`/user-avatar.png`} alt={`User ${i}`} width={40} height={40} className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold">1,000+</span> active users
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 mx-auto lg:ml-auto lg:mr-0 max-w-lg">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity" />

                  {/* Glassmorphism card */}
                  <div className="relative bg-white/20 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-800/30 shadow-xl overflow-hidden p-1">
                    <Image src="/juice.png" alt="Juicefast Dashboard" width={700} height={500} className="rounded-2xl" />
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  initial={{ x: 20, y: 20, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -right-4 top-5 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg backdrop-blur-lg bg-opacity-70 dark:bg-opacity-70 border border-white/30 dark:border-gray-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Daily Calories</p>
                      <p className="font-bold">1,840 / 2,200</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, y: 20, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute -left-4 bottom-10 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg backdrop-blur-lg bg-opacity-70 dark:bg-opacity-70 border border-white/30 dark:border-gray-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Health Score</p>
                      <p className="font-bold">92 / 100</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need to Track Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500"> Nutrition</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">Our comprehensive features make nutrition tracking simple, intuitive, and effective.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Utensils className="h-6 w-6 text-green-500" />,
                title: "Meal Tracking",
                description: "Log your meals and track your nutrition. Get recommendations to help you stay on track.",
              },
              {
                icon: <LineChart className="h-6 w-6 text-blue-500" />,
                title: "Nutrition Analysis",
                description: "Get detailed breakdowns of macros, vitamins, and minerals for every meal.",
              },
              {
                icon: <Zap className="h-6 w-6 text-yellow-500" />,
                title: "Energy Monitoring",
                description: "Track your calorie intake and expenditure to maintain your energy balance.",
              },
              {
                icon: <Apple className="h-6 w-6 text-red-500" />,
                title: "Custom Meal Plans",
                description: "Create and follow personalized meal plans based on your health goals.",
              },
              {
                icon: <CheckCircle2 className="h-6 w-6 text-purple-500" />,
                title: "Goal Setting",
                description: "Set and track nutrition goals with progress visualization and insights.",
              },
              {
                icon: <Heart className="h-6 w-6 text-pink-500" />,
                title: "Health Insights",
                description: "Receive personalized recommendations based on your nutrition patterns.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 border border-white/30 dark:border-gray-800/30 shadow-lg h-full">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-lg relative"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">Juicefast</span> Works
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">Getting started is easy. Follow these simple steps to begin your health journey.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-500 transform -translate-y-1/2 z-0" />

            {[
              {
                step: "01",
                title: "Create Your Account",
                description: "Sign up to get started. Create an account in just a few minutes and start your health journey today.",
              },
              {
                step: "02",
                title: "Set Your Goals",
                description: "Define your nutrition and health goals based on your personal needs.",
              },
              {
                step: "03",
                title: "Track & Improve",
                description: "Log your meals, track progress, and receive personalized insights.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-white/30 dark:border-gray-800/30 shadow-lg h-full relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <div className="pt-6">
                    <h3 className="text-xl font-bold mb-3 text-center">{item.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-center">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Loved by <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">Thousands</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">See what our users have to say about their experience with Juicefast.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Marin Juicefast",
                role: "Fitness Enthusiast",
                image: "/juice.png",
                quote: "Juicefast has completely transformed my approach to nutrition. The insights are invaluable!",
              },
              {
                name: "Martina Juicefast",
                role: "Marathon Runner",
                image: "/juice.png",
                quote: "As an athlete, proper nutrition is crucial. This app makes it so easy to ensure I'm fueling properly.",
              },
              {
                name: "Darko Juicefast",
                role: "Wellness Coach",
                image: "/juice.png",
                quote: "I recommend Juicefast to all my clients. The user interface is intuitive and the data is comprehensive.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Glassmorphism card */}
                  <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl p-8 border border-white/30 dark:border-gray-800/30 shadow-lg h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <Image src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} width={80} height={80} className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-lg relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simple, Transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">Pricing</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">One affordable plan with all the features you need to achieve your nutrition goals.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-xl blur-xl opacity-70" />

              {/* Glassmorphism card */}
              <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl p-8 border border-green-500/50 dark:border-green-500/30 shadow-lg">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-bold py-1 px-4 rounded-full">
                  Premium Plan
                </div>
                <div className="text-center mb-6 pt-4">
                  <h3 className="text-2xl font-bold mb-2">Juicefast Premium</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">€14.99</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Everything you need for better nutrition</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Comprehensive meal tracking",
                    "Detailed nutrition analysis",
                    "Custom meal plans",
                    "Recipe suggestions",
                    "Progress tracking & insights",
                    "Goal setting & monitoring",
                    "Priority support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                >
                  Start Your Journey
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-3xl blur-2xl opacity-70" />

            {/* Glassmorphism card */}
            <div className="relative bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl rounded-3xl p-12 border border-white/30 dark:border-gray-800/30 shadow-xl overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-green-500/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="lg:w-2/3">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Transform Your
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500"> Nutrition?</span>
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Join thousands of users who have already improved their health with Juicefast.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push("/sign-up")}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-green-500/20 flex items-center gap-2"
                    >
                      Sign Up Now <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="lg:w-1/3">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-xl mb-2 text-center">Start Today</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Full access for €14.99/month</p>
                    <Button
                      onClick={() => router.push("/sign-up")}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    >
                      Start Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
