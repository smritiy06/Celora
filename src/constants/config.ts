/** App-wide configuration constants */
export const APP_CONFIG = {
  name: "Celora",
  tagline: "Learn Smarter with AI",
  description: "AI-powered learning platform with personalized courses, smart quizzes, and an intelligent tutor.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
} as const;

/** XP level thresholds */
export const XP_LEVELS = [
  { level: 1, xpRequired: 0, title: "Novice" },
  { level: 2, xpRequired: 100, title: "Learner" },
  { level: 3, xpRequired: 300, title: "Explorer" },
  { level: 4, xpRequired: 600, title: "Achiever" },
  { level: 5, xpRequired: 1000, title: "Scholar" },
  { level: 6, xpRequired: 1500, title: "Expert" },
  { level: 7, xpRequired: 2200, title: "Master" },
  { level: 8, xpRequired: 3000, title: "Grandmaster" },
  { level: 9, xpRequired: 4000, title: "Legend" },
  { level: 10, xpRequired: 5500, title: "Visionary" },
] as const;

/** Animation duration constants */
export const ANIMATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  springBouncy: { type: "spring" as const, stiffness: 400, damping: 25 },
  easeOut: { type: "tween" as const, ease: "easeOut" as const, duration: 0.3 },
} as const;

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
