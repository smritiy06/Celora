import { APP_CONFIG } from "@/constants/config";
import { mockLearningPaths } from "@/data/learningPaths";
import { delay } from "@/lib/utils";
import type { LearningPath, PathFilters } from "@/types/learningPath";

/** Learning paths service — swap mock data for real API by changing USE_MOCK */
const USE_MOCK = APP_CONFIG.useMockData;

export const learningPathsService = {
  getAll: async (filters?: Partial<PathFilters>): Promise<LearningPath[]> => {
    if (USE_MOCK) {
      await delay(500);
      let paths = [...mockLearningPaths];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        paths = paths.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (filters?.category && filters.category !== "all") {
        paths = paths.filter((p) => p.category === filters.category);
      }
      if (filters?.difficulty && filters.difficulty !== "all") {
        paths = paths.filter((p) => p.difficulty === filters.difficulty);
      }
      return paths;
    }
    // Real API call would go here
    return [];
  },

  getById: async (id: string): Promise<LearningPath | undefined> => {
    if (USE_MOCK) {
      await delay(300);
      return mockLearningPaths.find((p) => p.id === id);
    }
    return undefined;
  },

  getActive: async (): Promise<LearningPath[]> => {
    if (USE_MOCK) {
      await delay(400);
      return mockLearningPaths.filter((p) => p.progress > 0 && p.progress < 100);
    }
    return [];
  },
};
