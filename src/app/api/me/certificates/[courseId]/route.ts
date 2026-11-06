import { createHash } from "node:crypto";
import { toSummary } from "@/domain/courses";
import { ApiError, handle, notFound, requireUser } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { getEnrollment } from "@/models/Enrollment";
import type { Certificate } from "@/types/domain";

/** A certificate for a course the signed-in learner has finished. */
export const GET = handle<{ courseId: string }>(async (_request, { courseId }): Promise<Certificate> => {
  const user = await requireUser();
  const [course, enrollment] = await Promise.all([getCourse(courseId), getEnrollment(user.clerkId, courseId)]);
  if (!course || !enrollment) throw notFound("Certificate");
  if (!enrollment.completedAt) throw new ApiError(403, "Finish every lesson in this course to earn its certificate");

  const summary = toSummary(course, enrollment);
  const id = createHash("sha256").update(`${user.clerkId}:${courseId}:${enrollment.completedAt}`).digest("hex").slice(0, 12).toUpperCase();
  return {
    id: `CEL-${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8)}`,
    learnerName: user.name,
    courseId,
    courseTitle: course.title,
    teacherName: course.teacherName,
    lessonCount: summary.lessonCount,
    durationMinutes: summary.durationMinutes,
    completedAt: enrollment.completedAt,
  };
});
