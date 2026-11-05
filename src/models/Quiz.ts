/** Quizzes and attempts — Firestore `quizzes` and `attempts` collections. */

import { Timestamp } from "firebase-admin/firestore";
import { quizXpEarned } from "@/domain/gamification";
import { gradeQuiz } from "@/domain/grading";
import { getDb } from "@/lib/firebase-admin";
import type { AnswerInput, Quiz, QuizAttempt, QuizForAttempt, QuizSummary } from "@/types/domain";
import { fromDoc } from "./firestore";
import type { QuizCreateInput, QuizUpdateInput } from "./schemas";
import { readProgress, writeProgress } from "./User";

const quizzes = () => getDb().collection("quizzes");
const attempts = () => getDb().collection("attempts");

const toQuiz = (snap: FirebaseFirestore.DocumentSnapshot) =>
  fromDoc<Quiz>(snap, ["createdAt", "updatedAt"]);
const toAttempt = (snap: FirebaseFirestore.DocumentSnapshot) =>
  fromDoc<QuizAttempt>(snap, ["submittedAt"]);

export function toQuizSummary(quiz: Quiz, bestScore: number | null = null): QuizSummary {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    teacherName: quiz.teacherName,
    timeLimitMinutes: quiz.timeLimitMinutes,
    questionCount: quiz.questions.length,
    bestScore,
  };
}

/** Removes answers and explanations so they can't be read from the network response. */
export function toQuizForAttempt(quiz: Quiz, bestScore: number | null): QuizForAttempt {
  return {
    ...toQuizSummary(quiz, bestScore),
    questions: quiz.questions.map(({ id, prompt, options, topic }) => ({ id, prompt, options, topic })),
  };
}

async function listWhere(field: string, value: unknown): Promise<Quiz[]> {
  const snap = await quizzes().where(field, "==", value).get();
  return snap.docs.map(toQuiz).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export const listPublishedQuizzes = () => listWhere("isPublished", true);
export const listQuizzesByTeacher = (teacherId: string) => listWhere("teacherId", teacherId);

export async function getQuiz(id: string): Promise<Quiz | null> {
  const snap = await quizzes().doc(id).get();
  return snap.exists ? toQuiz(snap) : null;
}

export async function createQuiz(
  teacher: { id: string; name: string },
  input: QuizCreateInput
): Promise<Quiz> {
  const now = Timestamp.now();
  const ref = await quizzes().add({
    teacherId: teacher.id,
    teacherName: teacher.name,
    title: input.title,
    description: input.description ?? "",
    category: input.category ?? "web-dev",
    difficulty: input.difficulty ?? "beginner",
    timeLimitMinutes: input.timeLimitMinutes ?? 10,
    isPublished: false,
    questions: input.questions ?? [],
    createdAt: now,
    updatedAt: now,
  });
  return toQuiz(await ref.get());
}

export async function updateQuiz(id: string, input: QuizUpdateInput): Promise<Quiz> {
  const ref = quizzes().doc(id);
  await ref.update({ ...input, updatedAt: Timestamp.now() });
  return toQuiz(await ref.get());
}

export async function setQuizPublished(id: string, isPublished: boolean): Promise<Quiz> {
  const ref = quizzes().doc(id);
  await ref.update({ isPublished, updatedAt: Timestamp.now() });
  return toQuiz(await ref.get());
}

export async function deleteQuiz(id: string): Promise<void> {
  await quizzes().doc(id).delete();
}

export async function listAttempts(userId: string): Promise<QuizAttempt[]> {
  const snap = await attempts().where("userId", "==", userId).get();
  return snap.docs.map(toAttempt).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getAttempt(id: string): Promise<QuizAttempt | null> {
  const snap = await attempts().doc(id).get();
  return snap.exists ? toAttempt(snap) : null;
}

/** Best score per quiz, for showing on quiz cards. */
export function bestScores(list: QuizAttempt[]): Map<string, number> {
  const best = new Map<string, number>();
  for (const a of list) best.set(a.quizId, Math.max(best.get(a.quizId) ?? 0, a.scorePercent));
  return best;
}

/** Grades on the server, saves the attempt, and records XP and streak together. */
export async function submitAttempt(
  userId: string,
  quiz: Quiz,
  input: { answers: AnswerInput[]; durationSeconds: number },
  today: string
): Promise<QuizAttempt> {
  const grade = gradeQuiz(quiz.questions, input.answers);
  const previous = (await listAttempts(userId)).filter((a) => a.quizId === quiz.id);
  const bestCorrect = Math.max(0, ...previous.map((a) => a.correct));
  const xpEarned = quizXpEarned(grade.correct, bestCorrect);
  const ref = attempts().doc();

  await getDb().runTransaction(async (tx) => {
    const progress = await readProgress(tx, userId, today);
    tx.set(ref, {
      ...grade,
      userId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      category: quiz.category,
      durationSeconds: input.durationSeconds,
      xpEarned,
      submittedAt: Timestamp.now(),
    });
    writeProgress(tx, progress, {
      xp: xpEarned,
      quizzes: 1,
      minutes: Math.round(input.durationSeconds / 60),
    });
  });

  return toAttempt(await ref.get());
}
