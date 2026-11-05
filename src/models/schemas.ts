/**
 * Request validation for the data API.
 *
 * Firestore enforces no schema, so these define what may be stored. Unknown
 * fields are stripped, so clients can't set owner or publish fields directly.
 */

import { z } from "zod";
import { CATEGORY_IDS, DIFFICULTIES } from "@/constants/catalog";

/** Firestore documents are limited to 1 MiB; leave room for the other fields. */
const MAX_COURSE_CONTENT = 900_000;

const httpsUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https$/, error: "Links must start with https://" }),
]);

const lessonCheckSchema = z.object({
  question: z.string().trim().min(1, "A knowledge check needs a question"),
  options: z.array(z.string().trim().min(1, "Fill in every answer option")).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().default(""),
});

const lessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Every lesson needs a title"),
  type: z.enum(["article", "video"]).default("article"),
  content: z.string().max(200_000).default(""),
  videoUrl: httpsUrl.default(""),
  duration: z.coerce.number().min(0).max(1000).default(0),
  resources: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Every resource needs a title"),
        url: z.url({ protocol: /^https$/, error: "Resource links must start with https://" }),
      })
    )
    .default([]),
  check: lessonCheckSchema
    .refine((c) => c.correctIndex < c.options.length, "Choose the correct answer")
    .nullable()
    .default(null),
});

const moduleSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Every module needs a title"),
  lessons: z.array(lessonSchema).default([]),
});

/** Every field is optional so a PUT only changes what it sends. */
export const courseUpdateSchema = z.object({
  title: z.string().trim().min(1, "Course title is required").max(150).optional(),
  description: z.string().max(2000).optional(),
  outcomes: z.array(z.string().trim().min(1)).max(10).optional(),
  category: z.enum(CATEGORY_IDS).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  thumbnail: httpsUrl.optional(),
  modules: z
    .array(moduleSchema)
    .refine(
      (modules) => JSON.stringify(modules).length < MAX_COURSE_CONTENT,
      "This course is too long to save. Split it into smaller courses."
    )
    .optional(),
});

export const courseCreateSchema = courseUpdateSchema.extend({
  title: z.string({ error: "Course title is required" }).trim().min(1, "Course title is required").max(150),
});

const quizQuestionSchema = z
  .object({
    id: z.string().min(1),
    prompt: z.string().trim().min(1, "Every question needs a prompt"),
    options: z.array(z.string().trim().min(1, "Fill in every answer option")).min(2).max(6),
    correctIndex: z.number().int().min(0),
    explanation: z.string().default(""),
    topic: z.string().trim().min(1, "Give every question a topic"),
  })
  .refine((q) => q.correctIndex < q.options.length, "Choose the correct answer");

export const quizUpdateSchema = z.object({
  title: z.string().trim().min(1, "Quiz title is required").max(150).optional(),
  description: z.string().max(1000).optional(),
  category: z.enum(CATEGORY_IDS).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  timeLimitMinutes: z.coerce.number().int().min(1).max(180).optional(),
  questions: z.array(quizQuestionSchema).max(100).optional(),
});

export const quizCreateSchema = quizUpdateSchema.extend({
  title: z.string({ error: "Quiz title is required" }).trim().min(1, "Quiz title is required").max(150),
});

export const attemptSchema = z.object({
  answers: z
    .array(z.object({ questionId: z.string(), selectedIndex: z.number().int().nullable() }))
    .max(200),
  durationSeconds: z.number().int().min(0).max(86_400),
});

export const goalSchema = z.object({
  title: z.string({ error: "Name your goal" }).trim().min(1, "Name your goal").max(150),
  category: z.enum(CATEGORY_IDS).nullish().transform((v) => v ?? null),
  targetDate: z.iso.date().nullish().transform((v) => v ?? null),
  milestones: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().trim().min(1, "Every step needs a name").max(150),
        done: z.boolean().default(false),
      })
    )
    .max(30)
    .default([]),
});

export const noteSchema = z.object({ content: z.string().max(50_000) });

export const onboardingSchema = z.object({
  role: z.enum(["student", "teacher"]),
  goal: z.string().nullish().transform((v) => v ?? null),
  level: z.enum(DIFFICULTIES).nullish().transform((v) => v ?? null),
  interests: z.array(z.string()).max(20).default([]),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(80).optional(),
  bio: z.string().max(500).optional(),
  showOnLeaderboard: z.boolean().optional(),
  preferences: z
    .object({
      goal: z.string().nullable(),
      level: z.enum(DIFFICULTIES).nullable(),
      interests: z.array(z.string()).max(20),
    })
    .optional(),
});

export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type QuizUpdateInput = z.infer<typeof quizUpdateSchema>;
export type QuizCreateInput = z.infer<typeof quizCreateSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
