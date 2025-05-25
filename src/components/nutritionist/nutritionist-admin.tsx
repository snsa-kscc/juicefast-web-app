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
import { getNutritionistSessions, getChatMessages, sendMessage, endChatSession, getUserNameById } from "@/app/actions/nutritionist-actions";
import { ChatSession } from "@/types/nutritionist";

interface NutritionistAdminProps {
  nutritionistId: string;
  initialActiveSessions: ChatSession[];
  initialCompletedSessions: ChatSession[];
  initialSessionMessages: Record<string, MessageType[]>;
}

export function NutritionistAdmin({ nutritionistId, initialActiveSessions, initialCompletedSessions, initialSessionMessages }: NutritionistAdminProps) {
  // State for admin UI
  const [activeTab, setActiveTab] = useState("active");
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>(initialActiveSessions);
  const [completedSessions, setCompletedSessions] = useState<ChatSession[]>(initialCompletedSessions);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  // Store all messages in a map keyed by session ID
  const [allMessages, setAllMessages] = useState<Record<string, MessageType[]>>(initialSessionMessages);

  // Current messages for the selected session
  const messages = selectedSession ? allMessages[selectedSession] || [] : [];

  // Periodic refresh of data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all sessions for this nutritionist
        const allSessionsData = await getNutritionistSessions(nutritionistId);

        // Separate active and completed sessions
        const activeSessionsData = allSessionsData.filter((s: ChatSession) => s.status !== "ended");
        const completedSessionsData = allSessionsData.filter((s: ChatSession) => s.status === "ended");

        setActiveSessions(activeSessionsData);
        setCompletedSessions(completedSessionsData);

        // Load messages for ALL sessions (both active and completed)
        const updatedMessages = { ...allMessages };
        let hasNewMessages = false;

        // Process all sessions, not just active ones
        for (const session of allSessionsData) {
          try {
            const sessionMessages = await getChatMessages(session.id);
            if (JSON.stringify(sessionMessages) !== JSON.stringify(updatedMessages[session.id] || [])) {
              updatedMessages[session.id] = sessionMessages;
              hasNewMessages = true;
            }
          } catch (error) {
            console.error(`Error fetching messages for session ${session.id}:`, error);
          }
        }

        if (hasNewMessages) {
          setAllMessages(updatedMessages);
        }
      } catch (error) {
        console.error(`Error fetching sessions for nutritionist ${nutritionistId}:`, error);
      }
    };

    // Set up interval to refresh data
    const intervalId = setInterval(() => {
      loadData();
    }, 60000); // Refresh every 60 seconds

    // Also refresh when the refresh trigger changes
    if (refreshTrigger > 0) {
      loadData();
    }

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [nutritionistId, refreshTrigger, allMessages]);

  // Fetch user names for all sessions
  useEffect(() => {
    const fetchUserNames = async () => {
      // Collect all user IDs from active and completed sessions
      const userIds = new Set<string>();
      [...activeSessions, ...completedSessions].forEach((session) => {
        if (session.userId) {
          userIds.add(session.userId);
        }
      });

      // Skip if we already have all the names
      if (Array.from(userIds).every((id) => userNames[id])) {
        return;
      }

      // Fetch names for all user IDs
      const newUserNames = { ...userNames };
      let hasNewNames = false;

      for (const userId of userIds) {
        if (!newUserNames[userId]) {
          try {
            const name = await getUserNameById(userId);
            if (name) {
              newUserNames[userId] = name;
              hasNewNames = true;
            }
          } catch (error) {
            console.error(`Error fetching user name for ID ${userId}:`, error);
          }
        }
      }

      if (hasNewNames) {
        setUserNames(newUserNames);
      }
    };

    fetchUserNames();
  }, [activeSessions, completedSessions, userNames]);

  // Handle sending a message using the server action
  const handleSendMessage = async (content: string) => {
    if (!selectedSession || !content.trim()) return;

    setIsLoading(true);

    try {
      const result = await sendMessage(selectedSession, content, "nutritionist", nutritionistId);

      if ("error" in result) {
        return;
      }

      // Update messages in the UI
      setAllMessages((prevMessages) => ({
        ...prevMessages,
        [selectedSession]: [...(prevMessages[selectedSession] || []), result],
      }));
    } catch (error) {
      console.error(`Error sending message for session ${selectedSession}:`, error);
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
      // No need to clear messages as they're derived from selectedSession now
    } catch (error) {
      console.error(`Error ending session ${selectedSession}:`, error);
    }
  };

  // Select a session to view
  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === selectedSession) {
      // If clicking the already selected session, deselect it
      setSelectedSession(null);
      return;
    }

    setSelectedSession(sessionId);
  };

  // Render session list item
  const renderSessionItem = (session: ChatSession) => {
    const isActive = session.id === selectedSession;
    const userName = userNames[session.userId] || `User ${session.userId.substring(0, 8)}`;

    return (
      <div
        key={session.id}
        className={`p-3 border-b cursor-pointer ${isActive ? "bg-accent" : "hover:bg-muted"}`}
        onClick={() => handleSelectSession(session.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{userName}</h4>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">{new Date(session.createdAt).toLocaleString()}</span>
                {session.status === "active" ? (
                  <Badge variant="success" className="text-[10px] px-1 py-0">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                    Ended
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Nutritionist Dashboard</CardTitle>
        <CardDescription>Manage your client conversations</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex overflow-hidden">
        {/* Left sidebar with sessions list */}
        <div className="w-1/3 border-r flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active ({activeSessions.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedSessions.length})</TabsTrigger>
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

        {/* Right side with chat messages */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h3 className="font-medium">
                    {(() => {
                      const session = [...activeSessions, ...completedSessions].find((s) => s.id === selectedSession);
                      if (!session) return "Unknown User";
                      const userId = session.userId;
                      return userNames[userId] || `User ${userId.substring(0, 8)}`;
                    })()}
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
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet</p>
                    <p className="text-xs mt-2">Session ID: {selectedSession}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-xs text-gray-500">Showing {messages.length} message(s)</div>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </>
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
