"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, HeartIcon, Share2Icon, BookmarkIcon } from "lucide-react";

// Sample wellness articles data
const WELLNESS_ARTICLES = [
  {
    id: "1",
    title: "The Benefits of Tracking Your Meals",
    excerpt: "Learn how tracking your daily meals can lead to better nutrition and overall health.",
    date: "May 5, 2025",
    author: "Nutrition Team",
    category: "Nutrition",
    content: `
      <p>Tracking your meals is one of the most effective ways to improve your diet and overall health. By keeping a record of what you eat, you become more aware of your eating patterns and can make more informed decisions about your nutrition.</p>
      
      <h2>Why Track Your Meals?</h2>
      
      <p>Research has shown that people who track their food intake tend to eat healthier and lose more weight than those who don't. Here are some key benefits:</p>
      
      <ul>
        <li><strong>Increased awareness:</strong> Simply being conscious of what you eat can help you make better choices.</li>
        <li><strong>Accountability:</strong> When you record everything, you're less likely to mindlessly snack or overeat.</li>
        <li><strong>Pattern recognition:</strong> You'll start to notice connections between what you eat and how you feel.</li>
        <li><strong>Better portion control:</strong> Measuring and recording portions helps you understand appropriate serving sizes.</li>
        <li><strong>Nutritional insights:</strong> You'll learn which foods provide the nutrients your body needs.</li>
      </ul>
      
      <h2>How to Get Started</h2>
      
      <p>Begin by recording everything you eat and drink for at least a week. Include:</p>
      
      <ul>
        <li>The type of food and how it was prepared</li>
        <li>Portion sizes (using measurements when possible)</li>
        <li>Time of day you ate</li>
        <li>How hungry you felt before eating (on a scale of 1-10)</li>
        <li>Your mood or how you felt while eating</li>
      </ul>
      
      <p>After a week, review your log to identify patterns and areas for improvement. Are you eating enough protein? Too many processed foods? Not enough vegetables? Use these insights to make small, sustainable changes to your diet.</p>
      
      <h2>Tools to Help You Track</h2>
      
      <p>While a simple notebook works well, digital tools like our meal tracker make the process even easier by automatically calculating nutritional information and providing insights into your eating habits.</p>
      
      <p>Remember, the goal isn't perfection—it's progress. Even tracking 80% of what you eat will give you valuable insights that can help improve your nutrition and overall health.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2940&auto=format&fit=crop",
    relatedArticles: [2, 5]
  },
  {
    id: "2",
    title: "5 Ways to Increase Your Daily Step Count",
    excerpt: "Simple strategies to help you move more throughout the day and reach your step goals.",
    date: "May 2, 2025",
    author: "Fitness Team",
    category: "Activity",
    content: `
      <p>Walking is one of the most accessible forms of exercise, and increasing your daily step count can have significant health benefits. Here are five simple strategies to help you move more throughout your day.</p>
      
      <h2>1. Take the Long Route</h2>
      
      <p>Look for opportunities to add extra steps to your daily routine. Park farther from store entrances, take the stairs instead of the elevator, or walk to a bathroom on a different floor at work. These small detours can add hundreds of extra steps to your day.</p>
      
      <h2>2. Schedule Walking Meetings</h2>
      
      <p>Instead of sitting in a conference room or at your desk for every meeting, suggest walking meetings for one-on-one discussions. Not only will you increase your step count, but the physical activity can also boost creativity and problem-solving.</p>
      
      <h2>3. Set Hourly Reminders</h2>
      
      <p>Extended periods of sitting can be harmful to your health. Set an alarm to remind yourself to get up and move for at least 2-3 minutes every hour. A quick lap around your home or office can add 250-300 steps each time.</p>
      
      <h2>4. Make It Social</h2>
      
      <p>Walking with friends, family, or colleagues can make increasing your step count more enjoyable. Schedule regular walking dates, join a walking group, or challenge coworkers to step competitions using fitness trackers.</p>
      
      <h2>5. Turn Chores Into Opportunities</h2>
      
      <p>Household tasks provide excellent opportunities for additional steps. Put away items one at a time instead of carrying everything at once, take multiple trips to bring in groceries, or walk around while talking on the phone.</p>
      
      <p>Remember, every step counts! Even if you can't reach 10,000 steps every day, any increase in your daily movement will benefit your health. Start where you are and gradually build up over time.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2940&auto=format&fit=crop",
    relatedArticles: [4, 6]
  },
  {
    id: "3",
    title: "Mindfulness and Nutrition: The Connection",
    excerpt: "How practicing mindfulness can transform your relationship with food and improve eating habits.",
    date: "April 28, 2025",
    author: "Wellness Team",
    category: "Mindfulness",
    content: `
      <p>Mindfulness—the practice of paying attention to the present moment without judgment—can transform your relationship with food and significantly improve your eating habits. Here's how mindfulness and nutrition are connected.</p>
      
      <h2>Understanding Mindful Eating</h2>
      
      <p>Mindful eating involves paying full attention to the experience of eating and drinking, both inside and outside the body. It includes:</p>
      
      <ul>
        <li>Observing the colors, smells, textures, flavors, temperatures, and sounds of your food</li>
        <li>Noticing how your body responds to hunger and fullness cues</li>
        <li>Recognizing emotional and non-hunger triggers for eating</li>
        <li>Appreciating the origins of your food and the work that went into bringing it to your table</li>
      </ul>
      
      <h2>Benefits of Mindful Eating</h2>
      
      <p>Research has shown that practicing mindful eating can lead to:</p>
      
      <ul>
        <li><strong>Better digestion:</strong> Eating slowly and chewing thoroughly improves digestion and nutrient absorption.</li>
        <li><strong>Weight management:</strong> Being aware of hunger and fullness cues helps prevent overeating.</li>
        <li><strong>Reduced emotional eating:</strong> Mindfulness helps you recognize when you're eating due to stress, boredom, or other emotions rather than hunger.</li>
        <li><strong>Greater satisfaction:</strong> When you pay attention to your food, you're more likely to enjoy and feel satisfied by your meals.</li>
        <li><strong>Healthier food choices:</strong> Mindfulness often leads to a natural preference for nutritious, whole foods.</li>
      </ul>
      
      <h2>How to Practice Mindful Eating</h2>
      
      <p>Start with these simple steps:</p>
      
      <ol>
        <li><strong>Eat without distractions:</strong> Turn off screens and put away your phone during meals.</li>
        <li><strong>Slow down:</strong> Take smaller bites, chew thoroughly, and put your utensils down between bites.</li>
        <li><strong>Engage your senses:</strong> Notice the appearance, aroma, texture, and flavor of your food.</li>
        <li><strong>Check in with your hunger:</strong> Before, during, and after eating, rate your hunger on a scale of 1-10.</li>
        <li><strong>Express gratitude:</strong> Take a moment to appreciate where your food came from and who prepared it.</li>
      </ol>
      
      <p>By bringing mindfulness to your meals, you can develop a healthier relationship with food that nourishes both body and mind.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2731&auto=format&fit=crop",
    relatedArticles: [1, 6]
  },
  {
    id: "4",
    title: "Understanding Sleep Cycles for Better Rest",
    excerpt: "Learn how sleep cycles work and how to optimize your sleep for better health.",
    date: "April 25, 2025",
    author: "Sleep Expert",
    category: "Sleep",
    content: `
      <p>Quality sleep is essential for overall health and wellbeing. Understanding your sleep cycles can help you optimize your rest and wake up feeling more refreshed.</p>
      
      <h2>The Stages of Sleep</h2>
      
      <p>Sleep is not a uniform state. Throughout the night, your brain cycles through different stages of sleep:</p>
      
      <ul>
        <li><strong>Stage 1 (N1):</strong> Light sleep where you drift in and out of consciousness and can be easily awakened.</li>
        <li><strong>Stage 2 (N2):</strong> Slightly deeper sleep where your heart rate slows and body temperature drops.</li>
        <li><strong>Stage 3 (N3):</strong> Deep sleep (slow-wave sleep) that's crucial for physical restoration and immune function.</li>
        <li><strong>REM Sleep:</strong> Rapid Eye Movement sleep where most dreaming occurs and memory consolidation happens.</li>
      </ul>
      
      <p>A complete sleep cycle takes about 90-110 minutes, and you typically go through 4-6 cycles per night.</p>
      
      <h2>Optimizing Your Sleep Cycles</h2>
      
      <p>To wake up feeling refreshed, try these strategies:</p>
      
      <ol>
        <li><strong>Plan your sleep in 90-minute increments:</strong> Aim for 7.5 hours (5 cycles) or 9 hours (6 cycles) to avoid waking during deep sleep.</li>
        <li><strong>Maintain a consistent schedule:</strong> Going to bed and waking up at the same time helps regulate your body's internal clock.</li>
        <li><strong>Create a bedtime routine:</strong> Signal to your body that it's time to wind down with relaxing activities before bed.</li>
        <li><strong>Optimize your sleep environment:</strong> Keep your bedroom cool, dark, and quiet to promote deeper sleep.</li>
      </ol>
      
      <h2>Signs of Disrupted Sleep Cycles</h2>
      
      <p>If you experience these symptoms, your sleep cycles may be disrupted:</p>
      
      <ul>
        <li>Difficulty falling asleep or staying asleep</li>
        <li>Waking up feeling unrefreshed despite adequate sleep duration</li>
        <li>Excessive daytime sleepiness</li>
        <li>Irritability or mood changes</li>
        <li>Difficulty concentrating</li>
      </ul>
      
      <p>By understanding and respecting your natural sleep cycles, you can improve both the quality and efficiency of your sleep, leading to better health and daily performance.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2942&auto=format&fit=crop",
    relatedArticles: [3, 6]
  },
  {
    id: "5",
    title: "Hydration: Why Water is Your Best Friend",
    excerpt: "Discover the many benefits of staying properly hydrated throughout the day.",
    date: "April 22, 2025",
    author: "Nutrition Team",
    category: "Hydration",
    content: `
      <p>Water is essential for nearly every bodily function. Staying properly hydrated can improve energy levels, cognitive function, and overall health.</p>
      
      <h2>Why Hydration Matters</h2>
      
      <p>Water makes up about 60% of your body weight and plays numerous crucial roles:</p>
      
      <ul>
        <li>Regulates body temperature</li>
        <li>Lubricates joints</li>
        <li>Delivers nutrients to cells</li>
        <li>Flushes toxins from organs</li>
        <li>Maintains blood volume and circulation</li>
        <li>Supports cognitive function</li>
      </ul>
      
      <h2>Signs of Dehydration</h2>
      
      <p>Many people walk around chronically dehydrated without realizing it. Watch for these signs:</p>
      
      <ul>
        <li>Thirst (by the time you feel thirsty, you're already slightly dehydrated)</li>
        <li>Dark yellow urine</li>
        <li>Dry mouth, lips, and skin</li>
        <li>Headache</li>
        <li>Fatigue</li>
        <li>Dizziness</li>
        <li>Decreased urination</li>
      </ul>
      
      <h2>How Much Water Do You Need?</h2>
      
      <p>While the common recommendation is eight 8-ounce glasses daily (about 2 liters), your individual needs may vary based on:</p>
      
      <ul>
        <li>Body size and weight</li>
        <li>Activity level</li>
        <li>Climate</li>
        <li>Health status</li>
        <li>Pregnancy or breastfeeding</li>
      </ul>
      
      <p>A good rule of thumb: Drink enough so that your urine is pale yellow or clear.</p>
      
      <h2>Tips for Staying Hydrated</h2>
      
      <ol>
        <li>Carry a reusable water bottle with you</li>
        <li>Set reminders to drink water throughout the day</li>
        <li>Drink a glass of water before each meal</li>
        <li>Eat water-rich foods like fruits and vegetables</li>
        <li>Flavor water with fruit or herbs if you find plain water boring</li>
        <li>Track your intake with our water tracker feature</li>
      </ol>
      
      <p>Remember, proper hydration is one of the simplest yet most effective ways to improve your health and wellbeing.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2736&auto=format&fit=crop",
    relatedArticles: [1, 6]
  },
  {
    id: "6",
    title: "Creating a Sustainable Wellness Routine",
    excerpt: "Tips for building healthy habits that last a lifetime.",
    date: "April 18, 2025",
    author: "Wellness Team",
    category: "Lifestyle",
    content: `
      <p>The key to long-term health is creating sustainable wellness routines. Small, consistent actions over time lead to significant improvements in overall wellbeing.</p>
      
      <h2>The Problem with All-or-Nothing Approaches</h2>
      
      <p>Many people approach wellness with an all-or-nothing mindset, trying to completely overhaul their lifestyle overnight. This approach often leads to:</p>
      
      <ul>
        <li>Burnout and exhaustion</li>
        <li>Feelings of failure when unable to maintain perfection</li>
        <li>Yo-yo patterns of extreme behavior followed by complete abandonment</li>
        <li>Negative associations with healthy behaviors</li>
      </ul>
      
      <h2>Building Sustainable Habits</h2>
      
      <p>Instead, focus on creating sustainable habits with these strategies:</p>
      
      <ol>
        <li><strong>Start small:</strong> Begin with tiny habits that require minimal motivation or effort.</li>
        <li><strong>Stack habits:</strong> Attach new habits to existing routines (e.g., do a quick stretch after brushing your teeth).</li>
        <li><strong>Focus on consistency over intensity:</strong> It's better to walk for 10 minutes daily than run for an hour once a week.</li>
        <li><strong>Plan for obstacles:</strong> Identify potential barriers and create strategies to overcome them.</li>
        <li><strong>Track your progress:</strong> Use our app to monitor your habits and celebrate small wins.</li>
      </ol>
      
      <h2>Creating Your Personal Wellness Framework</h2>
      
      <p>A balanced wellness routine should address multiple dimensions of health:</p>
      
      <ul>
        <li><strong>Physical:</strong> Movement, nutrition, sleep, and hydration</li>
        <li><strong>Mental:</strong> Stress management, cognitive stimulation, and mindfulness</li>
        <li><strong>Emotional:</strong> Processing feelings and cultivating positive emotions</li>
        <li><strong>Social:</strong> Meaningful connections with others</li>
        <li><strong>Spiritual:</strong> Finding purpose and meaning (however you define it)</li>
      </ul>
      
      <p>Choose one small action in each dimension to incorporate into your daily routine. Over time, these small actions will compound into significant improvements in your overall wellbeing.</p>
      
      <h2>The Power of Flexibility</h2>
      
      <p>Remember that a sustainable wellness routine must be flexible. Life happens, and your routine will need to adapt to changing circumstances. The goal isn't perfection but progress—creating a lifestyle that supports your wellbeing for the long term.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2920&auto=format&fit=crop",
    relatedArticles: [1, 3, 4]
  }
];

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
