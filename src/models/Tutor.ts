/**
 * AI Tutor conversations — Firestore `tutorChats` collection, plus a per-day
 * usage counter in `tutorUsage` that caps how many questions a learner can ask.
 */

import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { TutorChat, TutorChatSummary, TutorContext, TutorMessage } from "@/types/domain";
import { fromDoc } from "./firestore";

const chats = () => getDb().collection("tutorChats");
const usage = () => getDb().collection("tutorUsage");

export const TUTOR_DAILY_LIMIT = 50;
/** Older messages stay visible but aren't sent to the model, to bound cost. */
export const TUTOR_HISTORY_SENT = 20;
const MAX_STORED_MESSAGES = 200;

type Stored = TutorChat & { userId: string };

function toChat(snap: FirebaseFirestore.DocumentSnapshot): Stored {
  return fromDoc<Stored>(snap, ["updatedAt"]);
}

export async function listChats(userId: string): Promise<TutorChatSummary[]> {
  const snap = await chats().where("userId", "==", userId).get();
  return snap.docs
    .map(toChat)
    .map(({ id, title, context, updatedAt }) => ({ id, title, context, updatedAt }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Returns the chat only to its owner. */
export async function getChat(userId: string, id: string): Promise<TutorChat | null> {
  const snap = await chats().doc(id).get();
  if (!snap.exists || snap.get("userId") !== userId) return null;
  const { id: chatId, title, context, messages, updatedAt } = toChat(snap);
  return { id: chatId, title, context, messages, updatedAt };
}

export async function createChat(userId: string, title: string, context: TutorContext | null): Promise<string> {
  const ref = await chats().add({ userId, title, context, messages: [], updatedAt: Timestamp.now() });
  return ref.id;
}

export async function saveMessages(id: string, messages: TutorMessage[]): Promise<void> {
  await chats().doc(id).update({ messages: messages.slice(-MAX_STORED_MESSAGES), updatedAt: Timestamp.now() });
}

export async function deleteChat(userId: string, id: string): Promise<boolean> {
  const ref = chats().doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.get("userId") !== userId) return false;
  await ref.delete();
  return true;
}

export async function questionsAskedToday(userId: string, today: string): Promise<number> {
  const snap = await usage().doc(`${userId}_${today}`).get();
  return snap.exists ? (snap.get("count") ?? 0) : 0;
}

/** Counts a question against today's limit. Returns false if the limit is reached. */
export async function takeQuestion(userId: string, today: string): Promise<boolean> {
  const ref = usage().doc(`${userId}_${today}`);
  return getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count: number = snap.exists ? (snap.get("count") ?? 0) : 0;
    if (count >= TUTOR_DAILY_LIMIT) return false;
    tx.set(ref, { userId, date: today, count: count + 1 });
    return true;
  });
}
