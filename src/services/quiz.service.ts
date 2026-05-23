import { APP_CONFIG } from "@/constants/config";
import { mockQuizzes, mockLeaderboard, mockDailyChallenge, mockQuizQuestions } from "@/data/quizzes";
import { delay } from "@/lib/utils";
import type { Quiz, QuizQuestion, LeaderboardEntry, DailyChallenge } from "@/types/quiz";

const USE_MOCK = APP_CONFIG.useMockData;

export const quizService = {
  getAll: async (): Promise<Quiz[]> => {
    if (USE_MOCK) { await delay(500); return mockQuizzes; }
    return [];
  },
  getById: async (id: string): Promise<Quiz | undefined> => {
    if (USE_MOCK) { await delay(300); return mockQuizzes.find((q) => q.id === id); }
    return undefined;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getQuestions: async (_quizId: string): Promise<QuizQuestion[]> => {
    if (USE_MOCK) { await delay(400); return mockQuizQuestions; }
    return [];
  },
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    if (USE_MOCK) { await delay(400); return mockLeaderboard; }
    return [];
  },
  getDailyChallenge: async (): Promise<DailyChallenge> => {
    if (USE_MOCK) { await delay(300); return mockDailyChallenge; }
    return mockDailyChallenge;
  },
};
