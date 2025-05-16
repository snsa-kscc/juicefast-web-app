"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatInput } from "./chat-input";
import { ChatMessage, MessageType } from "./chat-message";
import {
  getNutritionistSessions,
  getChatMessages,
  sendMessage,
  endChatSession,
  acceptChatRequest,
  rejectChatRequest,
  getNutritionistPendingRequests,
} from "@/lib/nutritionist-service";

interface NutritionistAdminProps {
  nutritionistId: string;
}

export function NutritionistAdmin({ nutritionistId }: NutritionistAdminProps) {
  // State for admin UI
  const [activeTab, setActiveTab] = useState("active");
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load data on mount and when refresh is triggered
  useEffect(() => {
    const loadData = async () => {
      // Get all sessions for this nutritionist
      const allSessions = getNutritionistSessions(nutritionistId);

      // Filter sessions by status
      setActiveSessions(allSessions.filter((s) => s.status === "active"));
      setCompletedSessions(allSessions.filter((s) => s.status === "ended"));

      // Get pending requests
      setPendingRequests(getNutritionistPendingRequests(nutritionistId));

      // Load messages for selected session
      if (selectedSession) {
        const sessionMessages = getChatMessages(selectedSession);
        setMessages(sessionMessages);
      }
    };

    loadData();

    // Set up interval to refresh data
    const intervalId = setInterval(() => {
      loadData();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, [nutritionistId, selectedSession, refreshTrigger]);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!selectedSession || !content.trim()) return;

    setIsLoading(true);

    try {
      await sendMessage(selectedSession, content, "nutritionist", nutritionistId);

      // Refresh messages
      const updatedMessages = getChatMessages(selectedSession);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle ending a chat session
  const handleEndSession = async () => {
    if (!selectedSession) return;

    try {
      await endChatSession(selectedSession, "nutritionist");
      setRefreshTrigger((prev) => prev + 1);
      setSelectedSession(null);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  // Handle accepting a chat request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const session = await acceptChatRequest(requestId, nutritionistId);
      if (session) {
        setRefreshTrigger((prev) => prev + 1);
        setSelectedSession(session.id);
        setActiveTab("active");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Handle rejecting a chat request
  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectChatRequest(requestId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Select a session to view
  const handleSelectSession = (sessionId: string) => {
    setSelectedSession(sessionId);
    const sessionMessages = getChatMessages(sessionId);
    setMessages(sessionMessages);
  };

  // Render session list item
  const renderSessionItem = (session: any, isPending = false) => {
    const isSelected = selectedSession === session.id;

    return (
      <div
        key={session.id}
        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-100" : ""}`}
        onClick={() => !isPending && handleSelectSession(session.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{session.userName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session.userName || `User ${session.userId}`}</p>
              <p className="text-sm text-gray-500">
                {isPending ? `Request: ${new Date(session.createdAt).toLocaleString()}` : `Started: ${new Date(session.startedAt).toLocaleString()}`}
              </p>
            </div>
          </div>

          {isPending && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectRequest(session.id);
                }}
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptRequest(session.id);
                }}
              >
                Accept
              </Button>
            </div>
          )}

          {!isPending && session.status === "active" && <Badge variant="success">Active</Badge>}

          {!isPending && session.status === "ended" && <Badge variant="secondary">Completed</Badge>}
        </div>

        {!isPending && <p className="text-sm mt-1 line-clamp-1">{session.initialQuery || "No initial query"}</p>}
      </div>
    );
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Nutritionist Dashboard</CardTitle>
        <CardDescription>Manage your client conversations and requests</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex overflow-hidden">
        {/* Left sidebar with sessions list */}
        <div className="w-1/3 border-r flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="active" className="flex-1">
                  Active ({activeSessions.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  Requests ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="active" className="m-0">
                {activeSessions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No active sessions</div>
                ) : (
                  activeSessions.map((session) => renderSessionItem(session))
                )}
              </TabsContent>

              <TabsContent value="pending" className="m-0">
                {pendingRequests.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No pending requests</div>
                ) : (
                  pendingRequests.map((request) => renderSessionItem(request, true))
                )}
              </TabsContent>

              <TabsContent value="completed" className="m-0">
                {completedSessions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No completed sessions</div>
                ) : (
                  completedSessions.map((session) => renderSessionItem(session))
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Right side with chat */}
        <div className="w-2/3 flex flex-col">
          {selectedSession ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-medium">
                    {activeSessions.find((s) => s.id === selectedSession)?.userName ||
                      completedSessions.find((s) => s.id === selectedSession)?.userName ||
                      `User ${activeSessions.find((s) => s.id === selectedSession)?.userId || completedSessions.find((s) => s.id === selectedSession)?.userId}`}
                  </h3>
                  <p className="text-sm text-gray-500">Session ID: {selectedSession}</p>
                </div>

                {activeSessions.find((s) => s.id === selectedSession) && (
                  <Button variant="outline" size="sm" onClick={handleEndSession}>
                    End Session
                  </Button>
                )}
              </div>

              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No messages yet</div>
                ) : (
                  messages.map((message) => <ChatMessage key={message.id} message={message} />)
                )}
              </ScrollArea>

              {activeSessions.find((s) => s.id === selectedSession) ? (
                <div className="p-4 border-t">
                  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
              ) : (
                <div className="p-4 border-t text-center text-gray-500">This session has ended</div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">Select a session to view messages</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
