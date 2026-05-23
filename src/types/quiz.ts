/** Quiz-related types */
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  duration: number; // in minutes
  xpReward: number;
  thumbnail: string;
  tags: string[];
  attempts: number;
  bestScore: number;
  isDaily: boolean;
  isCompleted: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // in seconds
  xpEarned: number;
  completedAt: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface QuizResult {
  attempt: QuizAttempt;
  accuracy: number;
  weakTopics: WeakTopic[];
  recommendations: string[];
  performanceByTopic: TopicPerformance[];
}

export interface WeakTopic {
  topic: string;
  accuracy: number;
  questionsAttempted: number;
  suggestedResources: string[];
}

export interface TopicPerformance {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string;
  xp: number;
  streak: number;
  quizzesCompleted: number;
  accuracy: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  isCompleted: boolean;
  expiresAt: string;
}
