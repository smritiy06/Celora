/** Shared behaviour for API routes: auth, validation, and safe error responses. */

import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { dateKey } from "@/domain/gamification";
import { getOrCreateUser } from "@/models/User";
import type { User } from "@/types/domain";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export const notFound = (what: string) => new ApiError(404, `${what} not found`);

export function handle<P = Record<string, never>>(
  fn: (request: Request, params: P) => Promise<unknown>
) {
  return async (request: Request, context: { params: Promise<P> }) => {
    try {
      const data = await fn(request, await context.params);
      return NextResponse.json(data ?? { success: true });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      console.error(`[API] ${request.method} ${new URL(request.url).pathname}:`, error);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  };
}

export async function optionalUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function requireUserId(): Promise<string> {
  const userId = await optionalUserId();
  if (!userId) throw new ApiError(401, "Please sign in");
  return userId;
}

/** The signed-in user's profile, created from their Clerk identity on first use. */
export async function requireUser(): Promise<User> {
  const userId = await requireUserId();
  return getOrCreateUser(userId, async () => {
    const clerkUser = await currentUser();
    const name = `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim();
    return {
      email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? "",
      name: name || "Learner",
    };
  });
}

export async function requireTeacher(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "teacher") throw new ApiError(403, "Only teachers can do this");
  return user;
}

export async function parseBody<S extends z.ZodType>(request: Request, schema: S): Promise<z.output<S>> {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0].message);
  return parsed.data;
}

/** Today in the learner's time zone, so streaks roll over at their midnight. */
export function learnerToday(request: Request): string {
  return dateKey(new Date(), request.headers.get("x-time-zone"));
}

export function daysAgo(today: string, days: number): string {
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}
