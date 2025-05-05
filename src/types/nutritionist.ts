// Nutritionist types for the chat system

export interface NutritionistProfile {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  bio: string;
  photoUrl?: string;
  availability: {
    available: boolean;
    nextAvailableSlot?: Date;
    workingHours?: {
      [day: string]: {
        start: string; // Format: "HH:MM"
        end: string;   // Format: "HH:MM"
      };
    };
  };
  averageResponseTime?: number; // in minutes
}

export interface ChatSession {
  id: string;
  userId: string;
  nutritionistId: string;
  status: 'pending' | 'active' | 'ended';
  startedAt: Date;
  endedAt?: Date;
  lastMessageAt?: Date;
}

export interface ChatNotification {
  id: string;
  recipientId: string;
  recipientType: 'user' | 'nutritionist';
  sessionId: string;
  type: 'new_message' | 'session_request' | 'nutritionist_available' | 'session_ended';
  read: boolean;
  createdAt: Date;
  message: string;
}

// Status of a nutritionist's availability
export type AvailabilityStatus = 'online' | 'busy' | 'away' | 'offline';

// Request for a chat session
export interface SessionRequest {
  id: string;
  userId: string;
  requestedNutritionistId?: string; // Optional - if user requests specific nutritionist
  userQuery?: string; // Initial question/concern from user
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date; // When the request expires if not accepted
  acceptedAt?: Date;
  rejectedAt?: Date;
}
