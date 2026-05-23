/** Analytics types */
export interface AnalyticsOverview {
  totalStudyTime: number; // minutes
  coursesInProgress: number;
  coursesCompleted: number;
  averageQuizScore: number;
  currentStreak: number;
  weeklyGoalProgress: number;
}

export interface StudyTimeData {
  date: string;
  minutes: number;
}

export interface ProgressData {
  week: string;
  coursesCompleted: number;
  quizzesTaken: number;
  xpEarned: number;
}

export interface HeatmapData {
  date: string;
  count: number; // study sessions
  minutes: number;
}

export interface TopicMastery {
  topic: string;
  mastery: number; // 0-100
  questionsAttempted: number;
  accuracy: number;
}

export interface QuizAnalyticsData {
  month: string;
  averageScore: number;
  quizzesTaken: number;
  accuracy: number;
}

export interface AiRecommendation {
  id: string;
  type: "course" | "quiz" | "topic" | "practice";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  resourceId?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed?: string;
  nextReview?: string;
  mastery: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  type: "course" | "article" | "video" | "resource";
  category: string;
  createdAt: string;
}
