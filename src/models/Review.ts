/**
 * Course reviews — Firestore `reviews` collection, one per learner per course.
 * The course document keeps a running rating total so the catalog can sort by it.
 */

import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { CourseReview, CourseReviews } from "@/types/domain";
import { coursesCollection } from "./Course";
import { fromDoc } from "./firestore";
import type { ReviewInput } from "./schemas";

const reviews = () => getDb().collection("reviews");
const reviewId = (userId: string, courseId: string) => `${userId}_${courseId}`;

type StoredReview = Omit<CourseReview, "isYou"> & { userId: string };

function toReview(snap: FirebaseFirestore.DocumentSnapshot, viewerId: string | null): CourseReview {
  const { userId, ...review } = fromDoc<StoredReview>(snap, ["createdAt", "updatedAt"]);
  return { ...review, isYou: userId === viewerId };
}

export async function listReviews(courseId: string, viewerId: string | null, canReview: boolean): Promise<CourseReviews> {
  const snap = await reviews().where("courseId", "==", courseId).get();
  const all = snap.docs
    .map((d) => toReview(d, viewerId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const distribution = [0, 0, 0, 0, 0];
  for (const r of all) distribution[r.rating - 1] += 1;
  const total = all.reduce((sum, r) => sum + r.rating, 0);
  return {
    summary: { average: all.length ? Math.round((total / all.length) * 10) / 10 : 0, count: all.length },
    distribution,
    reviews: all,
    mine: all.find((r) => r.isYou) ?? null,
    canReview,
  };
}

/** Creates or replaces the learner's review and keeps the course totals in step. */
export async function saveReview(
  user: { id: string; publicName: string },
  courseId: string,
  input: ReviewInput
): Promise<{ review: CourseReview; isNew: boolean }> {
  const ref = reviews().doc(reviewId(user.id, courseId));
  const courseRef = coursesCollection().doc(courseId);

  const isNew = await getDb().runTransaction(async (tx) => {
    const [snap, courseSnap] = [await tx.get(ref), await tx.get(courseRef)];
    const previous: number = snap.exists ? snap.get("rating") : 0;
    const now = Timestamp.now();
    tx.set(ref, {
      userId: user.id,
      courseId,
      authorName: user.publicName,
      rating: input.rating,
      text: input.text,
      createdAt: snap.exists ? snap.get("createdAt") : now,
      updatedAt: now,
    });
    tx.update(courseRef, {
      ratingSum: (courseSnap.get("ratingSum") ?? 0) - previous + input.rating,
      ratingCount: (courseSnap.get("ratingCount") ?? 0) + (snap.exists ? 0 : 1),
    });
    return !snap.exists;
  });

  return { review: toReview(await ref.get(), user.id), isNew };
}

export async function deleteReview(userId: string, courseId: string): Promise<void> {
  const ref = reviews().doc(reviewId(userId, courseId));
  const courseRef = coursesCollection().doc(courseId);
  await getDb().runTransaction(async (tx) => {
    const [snap, courseSnap] = [await tx.get(ref), await tx.get(courseRef)];
    if (!snap.exists) return;
    tx.delete(ref);
    if (courseSnap.exists) {
      tx.update(courseRef, {
        ratingSum: Math.max(0, (courseSnap.get("ratingSum") ?? 0) - snap.get("rating")),
        ratingCount: Math.max(0, (courseSnap.get("ratingCount") ?? 0) - 1),
      });
    }
  });
}
