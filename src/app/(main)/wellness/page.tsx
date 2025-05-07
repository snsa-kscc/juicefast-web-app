"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartIcon, BookOpenIcon, BrainIcon } from "lucide-react";
import { WELLNESS_ARTICLES } from "@/data/wellness-articles";
import { WELLNESS_PROGRAMS } from "@/data/wellness-programs";
import { WELLNESS_TIPS } from "@/data/wellness-tips";

export default function WellnessPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory ? WELLNESS_ARTICLES.filter((article) => article.category === selectedCategory) : WELLNESS_ARTICLES;

  const categories = Array.from(new Set(WELLNESS_ARTICLES.map((article) => article.category)));

  return (
    <div className="py-6 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Wellness Center</h1>
        <p className="text-gray-500 mt-2">Articles and tips for your health journey</p>
      </div>

      {/* Featured wellness programs */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Featured Programs</h2>
        <div className="grid grid-cols-2 gap-4">
          {WELLNESS_PROGRAMS.map(program => {
            const IconComponent = program.icon === "Brain" ? BrainIcon : HeartIcon;
            const colorClasses = program.color === "blue" ? 
              { bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100", icon: "bg-blue-100 text-blue-600", title: "text-blue-700", text: "text-blue-600" } :
              { bg: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100", icon: "bg-green-100 text-green-600", title: "text-green-700", text: "text-green-600" };
            
            return (
              <Card key={program.id} className={colorClasses.bg}>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`${colorClasses.icon.split(' ')[0]} p-2 rounded-full mb-2`}>
                      <IconComponent className={`h-6 w-6 ${colorClasses.icon.split(' ')[1]}`} />
                    </div>
                    <h3 className={`font-medium ${colorClasses.title}`}>{program.title}</h3>
                    <p className={`text-xs ${colorClasses.text} mt-1`}>{program.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Wellness Articles</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)}>
            All
          </Button>
          {categories.map((category) => (
            <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden h-full flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">{article.date}</span>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">{article.category}</span>
              </div>
              <CardTitle className="text-xl">{article.title}</CardTitle>
              <CardDescription>{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-3 text-gray-600">{article.content}</p>
            </CardContent>
            <div className="p-4 pt-0 mt-auto">
              <Button variant="outline" className="w-full" onClick={() => router.push(`/wellness/${article.id}`)}>
                Read More
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Daily wellness tip */}
      <Card className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BookOpenIcon className="h-5 w-5 mr-2 text-amber-500" />
            Daily Wellness Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-800">
            "{WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)].content}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
