/**
 * Users — Firestore `users` collection, keyed by Clerk user ID, with a daily
 * `activity` subcollection that backs streaks and the activity heatmap.
 */

import { Timestamp, type Transaction } from "firebase-admin/firestore";
import { applyStreak } from "@/domain/gamification";
import { getDb } from "@/lib/firebase-admin";
import type { ActivityDay, LeaderboardEntry, Streak, User } from "@/types/domain";
import { fromDoc } from "./firestore";
import type { OnboardingInput, ProfileUpdateInput } from "./schemas";

const users = () => getDb().collection("users");
const activity = (clerkId: string) => users().doc(clerkId).collection("activity");

function toUser(snap: FirebaseFirestore.DocumentSnapshot): User {
  const { id, ...user } = fromDoc<User & { id: string }>(snap, ["createdAt", "updatedAt"]);
  return { ...user, clerkId: id };
}

export async function getUser(clerkId: string): Promise<User | null> {
  const snap = await users().doc(clerkId).get();
  return snap.exists ? toUser(snap) : null;
}

/** Returns the profile, creating it on first sign-in. */
export async function getOrCreateUser(
  clerkId: string,
  identity: () => Promise<{ email: string; name: string }>
): Promise<User> {
  const ref = users().doc(clerkId);
  const existing = await ref.get();
  if (existing.exists) return toUser(existing);

  const { email, name } = await identity();
  await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) return;
    const now = Timestamp.now();
    tx.set(ref, {
      email,
      name,
      bio: "",
      role: "student",
      onboardingCompleted: false,
      preferences: { goal: null, level: null, interests: [] },
      xp: 0,
      streak: { current: 0, longest: 0, lastActiveDate: null },
      showOnLeaderboard: true,
      createdAt: now,
      updatedAt: now,
    });
  });
  return toUser(await ref.get());
}

export async function completeOnboarding(clerkId: string, input: OnboardingInput): Promise<User> {
  const ref = users().doc(clerkId);
  await ref.update({
    role: input.role,
    preferences: { goal: input.goal, level: input.level, interests: input.interests },
    onboardingCompleted: true,
    updatedAt: Timestamp.now(),
  });
  return toUser(await ref.get());
}

export async function updateProfile(clerkId: string, input: ProfileUpdateInput): Promise<User> {
  const ref = users().doc(clerkId);
  await ref.update({ ...input, updatedAt: Timestamp.now() });
  return toUser(await ref.get());
}

export async function getUsersByIds(ids: string[]): Promise<Map<string, User>> {
  if (ids.length === 0) return new Map();
  const snaps = await getDb().getAll(...ids.map((id) => users().doc(id)));
  return new Map(snaps.filter((s) => s.exists).map((s) => [s.id, toUser(s)]));
}

export async function getActivity(clerkId: string, fromDate: string): Promise<ActivityDay[]> {
  const snap = await activity(clerkId).where("date", ">=", fromDate).get();
  return snap.docs
    .map((d) => d.data() as ActivityDay)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Shows first name and last initial only; other learners' details stay private. */
function publicName(name: string): string {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
}

export async function getLeaderboard(clerkId: string | null, size = 10): Promise<LeaderboardEntry[]> {
  const snap = await users().orderBy("xp", "desc").limit(100).get();
  return snap.docs
    .filter((d) => d.get("showOnLeaderboard") !== false && d.get("xp") > 0)
    .slice(0, size)
    .map((d, i) => ({
      rank: i + 1,
      name: publicName(d.get("name")),
      xp: d.get("xp"),
      isYou: d.id === clerkId,
    }));
}

/** The learner's position among everyone with more XP. */
export async function getRank(xp: number): Promise<number> {
  const result = await users().where("xp", ">", xp).count().get();
  return result.data().count + 1;
}

/** Progress recording, split so it can join a larger transaction (reads must come first). */
export interface ProgressDelta {
  xp?: number;
  lessons?: number;
  quizzes?: number;
  minutes?: number;
}

export async function readProgress(tx: Transaction, clerkId: string, today: string) {
  const userRef = users().doc(clerkId);
  const dayRef = activity(clerkId).doc(today);
  const [userSnap, daySnap] = [await tx.get(userRef), await tx.get(dayRef)];
  return { userRef, dayRef, userSnap, daySnap, today };
}

export function writeProgress(
  tx: Transaction,
  state: Awaited<ReturnType<typeof readProgress>>,
  delta: ProgressDelta
): void {
  const { userRef, dayRef, userSnap, daySnap, today } = state;
  const streak: Streak = userSnap.get("streak") ?? { current: 0, longest: 0, lastActiveDate: null };
  tx.update(userRef, {
    xp: (userSnap.get("xp") ?? 0) + (delta.xp ?? 0),
    streak: applyStreak(streak, today),
    updatedAt: Timestamp.now(),
  });
  const day = (daySnap.exists ? daySnap.data() : null) as ActivityDay | null;
  tx.set(dayRef, {
    date: today,
    lessons: (day?.lessons ?? 0) + (delta.lessons ?? 0),
    quizzes: (day?.quizzes ?? 0) + (delta.quizzes ?? 0),
    xp: (day?.xp ?? 0) + (delta.xp ?? 0),
    minutes: (day?.minutes ?? 0) + (delta.minutes ?? 0),
  });
}
