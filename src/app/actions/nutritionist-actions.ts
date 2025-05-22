"use server";

import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { eq, and, or, desc, asc, isNull } from "drizzle-orm";
import { nutritionistProfile, chatSession, chatMessage, sessionRequest, chatNotification, user } from "@/db/schema";
import { NutritionistProfile, ChatSession, ChatNotification, SessionRequest, AvailabilityStatus } from "@/types/nutritionist";
import { MessageType } from "@/components/nutritionist/chat-message";
import { revalidatePath } from "next/cache";

// Helper functions for mapping database records to application types
const mapDbProfileToNutritionistProfile = (profile: any): NutritionistProfile => {
  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.name,
    email: profile.email,
    specialties: profile.specialties,
    bio: profile.bio,
    photoUrl: profile.photoUrl || null,
    availability: {
      available: profile.available,
      nextAvailableSlot: profile.nextAvailableSlot,
      workingHours: profile.workingHours,
    },
    averageResponseTime: profile.averageResponseTime,
  };
};

// ======== NUTRITIONIST PROFILE OPERATIONS ========

export async function getNutritionists(): Promise<NutritionistProfile[]> {
  const profiles = await db.select().from(nutritionistProfile);
  return profiles.map(mapDbProfileToNutritionistProfile);
}

export async function getAvailableNutritionists(): Promise<NutritionistProfile[]> {
  const profiles = await db.select().from(nutritionistProfile).where(eq(nutritionistProfile.available, true));
  return profiles.map(mapDbProfileToNutritionistProfile);
}

export async function getNutritionistById(nutritionistId: string): Promise<NutritionistProfile | undefined> {
  try {
    const [profile] = await db.select().from(nutritionistProfile).where(eq(nutritionistProfile.id, nutritionistId));
    return profile ? mapDbProfileToNutritionistProfile(profile) : undefined;
  } catch (error) {
    console.error(`Error fetching nutritionist profile ${nutritionistId}:`, error);
    throw error;
  }
}

export async function getNutritionistByUserId(userId: string): Promise<NutritionistProfile | undefined> {
  try {
    const [profile] = await db.select().from(nutritionistProfile).where(eq(nutritionistProfile.userId, userId));
    return profile ? mapDbProfileToNutritionistProfile(profile) : undefined;
  } catch (error) {
    console.error(`Error fetching nutritionist profile ${userId}:`, error);
    throw error;
  }
}

export async function getNutritionistStatus(nutritionistId: string): Promise<"online" | "busy" | "away" | "offline"> {
  try {
    const [profile] = await db.select().from(nutritionistProfile).where(eq(nutritionistProfile.id, nutritionistId));

    if (!profile) {
      throw new Error(`Nutritionist profile ${nutritionistId} not found`);
    }

    // Check if the nutritionist is marked as available
    if (!profile.available) {
      return "offline";
    }

    // Check if the nutritionist has active sessions
    const activeSessions = await db
      .select()
      .from(chatSession)
      .where(and(eq(chatSession.nutritionistId, nutritionistId), eq(chatSession.status, "active")));

    // If the nutritionist has reached their maximum concurrent sessions (e.g., 3)
    // This is a business rule that could be configurable
    const MAX_CONCURRENT_SESSIONS = 3;
    if (activeSessions.length >= MAX_CONCURRENT_SESSIONS) {
      return "busy";
    }

    return "online";
  } catch (error) {
    console.error(`Error checking nutritionist status for ${nutritionistId}:`, error);
    return "offline";
  }
}

export async function createNutritionistProfile(profile: Omit<NutritionistProfile, "id">): Promise<NutritionistProfile> {
  const id = uuidv4();

  // Ensure userId is never undefined
  if (!profile.userId) {
    throw new Error("userId is required for creating a nutritionist profile");
  }

  await db.insert(nutritionistProfile).values({
    id,
    userId: profile.userId,
    email: profile.email,
    name: profile.name,
    bio: profile.bio,
    specialties: profile.specialties,
    photoUrl: profile.photoUrl || null,
    available: profile.availability?.available || false,
    nextAvailableSlot: profile.availability?.nextAvailableSlot || null,
    workingHours: profile.availability?.workingHours || null,
    averageResponseTime: 0, // Default value
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { ...profile, id };
}

export async function updateNutritionistProfile(id: string, updates: Partial<NutritionistProfile>): Promise<NutritionistProfile | undefined> {
  const updateValues: any = {
    updatedAt: new Date(),
  };

  // Map updates to database fields
  if (updates.name) updateValues.name = updates.name;
  if (updates.email) updateValues.email = updates.email;
  if (updates.bio) updateValues.bio = updates.bio;
  if (updates.specialties) updateValues.specialties = updates.specialties;
  if (updates.photoUrl !== undefined) updateValues.photoUrl = updates.photoUrl;
  if (updates.availability) {
    if (updates.availability.available !== undefined) {
      updateValues.available = updates.availability.available;
    }
    if (updates.availability.nextAvailableSlot !== undefined) {
      updateValues.nextAvailableSlot = updates.availability.nextAvailableSlot;
    }
    if (updates.availability.workingHours !== undefined) {
      updateValues.workingHours = updates.availability.workingHours;
    }
  }

  await db.update(nutritionistProfile).set(updateValues).where(eq(nutritionistProfile.id, id));

  const result = await getNutritionistById(id);
  revalidatePath("/nutritionist");
  return result;
}

// ======== CHAT SESSION OPERATIONS ========

export async function createChatSession(userId: string, nutritionistId: string, requestId?: string): Promise<ChatSession> {
  const id = uuidv4();
  const now = new Date();

  await db.insert(chatSession).values({
    id,
    userId,
    nutritionistId,
    status: "active",
    startedAt: now,
    endedAt: null,
    endedBy: null,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    userId,
    nutritionistId,
    status: "active",
    startedAt: now,
    endedAt: undefined,
    endedBy: undefined,
    createdAt: now,
  };
}

export async function getChatSessionById(id: string): Promise<ChatSession | null> {
  try {
    const [session] = await db.select().from(chatSession).where(eq(chatSession.id, id));

    if (!session) return null;

    return {
      id: session.id,
      userId: session.userId,
      nutritionistId: session.nutritionistId,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt || undefined,
      endedBy: session.endedBy || undefined,
      createdAt: session.createdAt,
    };
  } catch (error) {
    console.error(`Error fetching chat session ${id}:`, error);
    return null;
  }
}

export async function getUserActiveChatSession(userId: string): Promise<ChatSession | null> {
  try {
    const [session] = await db
      .select()
      .from(chatSession)
      .where(and(eq(chatSession.userId, userId), eq(chatSession.status, "active")))
      .orderBy(desc(chatSession.createdAt))
      .limit(1);

    if (!session) return null;

    return {
      id: session.id,
      userId: session.userId,
      nutritionistId: session.nutritionistId,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt || undefined,
      endedBy: session.endedBy || undefined,
      createdAt: session.createdAt,
    };
  } catch (error) {
    console.error(`Error fetching active chat session for user ${userId}:`, error);
    return null;
  }
}

export async function getNutritionistSessions(nutritionistId: string): Promise<ChatSession[]> {
  try {
    const sessions = await db.select().from(chatSession).where(eq(chatSession.nutritionistId, nutritionistId)).orderBy(desc(chatSession.createdAt));

    return sessions.map((session) => ({
      id: session.id,
      userId: session.userId,
      nutritionistId: session.nutritionistId,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt || undefined,
      endedBy: session.endedBy || undefined,
      createdAt: session.createdAt,
    }));
  } catch (error) {
    console.error(`Error fetching sessions for nutritionist ${nutritionistId}:`, error);
    return [];
  }
}

export async function getNutritionistActiveSessions(nutritionistId: string): Promise<ChatSession[]> {
  try {
    const sessions = await db
      .select()
      .from(chatSession)
      .where(and(eq(chatSession.nutritionistId, nutritionistId), eq(chatSession.status, "active")))
      .orderBy(desc(chatSession.createdAt));

    return sessions.map((session) => ({
      id: session.id,
      userId: session.userId,
      nutritionistId: session.nutritionistId,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt || undefined,
      endedBy: session.endedBy || undefined,
      createdAt: session.createdAt,
    }));
  } catch (error) {
    console.error(`Error fetching active sessions for nutritionist ${nutritionistId}:`, error);
    return [];
  }
}

export async function updateChatSessionStatus(sessionId: string, status: "active" | "ended", endedBy?: "user" | "nutritionist"): Promise<boolean> {
  try {
    const updateValues: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === "ended") {
      updateValues.endedAt = new Date();
      updateValues.endedBy = endedBy || null;
    }

    await db.update(chatSession).set(updateValues).where(eq(chatSession.id, sessionId));

    return true;
  } catch (error) {
    console.error(`Error updating chat session ${sessionId} status:`, error);
    return false;
  }
}

export async function endChatSession(sessionId: string, endedBy: "user" | "nutritionist"): Promise<boolean> {
  // Get the session
  const session = await getChatSessionById(sessionId);
  if (!session || session.status !== "active") {
    return false;
  }

  // Update session status
  await updateChatSessionStatus(sessionId, "ended", endedBy);

  // Create notifications for both parties
  const recipientId = endedBy === "user" ? session.nutritionistId : session.userId;
  const recipientType = endedBy === "user" ? "nutritionist" : "user";

  await createNotification({
    recipientId,
    recipientType,
    type: "session_ended",
    content: `Chat session has been ended.`,
    relatedEntityId: sessionId,
  });

  revalidatePath("/nutritionist");
  return true;
}

// ======== CHAT MESSAGE OPERATIONS ========

export async function createChatMessage(sessionId: string, content: string, sender: "user" | "nutritionist", senderId: string): Promise<MessageType> {
  const id = uuidv4();
  const now = new Date();

  await db.insert(chatMessage).values({
    id,
    sessionId,
    content,
    sender,
    senderId,
    read: false,
    createdAt: now,
  });

  return {
    id,
    sessionId,
    content,
    sender,
    senderId,
    read: false,
    timestamp: now,
  };
}

export async function getChatMessages(sessionId: string): Promise<MessageType[]> {
  try {
    const messages = await db.select().from(chatMessage).where(eq(chatMessage.sessionId, sessionId)).orderBy(asc(chatMessage.createdAt));

    return messages.map((message) => ({
      id: message.id,
      sessionId: message.sessionId,
      content: message.content,
      sender: message.sender,
      senderId: message.senderId,
      read: message.read === null ? false : message.read,
      timestamp: message.createdAt,
    }));
  } catch (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error);
    return [];
  }
}

export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    await db.update(chatMessage).set({ read: true }).where(eq(chatMessage.id, messageId));
    revalidatePath("/nutritionist");
    return true;
  } catch (error) {
    console.error(`Error marking message ${messageId} as read:`, error);
    return false;
  }
}

export async function sendMessage(
  sessionId: string,
  content: string,
  sender: "user" | "nutritionist",
  senderId: string
): Promise<MessageType | { error: string }> {
  // Get the session to find the recipient
  const session = await getChatSessionById(sessionId);
  if (!session) {
    console.error(`Chat session ${sessionId} not found`);
    return { error: `Chat session not found. The session may have expired or been deleted.` };
  }

  // Create the message
  const message = await createChatMessage(sessionId, content, sender, senderId);

  // Create notification for the recipient
  const recipientId = sender === "user" ? session.nutritionistId : session.userId;
  const recipientType = sender === "user" ? "nutritionist" : "user";

  await createNotification({
    recipientId,
    recipientType,
    type: "new_message",
    content: `New message: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
    relatedEntityId: sessionId,
  });

  revalidatePath("/nutritionist");
  return message;
}

// ======== SESSION REQUEST OPERATIONS ========

export async function createSessionRequest(userId: string, nutritionistId?: string, initialQuery?: string): Promise<SessionRequest> {
  const id = uuidv4();
  const now = new Date();

  await db.insert(sessionRequest).values({
    id,
    userId,
    requestedNutritionistId: nutritionistId || null,
    initialQuery: initialQuery || null,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    userId,
    requestedNutritionistId: nutritionistId,
    initialQuery: initialQuery,
    status: "pending",
    createdAt: now,
  };
}

export async function getSessionRequestById(id: string): Promise<SessionRequest | null> {
  try {
    const [request] = await db.select().from(sessionRequest).where(eq(sessionRequest.id, id));

    if (!request) return null;

    return {
      id: request.id,
      userId: request.userId,
      requestedNutritionistId: request.requestedNutritionistId || undefined,
      initialQuery: request.initialQuery || undefined,
      status: request.status,
      createdAt: request.createdAt,
    };
  } catch (error) {
    console.error(`Error fetching session request ${id}:`, error);
    return null;
  }
}

export async function getUserPendingSessionRequests(userId: string): Promise<SessionRequest[]> {
  try {
    const requests = await db
      .select()
      .from(sessionRequest)
      .where(and(eq(sessionRequest.userId, userId), eq(sessionRequest.status, "pending")))
      .orderBy(desc(sessionRequest.createdAt));

    return requests.map((request) => ({
      id: request.id,
      userId: request.userId,
      requestedNutritionistId: request.requestedNutritionistId || undefined,
      initialQuery: request.initialQuery || undefined,
      status: request.status,
      createdAt: request.createdAt,
    }));
  } catch (error) {
    console.error(`Error fetching pending session requests for user ${userId}:`, error);
    return [];
  }
}

export async function getNutritionistPendingSessionRequests(nutritionistId: string): Promise<SessionRequest[]> {
  try {
    const requests = await db
      .select()
      .from(sessionRequest)
      .where(and(eq(sessionRequest.requestedNutritionistId, nutritionistId), eq(sessionRequest.status, "pending")))
      .orderBy(desc(sessionRequest.createdAt));

    return requests.map((request) => ({
      id: request.id,
      userId: request.userId,
      requestedNutritionistId: request.requestedNutritionistId || undefined,
      initialQuery: request.initialQuery || undefined,
      status: request.status,
      createdAt: request.createdAt,
    }));
  } catch (error) {
    console.error(`Error fetching pending session requests for nutritionist ${nutritionistId}:`, error);
    return [];
  }
}

export async function updateSessionRequestStatus(requestId: string, status: "pending" | "active" | "ended"): Promise<boolean> {
  try {
    await db
      .update(sessionRequest)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(sessionRequest.id, requestId));

    return true;
  } catch (error) {
    console.error(`Error updating session request ${requestId} status:`, error);
    return false;
  }
}

export async function requestChatSession(userId: string, nutritionistId: string, initialQuery?: string): Promise<SessionRequest> {
  const request = await createSessionRequest(userId, nutritionistId, initialQuery);

  // Create notification for nutritionist
  await createNotification({
    recipientId: nutritionistId,
    recipientType: "nutritionist",
    type: "session_request",
    content: `New chat request from a user`,
    relatedEntityId: request.id,
  });

  revalidatePath("/nutritionist");
  return request;
}

export async function acceptSessionRequest(requestId: string, nutritionistId: string): Promise<ChatSession | null> {
  // Get the request
  const request = await getSessionRequestById(requestId);
  if (!request || request.status !== "pending") {
    return null;
  }

  // Update request status
  await updateSessionRequestStatus(requestId, "active");

  // Create chat session
  const session = await createChatSession(request.userId, nutritionistId, requestId);

  // Create notification for user
  await createNotification({
    recipientId: request.userId,
    recipientType: "user",
    type: "session_accepted",
    content: `Your chat request has been accepted.`,
    relatedEntityId: session.id,
  });

  // If there was an initial query, add it as the first message
  if (request.initialQuery) {
    await createChatMessage(session.id, request.initialQuery, "user", request.userId);
  }

  revalidatePath("/nutritionist");
  return session;
}

export async function rejectSessionRequest(requestId: string, nutritionistId: string): Promise<boolean> {
  // Get the request
  const request = await getSessionRequestById(requestId);
  if (!request || request.status !== "pending") {
    return false;
  }

  // Update request status
  await updateSessionRequestStatus(requestId, "ended");

  // Create notification for user
  await createNotification({
    recipientId: request.userId,
    recipientType: "user",
    type: "session_rejected",
    content: `Your chat request has been rejected. Please try again later.`,
    relatedEntityId: requestId,
  });

  revalidatePath("/nutritionist");
  return true;
}

// ======== NOTIFICATION OPERATIONS ========

export async function createNotification(notification: {
  recipientId: string;
  recipientType: "user" | "nutritionist";
  type: "new_message" | "session_request" | "session_accepted" | "session_rejected" | "session_ended";
  content: string;
  relatedEntityId?: string;
}): Promise<ChatNotification> {
  const id = uuidv4();
  const now = new Date();

  await db.insert(chatNotification).values({
    id,
    recipientId: notification.recipientId,
    recipientType: notification.recipientType,
    type: notification.type,
    message: notification.content,
    sessionId: notification.type === "new_message" || notification.type === "session_ended" ? notification.relatedEntityId || null : null,
    requestId:
      notification.type === "session_request" || notification.type === "session_accepted" || notification.type === "session_rejected"
        ? notification.relatedEntityId || null
        : null,
    read: false,
    createdAt: now,
  });

  return {
    id,
    recipientId: notification.recipientId,
    recipientType: notification.recipientType,
    type: notification.type,
    message: notification.content, // Required field
    content: notification.content, // For flexibility
    relatedEntityId: notification.relatedEntityId,
    read: false,
    createdAt: now,
  };
}

export async function getUserNotifications(userId: string): Promise<ChatNotification[]> {
  const notifications = await db
    .select()
    .from(chatNotification)
    .where(and(eq(chatNotification.recipientId, userId), eq(chatNotification.recipientType, "user")))
    .orderBy(desc(chatNotification.createdAt));

  return notifications.map((notification) => ({
    id: notification.id,
    recipientId: notification.recipientId,
    recipientType: notification.recipientType,
    type: notification.type,
    message: notification.message, // Required field
    content: notification.message, // For flexibility
    relatedEntityId: notification.sessionId || notification.requestId,
    read: notification.read === null ? false : notification.read,
    createdAt: notification.createdAt,
  }));
}

export async function getNutritionistNotifications(nutritionistId: string): Promise<ChatNotification[]> {
  const notifications = await db
    .select()
    .from(chatNotification)
    .where(and(eq(chatNotification.recipientId, nutritionistId), eq(chatNotification.recipientType, "nutritionist")))
    .orderBy(desc(chatNotification.createdAt));

  return notifications.map((notification) => ({
    id: notification.id,
    recipientId: notification.recipientId,
    recipientType: notification.recipientType,
    type: notification.type,
    message: notification.message, // Required field
    content: notification.message, // For flexibility
    relatedEntityId: notification.sessionId || notification.requestId,
    read: notification.read === null ? false : notification.read,
    createdAt: notification.createdAt,
  }));
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  await db.update(chatNotification).set({ read: true }).where(eq(chatNotification.id, notificationId));
  revalidatePath("/nutritionist");
  return true;
}

// ======== USER OPERATIONS ========

export async function getUserNameById(userId: string): Promise<string | null> {
  try {
    const [userRecord] = await db.select().from(user).where(eq(user.id, userId));
    return userRecord ? userRecord.name : null;
  } catch (error) {
    console.error(`Error fetching user name for ${userId}:`, error);
    return null;
  }
}

// ======== ADMIN OPERATIONS ========

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    // Since there's no isAdmin field in the user table, we need to check for admin status differently
    // For now, we'll use a hardcoded list of admin emails or check for specific user IDs
    // This should be replaced with a proper admin check mechanism in the future

    const [userRecord] = await db.select().from(user).where(eq(user.id, userId));
    if (!userRecord) return false;

    // Check if the user's email is in a list of admin emails
    // This is a temporary solution - in a production app, you'd have a proper admin role system
    const adminEmails = ["michael.chen@example.com", "amina.patel@example.com", "sarah.johnson@example.com"];
    return adminEmails.includes(userRecord.email);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false; // Default to not admin on error
  }
}

// ======== DIRECT CHAT SESSION CREATION ========

export async function createDirectChatSession(userId: string, nutritionistId: string, initialQuery?: string): Promise<ChatSession> {
  // Create a session directly without requiring manual acceptance
  const session = await createChatSession(userId, nutritionistId);

  // If there was an initial query, add it as the first message
  if (initialQuery) {
    await createChatMessage(session.id, initialQuery, "user", userId);
  }

  // Create notification for nutritionist
  await createNotification({
    recipientId: nutritionistId,
    recipientType: "nutritionist",
    type: "new_message",
    content: initialQuery ? `New chat started: ${initialQuery.substring(0, 50)}${initialQuery.length > 50 ? "..." : ""}` : "New chat started",
    relatedEntityId: session.id,
  });

  revalidatePath("/nutritionist");
  return session;
}
