"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChatMessage, MessageType } from "./chat-message";
import { ChatInput } from "./chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NutritionistProfile, AvailabilityStatus, ChatSession } from "@/types/nutritionist";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// Import the new nutritionist actions
import {
  getNutritionists,
  getUserActiveChatSession,
  getChatMessages,
  sendMessage,
  endChatSession,
  getNutritionistStatus,
  createDirectChatSession,
} from "@/app/actions/nutritionist-actions";

// Define types
type ChatState = "selecting" | "waiting" | "chatting" | "ended";

interface NutritionistChatProps {
  userId: string;
  nutritionists: NutritionistProfile[];
  activeSession?: ChatSession | null;
  initialMessages?: MessageType[];
  isAdmin?: boolean;
  userProfile?: any;
  recentMeals?: any[];
}

interface StatusBadgeProps {
  status: AvailabilityStatus;
  size?: "default" | "sm";
}

interface StatusBadgeAsyncProps {
  nutritionistId: string;
  size?: "default" | "sm";
}

interface NutritionistCardProps {
  nutritionist: NutritionistProfile;
  isSelected: boolean;
  onSelect: () => void;
}

// Helper component for loading spinner
const Spinner = ({ className }: { className?: string }) => (
  <div className={cn("animate-spin", className)}>
    <Clock className="h-4 w-4" />
  </div>
);

// Status badge component
const StatusBadge = ({ status, size = "default" }: StatusBadgeProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case "online":
        return { label: "Available", variant: "success" as const };
      case "busy":
        return { label: "In Session", variant: "warning" as const };
      case "away":
        return { label: "Away", variant: "info" as const };
      case "offline":
        return { label: "Offline", variant: "outline" as const };
      default:
        return { label: "Offline", variant: "outline" as const };
    }
  };

  const { label, variant } = getStatusInfo();
  const className = size === "sm" ? "text-[10px] px-1.5 py-0" : "";

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

// Async version of status badge that fetches status
const StatusBadgeAsync = ({ nutritionistId, size = "default" }: StatusBadgeAsyncProps) => {
  // Start with a consistent initial state for server and client
  const [status, setStatus] = useState<AvailabilityStatus>("offline");
  const [isLoading, setIsLoading] = useState(false); // Start with false to avoid hydration mismatch
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Use a ref to track if we're on the client side
  const isMounted = useRef(false);

  useEffect(() => {
    // Mark as mounted on client side
    isMounted.current = true;

    // Only start loading on the client side after component has mounted
    if (isMounted.current) {
      setIsLoading(true);
    }

    let isActive = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchStatus = async () => {
      if (!isActive || !isMounted.current) return;

      try {
        const currentStatus = await getNutritionistStatus(nutritionistId);
        if (isActive && isMounted.current) {
          setStatus(currentStatus);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (error) {
        console.error("Error fetching nutritionist status:", error);

        // Handle retry logic
        if (isActive && isMounted.current && retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          // Exponential backoff: 2^retry * 1000ms (2s, 4s, 8s)
          const retryDelay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})`);

          retryTimeout = setTimeout(fetchStatus, retryDelay);
        } else {
          // Default to offline after max retries
          if (isActive && isMounted.current) setStatus("offline");
        }
      } finally {
        if (isActive && isMounted.current) setIsLoading(false);
      }
    };

    // Only fetch on client side after component has mounted
    if (isMounted.current) {
      // Small delay to ensure hydration is complete
      const initialFetchTimeout = setTimeout(fetchStatus, 50);

      // Refresh status every 60 seconds
      const intervalId = setInterval(fetchStatus, 60000);

      return () => {
        isActive = false;
        clearInterval(intervalId);
        clearTimeout(initialFetchTimeout);
        if (retryTimeout) clearTimeout(retryTimeout);
      };
    }

    return () => {
      isActive = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [nutritionistId, retryCount]);

  // Only show loading spinner if we've mounted on the client
  if (isLoading && isMounted.current) {
    return (
      <Badge variant="outline" className={size === "sm" ? "text-[10px] px-1.5 py-0" : ""}>
        <span className="inline-block h-3 w-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
        {retryCount > 0 ? `Retry ${retryCount}/${maxRetries}` : "Loading"}
      </Badge>
    );
  }

  return <StatusBadge status={status} size={size} />;
};

// Nutritionist card component
const NutritionistCard = ({ nutritionist, isSelected, onSelect }: NutritionistCardProps) => {
  return (
    <Card className={cn("p-4 cursor-pointer transition-colors", isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50")} onClick={onSelect}>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{nutritionist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{nutritionist.name}</h4>
            <StatusBadgeAsync nutritionistId={nutritionist.id} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">{nutritionist.specialties.join(", ")}</p>
        </div>
      </div>
    </Card>
  );
};

export function NutritionistChat({
  userId,
  nutritionists: initialNutritionists,
  activeSession: initialActiveSession,
  initialMessages = [],
  userProfile,
  recentMeals,
}: NutritionistChatProps) {
  // Use a ref to track if we're on the client side to avoid hydration mismatches
  const isMounted = useRef(false);

  // Start with consistent initial states for server and client
  const [chatState, setChatState] = useState<ChatState>(initialActiveSession ? "chatting" : "selecting");
  const [nutritionists, setNutritionists] = useState<NutritionistProfile[]>(initialNutritionists);
  const [selectedNutritionist, setSelectedNutritionist] = useState<NutritionistProfile | null>(
    initialActiveSession ? nutritionists.find((n) => n.id === initialActiveSession.nutritionistId) || null : null
  );
  const [activeSessionId, setActiveSessionId] = useState<string | null>(initialActiveSession?.id || null);
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [initialQuery, setInitialQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mark component as mounted on client side
  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Load nutritionists and check for active sessions on mount
  useEffect(() => {
    // Only run on the client side to avoid hydration mismatches
    if (!isMounted.current) return;

    const loadInitialData = async () => {
      // Skip if we already have data from server-side props
      if (initialActiveSession && initialMessages.length > 0) {
        return;
      }

      try {
        setIsLoading(true);

        // Get all nutritionists
        const allNutritionists = await getNutritionists();
        setNutritionists(allNutritionists);

        // Check if user has an active session
        const activeSession = await getUserActiveChatSession(userId);

        if (activeSession) {
          // User has an active session, load it
          setActiveSessionId(activeSession.id);
          setChatState("chatting");

          // Get nutritionist info
          const nutritionist = allNutritionists.find((n: NutritionistProfile) => n.id === activeSession.nutritionistId);
          if (nutritionist) {
            setSelectedNutritionist(nutritionist);
          }

          // Load chat messages
          const sessionMessages = await getChatMessages(activeSession.id);
          setMessages(sessionMessages);
        } else {
          // In a real app, you would check for pending requests here
          // For now, we'll just set the state to selecting
          setChatState("selecting");
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load chat data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    // Run after component has mounted on client
    loadInitialData();
  }, [userId, initialActiveSession, initialMessages.length]);

  // Poll for new messages every 60 seconds when in a chat
  useEffect(() => {
    // Only run on the client side
    if (!isMounted.current) return;

    // Don't poll if we're not in a chat
    if (chatState !== "chatting" || !activeSessionId) return;

    const intervalId = setInterval(async () => {
      // Only refresh if we're in a chat and have an active session
      if (chatState === "chatting" && activeSessionId) {
        try {
          const sessionMessages = await getChatMessages(activeSessionId);
          setMessages(sessionMessages);
        } catch (error) {
          console.error("Error refreshing messages:", error);
        }
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [userId, chatState, activeSessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current && isMounted.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectNutritionist = (nutritionist: NutritionistProfile) => {
    setSelectedNutritionist(nutritionist);
  };

  const handleStartChat = async () => {
    if (!selectedNutritionist) return;

    setIsLoading(true);
    setChatState("waiting");

    try {
      // Use the initialQuery state variable directly
      const query = initialQuery.trim();

      const session = await createDirectChatSession(userId, selectedNutritionist.id, query);

      setActiveSessionId(session.id);
      setChatState("chatting");

      setInitialQuery("");

      const sessionMessages = await getChatMessages(session.id);
      setMessages(sessionMessages);
    } catch (error) {
      toast.error("Could not start chat session. Please try again.");
      setChatState("selecting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId || !content.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const result = await sendMessage(activeSessionId, content, "user", userId);

      if ("error" in result) {
        toast.error("Could not send message: " + result.error);
        return;
      }

      setMessages((prev) => [...prev, result as MessageType]);

      if (chatContainerRef.current) {
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
              top: chatContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    } catch (error) {
      toast.error("An error occurred while sending your message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndChat = async () => {
    if (!activeSessionId) return;

    setIsLoading(true);

    try {
      await endChatSession(activeSessionId, "user");

      setChatState("ended");

      setTimeout(() => {
        handleReset();
      }, 3000);
    } catch (error) {
      toast.error("Failed to end chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setChatState("selecting");
    setSelectedNutritionist(null);
    setInitialQuery("");
    setMessages([]);
    setActiveSessionId(null);

    // Reload nutritionists to get fresh data
    const loadFreshData = async () => {
      try {
        setIsLoading(true);
        const allNutritionists = await getNutritionists();
        setNutritionists(allNutritionists);
      } catch (error) {
        console.error("Error reloading nutritionists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFreshData();
  };

  // Render different UI based on chat state
  const renderContent = () => {
    switch (chatState) {
      case "selecting":
        return (
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Available Nutritionists</h3>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {nutritionists.map((nutritionist) => (
                  <NutritionistCard
                    key={nutritionist.id}
                    nutritionist={nutritionist}
                    isSelected={selectedNutritionist?.id === nutritionist.id}
                    onSelect={() => handleSelectNutritionist(nutritionist)}
                  />
                ))}
              </div>
            )}

            {selectedNutritionist && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">What would you like to discuss?</h3>
                <Textarea
                  placeholder="Type your nutrition question here..."
                  value={initialQuery}
                  onChange={(e) => setInitialQuery(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end mt-2">
                  <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleStartChat} disabled={isLoading || !initialQuery.trim()}>
                    {isLoading ? "Starting Chat..." : "Start Chat"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case "waiting":
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center overflow-y-auto">
            <div className="mb-6">
              <Spinner className="h-12 w-12 text-primary" />
            </div>

            <h3 className="text-xl font-medium mb-2">Waiting for Nutritionist</h3>

            {selectedNutritionist ? (
              <p className="text-gray-500 mb-6">Your request has been sent to {selectedNutritionist.name}. Please wait while they connect.</p>
            ) : (
              <p className="text-gray-500 mb-6">Your request has been sent to the next available nutritionist. Please wait while they connect.</p>
            )}

            <Button variant="outline" onClick={handleReset}>
              Cancel Request
            </Button>
          </div>
        );

      case "chatting":
        return (
          <div className="flex flex-col h-full">
            {selectedNutritionist && (
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{selectedNutritionist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedNutritionist.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <StatusBadgeAsync nutritionistId={selectedNutritionist.id} size="sm" />
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleEndChat} disabled={isLoading}>
                  End Chat
                </Button>
              </div>
            )}

            <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                    <p>No messages yet. Start the conversation by sending a message.</p>
                  </div>
                ) : (
                  messages.map((message) => <ChatMessage key={message.id} message={message} />)
                )}

                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Spinner className="h-4 w-4" />
                    <span>Typing</span>
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce" />
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce delay-150" />
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce delay-300" />
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        );

      case "ended":
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 overflow-y-auto">
            <div className="mb-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">Chat Session Ended</h3>
            <p className="text-gray-500 mb-6">Thank you for chatting with our nutritionist. Your conversation has been saved.</p>
            <Button onClick={handleReset}>Start New Chat</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Nutritionist</CardTitle>
        <CardDescription>Connect with a real nutritionist for personalized advice based on your health data.</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
      </CardContent>
    </Card>
  );
}
