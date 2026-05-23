/**
 * Custom hook for authentication state.
 * Wraps the auth service for use in React components.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

/** Fetch current authenticated user */
export function useAuth() {
  return useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

/** Login mutation */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

/** Logout mutation */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
