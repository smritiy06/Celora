import type { User, UserStats } from "@/types/user";

export const mockCurrentUser: User = {
  id: "current",
  name: "Ansh Yadav", // fallback name
  email: "anshy9527@gmail.com", // fallback email
  avatar: "/images/avatars/default.jpg",
  role: "student",
  xp: 4200,
  level: 5,
  streak: 12,
  joinedAt: "2025-06-15",
  bio: "Passionate learner exploring AI, web development, and cybersecurity. Building the future one commit at a time.",
  skills: ["Python", "React", "Machine Learning", "TypeScript", "Next.js"],
  achievements: [
    { id: "ach-1", title: "First Steps", description: "Complete your first learning path", icon: "🎓", unlockedAt: "2025-07-01", rarity: "common" },
    { id: "ach-2", title: "Quiz Master", description: "Score 100% on any quiz", icon: "🏆", unlockedAt: "2025-08-15", rarity: "rare" },
    { id: "ach-3", title: "Streak Warrior", description: "Maintain a 10-day streak", icon: "🔥", unlockedAt: "2025-09-20", rarity: "rare" },
    { id: "ach-4", title: "Deep Diver", description: "Complete 50 modules", icon: "⭐", unlockedAt: "2025-10-05", rarity: "epic" },
    { id: "ach-5", title: "Code Ninja", description: "Complete 100 coding challenges", icon: "🥷", unlockedAt: "2025-11-12", rarity: "epic" },
    { id: "ach-6", title: "AI Explorer", description: "Complete the AI/ML pathway", icon: "🤖", unlockedAt: "2025-12-01", rarity: "legendary" },
  ],
  certificates: [
    { id: "cert-1", title: "Machine Learning Foundations", pathId: "path-1", issuedAt: "2025-10-15", credentialUrl: "#" },
    { id: "cert-2", title: "Cybersecurity Essentials", pathId: "path-3", issuedAt: "2025-11-20", credentialUrl: "#" },
  ],
  learningGoals: ["AI/ML Engineer", "Full Stack Web Developer"],
  interests: ["Python", "Machine Learning", "React", "Next.js", "TensorFlow"],
  skillLevel: "intermediate",
  preferredStyle: "hands-on",
  onboardingCompleted: true,
};

export const mockUserStats: UserStats = {
  totalXp: 4200,
  currentLevel: 5,
  pathsCompleted: 3,
  quizzesTaken: 45,
  totalStudyHours: 128,
  currentStreak: 12,
  longestStreak: 24,
  rank: 8,
  accuracy: 82,
};
