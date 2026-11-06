import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Anyone can browse the catalog; learning, progress and teaching need sign-in.
 * The public API routes check auth themselves for anything that writes.
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/teach",
  "/teach/login(.*)",
  "/teach/signup(.*)",
  "/courses",
  "/courses/:id",
  "/quiz",
  "/api/courses",
  "/api/courses/:id",
  "/api/courses/:id/reviews",
  "/api/quizzes",
]);

const isTeacherPortal = createRouteMatcher(["/teacher(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;
  if (isTeacherPortal(request)) {
    // Signed-out visitors to the teacher portal get the teacher login.
    const login = new URL("/teach/login", request.url);
    login.searchParams.set("redirect_url", request.url);
    await auth.protect({ unauthenticatedUrl: login.toString() });
    return;
  }
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
