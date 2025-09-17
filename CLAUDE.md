# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` (uses Next.js with Turbopack)
- **Build**: `pnpm build`
- **Start production**: `pnpm start`
- **Lint**: `pnpm lint`

## Database Commands

- **Run migrations**: `npx drizzle-kit migrate`
- **Generate migrations**: `npx drizzle-kit generate`
- **Drop migrations**: `npx drizzle-kit drop`
- **Push schema**: `npx drizzle-kit push`

## Project Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router and React Server Components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google, Facebook, and Apple OAuth
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom Lufga font family
- **AI Integration**: Google AI SDK for meal analysis and chat features
- **Deployment**: Configured for Vercel

### Application Structure

**Route Organization**:

- `(auth)/` - Authentication pages (sign-in, sign-up)
- `(main)/` - Main application with bottom navigation
- Protected routes redirect to `/sign-in` if not authenticated
- Authenticated users accessing auth routes redirect to `/dashboard`

**Core Features**:

1. **Health Tracking System**

   - Daily health metrics with scoring
   - Meal tracking with AI-powered analysis (macronutrients, calories)
   - Water intake, step counting, sleep, and mindfulness tracking
   - Progress visualization with charts (Recharts)

2. **Nutritionist Chat Platform**

   - Real-time chat sessions between users and nutritionists
   - Session management (pending, active, ended)
   - Notification system for messages and session updates
   - Nutritionist profiles with specialties and availability

3. **Wellness Content System**

   - Categorized content (nutrition, workouts, beauty, mind)
   - Subcategory navigation and content filtering
   - Premium subscription features

4. **User Management & Referrals**
   - User profiles with health data (height, weight, activity level)
   - Referral code system with tracking
   - Onboarding quiz for personalized experience

### Database Schema

**Authentication Tables**:

- `jf-user`, `jf-session`, `jf-account`, `jf-verification`

**Health Tracking Tables**:

- `jf-user-profile` - User demographics and referral data
- `jf-daily-health-metrics` - Daily score aggregations
- `jf-meal-entry` - Meal tracking with macronutrient breakdown
- `jf-water-intake`, `jf-step-entry`, `jf-sleep-entry`, `jf-mindfulness-entry`

**Nutritionist Chat Tables**:

- `jf-nutritionist_profile` - Nutritionist information and availability
- `jf-chat_session` - Chat session management
- `jf-chat_message` - Individual messages
- `jf-chat_notification` - Message and session notifications

### Key Implementation Details

- **Authentication**: Better Auth with Drizzle adapter, supports multiple OAuth providers
- **AI Integration**: Google AI SDK for meal image analysis and nutritionist chat
- **Image Handling**: Next.js Image with Google profile photos support
- **Middleware**: Session-based route protection with cookie validation
- **Mobile-First**: Bottom navigation UI optimized for mobile experience
- **Server Actions**: Used for form handling and data mutations
- **Type Safety**: Full TypeScript implementation with Zod validation

### Component Architecture

- **UI Components**: Located in `src/components/ui/` using shadcn/ui conventions
- **Feature Components**: Organized by feature in `src/components/`
- **Data Layer**: Static data in `src/data/`, database models in `src/db/`
- **Actions**: Server actions in `src/app/actions/`
- **API Routes**: Next.js API routes in `src/app/api/`

### Development Notes

- Uses pnpm for package management
- Turbopack enabled for faster development builds
- Server actions have 10MB body size limit for image uploads
- Database uses PostgreSQL enums for status fields
- Custom fonts loaded via `src/lib/fonts.ts`
- Environment variables required: `DATABASE_URL`, OAuth client credentials
