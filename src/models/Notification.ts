/**
 * Notifications — Firestore `notifications` collection. Written by the server
 * when something happens that someone else should know about.
 */

import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import type { AppNotification, NotificationType } from "@/types/domain";
import { fromDoc } from "./firestore";

const notifications = () => getDb().collection("notifications");
const KEEP = 50;

export interface NewNotification {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
}

/** Never notifies people about their own actions. Failures are logged, not thrown. */
export async function notify(actorId: string, items: NewNotification[]): Promise<void> {
  const recipients = items.filter((n) => n.userId && n.userId !== actorId);
  if (recipients.length === 0) return;
  try {
    const batch = getDb().batch();
    const now = Timestamp.now();
    for (const n of recipients) {
      batch.set(notifications().doc(), { ...n, body: n.body.slice(0, 200), read: false, createdAt: now });
    }
    await batch.commit();
  } catch (error) {
    console.error("[notify] could not write notifications:", error);
  }
}

export async function listNotifications(userId: string): Promise<AppNotification[]> {
  const snap = await notifications().where("userId", "==", userId).get();
  return snap.docs
    .map((d) => {
      const { id, type, title, body, href, read, createdAt } = fromDoc<AppNotification>(d, ["createdAt"]);
      return { id, type, title, body, href, read, createdAt };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, KEEP);
}

/** Marks the given notifications read, or all of them when ids is omitted. */
export async function markRead(userId: string, ids?: string[]): Promise<void> {
  const snap = await notifications().where("userId", "==", userId).where("read", "==", false).get();
  const batch = getDb().batch();
  for (const doc of snap.docs) {
    if (!ids || ids.includes(doc.id)) batch.update(doc.ref, { read: true });
  }
  await batch.commit();
}
