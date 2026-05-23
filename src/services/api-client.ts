/**
 * Celora API Client
 *
 * Centralized Axios instance with interceptors, error handling,
 * and automatic fallback to mock data when backend is unavailable.
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { APP_CONFIG } from "@/constants/config";

/** Create configured Axios instance */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: APP_CONFIG.apiUrl,
    timeout: 15_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  /** Request interceptor — attach auth token */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  /** Response interceptor — global error handling */
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Token expired — redirect to login
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }
            break;
          case 403:
            console.error("[API] Forbidden:", error.response.data);
            break;
          case 429:
            console.error("[API] Rate limited");
            break;
          case 500:
            console.error("[API] Server error:", error.response.data);
            break;
        }
      } else if (error.request) {
        console.error("[API] Network error — no response received");
      }
      return Promise.reject(error);
    }
  );

  return client;
}

/** Singleton API client */
export const apiClient = createApiClient();

/**
 * Helper to simulate network delay for mock data.
 * Used by service files when `APP_CONFIG.useMockData` is true.
 */
export async function simulateDelay(ms: number = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
