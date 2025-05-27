CREATE TABLE "jf-daily-health-metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"total_score" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jf-meal-entry" (
	"id" text PRIMARY KEY NOT NULL,
	"metrics_id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"calories" real NOT NULL,
	"protein" real NOT NULL,
	"carbs" real NOT NULL,
	"fat" real NOT NULL,
	"meal_type" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jf-mindfulness-entry" (
	"id" text PRIMARY KEY NOT NULL,
	"metrics_id" text NOT NULL,
	"user_id" text NOT NULL,
	"minutes" integer NOT NULL,
	"activity" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jf-sleep-entry" (
	"id" text PRIMARY KEY NOT NULL,
	"metrics_id" text NOT NULL,
	"user_id" text NOT NULL,
	"hours_slept" real NOT NULL,
	"quality" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jf-step-entry" (
	"id" text PRIMARY KEY NOT NULL,
	"metrics_id" text NOT NULL,
	"user_id" text NOT NULL,
	"count" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jf-user-profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"height" real,
	"weight" real,
	"age" integer,
	"gender" text,
	"activity_level" text,
	"referral_code" text,
	"referred_by" text,
	"referral_count" integer DEFAULT 0,
	"referrals" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jf-water-intake" (
	"id" text PRIMARY KEY NOT NULL,
	"metrics_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount" real NOT NULL,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jf-daily-health-metrics" ADD CONSTRAINT "jf-daily-health-metrics_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-meal-entry" ADD CONSTRAINT "jf-meal-entry_metrics_id_jf-daily-health-metrics_id_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."jf-daily-health-metrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-meal-entry" ADD CONSTRAINT "jf-meal-entry_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-mindfulness-entry" ADD CONSTRAINT "jf-mindfulness-entry_metrics_id_jf-daily-health-metrics_id_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."jf-daily-health-metrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-mindfulness-entry" ADD CONSTRAINT "jf-mindfulness-entry_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-sleep-entry" ADD CONSTRAINT "jf-sleep-entry_metrics_id_jf-daily-health-metrics_id_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."jf-daily-health-metrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-sleep-entry" ADD CONSTRAINT "jf-sleep-entry_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-step-entry" ADD CONSTRAINT "jf-step-entry_metrics_id_jf-daily-health-metrics_id_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."jf-daily-health-metrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-step-entry" ADD CONSTRAINT "jf-step-entry_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-user-profile" ADD CONSTRAINT "jf-user-profile_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-water-intake" ADD CONSTRAINT "jf-water-intake_metrics_id_jf-daily-health-metrics_id_fk" FOREIGN KEY ("metrics_id") REFERENCES "public"."jf-daily-health-metrics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jf-water-intake" ADD CONSTRAINT "jf-water-intake_user_id_jf-user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."jf-user"("id") ON DELETE cascade ON UPDATE no action;