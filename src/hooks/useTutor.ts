"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useTutorStatus = () => useQuery({ queryKey: ["tutor", "status"], queryFn: api.tutorStatus });
export const useTutorChats = () => useQuery({ queryKey: ["tutor", "chats"], queryFn: api.tutorChats });

export const useTutorChat = (id: string | null) =>
  useQuery({ queryKey: ["tutor", "chat", id], queryFn: () => api.tutorChat(id!), enabled: Boolean(id) });

export function useDeleteTutorChat() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTutorChat,
    onSuccess: () => client.invalidateQueries({ queryKey: ["tutor", "chats"] }),
  });
}
