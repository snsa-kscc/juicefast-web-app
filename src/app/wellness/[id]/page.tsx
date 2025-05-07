"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, HeartIcon, Share2Icon, BookmarkIcon } from "lucide-react";
import { WELLNESS_ARTICLES } from "@/data/wellness-articles";

export default function WellnessArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  
  const article = WELLNESS_ARTICLES.find((article) => article.id === id);
  
  if (!article) {
    return (
      <div className="py-6 text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-6">The wellness article you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/wellness")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wellness
        </Button>
      </div>
    );
  }
  
  // Find related articles
  const relatedArticlesData = article.relatedArticles 
    ? WELLNESS_ARTICLES.filter(a => article.relatedArticles?.includes(Number(a.id)))
    : [];
  
  return (
    <div className="py-6 font-sans">
      <Button variant="ghost" className="mb-6 p-0 h-9 w-9" onClick={() => router.push("/wellness")}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{article.date}</span>
          <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">{article.category}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <p className="text-gray-500">By {article.author}</p>
      </div>
      
      {/* Article actions */}
      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" className="flex-1">
          <BookmarkIcon className="h-4 w-4 mr-2" /> Save
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Share2Icon className="h-4 w-4 mr-2" /> Share
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <HeartIcon className="h-4 w-4 mr-2" /> Like
        </Button>
      </div>
      
      <div 
        className="prose prose-indigo max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      
      {/* Related articles */}
      {relatedArticlesData.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticlesData.map(relatedArticle => (
              <Card 
                key={relatedArticle.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/wellness/${relatedArticle.id}`)}
              >
                <CardContent className="p-4 flex items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    <img 
                      src={relatedArticle.imageUrl} 
                      alt={relatedArticle.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium line-clamp-2">{relatedArticle.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{relatedArticle.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Action button */}
      <div className="mt-8 text-center">
        <Button onClick={() => router.push("/tracker")}>
          Start Tracking Your Health
        </Button>
      </div>
    </div>
  );
}
