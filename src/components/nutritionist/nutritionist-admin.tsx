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
  getNutritionistActiveSessions,
  getChatMessages,
  sendMessage,
  endChatSession,
  acceptSessionRequest,
  rejectSessionRequest,
  getNutritionistPendingSessionRequests,
} from "@/app/actions/nutritionist-actions";
import { ChatSession, SessionRequest } from "@/types/nutritionist";

interface NutritionistAdminProps {
  nutritionistId: string;
  initialActiveSessions: ChatSession[];
  initialPendingRequests: SessionRequest[];
  initialCompletedSessions: ChatSession[];
  initialSessionMessages: Record<string, MessageType[]>;
}

export function NutritionistAdmin({
  nutritionistId,
  initialActiveSessions,
  initialPendingRequests,
  initialCompletedSessions,
  initialSessionMessages,
}: NutritionistAdminProps) {
  // State for admin UI
  const [activeTab, setActiveTab] = useState("active");
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>(initialActiveSessions);
  const [pendingRequests, setPendingRequests] = useState<SessionRequest[]>(initialPendingRequests);
  const [completedSessions, setCompletedSessions] = useState<ChatSession[]>(initialCompletedSessions);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Store all messages in a map keyed by session ID
  const [allMessages, setAllMessages] = useState<Record<string, MessageType[]>>(initialSessionMessages);

  // Current messages for the selected session
  const messages = selectedSession ? allMessages[selectedSession] || [] : [];

  // Periodic refresh of data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get active sessions for this nutritionist
        const activeSessions = await getNutritionistActiveSessions(nutritionistId);
        setActiveSessions(activeSessions.filter((s: ChatSession) => s.status !== "ended"));

        // For completed sessions, we need to get all sessions and filter
        setCompletedSessions(activeSessions.filter((s: ChatSession) => s.status === "ended"));

        // Get pending requests
        const pendingRequests = await getNutritionistPendingSessionRequests(nutritionistId);
        setPendingRequests(pendingRequests);

        // Load messages for all active sessions
        const updatedMessages = { ...allMessages };
        let hasNewMessages = false;

        for (const session of activeSessions.filter((s: ChatSession) => s.status !== "ended")) {
          try {
            const sessionMessages = await getChatMessages(session.id);
            if (JSON.stringify(sessionMessages) !== JSON.stringify(updatedMessages[session.id] || [])) {
              updatedMessages[session.id] = sessionMessages;
              hasNewMessages = true;
              console.log(`Updated ${sessionMessages.length} messages for session ${session.id}`);
            }
          } catch (error) {
            console.error(`Error fetching messages for session ${session.id}:`, error);
          }
        }

        if (hasNewMessages) {
          setAllMessages(updatedMessages);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    // Set up interval to refresh data
    const intervalId = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds

    // Also refresh when the refresh trigger changes
    if (refreshTrigger > 0) {
      loadData();
    }

    return () => clearInterval(intervalId);
  }, [nutritionistId, refreshTrigger, allMessages]);

  // Update active tab when selected session changes
  useEffect(() => {
    if (selectedSession) {
      // If we have a selected session, make sure we're on the active tab
      const isInActiveSessions = activeSessions.some((s) => s.id === selectedSession);
      const isInCompletedSessions = completedSessions.some((s) => s.id === selectedSession);

      if (isInActiveSessions) {
        setActiveTab("active");
      } else if (isInCompletedSessions) {
        setActiveTab("completed");
      }
    }
  }, [selectedSession, activeSessions, completedSessions]);

  // Handle sending a message using the server action
  const handleSendMessage = async (content: string) => {
    if (!selectedSession || !content.trim()) return;

    setIsLoading(true);

    try {
      // Use the server action directly
      const result = await sendMessage(selectedSession, content, "nutritionist", nutritionistId);

      if ("error" in result) {
        console.error("Error sending message:", result.error);
        return;
      }

      // Add the new message to the existing messages for this session
      setAllMessages((prevMessages) => ({
        ...prevMessages,
        [selectedSession]: [...(prevMessages[selectedSession] || []), result],
      }));
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

      // Update local state
      setRefreshTrigger((prev) => prev + 1);
      setSelectedSession(null);
      // No need to clear messages as they're derived from selectedSession now
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  // Handle accepting a chat request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const session = await acceptSessionRequest(requestId, nutritionistId);
      if (session) {
        // Update local state
        setRefreshTrigger((prev) => prev + 1);
        setActiveTab("active"); // Switch to active tab

        // Select the new session
        await handleSelectSession(session.id);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Handle rejecting a chat request
  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectSessionRequest(requestId, nutritionistId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Select a session to view
  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === selectedSession) {
      // If clicking the already selected session, deselect it
      setSelectedSession(null);
      return;
    }

    console.log("Selecting session:", sessionId);
    console.log("Current messages for this session:", allMessages[sessionId] || []);
    setSelectedSession(sessionId);

    // No need to fetch messages here as they're already loaded in initialSessionMessages
    // and are periodically refreshed by the useEffect
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
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet</p>
                    <p className="text-xs mt-2">Session ID: {selectedSession}</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          console.log("Current messages state:", messages);
                          console.log("Refreshing messages for session:", selectedSession);
                          if (selectedSession) {
                            getChatMessages(selectedSession).then((msgs) => {
                              console.log("Refreshed messages:", msgs);
                              setAllMessages((prev) => ({
                                ...prev,
                                [selectedSession]: msgs,
                              }));
                            });
                          }
                        }}
                        className="text-blue-500 underline text-xs"
                      >
                        Debug: Refresh Messages
                      </button>

                      <button
                        onClick={() => {
                          if (selectedSession) {
                            // Create a test message to see if rendering works
                            const testMessage = {
                              id: `test-${Date.now()}`,
                              sessionId: selectedSession,
                              content: `Test message created at ${new Date().toLocaleTimeString()}`,
                              sender: "nutritionist" as const,
                              senderId: nutritionistId,
                              timestamp: new Date(),
                              read: false,
                            };
                            console.log("Adding test message:", testMessage);

                            // Update the allMessages state with the test message
                            setAllMessages((prev) => ({
                              ...prev,
                              [selectedSession]: [...(prev[selectedSession] || []), testMessage],
                            }));

                            // Also try sending a real message to the database
                            sendMessage(selectedSession, `Test message sent at ${new Date().toLocaleTimeString()}`, "nutritionist", nutritionistId)
                              .then((result) => {
                                console.log("Send message result:", result);
                              })
                              .catch((err) => {
                                console.error("Error sending test message:", err);
                              });
                          }
                        }}
                        className="text-blue-500 underline text-xs"
                      >
                        Debug: Add Test Message
                      </button>
                    </div>
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
