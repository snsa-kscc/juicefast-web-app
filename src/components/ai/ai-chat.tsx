"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, Bot, Loader2 } from "lucide-react";

interface AIChatProps {
  userId: string;
}

export function AIChat({ userId }: AIChatProps) {
  const { messages, input, handleInputChange, handleSubmit, status, error } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI health assistant. I can provide insights based on your tracked health data and offer personalized recommendations. What would you like to know today?",
      },
    ],
    body: {
      userId,
    },
    onError: (error) => {
      console.error("Error in chat:", error);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardDescription>Get personalized health insights and recommendations based on your tracked data</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-hidden mb-4">
          <ScrollArea className="h-full w-full">
            <div className="space-y-4 p-4 pb-4 flex flex-col">
              {messages.map((message) => {
                if (message.role === "user") {
                  return (
                    <div key={message.id} className="flex items-start justify-end gap-3 w-full">
                      <div className="rounded-lg px-4 py-2 text-sm bg-primary text-primary-foreground max-w-[80%]">{message.content}</div>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>{userId.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  );
                } else {
                  return (
                    <div key={message.id} className="flex items-start gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary/20">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 text-sm bg-muted">{message.content}</div>
                    </div>
                  );
                }
              })}

              {status === "streaming" && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2 text-sm text-red-500 bg-red-50 rounded-md">Error: {error.message || "Something went wrong. Please try again."}</div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 pt-0">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={status === "streaming"}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={status === "streaming" || !input.trim()}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
