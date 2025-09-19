# JuiceFast Nutrition App - Health & Wellness Platform

A comprehensive health tracking and nutritionist consultation platform built with Next.js 15, featuring AI-powered meal analysis, real-time chat, and wellness content management.

## Features

- **Health Tracking System**: Daily metrics with scoring, meal tracking with AI analysis, water intake, steps, sleep, and mindfulness tracking
- **Nutritionist Chat Platform**: Real-time chat sessions with certified nutritionists
- **AI-Powered Meal Analysis**: Google AI integration for macronutrient and calorie analysis from food images
- **Wellness Content System**: Categorized content for nutrition, workouts, beauty, and mindfulness
- **User Management**: Profile management, referral system, and personalized onboarding quiz
- **Mobile-First Design**: Optimized mobile experience with bottom navigation

## Tech Stack

- **Framework**: Next.js 15 with App Router and React Server Components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google, Facebook, and Apple OAuth
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom Lufga font family
- **AI Integration**: Google AI SDK for meal analysis and chat features
- **Charts**: Recharts for progress visualization
- **Deployment**: Configured for Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI API key
- OAuth provider credentials (Google, Facebook, Apple)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables (copy `.env.example` to `.env.local`)

4. Run database migrations:

   ```bash
   npx drizzle-kit migrate
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Commands

- **Development server**: `pnpm dev` (uses Turbopack)
- **Build**: `pnpm build`
- **Start production**: `pnpm start`
- **Lint**: `pnpm lint`

## Database Commands

- **Run migrations**: `npx drizzle-kit migrate`
- **Generate migrations**: `npx drizzle-kit generate`
- **Drop migrations**: `npx drizzle-kit drop`
- **Push schema**: `npx drizzle-kit push`

## Project Structure

```
/
├── README.md              # Project documentation
├── CLAUDE.md              # Claude Code instructions
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── components.json        # shadcn/ui configuration
├── drizzle.config.ts      # Database configuration
├── next.config.ts         # Next.js configuration
├── next-env.d.ts          # Next.js type definitions
├── postcss.config.mjs     # PostCSS configuration
├── migrations/            # Database migration files
│   ├── *.sql             # SQL migration scripts
│   └── meta/             # Migration metadata
├── public/               # Static assets
│   ├── icons/            # App icons and favicons
│   ├── *.svg             # Vector graphics
│   ├── *.png             # Images and avatars
│   └── jf-logo.png       # Brand logo
└── src/
    ├── app/              # Next.js App Router
    │   ├── layout.tsx    # Root layout
    │   ├── page.tsx      # Landing page
    │   ├── globals.css   # Global styles
    │   ├── favicon.ico   # App favicon
    │   ├── (auth)/       # Authentication routes
    │   │   ├── layout.tsx
    │   │   ├── sign-in/
    │   │   │   ├── page.tsx
    │   │   │   └── login-form.tsx
    │   │   └── sign-up/
    │   │       ├── page.tsx
    │   │       └── signup-form.tsx
    │   ├── (main)/       # Main app routes
    │   │   ├── layout.tsx            # Main layout with navigation
    │   │   ├── dashboard/page.tsx    # Health dashboard
    │   │   ├── profile/page.tsx      # User profile
    │   │   ├── onboarding/page.tsx   # User onboarding quiz
    │   │   ├── admin/page.tsx        # Admin panel
    │   │   ├── seed/page.tsx         # Database seeding
    │   │   ├── stores/page.tsx       # Store locator
    │   │   ├── tracker/
    │   │   │   ├── page.tsx          # Health tracker overview
    │   │   │   └── [type]/page.tsx   # Specific tracker types
    │   │   ├── chat/
    │   │   │   ├── page.tsx          # Chat overview
    │   │   │   ├── ai/page.tsx       # AI chat
    │   │   │   └── nutritionist/page.tsx # Nutritionist chat
    │   │   └── wellness/
    │   │       ├── page.tsx                    # Wellness home
    │   │       ├── content/[id]/page.tsx       # Individual content
    │   │       ├── categories/
    │   │       │   ├── nutrition/page.tsx
    │   │       │   ├── workouts/page.tsx
    │   │       │   ├── beauty/page.tsx
    │   │       │   ├── mind/page.tsx
    │   │       │   └── [category]/[subcategory]/page.tsx
    │   │       └── [category]/[subcategory]/page.tsx
    │   ├── actions/          # Server actions
    │   │   ├── add-meal.ts
    │   │   ├── analyze-meal.tsx
    │   │   ├── auth.ts
    │   │   ├── health-actions.ts
    │   │   ├── nutritionist-actions.ts
    │   │   ├── referral-actions.ts
    │   │   └── seed.ts
    │   └── api/              # API routes
    │       ├── auth/[...all]/route.ts    # Better Auth
    │       ├── analyze-meal/route.ts     # AI meal analysis
    │       └── chat/route.ts             # AI chat endpoint
    ├── components/           # React components
    │   ├── ui/               # shadcn/ui components
    │   │   ├── alert.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dual-wheel-picker.tsx
    │   │   ├── file-input.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   └── wheel-picker.tsx
    │   ├── health-tracker/   # Health tracking components
    │   │   ├── dashboard-client.tsx
    │   │   ├── date-picker.tsx
    │   │   ├── health-score-card.tsx
    │   │   ├── meal-tracker-extended.tsx
    │   │   ├── meals-tracker-client.tsx
    │   │   ├── mindfulness-tracker-client.tsx
    │   │   ├── referral-section.tsx
    │   │   ├── sleep-tracker-client.tsx
    │   │   ├── standalone-referral.tsx
    │   │   ├── steps-tracker-client.tsx
    │   │   ├── tracker-client.tsx
    │   │   ├── user-profile.tsx
    │   │   ├── water-tracker-client.tsx
    │   │   └── weekly-trends.tsx
    │   ├── meal-tracker/     # Meal tracking components
    │   │   ├── image-scanner.tsx
    │   │   ├── manual-entry-form.tsx
    │   │   └── meal-log.tsx
    │   ├── nutritionist/     # Nutritionist chat components
    │   │   ├── chat-input.tsx
    │   │   ├── chat-message.tsx
    │   │   ├── nutritionist-admin.tsx
    │   │   └── nutritionist-chat.tsx
    │   ├── wellness/         # Wellness content components
    │   │   ├── category-selector.tsx
    │   │   ├── content-card.tsx
    │   │   ├── content-grid.tsx
    │   │   ├── daily-content.tsx
    │   │   ├── premium-subscription-drawer.tsx
    │   │   └── subcategory-detail.tsx
    │   ├── quiz/             # Onboarding quiz components
    │   │   ├── quiz-complete.tsx
    │   │   ├── quiz-progress.tsx
    │   │   ├── quiz-question.tsx
    │   │   └── quiz-start.tsx
    │   ├── shapes/           # Custom SVG shape components
    │   │   ├── body-figure.tsx
    │   │   ├── dumbbell.tsx
    │   │   ├── scale.tsx
    │   │   └── star.tsx
    │   ├── about-us/         # About/store components
    │   │   ├── about-us.tsx
    │   │   └── store-finder.tsx
    │   ├── navigation/       # Navigation components
    │   │   └── mobile-navigation.tsx
    │   ├── profile/          # Profile components
    │   │   └── profile-client.tsx
    │   ├── ai/               # AI chat components
    │   │   └── ai-chat.tsx
    │   ├── external-site/    # External site wrapper
    │   │   └── external-site-wrapper.tsx
    │   ├── landing-page.tsx  # Landing page component
    │   ├── landing-page-old.tsx
    │   └── onboarding-quiz.tsx
    ├── db/                   # Database configuration
    │   ├── index.ts          # Database connection
    │   └── schema.ts         # Drizzle schema definitions
    ├── lib/                  # Utility functions
    │   ├── action-helpers.tsx
    │   ├── auth-client.ts    # Client-side auth utilities
    │   ├── auth.ts           # Server-side auth configuration
    │   ├── date-utils.ts     # Date manipulation utilities
    │   ├── fonts.ts          # Font configurations
    │   ├── referral-service.ts
    │   ├── referral-utils.ts
    │   └── utils.ts          # General utilities (cn, etc.)
    ├── types/                # TypeScript type definitions
    │   ├── auth.ts           # Authentication types
    │   ├── health-metrics.ts # Health tracking types
    │   └── nutritionist.ts   # Chat/nutritionist types
    ├── data/                 # Static data and configurations
    │   ├── landing-page.ts   # Landing page content
    │   ├── meals-tracker.ts  # Meal tracker configuration
    │   ├── mindfulness-tracker.ts
    │   ├── navigation.tsx    # Navigation configuration
    │   ├── quiz-questions.ts # Onboarding quiz questions
    │   ├── sleep-tracker.ts
    │   ├── steps-tracker.ts
    │   ├── store-locations.ts
    │   ├── water-tracker.ts
    │   ├── wellness-articles.ts
    │   ├── wellness-content.ts
    │   ├── wellness-programs.ts
    │   └── wellness-tips.ts
    └── middleware.ts         # Next.js middleware (auth protection)
```

## Key Features Detail

### Authentication & User Management

- OAuth integration with multiple providers
- Session-based authentication with Better Auth
- User profiles with health data and referral tracking
- Personalized onboarding quiz

### Health Tracking

- Daily health score aggregation
- Meal tracking with AI-powered image analysis
- Water intake, step counting, sleep, and mindfulness logging
- Progress visualization with interactive charts

### Nutritionist Platform

- Real-time chat sessions between users and nutritionists
- Session management (pending, active, ended states)
- Notification system for messages and session updates
- Nutritionist profiles with specialties and availability

### AI Integration

- Google AI SDK for meal image analysis
- Automatic macronutrient and calorie calculation
- AI-powered nutritionist chat assistance

## Database Schema

The application uses PostgreSQL with Drizzle ORM, featuring tables for:

- User authentication and sessions
- Health metrics and meal tracking
- Nutritionist profiles and chat sessions
- Wellness content and user preferences

## Deployment

This application is configured for deployment on Vercel with:

- Automatic deployments from main branch
- Environment variable management
- PostgreSQL database integration
- Static asset optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.

Something on readme