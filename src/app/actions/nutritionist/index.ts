'use server';

import * as dbActions from './db-actions';
import { 
  NutritionistProfile, 
  ChatSession, 
  AvailabilityStatus,
  SessionRequest,
  ChatNotification
} from '@/types/nutritionist';
import { MessageType } from '@/components/nutritionist/chat-message';
import { revalidatePath } from 'next/cache';



// Nutritionist Profile Actions
export async function getNutritionists(): Promise<NutritionistProfile[]> {
  return dbActions.getNutritionistProfiles();
}

export async function getAvailableNutritionists(): Promise<NutritionistProfile[]> {
  return dbActions.getAvailableNutritionistProfiles();
}

export async function getNutritionistById(id: string): Promise<NutritionistProfile | undefined> {
  return dbActions.getNutritionistProfileById(id);
}

export async function getNutritionistStatus(nutritionistId: string): Promise<AvailabilityStatus> {
  return dbActions.getNutritionistStatus(nutritionistId);
}

export async function updateNutritionistProfile(
  id: string, 
  updates: Partial<NutritionistProfile>
): Promise<NutritionistProfile | undefined> {
  const result = await dbActions.updateNutritionistProfile(id, updates);
  revalidatePath('/nutritionist');
  return result;
}

// Chat Session Actions
export async function requestChatSession(
  userId: string,
  nutritionistId: string,
  initialQuery?: string
): Promise<SessionRequest> {
  const request = await dbActions.createSessionRequest(userId, nutritionistId, initialQuery);
  
  // Create notification for nutritionist
  await dbActions.createNotification({
    recipientId: nutritionistId,
    recipientType: 'nutritionist',
    type: 'session_request',
    content: `New chat request from a user`,
    relatedEntityId: request.id
  });
  
  revalidatePath('/nutritionist');
  return request;
}

export async function acceptSessionRequest(requestId: string, nutritionistId: string): Promise<ChatSession | null> {
  
  // Get the request
  const request = await dbActions.getSessionRequestById(requestId);
  if (!request || request.status !== 'pending') {
    return null;
  }
  
  // Update request status
  await dbActions.updateSessionRequestStatus(requestId, 'active');
  
  // Create chat session
  const session = await dbActions.createChatSession(request.userId, nutritionistId, requestId);
  
  // Create notification for user
  await dbActions.createNotification({
    recipientId: request.userId,
    recipientType: 'user',
    type: 'session_accepted',
    content: `Your chat request has been accepted.`,
    relatedEntityId: session.id
  });
  
  // If there was an initial query, add it as the first message
  if (request.initialQuery) {
    await dbActions.createChatMessage(
      session.id,
      request.initialQuery,
      'user',
      request.userId
    );
  }
  
  revalidatePath('/nutritionist');
  return session;
}

export async function rejectSessionRequest(requestId: string, nutritionistId: string): Promise<boolean> {
  
  // Get the request
  const request = await dbActions.getSessionRequestById(requestId);
  if (!request || request.status !== 'pending') {
    return false;
  }
  
  // Update request status
  await dbActions.updateSessionRequestStatus(requestId, 'ended');
  
  // Create notification for user
  await dbActions.createNotification({
    recipientId: request.userId,
    recipientType: 'user',
    type: 'session_rejected',
    content: `Your chat request has been rejected. Please try again later.`,
    relatedEntityId: requestId
  });
  
  revalidatePath('/nutritionist');
  return true;
}

export async function getUserActiveChatSession(userId: string): Promise<ChatSession | null> {
  return dbActions.getUserActiveChatSession(userId);
}

export async function getNutritionistActiveSessions(nutritionistId: string): Promise<ChatSession[]> {
  return dbActions.getNutritionistActiveSessions(nutritionistId);
}

export async function getChatMessages(sessionId: string): Promise<MessageType[]> {
  return dbActions.getChatMessages(sessionId);
}

export async function sendMessage(
  sessionId: string,
  content: string,
  sender: 'user' | 'nutritionist',
  senderId: string
): Promise<MessageType> {
  
  // Get the session to find the recipient
  const session = await dbActions.getChatSessionById(sessionId);
  if (!session) {
    throw new Error(`Chat session ${sessionId} not found`);
  }
  
  // Create the message
  const message = await dbActions.createChatMessage(sessionId, content, sender, senderId);
  
  // Create notification for the recipient
  const recipientId = sender === 'user' ? session.nutritionistId : session.userId;
  const recipientType = sender === 'user' ? 'nutritionist' : 'user';
  
  await dbActions.createNotification({
    recipientId,
    recipientType,
    type: 'new_message',
    content: `New message: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
    relatedEntityId: sessionId
  });
  
  revalidatePath('/nutritionist');
  return message;
}

export async function markMessageAsRead(messageId: string): Promise<boolean> {
  const result = await dbActions.markMessageAsRead(messageId);
  revalidatePath('/nutritionist');
  return result;
}

export async function endChatSession(sessionId: string, endedBy: 'user' | 'nutritionist'): Promise<boolean> {
  
  // Get the session
  const session = await dbActions.getChatSessionById(sessionId);
  if (!session || session.status !== 'active') {
    return false;
  }
  
  // Update session status
  await dbActions.updateChatSessionStatus(sessionId, 'ended', endedBy);
  
  // Create notifications for both parties
  const recipientId = endedBy === 'user' ? session.nutritionistId : session.userId;
  const recipientType = endedBy === 'user' ? 'nutritionist' : 'user';
  
  await dbActions.createNotification({
    recipientId,
    recipientType,
    type: 'session_ended',
    content: `Chat session has been ended.`,
    relatedEntityId: sessionId
  });
  
  revalidatePath('/nutritionist');
  return true;
}

// Notification Actions
export async function getUserNotifications(userId: string): Promise<ChatNotification[]> {
  return dbActions.getUserNotifications(userId);
}

export async function getNutritionistNotifications(nutritionistId: string): Promise<ChatNotification[]> {
  return dbActions.getNutritionistNotifications(nutritionistId);
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const result = await dbActions.markNotificationAsRead(notificationId);
  revalidatePath('/nutritionist');
  return result;
}

// Admin Operations
export async function isUserAdmin(userId: string): Promise<boolean> {
  return dbActions.isUserAdmin(userId);
}
