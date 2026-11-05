/**
 * Firestore connection (Firebase Admin SDK, server only).
 *
 * Initialised on first use rather than at import so `next build` works without
 * credentials, and cached on the global object to survive dev hot-reloads.
 */

import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

declare global {
  var firestoreDb: Firestore | undefined;
}

export function getDb(): Firestore {
  if (global.firestoreDb) return global.firestoreDb;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Please define FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local"
    );
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Env files usually store the key with literal "\n" sequences.
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });

  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  global.firestoreDb = db;
  return db;
}
