/** Converts stored Timestamps to ISO strings so documents can be sent as JSON. */

import type { DocumentSnapshot, Timestamp } from "firebase-admin/firestore";

export function iso(value: Timestamp | null | undefined): string {
  return value ? value.toDate().toISOString() : new Date(0).toISOString();
}

export function fromDoc<T>(snap: DocumentSnapshot, timestampFields: string[]): T {
  const data = snap.data() as Record<string, unknown>;
  const converted: Record<string, unknown> = { ...data, id: snap.id };
  for (const field of timestampFields) {
    const value = data[field] as Timestamp | null | undefined;
    converted[field] = value ? iso(value) : null;
  }
  return converted as T;
}
