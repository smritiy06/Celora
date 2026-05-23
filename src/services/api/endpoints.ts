/** Centralized API endpoint constants for easy backend integration */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  COURSES: {
    LIST: "/courses",
    DETAIL: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    PROGRESS: (id: string) => `/courses/${id}/progress`,
  },
  QUIZ: {
    LIST: "/quizzes",
    DETAIL: (id: string) => `/quizzes/${id}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
    LEADERBOARD: "/quizzes/leaderboard",
    DAILY: "/quizzes/daily",
  },
  AI_TUTOR: {
    CHAT: "/ai/chat",
    SESSIONS: "/ai/sessions",
    SESSION: (id: string) => `/ai/sessions/${id}`,
  },
  ROADMAPS: {
    LIST: "/roadmaps",
    DETAIL: (id: string) => `/roadmaps/${id}`,
  },
  NOTES: {
    LIST: "/notes",
    DETAIL: (id: string) => `/notes/${id}`,
  },
  COMMUNITY: {
    POSTS: "/community/posts",
    CHALLENGES: "/community/challenges",
    PROJECTS: "/community/projects",
    GROUPS: "/community/groups",
  },
  PROFILE: {
    ME: "/profile",
    STATS: "/profile/stats",
    ACHIEVEMENTS: "/profile/achievements",
  },
  ANALYTICS: {
    OVERVIEW: "/analytics/overview",
    STUDY_TIME: "/analytics/study-time",
    QUIZ: "/analytics/quiz",
    HEATMAP: "/analytics/heatmap",
  },
} as const;
