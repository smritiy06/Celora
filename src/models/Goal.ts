/** Personal learning goals — Firestore `goals` collection. Private to their owner. */

import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { LearningGoal } from "@/types/domain";
import { fromDoc } from "./firestore";
import type { GoalInput } from "./schemas";

const goals = () => getDb().collection("goals");

const toGoal = (snap: FirebaseFirestore.DocumentSnapshot) =>
  fromDoc<LearningGoal & { userId: string }>(snap, ["createdAt", "updatedAt"]);

export async function listGoals(userId: string): Promise<LearningGoal[]> {
  const snap = await goals().where("userId", "==", userId).get();
  return snap.docs.map(toGoal).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createGoal(userId: string, input: GoalInput): Promise<LearningGoal> {
  const now = Timestamp.now();
  const ref = await goals().add({ ...input, userId, createdAt: now, updatedAt: now });
  return toGoal(await ref.get());
}

/** Returns null unless the goal exists and belongs to this user. */
export async function updateGoal(userId: string, id: string, input: GoalInput): Promise<LearningGoal | null> {
  const ref = goals().doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.get("userId") !== userId) return null;
  await ref.update({ ...input, updatedAt: Timestamp.now() });
  return toGoal(await ref.get());
}

export async function deleteGoal(userId: string, id: string): Promise<boolean> {
  const ref = goals().doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.get("userId") !== userId) return false;
  await ref.delete();
  return true;
}
