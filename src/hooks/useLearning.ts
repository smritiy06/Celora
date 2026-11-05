"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CatalogQuery } from "@/domain/courses";
import { api } from "@/services/api";
import type { GoalInput } from "@/models/schemas";
import type { AnswerInput } from "@/types/domain";

/** Everything that shows XP, streaks or course progress. */
function refreshProgress(client: QueryClient) {
  for (const key of ["me", "dashboard", "progress", "catalog", "course", "leaderboard"]) {
    client.invalidateQueries({ queryKey: [key] });
  }
}

export const useDashboard = () => useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
export const useProgress = () => useQuery({ queryKey: ["progress"], queryFn: api.progress });
export const useLeaderboard = (enabled: boolean) =>
  useQuery({ queryKey: ["leaderboard"], queryFn: api.leaderboard, enabled });

export const useCatalog = (params: CatalogQuery) =>
  useQuery({
    queryKey: ["catalog", params],
    // Passing the signal cancels the request when the search text changes.
    queryFn: ({ signal }) => api.catalog(params, signal),
    placeholderData: (previous) => previous,
  });

export const useCourse = (id: string) => useQuery({ queryKey: ["course", id], queryFn: () => api.course(id) });

export const useLesson = (courseId: string, lessonId: string) =>
  useQuery({ queryKey: ["lesson", courseId, lessonId], queryFn: () => api.lesson(courseId, lessonId) });

export function useEnroll(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => api.enroll(courseId),
    onSuccess: () => refreshProgress(client),
  });
}

export function useCompleteLesson(courseId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => api.completeLesson(courseId, lessonId),
    onSuccess: () => refreshProgress(client),
  });
}

export const useNote = (courseId: string, lessonId: string) =>
  useQuery({ queryKey: ["note", courseId, lessonId], queryFn: () => api.note(courseId, lessonId) });

export const useNotes = () => useQuery({ queryKey: ["notes"], queryFn: api.notes });

export function useDeleteNote() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.deleteNote,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["notes"] });
      client.invalidateQueries({ queryKey: ["note"] });
    },
  });
}

export const useGoals = () => useQuery({ queryKey: ["goals"], queryFn: api.goals });

function useGoalMutation<I, O>(mutationFn: (input: I) => Promise<O>) {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => client.invalidateQueries({ queryKey: ["goals"] }) });
}

export const useCreateGoal = () => useGoalMutation(api.createGoal);
export const useUpdateGoal = () =>
  useGoalMutation(({ id, input }: { id: string; input: GoalInput }) => api.updateGoal(id, input));
export const useDeleteGoal = () => useGoalMutation(api.deleteGoal);

export const useQuizzes = () => useQuery({ queryKey: ["quizzes"], queryFn: api.quizzes });
export const useQuiz = (id: string) => useQuery({ queryKey: ["quiz", id], queryFn: () => api.quiz(id) });
export const useAttempt = (id: string) => useQuery({ queryKey: ["attempt", id], queryFn: () => api.attempt(id) });

export function useSubmitAttempt(quizId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { answers: AnswerInput[]; durationSeconds: number }) => api.submitAttempt(quizId, input),
    onSuccess: () => {
      refreshProgress(client);
      client.invalidateQueries({ queryKey: ["quizzes"] });
      client.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
  });
}
