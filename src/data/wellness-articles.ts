// Wellness articles data for the wellness section
export interface WellnessArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  content: string;
  imageUrl: string;
  relatedArticles?: number[];
}

export const WELLNESS_ARTICLES: WellnessArticle[] = [
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
      
      <p>Instead of sitting in a conference room, suggest walking meetings for one-on-one discussions. Walking meetings not only increase your step count but can also boost creativity and productivity.</p>
      
      <h2>3. Set Reminders to Move</h2>
      
      <p>It's easy to get caught up in work and remain sedentary for hours. Set a timer to remind yourself to stand up and walk around for a few minutes every hour. Even a short walk around your home or office can add significant steps to your daily total.</p>
      
      <h2>4. Make Walking Social</h2>
      
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
      
      <h2>The Mindless Eating Trap</h2>
      
      <p>Many of us eat on autopilot, barely noticing what or how much we're consuming. We eat while working, watching TV, or scrolling through our phones. This mindless eating can lead to:</p>
      
      <ul>
        <li>Overeating before realizing you're full</li>
        <li>Missing out on the pleasure and satisfaction of food</li>
        <li>Poor digestion due to eating too quickly</li>
        <li>Unhealthy food choices made without awareness</li>
        <li>Emotional eating without addressing the underlying feelings</li>
      </ul>
      
      <h2>Benefits of Mindful Eating</h2>
      
      <p>Research has shown that practicing mindful eating can lead to:</p>
      
      <ul>
        <li><strong>Better digestion:</strong> Eating slowly and chewing thoroughly improves digestion and nutrient absorption.</li>
        <li><strong>Weight management:</strong> Being more aware of hunger and fullness cues helps prevent overeating.</li>
        <li><strong>Reduced binge eating:</strong> Mindfulness techniques can help break the cycle of emotional eating.</li>
        <li><strong>Greater satisfaction:</strong> When you pay attention to your food, you enjoy it more and may need less to feel satisfied.</li>
        <li><strong>Healthier food choices:</strong> Mindfulness helps you recognize how different foods affect your body and energy levels.</li>
      </ul>
      
      <h2>How to Practice Mindful Eating</h2>
      
      <p>Try these simple steps to bring mindfulness to your meals:</p>
      
      <ol>
        <li><strong>Eat without distractions:</strong> Turn off screens and focus solely on your meal.</li>
        <li><strong>Engage your senses:</strong> Notice the colors, smells, textures, and flavors of your food.</li>
        <li><strong>Eat slowly:</strong> Put down your utensils between bites and chew thoroughly.</li>
        <li><strong>Check in with your hunger:</strong> Before, during, and after eating, rate your hunger on a scale of 1-10.</li>
        <li><strong>Notice without judgment:</strong> Observe your thoughts and feelings about food without labeling them as "good" or "bad."</li>
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
      
      <h2>The Sleep Cycle Explained</h2>
      
      <p>Sleep isn't a uniform state of unconsciousness. Instead, your brain cycles through different stages of sleep throughout the night:</p>
      
      <ul>
        <li><strong>Stage 1 (N1):</strong> Light sleep where you drift in and out of consciousness and can be easily awakened.</li>
        <li><strong>Stage 2 (N2):</strong> Slightly deeper sleep where your heart rate slows and body temperature drops.</li>
        <li><strong>Stage 3 (N3):</strong> Deep sleep or slow-wave sleep, which is crucial for physical recovery and immune function.</li>
        <li><strong>REM Sleep:</strong> Rapid Eye Movement sleep, where most dreaming occurs and memory consolidation takes place.</li>
      </ul>
      
      <p>A complete sleep cycle takes about 90-110 minutes, and you typically go through 4-6 cycles per night. The first cycles of the night contain more deep sleep, while later cycles contain more REM sleep.</p>
      
      <h2>Optimizing Your Sleep Cycles</h2>
      
      <p>Here are strategies to improve your sleep quality by working with your natural cycles:</p>
      
      <h3>1. Plan Your Sleep Duration in Multiples of 90 Minutes</h3>
      
      <p>Try to plan your sleep in 90-minute increments (7.5 hours or 9 hours rather than 8) to avoid waking up in the middle of a deep sleep cycle, which can cause grogginess.</p>
      
      <h3>2. Maintain a Consistent Sleep Schedule</h3>
      
      <p>Going to bed and waking up at the same time every day helps regulate your body's internal clock, making it easier to fall asleep and wake up naturally.</p>
      
      <h3>3. Create a Sleep-Conducive Environment</h3>
      
      <p>Keep your bedroom dark, quiet, and cool (around 65°F or 18°C) to support deeper sleep cycles.</p>
      
      <h3>4. Avoid Sleep Disruptors</h3>
      
      <p>Caffeine, alcohol, large meals, and screen time before bed can disrupt your natural sleep cycles. Try to avoid these in the hours leading up to bedtime.</p>
      
      <h3>5. Use Sleep Tracking</h3>
      
      <p>Our sleep tracker can help you understand your personal sleep patterns and optimize your sleep schedule accordingly.</p>
      
      <p>Remember that individual sleep needs vary, and what matters most is how you feel during the day. If you're consistently waking up refreshed and maintaining energy throughout the day, your sleep cycles are likely working well for you.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2942&auto=format&fit=crop",
    relatedArticles: [2, 6]
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
        <li>Maintains blood volume and pressure</li>
        <li>Supports cognitive function</li>
      </ul>
      
      <p>Even mild dehydration—as little as 1-2% of your body weight—can impair physical performance, reduce energy levels, and affect mental clarity.</p>
      
      <h2>Signs You Need More Water</h2>
      
      <p>Your body has several ways of signaling dehydration:</p>
      
      <ul>
        <li><strong>Thirst:</strong> By the time you feel thirsty, you're already slightly dehydrated</li>
        <li><strong>Dark urine:</strong> Urine should be pale yellow; darker colors indicate dehydration</li>
        <li><strong>Fatigue:</strong> Low energy can be a sign you need more fluids</li>
        <li><strong>Headaches:</strong> Dehydration can trigger or worsen headaches</li>
        <li><strong>Dry skin and lips:</strong> Your skin may feel tight or look dull when dehydrated</li>
        <li><strong>Dizziness:</strong> Especially when standing up quickly</li>
      </ul>
      
      <h2>How Much Water Do You Need?</h2>
      
      <p>While the common recommendation is eight 8-ounce glasses (about 2 liters) per day, individual needs vary based on:</p>
      
      <ul>
        <li>Body size and weight</li>
        <li>Activity level</li>
        <li>Climate and environment</li>
        <li>Overall health</li>
        <li>Pregnancy or breastfeeding status</li>
      </ul>
      
      <p>A good rule of thumb is to drink enough so that you're rarely thirsty and your urine is pale yellow.</p>
      
      <h2>Tips for Staying Hydrated</h2>
      
      <ol>
        <li><strong>Carry a water bottle:</strong> Keep water with you throughout the day</li>
        <li><strong>Set reminders:</strong> Use our water tracker to remind you to drink regularly</li>
        <li><strong>Flavor your water:</strong> Add fruit, cucumber, or herbs if you find plain water boring</li>
        <li><strong>Eat water-rich foods:</strong> Fruits and vegetables like watermelon, cucumber, and oranges are excellent sources of water</li>
        <li><strong>Create habits:</strong> Drink a glass of water when you wake up, before meals, and before bed</li>
      </ol>
      
      <p>Remember, staying hydrated is one of the simplest yet most effective ways to improve your health and wellbeing.</p>
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
      
      <h2>Why Most Health Routines Fail</h2>
      
      <p>Many people start health journeys with enthusiasm but struggle to maintain them. Common reasons include:</p>
      
      <ul>
        <li><strong>Overly ambitious goals:</strong> Trying to change too much at once</li>
        <li><strong>All-or-nothing thinking:</strong> Believing one slip-up means total failure</li>
        <li><strong>Lack of enjoyment:</strong> Following routines that feel like punishment</li>
        <li><strong>Ignoring personal preferences:</strong> Adopting habits that don't fit your lifestyle</li>
        <li><strong>No accountability:</strong> Having no system to track progress or stay motivated</li>
      </ul>
      
      <h2>Building a Sustainable Wellness Routine</h2>
      
      <h3>1. Start Small</h3>
      
      <p>Begin with tiny habits that take less than two minutes to complete. For example:</p>
      <ul>
        <li>Drinking a glass of water when you wake up</li>
        <li>Taking a one-minute breathing break</li>
        <li>Doing five squats while waiting for your coffee to brew</li>
      </ul>
      
      <h3>2. Stack Habits</h3>
      
      <p>Attach new habits to existing routines. For example: "After I brush my teeth (current habit), I will do one minute of stretching (new habit)."</p>
      
      <h3>3. Focus on Consistency, Not Perfection</h3>
      
      <p>It's better to do a little bit consistently than to do a perfect routine occasionally. Aim for "good enough" most days rather than "perfect" rarely.</p>
      
      <h3>4. Make It Enjoyable</h3>
      
      <p>Choose activities you genuinely like. Listen to podcasts while walking, cook healthy meals with friends, or find a workout style that feels fun rather than punishing.</p>
      
      <h3>5. Track Your Progress</h3>
      
      <p>Use our tracking tools to monitor your habits. Seeing your progress provides motivation and helps identify patterns in your behavior.</p>
      
      <h3>6. Build a Flexible Framework</h3>
      
      <p>Rather than rigid rules, create flexible routines that can adapt to different circumstances. Have backup plans for busy days or when traveling.</p>
      
      <h3>7. Practice Self-Compassion</h3>
      
      <p>When you inevitably miss a day or make choices that don't align with your goals, respond with kindness rather than criticism. This resilience is crucial for long-term success.</p>
      
      <p>Remember that sustainable wellness isn't about dramatic transformations but rather consistent small actions that compound over time. Start where you are, use what you have, and do what you can.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2920&auto=format&fit=crop",
    relatedArticles: [1, 3, 4]
  }
];
