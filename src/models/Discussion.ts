/**
 * Lesson discussions — Firestore `discussions` collection. Questions sit beside
 * a lesson, with one level of replies. Posts that several people report are
 * hidden until a teacher looks at them.
 */

import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { DiscussionPost } from "@/types/domain";
import { fromDoc } from "./firestore";

const discussions = () => getDb().collection("discussions");
export const HIDE_AFTER_REPORTS = 3;

interface StoredPost {
  id: string;
  courseId: string;
  lessonId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  isTeacher: boolean;
  body: string;
  reportedBy: string[];
  createdAt: string;
}

const toStored = (snap: FirebaseFirestore.DocumentSnapshot) => fromDoc<StoredPost>(snap, ["createdAt"]);

function present(post: StoredPost, viewerId: string, isCourseOwner: boolean): DiscussionPost {
  return {
    id: post.id,
    courseId: post.courseId,
    lessonId: post.lessonId,
    parentId: post.parentId,
    authorName: post.authorName,
    isTeacher: post.isTeacher,
    isYou: post.authorId === viewerId,
    canDelete: post.authorId === viewerId || isCourseOwner,
    reportedByYou: (post.reportedBy ?? []).includes(viewerId),
    body: post.body,
    createdAt: post.createdAt,
    replies: [],
  };
}

/** Questions newest first, each with its replies oldest first. */
export async function listLessonPosts(
  courseId: string,
  lessonId: string,
  viewerId: string,
  isCourseOwner: boolean
): Promise<DiscussionPost[]> {
  const snap = await discussions().where("courseId", "==", courseId).where("lessonId", "==", lessonId).get();
  const visible = snap.docs
    .map(toStored)
    // The course's teacher still sees reported posts so they can remove them.
    .filter((p) => isCourseOwner || (p.reportedBy ?? []).length < HIDE_AFTER_REPORTS);

  const threads = visible
    .filter((p) => !p.parentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((p) => present(p, viewerId, isCourseOwner));
  const byId = new Map(threads.map((t) => [t.id, t]));
  for (const reply of visible.filter((p) => p.parentId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    byId.get(reply.parentId!)?.replies.push(present(reply, viewerId, isCourseOwner));
  }
  return threads;
}

export async function getPost(id: string): Promise<StoredPost | null> {
  const snap = await discussions().doc(id).get();
  return snap.exists ? toStored(snap) : null;
}

export async function createPost(input: {
  courseId: string;
  lessonId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  isTeacher: boolean;
  body: string;
}): Promise<StoredPost> {
  const ref = await discussions().add({ ...input, reportedBy: [], createdAt: Timestamp.now() });
  return toStored(await ref.get());
}

/** Deleting a question removes its replies too. */
export async function deletePost(id: string): Promise<void> {
  const replies = await discussions().where("parentId", "==", id).get();
  const batch = getDb().batch();
  for (const doc of replies.docs) batch.delete(doc.ref);
  batch.delete(discussions().doc(id));
  await batch.commit();
}

export async function reportPost(id: string, userId: string): Promise<void> {
  const ref = discussions().doc(id);
  await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return;
    const reportedBy: string[] = snap.get("reportedBy") ?? [];
    if (!reportedBy.includes(userId)) tx.update(ref, { reportedBy: [...reportedBy, userId] });
  });
}
