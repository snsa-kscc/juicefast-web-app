import { pgTable, text, timestamp, boolean, integer, json, pgEnum } from "drizzle-orm/pg-core";

// User tables (existing)
export const user = pgTable("jf-user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("jf-session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("jf-account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("jf-verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Nutritionist chat enums
export const sessionStatusEnum = pgEnum("jf-session_status", ["pending", "active", "ended"]);
export const availabilityStatusEnum = pgEnum("jf-availability_status", ["online", "busy", "away", "offline"]);
export const senderTypeEnum = pgEnum("jf-sender_type", ["user", "nutritionist"]);
export const notificationTypeEnum = pgEnum("jf-notification_type", ["new_message", "session_ended"]);

// Nutritionist tables
export const nutritionistProfile = pgTable("jf-nutritionist_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  specialties: json("specialties").$type<string[]>().notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url"),
  available: boolean("available").default(true),
  nextAvailableSlot: timestamp("next_available_slot"),
  workingHours: json("working_hours"),
  averageResponseTime: integer("average_response_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatSession = pgTable("jf-chat_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  nutritionistId: text("nutritionist_id")
    .notNull()
    .references(() => nutritionistProfile.id, { onDelete: "cascade" }),
  status: sessionStatusEnum("status").notNull().default("active"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  endedBy: senderTypeEnum("ended_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatMessage = pgTable("jf-chat_message", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSession.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sender: senderTypeEnum("sender").notNull(),
  senderId: text("sender_id").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Session request table removed

export const chatNotification = pgTable("jf-chat_notification", {
  id: text("id").primaryKey(),
  recipientId: text("recipient_id").notNull(),
  recipientType: senderTypeEnum("recipient_type").notNull(),
  sessionId: text("session_id").references(() => chatSession.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
