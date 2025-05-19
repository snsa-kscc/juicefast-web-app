import { db } from '@/db';
import { v4 as uuidv4 } from 'uuid';
import { eq, and, or, desc, asc, isNull } from 'drizzle-orm';
import { 
  nutritionistProfile, 
  chatSession, 
  chatMessage, 
  sessionRequest, 
  chatNotification,
  user
} from '@/db/schema';
import { 
  NutritionistProfile, 
  ChatSession, 
  ChatNotification, 
  SessionRequest, 
  AvailabilityStatus 
} from '@/types/nutritionist';
import { MessageType } from '@/components/nutritionist/chat-message';

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
      workingHours: profile.workingHours
    },
    averageResponseTime: profile.averageResponseTime
  };
};

// Nutritionist Profile Operations
export const getNutritionistProfiles = async (): Promise<NutritionistProfile[]> => {
  const profiles = await db.select().from(nutritionistProfile);
  return profiles.map(mapDbProfileToNutritionistProfile);
};

export const getNutritionistProfileById = async (id: string): Promise<NutritionistProfile | undefined> => {
  const [profile] = await db.select().from(nutritionistProfile).where(eq(nutritionistProfile.id, id));
  return profile ? mapDbProfileToNutritionistProfile(profile) : undefined;
};

export const getAvailableNutritionistProfiles = async (): Promise<NutritionistProfile[]> => {
  const profiles = await db.select().from(nutritionistProfile).where(eq(nutritionistProfile.available, true));
  return profiles.map(mapDbProfileToNutritionistProfile);
};

export const createNutritionistProfile = async (profile: Omit<NutritionistProfile, 'id'>): Promise<NutritionistProfile> => {
  const id = uuidv4();
  
  // Ensure userId is never undefined
  if (!profile.userId) {
    throw new Error('userId is required for creating a nutritionist profile');
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
    updatedAt: new Date()
  });
  
  return { ...profile, id };
};

export const updateNutritionistProfile = async (id: string, updates: Partial<NutritionistProfile>): Promise<NutritionistProfile | undefined> => {
  const updateValues: any = {
    updatedAt: new Date()
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
  
  await db.update(nutritionistProfile)
    .set(updateValues)
    .where(eq(nutritionistProfile.id, id));
  
  return getNutritionistProfileById(id);
};

// Nutritionist Status Operations
export const getNutritionistStatus = async (nutritionistId: string): Promise<AvailabilityStatus> => {
  // Get the nutritionist profile
  const profile = await getNutritionistProfileById(nutritionistId);
  if (!profile) return 'offline';
  
  // If not available, return offline
  if (!profile.availability.available) return 'offline';
  
  // Check if nutritionist has active sessions
  const activeSessions = await db.select()
    .from(chatSession)
    .where(
      and(
        eq(chatSession.nutritionistId, nutritionistId),
        eq(chatSession.status, 'active')
      )
    );
  
  // If nutritionist has active sessions, return busy
  if (activeSessions.length > 0) return 'busy';
  
  // Otherwise, return online
  return 'online';
};

// Chat Session Operations
export const createChatSession = async (
  userId: string,
  nutritionistId: string,
  requestId?: string
): Promise<ChatSession> => {
  const id = uuidv4();
  const now = new Date();
  
  await db.insert(chatSession).values({
    id,
    userId,
    nutritionistId,
    status: 'active',
    startedAt: now,
    createdAt: now,
    updatedAt: now
  });
  
  return {
    id,
    userId,
    nutritionistId,
    status: 'active',
    startedAt: now,
    createdAt: now
  };
};

export const getChatSessionById = async (id: string): Promise<ChatSession | null> => {
  const [session] = await db.select()
    .from(chatSession)
    .where(eq(chatSession.id, id));
  
  if (!session) return null;
  
  return {
    id: session.id,
    userId: session.userId,
    nutritionistId: session.nutritionistId,
    status: session.status,
    startedAt: session.startedAt,
    endedAt: session.endedAt || undefined,
    endedBy: session.endedBy || undefined,
    createdAt: session.createdAt
  };
};

export const getUserActiveChatSession = async (userId: string): Promise<ChatSession | null> => {
  const [session] = await db.select()
    .from(chatSession)
    .where(
      and(
        eq(chatSession.userId, userId),
        eq(chatSession.status, 'active')
      )
    );
  
  if (!session) return null;
  
  return {
    id: session.id,
    userId: session.userId,
    nutritionistId: session.nutritionistId,
    status: session.status,
    startedAt: session.startedAt,
    endedAt: session.endedAt || undefined,
    endedBy: session.endedBy || undefined,
    createdAt: session.createdAt
  };
};

export const getNutritionistSessions = async (nutritionistId: string): Promise<ChatSession[]> => {
  const sessions = await db.select()
    .from(chatSession)
    .where(eq(chatSession.nutritionistId, nutritionistId))
    .orderBy(desc(chatSession.createdAt));
  
  return sessions.map(session => ({
    id: session.id,
    userId: session.userId,
    nutritionistId: session.nutritionistId,
    status: session.status,
    startedAt: session.startedAt,
    endedAt: session.endedAt || undefined,
    endedBy: session.endedBy || undefined,
    createdAt: session.createdAt
  }));
};

export const getNutritionistActiveSessions = async (nutritionistId: string): Promise<ChatSession[]> => {
  const sessions = await db.select()
    .from(chatSession)
    .where(
      and(
        eq(chatSession.nutritionistId, nutritionistId),
        eq(chatSession.status, 'active')
      )
    )
    .orderBy(desc(chatSession.createdAt));
  
  return sessions.map(session => ({
    id: session.id,
    userId: session.userId,
    nutritionistId: session.nutritionistId,
    status: session.status,
    startedAt: session.startedAt,
    endedAt: session.endedAt || undefined,
    endedBy: session.endedBy || undefined,
    createdAt: session.createdAt
  }));
};

export const updateChatSessionStatus = async (
  sessionId: string,
  status: 'active' | 'ended',
  endedBy?: 'user' | 'nutritionist'
): Promise<boolean> => {
  const updateValues: any = {
    status,
    updatedAt: new Date()
  };
  
  if (status === 'ended') {
    updateValues.endedAt = new Date();
    if (endedBy) {
      updateValues.endedBy = endedBy;
    }
  }
  
  await db.update(chatSession)
    .set(updateValues)
    .where(eq(chatSession.id, sessionId));
  
  return true;
};

// Chat Message Operations
export const createChatMessage = async (
  sessionId: string,
  content: string,
  sender: 'user' | 'nutritionist',
  senderId: string
): Promise<MessageType> => {
  const id = uuidv4();
  const now = new Date();
  
  await db.insert(chatMessage).values({
    id,
    sessionId,
    content,
    sender,
    senderId,
    read: false,
    createdAt: now
  });
  
  return {
    id,
    sessionId,
    content,
    sender,
    senderId,
    timestamp: now,
    read: false
  };
};

export const getChatMessages = async (sessionId: string): Promise<MessageType[]> => {
  const messages = await db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.sessionId, sessionId))
    .orderBy(asc(chatMessage.createdAt));

  return messages.map((message) => ({
    id: message.id,
    sessionId: message.sessionId,
    content: message.content,
    sender: message.sender,
    senderId: message.senderId,
    timestamp: message.createdAt,
    read: message.read === null ? false : message.read
  }));
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  await db.update(chatMessage)
    .set({ read: true })
    .where(eq(chatMessage.id, messageId));
  
  return true;
};

// Session Request Operations
export const createSessionRequest = async (
  userId: string,
  nutritionistId?: string,
  initialQuery?: string
): Promise<SessionRequest> => {
  const id = uuidv4();
  const now = new Date();
  
  await db.insert(sessionRequest).values({
    id,
    userId,
    requestedNutritionistId: nutritionistId || null,
    initialQuery: initialQuery || null,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  });
  
  return {
    id,
    userId,
    requestedNutritionistId: nutritionistId,
    initialQuery,
    status: 'pending',
    createdAt: now
  };
};

export const getSessionRequestById = async (id: string): Promise<SessionRequest | null> => {
  const [request] = await db.select().from(sessionRequest).where(eq(sessionRequest.id, id));
  
  if (!request) return null;
  
  return {
    id: request.id,
    userId: request.userId,
    requestedNutritionistId: request.requestedNutritionistId || undefined,
    initialQuery: request.initialQuery || undefined,
    status: request.status,
    createdAt: request.createdAt
  };
};

export const getUserPendingSessionRequests = async (userId: string): Promise<SessionRequest[]> => {
  const requests = await db.select()
    .from(sessionRequest)
    .where(
      and(
        eq(sessionRequest.userId, userId),
        eq(sessionRequest.status, 'pending')
      )
    )
    .orderBy(desc(sessionRequest.createdAt));
  
  return requests.map(request => ({
    id: request.id,
    userId: request.userId,
    requestedNutritionistId: request.requestedNutritionistId || undefined,
    initialQuery: request.initialQuery || undefined,
    status: request.status,
    createdAt: request.createdAt
  }));
};

export const getNutritionistPendingSessionRequests = async (nutritionistId: string): Promise<SessionRequest[]> => {
  const requests = await db.select()
    .from(sessionRequest)
    .where(
      and(
        eq(sessionRequest.requestedNutritionistId, nutritionistId),
        eq(sessionRequest.status, 'pending')
      )
    )
    .orderBy(desc(sessionRequest.createdAt));
  
  return requests.map(request => ({
    id: request.id,
    userId: request.userId,
    requestedNutritionistId: request.requestedNutritionistId || undefined,
    initialQuery: request.initialQuery || undefined,
    status: request.status,
    createdAt: request.createdAt
  }));
};

export const updateSessionRequestStatus = async (
  requestId: string,
  status: 'pending' | 'active' | 'ended'
): Promise<boolean> => {
  await db.update(sessionRequest)
    .set({
      status,
      updatedAt: new Date()
    })
    .where(eq(sessionRequest.id, requestId));
  
  return true;
};

// Notification Operations
export const createNotification = async (notification: {
  recipientId: string;
  recipientType: 'user' | 'nutritionist';
  type: 'new_message' | 'session_request' | 'session_accepted' | 'session_rejected' | 'session_ended';
  content: string;
  relatedEntityId?: string;
}): Promise<ChatNotification> => {
  const id = uuidv4();
  const now = new Date();
  
  await db.insert(chatNotification).values({
    id,
    recipientId: notification.recipientId,
    recipientType: notification.recipientType,
    type: notification.type,
    message: notification.content,
    sessionId: notification.type === 'new_message' || notification.type === 'session_ended' 
      ? notification.relatedEntityId || null 
      : null,
    requestId: notification.type === 'session_request' || notification.type === 'session_accepted' || notification.type === 'session_rejected'
      ? notification.relatedEntityId || null
      : null,
    read: false,
    createdAt: now
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
    createdAt: now
  };
};

export const getUserNotifications = async (userId: string): Promise<ChatNotification[]> => {
  const notifications = await db
    .select()
    .from(chatNotification)
    .where(
      and(
        eq(chatNotification.recipientId, userId),
        eq(chatNotification.recipientType, 'user')
      )
    )
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
    createdAt: notification.createdAt
  }));
};

export const getNutritionistNotifications = async (nutritionistId: string): Promise<ChatNotification[]> => {
  const notifications = await db
    .select()
    .from(chatNotification)
    .where(
      and(
        eq(chatNotification.recipientId, nutritionistId),
        eq(chatNotification.recipientType, 'nutritionist')
      )
    )
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
    createdAt: notification.createdAt
  }));
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  await db.update(chatNotification)
    .set({ read: true })
    .where(eq(chatNotification.id, notificationId));
  
  return true;
};

// Admin Operations
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const [userRecord] = await db.select().from(user).where(eq(user.id, userId));
  return userRecord?.isAdmin || false;
};
