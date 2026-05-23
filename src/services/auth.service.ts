import { APP_CONFIG } from "@/constants/config";
import { mockCurrentUser, mockUserStats } from "@/data/users";
import { delay } from "@/lib/utils";
import type { User, UserStats } from "@/types/user";

const USE_MOCK = APP_CONFIG.useMockData;

export const authService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (_email: string, _password: string): Promise<{ user: User; token: string }> => {
    if (USE_MOCK) {
      await delay(800);
      return { user: mockCurrentUser, token: "mock-jwt-token-xyz" };
    }
    throw new Error("Not implemented");
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signup: async (_data: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> => {
    if (USE_MOCK) {
      await delay(800);
      return { user: mockCurrentUser, token: "mock-jwt-token-xyz" };
    }
    throw new Error("Not implemented");
  },
  getCurrentUser: async (): Promise<User> => {
    if (USE_MOCK) { await delay(300); return mockCurrentUser; }
    throw new Error("Not implemented");
  },
  getUserStats: async (): Promise<UserStats> => {
    if (USE_MOCK) { await delay(300); return mockUserStats; }
    throw new Error("Not implemented");
  },
  logout: async (): Promise<void> => {
    if (typeof window !== "undefined") localStorage.removeItem("auth_token");
  },
};
