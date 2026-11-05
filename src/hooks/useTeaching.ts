"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CourseUpdateInput, QuizUpdateInput } from "@/models/schemas";
import { api } from "@/services/api";

const t = api.teaching;

export const useTeacherCourses = () => useQuery({ queryKey: ["teaching", "courses"], queryFn: t.courses });
export const useTeacherCourse = (id: string) => useQuery({ queryKey: ["teaching", "course", id], queryFn: () => t.course(id) });
export const useTeacherQuizzes = () => useQuery({ queryKey: ["teaching", "quizzes"], queryFn: t.quizzes });
export const useTeacherQuiz = (id: string) => useQuery({ queryKey: ["teaching", "quiz", id], queryFn: () => t.quiz(id) });
export const useCourseInsights = (id: string) => useQuery({ queryKey: ["teaching", "insights", id], queryFn: () => t.insights(id) });

/** Saving or publishing can change what learners see, so public lists refresh too. */
function useTeachingMutation<I, O>(mutationFn: (input: I) => Promise<O>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      for (const key of ["teaching", "catalog", "course", "quizzes", "quiz"]) {
        client.invalidateQueries({ queryKey: [key] });
      }
    },
  });
}

export const useCreateCourse = () => useTeachingMutation(t.createCourse);
export const useUpdateCourse = (id: string) => useTeachingMutation((input: CourseUpdateInput) => t.updateCourse(id, input));
export const useToggleCourse = () => useTeachingMutation(t.togglePublishCourse);
export const useDeleteCourse = () => useTeachingMutation(t.deleteCourse);
export const useCreateQuiz = () => useTeachingMutation(t.createQuiz);
export const useUpdateQuiz = (id: string) => useTeachingMutation((input: QuizUpdateInput) => t.updateQuiz(id, input));
export const useToggleQuiz = () => useTeachingMutation(t.togglePublishQuiz);
export const useDeleteQuiz = () => useTeachingMutation(t.deleteQuiz);
