import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingPageClient } from "@/features/landing/LandingPageClient";

/**
 * Landing Page — Server Component
 *
 * Checks Clerk auth state on the server:
 * - Authenticated users → redirect to /dashboard
 * - Unauthenticated users → show the landing page
 *
 * This is the fix for Issue 1: navigating to "/" no longer
 * shows the login/onboarding flow for authenticated users.
 */
export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <LandingPageClient />;
}
