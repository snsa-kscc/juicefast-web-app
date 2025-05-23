ALTER TABLE "jf-session_request" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "jf-session_request" CASCADE;--> statement-breakpoint
ALTER TABLE "jf-chat_notification" DROP CONSTRAINT "jf-chat_notification_request_id_jf-session_request_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-chat_notification" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."jf-notification_type";--> statement-breakpoint
CREATE TYPE "public"."jf-notification_type" AS ENUM('new_message', 'session_ended');--> statement-breakpoint
ALTER TABLE "jf-chat_notification" ALTER COLUMN "type" SET DATA TYPE "public"."jf-notification_type" USING "type"::"public"."jf-notification_type";--> statement-breakpoint
ALTER TABLE "jf-chat_notification" DROP COLUMN "request_id";