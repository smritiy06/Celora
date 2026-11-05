/**
 * Enrollments and lesson progress — Firestore `enrollments` collection, one
 * document per learner per course.
 */

import { Timestamp } from "firebase-admin/firestore";
import { XP_COURSE_BONUS, XP_PER_LESSON } from "@/constants/catalog";
import { lessonIds } from "@/domain/courses";
import { getDb } from "@/lib/firebase-admin";
import type { Course, Enrollment } from "@/types/domain";
import { coursesCollection } from "./Course";
import { fromDoc } from "./firestore";
import { readProgress, writeProgress } from "./User";

const enrollments = () => getDb().collection("enrollments");
const enrollmentId = (userId: string, courseId: string) => `${userId}_${courseId}`;

const toEnrollment = (snap: FirebaseFirestore.DocumentSnapshot) =>
  fromDoc<Enrollment>(snap, ["enrolledAt", "lastActivityAt", "completedAt"]);

export async function getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
  const snap = await enrollments().doc(enrollmentId(userId, courseId)).get();
  return snap.exists ? toEnrollment(snap) : null;
}

export async function listEnrollments(userId: string): Promise<Enrollment[]> {
  const snap = await enrollments().where("userId", "==", userId).get();
  return snap.docs
    .map(toEnrollment)
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}

export async function listCourseEnrollments(courseId: string): Promise<Enrollment[]> {
  const snap = await enrollments().where("courseId", "==", courseId).get();
  return snap.docs.map(toEnrollment);
}

/** Enrolling twice is harmless. Returns null if the course isn't open to enrollment. */
export async function enroll(userId: string, courseId: string): Promise<Enrollment | null> {
  const ref = enrollments().doc(enrollmentId(userId, courseId));
  const courseRef = coursesCollection().doc(courseId);

  const enrolled = await getDb().runTransaction(async (tx) => {
    const [courseSnap, snap] = [await tx.get(courseRef), await tx.get(ref)];
    if (snap.exists) return true;
    if (!courseSnap.exists || !courseSnap.get("isPublished")) return false;

    const now = Timestamp.now();
    tx.set(ref, {
      userId,
      courseId,
      completedLessonIds: [],
      lastLessonId: null,
      enrolledAt: now,
      lastActivityAt: now,
      completedAt: null,
    });
    const learners: string[] = courseSnap.get("enrolledStudents") ?? [];
    tx.update(courseRef, { enrolledStudents: [...new Set([...learners, userId])] });
    return true;
  });

  return enrolled ? toEnrollment(await ref.get()) : null;
}

export async function recordLessonVisit(userId: string, courseId: string, lessonId: string) {
  await enrollments()
    .doc(enrollmentId(userId, courseId))
    .update({ lastLessonId: lessonId, lastActivityAt: Timestamp.now() });
}

export interface LessonCompletion {
  enrollment: Enrollment;
  xpEarned: number;
  courseCompleted: boolean;
}

/**
 * Marks a lesson complete and awards XP, once per lesson. Returns null if the
 * learner isn't enrolled or the lesson doesn't exist.
 */
export async function completeLesson(
  userId: string,
  courseId: string,
  lessonId: string,
  today: string
): Promise<LessonCompletion | null> {
  const ref = enrollments().doc(enrollmentId(userId, courseId));
  const courseRef = coursesCollection().doc(courseId);

  const outcome = await getDb().runTransaction(async (tx) => {
    const courseSnap = await tx.get(courseRef);
    const snap = await tx.get(ref);
    const progress = await readProgress(tx, userId, today);
    if (!snap.exists || !courseSnap.exists) return null;

    const course = courseSnap.data() as Course;
    const lesson = course.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
    if (!lesson) return null;

    const now = Timestamp.now();
    const completed: string[] = snap.get("completedLessonIds") ?? [];
    if (completed.includes(lessonId)) {
      tx.update(ref, { lastLessonId: lessonId, lastActivityAt: now });
      return { xpEarned: 0, courseCompleted: false };
    }

    const nowCompleted = [...completed, lessonId];
    const allDone = lessonIds(course).every((id) => nowCompleted.includes(id));
    const courseCompleted = allDone && !snap.get("completedAt");
    const xpEarned = XP_PER_LESSON + (courseCompleted ? XP_COURSE_BONUS : 0);

    tx.update(ref, {
      completedLessonIds: nowCompleted,
      lastLessonId: lessonId,
      lastActivityAt: now,
      ...(courseCompleted && { completedAt: now }),
    });
    writeProgress(tx, progress, { xp: xpEarned, lessons: 1, minutes: lesson.duration });
    return { xpEarned, courseCompleted };
  });

  return outcome && { ...outcome, enrollment: toEnrollment(await ref.get()) };
}
