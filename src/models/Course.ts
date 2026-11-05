/**
 * Courses — Firestore `courses` collection.
 *
 * Modules and lessons are embedded in the course document; schemas.ts keeps a
 * course under Firestore's 1 MiB document limit.
 */

import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { Course } from "@/types/domain";
import { fromDoc } from "./firestore";
import type { CourseCreateInput, CourseUpdateInput } from "./schemas";

export const coursesCollection = () => getDb().collection("courses");

const toCourse = (snap: FirebaseFirestore.DocumentSnapshot) =>
  fromDoc<Course>(snap, ["createdAt", "updatedAt"]);

// Sorted here rather than with orderBy so the queries need no composite index.
async function listWhere(field: string, value: unknown): Promise<Course[]> {
  const snap = await coursesCollection().where(field, "==", value).get();
  return snap.docs.map(toCourse).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export const listCoursesByTeacher = (teacherId: string) => listWhere("teacherId", teacherId);
export const listPublishedCourses = () => listWhere("isPublished", true);

export async function getCourse(id: string): Promise<Course | null> {
  const snap = await coursesCollection().doc(id).get();
  return snap.exists ? toCourse(snap) : null;
}

export async function getCoursesByIds(ids: string[]): Promise<Course[]> {
  if (ids.length === 0) return [];
  const snaps = await getDb().getAll(...ids.map((id) => coursesCollection().doc(id)));
  return snaps.filter((s) => s.exists).map(toCourse);
}

export async function createCourse(
  teacher: { id: string; name: string },
  input: CourseCreateInput
): Promise<Course> {
  const now = Timestamp.now();
  const ref = await coursesCollection().add({
    teacherId: teacher.id,
    teacherName: teacher.name,
    title: input.title,
    description: input.description ?? "",
    outcomes: input.outcomes ?? [],
    category: input.category ?? "web-dev",
    difficulty: input.difficulty ?? "beginner",
    thumbnail: input.thumbnail ?? "",
    isPublished: false,
    modules: input.modules ?? [],
    enrolledStudents: [],
    createdAt: now,
    updatedAt: now,
  });
  return toCourse(await ref.get());
}

export async function updateCourse(id: string, input: CourseUpdateInput): Promise<Course> {
  const ref = coursesCollection().doc(id);
  await ref.update({ ...input, updatedAt: Timestamp.now() });
  return toCourse(await ref.get());
}

export async function deleteCourse(id: string): Promise<void> {
  await coursesCollection().doc(id).delete();
}

export async function setCoursePublished(id: string, isPublished: boolean): Promise<Course> {
  const ref = coursesCollection().doc(id);
  await ref.update({ isPublished, updatedAt: Timestamp.now() });
  return toCourse(await ref.get());
}
