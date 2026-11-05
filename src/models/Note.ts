/** Learner notes — Firestore `notes` collection, one note per learner per lesson. */

import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { LessonNote } from "@/types/domain";
import { fromDoc } from "./firestore";

const notes = () => getDb().collection("notes");
const noteId = (userId: string, courseId: string, lessonId: string) =>
  `${userId}_${courseId}_${lessonId}`;

const toNote = (snap: FirebaseFirestore.DocumentSnapshot) => {
  const note = fromDoc<LessonNote & { userId?: string }>(snap, ["updatedAt"]);
  delete note.userId;
  return note as LessonNote;
};

export async function getNote(userId: string, courseId: string, lessonId: string) {
  const snap = await notes().doc(noteId(userId, courseId, lessonId)).get();
  return snap.exists ? toNote(snap) : null;
}

export async function listNotes(userId: string): Promise<LessonNote[]> {
  const snap = await notes().where("userId", "==", userId).get();
  return snap.docs.map(toNote).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** An empty note is deleted rather than kept. */
export async function saveNote(
  userId: string,
  lesson: { courseId: string; lessonId: string; courseTitle: string; lessonTitle: string },
  content: string
): Promise<LessonNote | null> {
  const ref = notes().doc(noteId(userId, lesson.courseId, lesson.lessonId));
  if (!content.trim()) {
    await ref.delete();
    return null;
  }
  await ref.set({ userId, ...lesson, content, updatedAt: Timestamp.now() });
  return toNote(await ref.get());
}

export async function deleteNoteById(userId: string, id: string): Promise<void> {
  if (!id.startsWith(`${userId}_`)) return;
  await notes().doc(id).delete();
}
