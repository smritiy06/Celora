import { APP_CONFIG } from "@/constants/config";
import { mockCourses } from "@/data/courses";
import { delay } from "@/lib/utils";
import type { Course, CourseFilters } from "@/types/course";

/** Courses service — swap mock data for real API by changing USE_MOCK */
const USE_MOCK = APP_CONFIG.useMockData;

export const coursesService = {
  getAll: async (filters?: Partial<CourseFilters>): Promise<Course[]> => {
    if (USE_MOCK) {
      await delay(500);
      let courses = [...mockCourses];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        courses = courses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
      }
      if (filters?.category && filters.category !== "all") {
        courses = courses.filter((c) => c.category === filters.category);
      }
      if (filters?.difficulty && filters.difficulty !== "all") {
        courses = courses.filter((c) => c.difficulty === filters.difficulty);
      }
      return courses;
    }
    // Real API call would go here
    return [];
  },

  getById: async (id: string): Promise<Course | undefined> => {
    if (USE_MOCK) {
      await delay(300);
      return mockCourses.find((c) => c.id === id);
    }
    return undefined;
  },

  getEnrolled: async (): Promise<Course[]> => {
    if (USE_MOCK) {
      await delay(400);
      return mockCourses.filter((c) => c.isEnrolled);
    }
    return [];
  },

  getRecommended: async (): Promise<Course[]> => {
    if (USE_MOCK) {
      await delay(400);
      return mockCourses.filter((c) => !c.isEnrolled).slice(0, 3);
    }
    return [];
  },
};
