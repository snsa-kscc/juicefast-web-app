CREATE TYPE "public"."js-availability_status" AS ENUM('online', 'busy', 'away', 'offline');--> statement-breakpoint
CREATE TYPE "public"."js-notification_type" AS ENUM('new_message', 'session_request', 'session_accepted', 'session_rejected', 'session_ended');--> statement-breakpoint
CREATE TYPE "public"."js-sender_type" AS ENUM('user', 'nutritionist');--> statement-breakpoint
CREATE TYPE "public"."js-session_status" AS ENUM('pending', 'active', 'ended');--> statement-breakpoint
CREATE TABLE "js-chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"content" text NOT NULL,
	"sender" "js-sender_type" NOT NULL,
	"sender_id" text NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "js-chat_notification" (
	"id" text PRIMARY KEY NOT NULL,
	"recipient_id" text NOT NULL,
	"recipient_type" "js-sender_type" NOT NULL,
	"session_id" text,
	"request_id" text,
	"type" "js-notification_type" NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "js-chat_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"nutritionist_id" text NOT NULL,
	"status" "js-session_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"ended_by" "js-sender_type",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "js-nutritionist_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"specialties" json NOT NULL,
	"bio" text NOT NULL,
	"photo_url" text,
	"available" boolean DEFAULT true,
	"next_available_slot" timestamp,
	"working_hours" json,
	"average_response_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "js-session_request" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"requested_nutritionist_id" text,
	"initial_query" text,
	"status" "js-session_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "js-chat_message" ADD CONSTRAINT "js-chat_message_session_id_js-chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."js-chat_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "js-chat_notification" ADD CONSTRAINT "js-chat_notification_session_id_js-chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."js-chat_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "js-chat_notification" ADD CONSTRAINT "js-chat_notification_request_id_js-session_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."js-session_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "js-chat_session" ADD CONSTRAINT "js-chat_session_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "js-chat_session" ADD CONSTRAINT "js-chat_session_nutritionist_id_js-nutritionist_profile_id_fk" FOREIGN KEY ("nutritionist_id") REFERENCES "public"."js-nutritionist_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "js-nutritionist_profile" ADD CONSTRAINT "js-nutritionist_profile_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "js-session_request" ADD CONSTRAINT "js-session_request_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "js-session_request" ADD CONSTRAINT "js-session_request_requested_nutritionist_id_js-nutritionist_profile_id_fk" FOREIGN KEY ("requested_nutritionist_id") REFERENCES "public"."js-nutritionist_profile"("id") ON DELETE no action ON UPDATE no action;