/** User-related types */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "student" | "instructor" | "admin";
  xp: number;
  level: number;
  streak: number;
  joinedAt: string;
  bio?: string;
  skills: string[];
  achievements: Achievement[];
  certificates: Certificate[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Certificate {
  id: string;
  title: string;
  courseId: string;
  issuedAt: string;
  credentialUrl: string;
}

export interface UserStats {
  totalXp: number;
  currentLevel: number;
  coursesCompleted: number;
  quizzesTaken: number;
  totalStudyHours: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  accuracy: number;
}
