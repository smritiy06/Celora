/**
 * The client's only route to the backend. Components use the hooks in
 * src/hooks, which call these typed functions, and never call fetch directly.
 */

import type {
  AnswerInput,
  Course,
  CourseInsights,
  CourseOutline,
  CourseSummary,
  DashboardData,
  Enrollment,
  LearningGoal,
  LeaderboardEntry,
  Lesson,
  LessonNote,
  ProgressData,
  Quiz,
  QuizAttempt,
  QuizForAttempt,
  QuizSummary,
  User,
} from "@/types/domain";
import type { CatalogQuery } from "@/domain/courses";
import type {
  CourseCreateInput,
  CourseUpdateInput,
  GoalInput,
  OnboardingInput,
  ProfileUpdateInput,
  QuizCreateInput,
  QuizUpdateInput,
} from "@/models/schemas";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function request<T>(path: string, method = "GET", body?: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      signal,
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        "x-time-zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiClientError(0, "Can't reach Celora. Check your connection and try again.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiClientError(response.status, data?.error ?? "Something went wrong. Please try again.");
  }
  return response.json();
}

function query(params: object): string {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v) as [string, string][]
  ).toString();
  return search ? `?${search}` : "";
}

export const api = {
  me: () => request<User>("/api/users"),
  updateProfile: (input: ProfileUpdateInput) => request<User>("/api/users", "PATCH", input),
  completeOnboarding: (input: OnboardingInput) => request<User>("/api/users/onboarding", "PUT", input),
  dashboard: () => request<DashboardData>("/api/me/dashboard"),
  progress: () => request<ProgressData>("/api/me/progress"),
  leaderboard: () => request<LeaderboardEntry[]>("/api/leaderboard"),

  catalog: (params: CatalogQuery, signal?: AbortSignal) =>
    request<CourseSummary[]>(`/api/courses${query(params)}`, "GET", undefined, signal),
  course: (id: string) => request<CourseOutline>(`/api/courses/${id}`),
  enroll: (id: string) => request<Enrollment>(`/api/courses/${id}/enroll`, "POST", {}),
  lesson: (courseId: string, lessonId: string) =>
    request<Lesson>(`/api/courses/${courseId}/lessons/${lessonId}`),
  completeLesson: (courseId: string, lessonId: string) =>
    request<{ enrollment: Enrollment; xpEarned: number; courseCompleted: boolean }>(
      `/api/courses/${courseId}/lessons/${lessonId}`,
      "POST",
      {}
    ),

  note: (courseId: string, lessonId: string) =>
    request<{ note: LessonNote | null }>(`/api/courses/${courseId}/lessons/${lessonId}/note`),
  saveNote: (courseId: string, lessonId: string, content: string) =>
    request<{ note: LessonNote | null }>(`/api/courses/${courseId}/lessons/${lessonId}/note`, "PUT", { content }),
  notes: () => request<LessonNote[]>("/api/notes"),
  deleteNote: (id: string) => request<unknown>(`/api/notes/${id}`, "DELETE"),

  goals: () => request<LearningGoal[]>("/api/goals"),
  createGoal: (input: GoalInput) => request<LearningGoal>("/api/goals", "POST", input),
  updateGoal: (id: string, input: GoalInput) => request<LearningGoal>(`/api/goals/${id}`, "PUT", input),
  deleteGoal: (id: string) => request<unknown>(`/api/goals/${id}`, "DELETE"),

  quizzes: () => request<QuizSummary[]>("/api/quizzes"),
  quiz: (id: string) => request<QuizForAttempt>(`/api/quizzes/${id}`),
  submitAttempt: (id: string, input: { answers: AnswerInput[]; durationSeconds: number }) =>
    request<QuizAttempt>(`/api/quizzes/${id}/attempts`, "POST", input),
  attempt: (id: string) => request<QuizAttempt>(`/api/attempts/${id}`),

  teaching: {
    courses: () => request<Course[]>("/api/courses?teacherOnly=true"),
    course: (id: string) => request<Course>(`/api/courses/${id}?edit=true`),
    createCourse: (input: CourseCreateInput) => request<Course>("/api/courses", "POST", input),
    updateCourse: (id: string, input: CourseUpdateInput) => request<Course>(`/api/courses/${id}`, "PUT", input),
    togglePublishCourse: (id: string) => request<Course>(`/api/courses/${id}/publish`, "PUT"),
    deleteCourse: (id: string) => request<unknown>(`/api/courses/${id}`, "DELETE"),
    insights: (id: string) => request<CourseInsights>(`/api/courses/${id}/insights`),
    quizzes: () => request<Quiz[]>("/api/quizzes?teacherOnly=true"),
    quiz: (id: string) => request<Quiz>(`/api/quizzes/${id}?edit=true`),
    createQuiz: (input: QuizCreateInput) => request<Quiz>("/api/quizzes", "POST", input),
    updateQuiz: (id: string, input: QuizUpdateInput) => request<Quiz>(`/api/quizzes/${id}`, "PUT", input),
    togglePublishQuiz: (id: string) => request<Quiz>(`/api/quizzes/${id}/publish`, "PUT"),
    deleteQuiz: (id: string) => request<unknown>(`/api/quizzes/${id}`, "DELETE"),
  },
};
