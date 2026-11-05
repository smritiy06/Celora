import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Anyone can browse the catalog; learning, progress and teaching need sign-in.
 * The public API routes check auth themselves for anything that writes.
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/courses",
  "/courses/:id",
  "/quiz",
  "/api/courses",
  "/api/courses/:id",
  "/api/quizzes",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
