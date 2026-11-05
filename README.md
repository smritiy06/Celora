# Celora

A learning platform that pairs structured courses with quizzes that explain every answer, so learners can see what they've understood and what to go back to.

Everything on screen comes from the database. There is no sample data: pages show a helpful empty state until teachers publish real courses and quizzes.

## What it does

**For learners**
- Browse and filter a public course catalog, with filters kept in the URL
- Follow lessons in a focused player with text, video, resources and a knowledge check
- Keep notes that save automatically beside each lesson, and search them all in one place
- Take timed quizzes that are graded on the server, with per-question explanations and scores by topic
- Track streaks, XP, levels, activity, weak topics and a leaderboard they can opt out of
- Set personal goals and break them into steps

**For teachers**
- Write courses in Markdown or link videos, with modules, lessons, resources and knowledge checks
- Build quizzes tagged by topic
- Publish only when a course is complete, with a checklist of what's missing
- See each learner's progress and which lesson learners stop at

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, Zod, Firebase Cloud Firestore (Admin SDK), Clerk (authentication), Vitest.

## Design

Warm cream and deep navy themes with a terracotta accent, soft shadows, and a still dot-grid background. Dark, light and system themes are supported, and motion follows the device's reduced-motion setting.

## How the code is organised

```text
src/
  app/          Routes, layouts, and API route handlers
  components/   UI primitives, app layout, shared learning components
  features/     Larger feature pieces, such as the course and quiz editors
  hooks/        TanStack Query hooks that components use for data
  services/     The typed API client, the only place the browser calls the backend
  domain/       Pure rules: grading, XP, streaks, progress, recommendations
  models/       Firestore data access and request validation (server only)
  types/        Domain types shared by server and client
  tests/        Unit tests, using an in-memory Firestore stand-in
```

The browser never talks to Firestore directly. All access goes through the API routes, which check who is asking and what they're allowed to see. Quiz answers aren't sent to the browser until an attempt is submitted, and lesson content is only sent to enrolled learners and the course's teacher.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill it in.
   - **Clerk:** use the keys from your Clerk dashboard.
   - **Firebase:** create a Firestore database in the Firebase console in production mode, so browsers have no direct access. Then generate a key under Project settings → Service accounts and copy the values from the downloaded JSON file.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000), sign up, and choose "To teach" to create your first course.

## Checks

```bash
npm test
```

```bash
npm run lint
```

```bash
npm run build
```

## Not built yet

The AI Tutor is shown in the app as not available yet, because it needs an AI provider connected on the server. Course reviews and discussions, Community, flashcards, bookmarks and notifications aren't built yet.
