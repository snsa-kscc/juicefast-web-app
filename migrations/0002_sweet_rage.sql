ALTER TYPE "public"."js-availability_status" RENAME TO "jf-availability_status";--> statement-breakpoint
ALTER TYPE "public"."js-notification_type" RENAME TO "jf-notification_type";--> statement-breakpoint
ALTER TYPE "public"."js-sender_type" RENAME TO "jf-sender_type";--> statement-breakpoint
ALTER TYPE "public"."js-session_status" RENAME TO "jf-session_status";--> statement-breakpoint
ALTER TABLE "js-chat_message" RENAME TO "jf-chat_message";--> statement-breakpoint
ALTER TABLE "js-chat_notification" RENAME TO "jf-chat_notification";--> statement-breakpoint
ALTER TABLE "js-chat_session" RENAME TO "jf-chat_session";--> statement-breakpoint
ALTER TABLE "js-nutritionist_profile" RENAME TO "jf-nutritionist_profile";--> statement-breakpoint
ALTER TABLE "js-session_request" RENAME TO "jf-session_request";--> statement-breakpoint
ALTER TABLE "jf-chat_message" DROP CONSTRAINT "js-chat_message_session_id_js-chat_session_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-chat_notification" DROP CONSTRAINT "js-chat_notification_session_id_js-chat_session_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-chat_notification" DROP CONSTRAINT "js-chat_notification_request_id_js-session_request_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-chat_session" DROP CONSTRAINT "js-chat_session_user_id_jf-user_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-chat_session" DROP CONSTRAINT "js-chat_session_nutritionist_id_js-nutritionist_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-nutritionist_profile" DROP CONSTRAINT "js-nutritionist_profile_user_id_jf-user_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-session_request" DROP CONSTRAINT "js-session_request_user_id_jf-user_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-session_request" DROP CONSTRAINT "js-session_request_requested_nutritionist_id_js-nutritionist_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "jf-chat_message" ADD CONSTRAINT "jf-chat_message_session_id_jf-chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."jf-chat_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-chat_notification" ADD CONSTRAINT "jf-chat_notification_session_id_jf-chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."jf-chat_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-chat_notification" ADD CONSTRAINT "jf-chat_notification_request_id_jf-session_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."jf-session_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-chat_session" ADD CONSTRAINT "jf-chat_session_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-chat_session" ADD CONSTRAINT "jf-chat_session_nutritionist_id_jf-nutritionist_profile_id_fk" FOREIGN KEY ("nutritionist_id") REFERENCES "public"."jf-nutritionist_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-nutritionist_profile" ADD CONSTRAINT "jf-nutritionist_profile_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-session_request" ADD CONSTRAINT "jf-session_request_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-session_request" ADD CONSTRAINT "jf-session_request_requested_nutritionist_id_jf-nutritionist_profile_id_fk" FOREIGN KEY ("requested_nutritionist_id") REFERENCES "public"."jf-nutritionist_profile"("id") ON DELETE no action ON UPDATE no action;