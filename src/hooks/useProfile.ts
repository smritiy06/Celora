"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (user) => {
      client.setQueryData(["me"], user);
      for (const key of ["dashboard", "progress", "leaderboard", "catalog"]) {
        client.invalidateQueries({ queryKey: [key] });
      }
    },
  });
}
