// Nutritionist types for the chat system

export interface NutritionistProfile {
  id: string;
  userId?: string; // Reference to the user who is a nutritionist
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
  // Additional fields for UI display
  userName?: string;
  nutritionistName?: string;
  endedBy?: 'user' | 'nutritionist';
  createdAt: Date; // When the session was created
}

export interface ChatNotification {
  id: string;
  recipientId: string;
  recipientType: 'user' | 'nutritionist';
  sessionId?: string;
  requestId?: string;
  type: 'new_message' | 'session_request' | 'session_accepted' | 'session_rejected' | 'session_ended' | 'nutritionist_available';
  read: boolean;
  createdAt: Date;
  message: string;
  content?: string; // Alternative to message for flexibility
  relatedEntityId?: string | null; // Generic reference to related entity (session or request)
}

// Status of a nutritionist's availability
export type AvailabilityStatus = 'online' | 'busy' | 'away' | 'offline';

// Request for a chat session
export interface SessionRequest {
  id: string;
  userId: string;
  requestedNutritionistId?: string; // Optional - if user requests specific nutritionist
  initialQuery?: string; // Initial question/concern from user
  status: 'pending' | 'active' | 'ended' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt?: Date; // When the request expires if not accepted
  acceptedAt?: Date;
  rejectedAt?: Date;
  // Additional fields for UI display
  userName?: string;
}
