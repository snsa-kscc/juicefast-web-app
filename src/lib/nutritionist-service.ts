// Service for handling nutritionist chat functionality
import { v4 as uuidv4 } from "uuid";
import { NutritionistProfile, ChatSession, ChatNotification, SessionRequest, AvailabilityStatus } from "@/types/nutritionist";
import { MessageType } from "@/components/nutritionist/chat-message";

// Mock data for nutritionists
const MOCK_NUTRITIONISTS: NutritionistProfile[] = [
  {
    id: "1",
    name: "Dr. Sarah Juicefast",
    email: "sarah.juicefast@example.com",
    specialties: ["Sports Nutrition", "Weight Management", "Diabetes"],
    bio: "Registered Dietitian with 10+ years of experience in sports nutrition and weight management.",
    photoUrl: "/nutritionist-avatar.png",
    availability: {
      available: true,
      workingHours: {
        Monday: { start: "09:00", end: "17:00" },
        Tuesday: { start: "09:00", end: "17:00" },
        Wednesday: { start: "09:00", end: "17:00" },
        Thursday: { start: "09:00", end: "17:00" },
        Friday: { start: "09:00", end: "15:00" },
      },
    },
    averageResponseTime: 5,
  },
  {
    id: "2",
    name: "John Juicefast",
    email: "john.juicefast@example.com",
    specialties: ["Plant-based Nutrition", "Food Allergies", "Gut Health"],
    bio: "Specialized in plant-based nutrition and helping clients with food allergies and digestive issues.",
    photoUrl: "/nutritionist-avatar.png",
    availability: {
      available: false,
      nextAvailableSlot: new Date(Date.now() + 3600000), // 1 hour from now
      workingHours: {
        Monday: { start: "10:00", end: "18:00" },
        Tuesday: { start: "10:00", end: "18:00" },
        Wednesday: { start: "10:00", end: "18:00" },
        Thursday: { start: "10:00", end: "18:00" },
        Friday: { start: "10:00", end: "16:00" },
      },
    },
    averageResponseTime: 10,
  },
  {
    id: "3",
    name: "Jane Juicefast",
    email: "jane.juicefast@example.com",
    specialties: ["Prenatal Nutrition", "Child Nutrition", "Family Meal Planning"],
    bio: "Master's in Nutrition with focus on prenatal, infant, and child nutrition. Helps families establish healthy eating habits.",
    photoUrl: "/nutritionist-avatar.png",
    availability: {
      available: true,
      workingHours: {
        Monday: { start: "08:00", end: "16:00" },
        Tuesday: { start: "08:00", end: "16:00" },
        Wednesday: { start: "08:00", end: "16:00" },
        Thursday: { start: "08:00", end: "16:00" },
        Friday: { start: "08:00", end: "14:00" },
      },
    },
    averageResponseTime: 7,
  },
];

// Mock storage for chat sessions and messages
let activeSessions: ChatSession[] = [];
let sessionMessages: Record<string, MessageType[]> = {};
let sessionRequests: SessionRequest[] = [];
let notifications: ChatNotification[] = [];

// Helper to save data to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("nutritionist_sessions", JSON.stringify(activeSessions));
  localStorage.setItem("nutritionist_messages", JSON.stringify(sessionMessages));
  localStorage.setItem("nutritionist_requests", JSON.stringify(sessionRequests));
  localStorage.setItem("nutritionist_notifications", JSON.stringify(notifications));
};

// Helper to load data from localStorage
const loadFromLocalStorage = () => {
  try {
    const sessions = localStorage.getItem("nutritionist_sessions");
    const messages = localStorage.getItem("nutritionist_messages");
    const requests = localStorage.getItem("nutritionist_requests");
    const notifs = localStorage.getItem("nutritionist_notifications");

    if (sessions) activeSessions = JSON.parse(sessions);
    if (messages) sessionMessages = JSON.parse(messages);
    if (requests) sessionRequests = JSON.parse(requests);
    if (notifs) notifications = JSON.parse(notifs);

    // Convert string dates back to Date objects
    activeSessions = activeSessions.map((session) => ({
      ...session,
      startedAt: new Date(session.startedAt),
      endedAt: session.endedAt ? new Date(session.endedAt) : undefined,
      lastMessageAt: session.lastMessageAt ? new Date(session.lastMessageAt) : undefined,
    }));

    // Convert message timestamps
    Object.keys(sessionMessages).forEach((sessionId) => {
      sessionMessages[sessionId] = sessionMessages[sessionId].map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    });

    // Convert request dates
    sessionRequests = sessionRequests.map((req) => ({
      ...req,
      createdAt: new Date(req.createdAt),
      expiresAt: new Date(req.expiresAt),
      acceptedAt: req.acceptedAt ? new Date(req.acceptedAt) : undefined,
      rejectedAt: req.rejectedAt ? new Date(req.rejectedAt) : undefined,
    }));

    // Convert notification dates
    notifications = notifications.map((notif) => ({
      ...notif,
      createdAt: new Date(notif.createdAt),
    }));
  } catch (error) {
    console.error("Error loading nutritionist data from localStorage:", error);
  }
};

// Initialize data
const initializeData = () => {
  if (typeof window !== "undefined") {
    loadFromLocalStorage();
  }
};

// Get all nutritionists
export const getNutritionists = (): NutritionistProfile[] => {
  return MOCK_NUTRITIONISTS;
};

// Get available nutritionists
export const getAvailableNutritionists = (): NutritionistProfile[] => {
  return MOCK_NUTRITIONISTS.filter((n) => n.availability.available);
};

// Get a specific nutritionist by ID
export const getNutritionistById = (id: string): NutritionistProfile | undefined => {
  return MOCK_NUTRITIONISTS.find((n) => n.id === id);
};

// Request a chat session with a nutritionist
export const requestChatSession = async (userId: string, nutritionistId?: string, initialQuery?: string): Promise<SessionRequest> => {
  initializeData();

  // Create a new session request
  const request: SessionRequest = {
    id: uuidv4(),
    userId,
    requestedNutritionistId: nutritionistId,
    userQuery: initialQuery,
    status: "pending",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
  };

  sessionRequests.push(request);

  // Create notification for nutritionist
  const notification: ChatNotification = {
    id: uuidv4(),
    recipientId: nutritionistId || getAvailableNutritionists()[0]?.id || "1",
    recipientType: "nutritionist",
    sessionId: request.id,
    type: "session_request",
    read: false,
    createdAt: new Date(),
    message: `New chat request from user ${userId}${initialQuery ? ": " + initialQuery : ""}`,
  };

  notifications.push(notification);
  saveToLocalStorage();

  // In a real app, this would trigger a notification to the nutritionist
  // For demo purposes, we'll simulate acceptance after a delay
  setTimeout(() => {
    acceptChatRequest(request.id, notification.recipientId);
  }, 5000);

  return request;
};

// Accept a chat request (by nutritionist)
export const acceptChatRequest = async (requestId: string, nutritionistId: string): Promise<ChatSession | null> => {
  initializeData();

  const requestIndex = sessionRequests.findIndex((req) => req.id === requestId);
  if (requestIndex === -1) return null;

  const request = sessionRequests[requestIndex];
  if (request.status !== "pending") return null;

  // Update request status
  request.status = "accepted";
  request.acceptedAt = new Date();
  sessionRequests[requestIndex] = request;

  // Create a new chat session
  const session: ChatSession = {
    id: uuidv4(),
    userId: request.userId,
    nutritionistId,
    status: "active",
    startedAt: new Date(),
  };

  activeSessions.push(session);

  // Initialize message array for this session
  sessionMessages[session.id] = [];

  // If there was an initial query, add it as first message
  if (request.userQuery) {
    const message: MessageType = {
      id: uuidv4(),
      content: request.userQuery,
      sender: "user",
      timestamp: new Date(),
    };
    sessionMessages[session.id].push(message);
  }

  // Create notification for user
  const notification: ChatNotification = {
    id: uuidv4(),
    recipientId: request.userId,
    recipientType: "user",
    sessionId: session.id,
    type: "nutritionist_available",
    read: false,
    createdAt: new Date(),
    message: `Your chat request has been accepted by ${getNutritionistById(nutritionistId)?.name || "a nutritionist"}`,
  };

  notifications.push(notification);
  saveToLocalStorage();

  return session;
};

// Reject a chat request (by nutritionist)
export const rejectChatRequest = async (requestId: string): Promise<boolean> => {
  initializeData();

  const requestIndex = sessionRequests.findIndex((req) => req.id === requestId);
  if (requestIndex === -1) return false;

  const request = sessionRequests[requestIndex];
  if (request.status !== "pending") return false;

  // Update request status
  request.status = "rejected";
  request.rejectedAt = new Date();
  sessionRequests[requestIndex] = request;

  // Create notification for user
  const notification: ChatNotification = {
    id: uuidv4(),
    recipientId: request.userId,
    recipientType: "user",
    sessionId: requestId,
    type: "session_request",
    read: false,
    createdAt: new Date(),
    message: "Your chat request could not be accepted at this time. Please try again later.",
  };

  notifications.push(notification);
  saveToLocalStorage();

  return true;
};

// Send a message in a chat session
export const sendMessage = async (sessionId: string, content: string, sender: "user" | "nutritionist", senderId: string): Promise<MessageType | null> => {
  initializeData();

  const session = activeSessions.find((s) => s.id === sessionId);
  if (!session || session.status !== "active") return null;

  // Validate sender
  if ((sender === "user" && session.userId !== senderId) || (sender === "nutritionist" && session.nutritionistId !== senderId)) {
    return null;
  }

  // Create message
  const message: MessageType = {
    id: uuidv4(),
    content,
    sender,
    timestamp: new Date(),
  };

  // Add to session messages
  if (!sessionMessages[sessionId]) {
    sessionMessages[sessionId] = [];
  }
  sessionMessages[sessionId].push(message);

  // Update session last message time
  const sessionIndex = activeSessions.findIndex((s) => s.id === sessionId);
  activeSessions[sessionIndex].lastMessageAt = new Date();

  // Create notification for recipient
  const recipientId = sender === "user" ? session.nutritionistId : session.userId;
  const notification: ChatNotification = {
    id: uuidv4(),
    recipientId,
    recipientType: sender === "user" ? "nutritionist" : "user",
    sessionId,
    type: "new_message",
    read: false,
    createdAt: new Date(),
    message: `New message from ${sender === "user" ? "user" : getNutritionistById(session.nutritionistId)?.name || "nutritionist"}`,
  };

  notifications.push(notification);
  saveToLocalStorage();

  // In a real app, this would trigger a real-time notification
  // For demo purposes, if the message is from a user, simulate a nutritionist response
  if (sender === "user") {
    setTimeout(() => {
      simulateNutritionistResponse(sessionId, session.nutritionistId);
    }, Math.random() * 5000 + 2000); // Random delay between 2-7 seconds
  }

  return message;
};

// Simulate a nutritionist response (for demo purposes)
const simulateNutritionistResponse = async (sessionId: string, nutritionistId: string) => {
  const session = activeSessions.find((s) => s.id === sessionId);
  if (!session || session.status !== "active") return;

  const nutritionist = getNutritionistById(nutritionistId);
  if (!nutritionist) return;

  const messages = sessionMessages[sessionId] || [];
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.sender !== "user") return;

  // Generate a response based on the last message
  let response = "Thank you for your message. As your nutritionist, I'm here to help with your nutrition needs.";

  const content = lastMessage.content.toLowerCase();

  if (content.includes("hello") || content.includes("hi")) {
    response = `Hello! I'm ${nutritionist.name}, your nutritionist. How can I help you today?`;
  } else if (content.includes("meal plan") || content.includes("diet")) {
    response = "I'd be happy to help you create a personalized meal plan. Could you tell me more about your current eating habits and goals?";
  } else if (content.includes("weight") || content.includes("lose weight")) {
    response = "Weight management is about sustainable habits. Let's discuss your current routine and find realistic adjustments that work for your lifestyle.";
  } else if (content.includes("protein")) {
    response =
      "Protein is essential for muscle repair and satiety. Good sources include lean meats, fish, eggs, dairy, legumes, and plant-based options like tofu. How's your current protein intake?";
  } else if (content.includes("vegetarian") || content.includes("vegan")) {
    response =
      "Plant-based diets can be very nutritious when well-planned. Let's make sure you're getting all essential nutrients like B12, iron, and complete proteins.";
  }

  // Send the response
  await sendMessage(sessionId, response, "nutritionist", nutritionistId);
};

// End a chat session
export const endChatSession = async (sessionId: string, endedBy: "user" | "nutritionist"): Promise<boolean> => {
  initializeData();

  const sessionIndex = activeSessions.findIndex((s) => s.id === sessionId);
  if (sessionIndex === -1) return false;

  const session = activeSessions[sessionIndex];
  if (session.status !== "active") return false;

  // Update session status
  session.status = "ended";
  session.endedAt = new Date();
  activeSessions[sessionIndex] = session;

  // Create notifications for both parties
  const userNotification: ChatNotification = {
    id: uuidv4(),
    recipientId: session.userId,
    recipientType: "user",
    sessionId,
    type: "session_ended",
    read: false,
    createdAt: new Date(),
    message: `Chat session with ${getNutritionistById(session.nutritionistId)?.name || "nutritionist"} has ended.`,
  };

  const nutritionistNotification: ChatNotification = {
    id: uuidv4(),
    recipientId: session.nutritionistId,
    recipientType: "nutritionist",
    sessionId,
    type: "session_ended",
    read: false,
    createdAt: new Date(),
    message: `Chat session with user ${session.userId} has ended.`,
  };

  notifications.push(userNotification, nutritionistNotification);
  saveToLocalStorage();

  return true;
};

// Get active chat session for a user
export const getUserActiveChatSession = (userId: string): ChatSession | undefined => {
  initializeData();
  return activeSessions.find((s) => s.userId === userId && s.status === "active");
};

// Get chat messages for a session
export const getChatMessages = (sessionId: string): MessageType[] => {
  initializeData();
  return sessionMessages[sessionId] || [];
};

// Get pending requests for a user
export const getUserPendingRequests = (userId: string): SessionRequest[] => {
  initializeData();
  return sessionRequests.filter((r) => r.userId === userId && r.status === "pending");
};

// Get unread notifications for a user
export const getUserNotifications = (userId: string): ChatNotification[] => {
  initializeData();
  return notifications.filter((n) => n.recipientId === userId && n.recipientType === "user");
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): boolean => {
  initializeData();

  const notificationIndex = notifications.findIndex((n) => n.id === notificationId);
  if (notificationIndex === -1) return false;

  notifications[notificationIndex].read = true;
  saveToLocalStorage();

  return true;
};

// Get nutritionist status
export const getNutritionistStatus = (nutritionistId: string): AvailabilityStatus => {
  const nutritionist = getNutritionistById(nutritionistId);
  if (!nutritionist) return "offline";

  if (!nutritionist.availability.available) return "away";

  // Check if nutritionist is in an active session
  initializeData();
  const hasActiveSession = activeSessions.some((s) => s.nutritionistId === nutritionistId && s.status === "active");

  return hasActiveSession ? "busy" : "online";
};
