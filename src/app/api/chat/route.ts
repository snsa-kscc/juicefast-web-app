import { NextRequest, NextResponse } from "next/server";
import { generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getDailyMetrics } from "@/app/actions/health-actions";
import { formatDateKey, getTodayKey } from "@/lib/date-utils";

export async function POST(request: NextRequest) {
  try {
    const { messages, userId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Get the user's health data for context
    const todayKey = getTodayKey();
    const dailyMetrics = (await getDailyMetrics(userId, new Date(todayKey))) || {
      meals: [],
      waterIntake: [],
      steps: [],
      sleep: null,
      mindfulness: [],
      totalScore: 0,
    };

    // Create a context message with the user's health data
    const healthContext = `
      User Health Data Context:
      - Meals: ${dailyMetrics.meals ? `${dailyMetrics.meals.length} meals logged` : "No meals logged"}
      - Water: ${
        dailyMetrics.waterIntake
          ? `${dailyMetrics.waterIntake.length} entries, total: ${dailyMetrics.waterIntake.reduce((sum, entry) => sum + entry.amount, 0)}ml`
          : "No water intake logged"
      }
      - Steps: ${dailyMetrics.steps ? `${dailyMetrics.steps.reduce((sum, entry) => sum + entry.count, 0)} steps` : "No steps logged"}
      - Sleep: ${dailyMetrics.sleep ? `${dailyMetrics.sleep.hoursSlept} hours, quality: ${dailyMetrics.sleep.quality}/10` : "No sleep data logged"}
      - Mindfulness: ${
        dailyMetrics.mindfulness && dailyMetrics.mindfulness.length > 0
          ? `${dailyMetrics.mindfulness.reduce((sum, entry) => sum + entry.minutes, 0)} minutes of ${[
              ...new Set(dailyMetrics.mindfulness.map((entry) => entry.activity)),
            ].join(", ")}`
          : "No mindfulness sessions logged"
      }
      - Overall Health Score: ${dailyMetrics.totalScore ? `${dailyMetrics.totalScore.toFixed(1)}/100` : "Not calculated"}
    `;

    // Add system message with health context
    const systemMessage = {
      role: "system",
      content: `You are an AI health assistant that provides personalized advice based on the user's health tracking data. 
      Be helpful, encouraging, and provide actionable advice.
      
      ${healthContext}
      
      When responding:
      1. Reference the user's actual health data when relevant
      2. Provide specific, actionable advice based on their data
      3. Be encouraging and positive
      4. Keep responses concise and focused
      5. If asked about topics you don't have data for, acknowledge this and provide general advice
      6. Don't use markdown formatting in your responses`,
    };

    // Generate response using Vercel AI SDK
    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
