"use client";

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChatMessage, MessageType } from "./chat-message";
import { ChatInput } from "./chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NutritionistProfile } from "@/types/nutritionist";
import {
  getNutritionists,
  getAvailableNutritionists,
  requestChatSession,
  getUserActiveChatSession,
  getChatMessages,
  sendMessage,
  endChatSession,
  getUserPendingRequests,
  getNutritionistStatus
} from "@/lib/nutritionist-service";

interface NutritionistChatProps {
  userId: string;
  userProfile?: any;
  recentMeals?: any[];
}

type ChatState = 
  | 'browsing' // Viewing available nutritionists
  | 'requesting' // Requesting a chat session
  | 'waiting' // Waiting for nutritionist to accept
  | 'chatting' // Active chat with nutritionist
  | 'ended'; // Chat session ended

export function NutritionistChat({ 
  userId, 
  userProfile = null, 
  recentMeals = [] 
}: NutritionistChatProps) {
  // State for chat UI
  const [chatState, setChatState] = useState<ChatState>('browsing');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionists, setNutritionists] = useState<NutritionistProfile[]>([]);
  const [selectedNutritionist, setSelectedNutritionist] = useState<NutritionistProfile | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [initialQuestion, setInitialQuestion] = useState('');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Load nutritionists and check for active sessions on mount
  useEffect(() => {
    const loadInitialData = async () => {
      // Get all nutritionists
      const allNutritionists = getNutritionists();
      setNutritionists(allNutritionists);
      
      // Check if user has an active session
      const activeSession = getUserActiveChatSession(userId);
      
      if (activeSession) {
        // User has an active session, load it
        setActiveSessionId(activeSession.id);
        setChatState('chatting');
        
        // Get nutritionist info
        const nutritionist = allNutritionists.find(n => n.id === activeSession.nutritionistId);
        if (nutritionist) {
          setSelectedNutritionist(nutritionist);
        }
        
        // Load chat messages
        const sessionMessages = getChatMessages(activeSession.id);
        setMessages(sessionMessages);
      } else {
        // Check for pending requests
        const pendingRequests = getUserPendingRequests(userId);
        
        if (pendingRequests.length > 0) {
          // User has a pending request
          setChatState('waiting');
          
          // If there's a specific nutritionist requested
          if (pendingRequests[0].requestedNutritionistId) {
            const nutritionist = allNutritionists.find(
              n => n.id === pendingRequests[0].requestedNutritionistId
            );
            if (nutritionist) {
              setSelectedNutritionist(nutritionist);
            }
          }
        }
      }
    };
    
    loadInitialData();
    
    // Set up interval to check for updates
    const intervalId = setInterval(() => {
      if (activeSessionId) {
        // If in active chat, refresh messages
        const updatedMessages = getChatMessages(activeSessionId);
        setMessages(updatedMessages);
      } else if (chatState === 'waiting') {
        // If waiting, check if request was accepted
        const activeSession = getUserActiveChatSession(userId);
        if (activeSession) {
          setActiveSessionId(activeSession.id);
          setChatState('chatting');
          
          // Get nutritionist info if not already set
          if (!selectedNutritionist) {
            const nutritionist = nutritionists.find(n => n.id === activeSession.nutritionistId);
            if (nutritionist) {
              setSelectedNutritionist(nutritionist);
            }
          }
          
          // Load chat messages
          const sessionMessages = getChatMessages(activeSession.id);
          setMessages(sessionMessages);
        }
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(intervalId);
  }, [userId, chatState, activeSessionId, nutritionists]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle sending a message in an active chat
  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) return;
    
    setIsLoading(true);
    try {
      await sendMessage(activeSessionId, content, 'user', userId);
      
      // Update messages (the service will handle adding to storage)
      const updatedMessages = getChatMessages(activeSessionId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Request a chat with a specific nutritionist
  const handleRequestChat = async (nutritionist: NutritionistProfile) => {
    setSelectedNutritionist(nutritionist);
    setChatState('requesting');
  };
  
  // Submit chat request
  const handleSubmitRequest = async () => {
    if (!selectedNutritionist) return;
    
    setIsLoading(true);
    try {
      await requestChatSession(
        userId,
        selectedNutritionist.id,
        initialQuestion
      );
      
      setChatState('waiting');
    } catch (error) {
      console.error('Error requesting chat:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // End the current chat session
  const handleEndChat = async () => {
    if (!activeSessionId) return;
    
    setIsLoading(true);
    try {
      await endChatSession(activeSessionId, 'user');
      setChatState('ended');
      setActiveSessionId(null);
    } catch (error) {
      console.error('Error ending chat:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset to browsing state
  const handleReset = () => {
    setChatState('browsing');
    setSelectedNutritionist(null);
    setInitialQuestion('');
  };
  
  // Render different UI based on chat state
  const renderContent = () => {
    switch (chatState) {
      case 'browsing':
        return (
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-medium mb-4">Available Nutritionists</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {nutritionists.map((nutritionist) => {
                const status = getNutritionistStatus(nutritionist.id);
                return (
                  <Card key={nutritionist.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{nutritionist.name}</h4>
                        <StatusBadge status={status} />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{nutritionist.specialties.join(', ')}</p>
                      <p className="text-sm mb-4">{nutritionist.bio}</p>
                      <Button 
                        onClick={() => handleRequestChat(nutritionist)}
                        disabled={status === 'offline'}
                        className="w-full"
                        variant={status === 'online' ? 'default' : 'outline'}
                      >
                        Request Chat
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
        
      case 'requesting':
        return (
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <Button variant="outline" size="sm" onClick={handleReset}>
                ← Back to Nutritionists
              </Button>
            </div>
            
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {selectedNutritionist?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedNutritionist?.name}</h3>
                    <p className="text-sm text-gray-500">{selectedNutritionist?.specialties.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">What would you like to discuss?</h3>
              <Textarea 
                value={initialQuestion}
                onChange={(e) => setInitialQuestion(e.target.value)}
                placeholder="Enter your nutrition question or concern..."
                className="min-h-[120px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest} disabled={isLoading || !initialQuestion.trim()}>
                  {isLoading ? 'Sending Request...' : 'Send Request'}
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'waiting':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="mb-6">
              <Spinner className="h-12 w-12 text-primary mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-medium mb-2">Waiting for nutritionist...</h3>
            <p className="text-gray-500 mb-6">
              {selectedNutritionist 
                ? `${selectedNutritionist.name} will join the chat shortly.` 
                : 'A nutritionist will join the chat shortly.'}
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Average response time: {selectedNutritionist?.averageResponseTime || 5} minutes
            </p>
            <Button variant="outline" onClick={handleReset}>
              Cancel Request
            </Button>
          </div>
        );
        
      case 'chatting':
        return (
          <div className="flex-1 flex flex-col">
            {selectedNutritionist && (
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {selectedNutritionist.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedNutritionist.name}</p>
                    <StatusBadge status={getNutritionistStatus(selectedNutritionist.id)} size="sm" />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleEndChat}>
                  End Chat
                </Button>
              </div>
            )}
            
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto mb-4 pr-2"
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {selectedNutritionist?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce" />
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce delay-150" />
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}
            </div>
            
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        );
        
      case 'ended':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="mb-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">Chat Session Ended</h3>
            <p className="text-gray-500 mb-6">
              Thank you for chatting with our nutritionist. Your conversation has been saved.
            </p>
            <Button onClick={handleReset}>
              Start New Chat
            </Button>
          </div>
        );
    }
  };
  
  return (
    <Card className="w-full h-[calc(100vh-250px)] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Nutritionist</CardTitle>
        <CardDescription>
          Connect with a real nutritionist for personalized advice based on your health data.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

// Status badge component
interface StatusBadgeProps {
  status: 'online' | 'busy' | 'away' | 'offline';
  size?: 'default' | 'sm';
}

const StatusBadge = ({ status, size = 'default' }: StatusBadgeProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'online':
        return { label: 'Available', variant: 'success' as const };
      case 'busy':
        return { label: 'In Session', variant: 'warning' as const };
      case 'away':
        return { label: 'Away', variant: 'info' as const };
      case 'offline':
        return { label: 'Offline', variant: 'outline' as const };
    }
  };
  
  const { label, variant } = getStatusInfo();
  const className = size === 'sm' ? 'text-[10px] px-1.5 py-0' : '';
  
  return <Badge variant={variant} className={className}>{label}</Badge>;
};

// Spinner component for loading states
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Import additional components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
