/**
 * User Profile Store — Zustand
 *
 * Client-side cache for the MongoDB user profile.
 * Fetches from /api/users on init, exposes update actions.
 */

import { create } from "zustand";

export interface UserPreferences {
  goal: string | null;
  level: string | null;
  style: string | null;
  interests: string[];
}

export interface UserProfile {
  clerkId: string;
  email: string;
  name: string;
  role: "student" | "teacher";
  onboardingCompleted: boolean;
  preferences: UserPreferences;
}

interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  /** Fetch profile from MongoDB via API */
  fetchProfile: () => Promise<UserProfile | null>;

  /** Create or sync profile in MongoDB after Clerk auth */
  syncProfile: (data?: { role?: string; name?: string }) => Promise<UserProfile | null>;

  /** Update preferences via API */
  updatePreferences: (prefs: UserPreferences) => Promise<void>;

  /** Update role via API */
  updateRole: (role: "student" | "teacher") => Promise<void>;

  /** Clear local state (on logout) */
  clearProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/users");
      if (res.status === 404) {
        // User hasn't been created yet — not an error
        set({ profile: null, isLoading: false });
        return null;
      }
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      set({ profile: data, isLoading: false });
      return data;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },

  syncProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data || {}),
      });
      if (!res.ok) throw new Error("Failed to sync profile");
      const profile = await res.json();
      set({ profile, isLoading: false });
      return profile;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },

  updatePreferences: async (prefs) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/users/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      const profile = await res.json();
      set({ profile, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  updateRole: async (role) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/users/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      const profile = await res.json();
      set({ profile, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  clearProfile: () => {
    set({ profile: null, isLoading: false, error: null });
  },
}));
