"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/hooks/useAccount";
import type { DiscussionPostInput, ReviewInput } from "@/models/schemas";
import { api } from "@/services/api";

export const useReviews = (courseId: string) =>
  useQuery({ queryKey: ["reviews", courseId], queryFn: () => api.reviews(courseId) });

export function useSaveReview(courseId: string) {
  const client = useQueryClient();
  const refresh = () => {
    client.invalidateQueries({ queryKey: ["reviews", courseId] });
    client.invalidateQueries({ queryKey: ["catalog"] });
    client.invalidateQueries({ queryKey: ["course", courseId] });
  };
  return {
    save: useMutation({ mutationFn: (input: ReviewInput) => api.saveReview(courseId, input), onSuccess: refresh }),
    remove: useMutation({ mutationFn: () => api.deleteReview(courseId), onSuccess: refresh }),
  };
}

export const useDiscussion = (courseId: string, lessonId: string) =>
  useQuery({ queryKey: ["discussion", courseId, lessonId], queryFn: () => api.discussion(courseId, lessonId) });

export function useDiscussionActions(courseId: string, lessonId: string) {
  const client = useQueryClient();
  const onSuccess = () => client.invalidateQueries({ queryKey: ["discussion", courseId, lessonId] });
  return {
    post: useMutation({ mutationFn: (input: DiscussionPostInput) => api.createPost(courseId, lessonId, input), onSuccess }),
    remove: useMutation({ mutationFn: api.deletePost, onSuccess }),
    report: useMutation({ mutationFn: api.reportPost, onSuccess }),
  };
}

/** Checked every minute while the tab is open, and whenever it regains focus. */
export function useNotifications() {
  const { isSignedIn } = useSession();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: api.notifications,
    enabled: isSignedIn,
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationsRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (ids?: string[]) => api.markNotificationsRead(ids),
    onSuccess: () => client.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
