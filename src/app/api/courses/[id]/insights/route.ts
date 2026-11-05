import { lessonIds, toProgress } from "@/domain/courses";
import { ApiError, handle, notFound, requireTeacher } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { listCourseEnrollments } from "@/models/Enrollment";
import { getUsersByIds } from "@/models/User";
import type { CourseInsights } from "@/types/domain";

export const GET = handle<{ id: string }>(async (_request, { id }): Promise<CourseInsights> => {
  const teacher = await requireTeacher();
  const course = await getCourse(id);
  if (!course) throw notFound("Course");
  if (course.teacherId !== teacher.clerkId) throw new ApiError(403, "This course belongs to another teacher");

  const enrollments = await listCourseEnrollments(id);
  const users = await getUsersByIds(enrollments.map((e) => e.userId));

  const learners = enrollments
    .map((e) => ({
      userId: e.userId,
      name: users.get(e.userId)?.name ?? "Former learner",
      percent: toProgress(course, e)?.percent ?? 0,
      lastActivityAt: e.lastActivityAt,
      completedAt: e.completedAt,
    }))
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));

  const count = learners.length;
  const titles = new Map(course.modules.flatMap((m) => m.lessons).map((l) => [l.id, l.title]));

  return {
    course: { id: course.id, title: course.title },
    learners,
    completionRate: count ? Math.round((learners.filter((l) => l.completedAt).length / count) * 100) : 0,
    averageProgress: count ? Math.round(learners.reduce((s, l) => s + l.percent, 0) / count) : 0,
    lessonFunnel: lessonIds(course).map((lessonId) => ({
      lessonId,
      title: titles.get(lessonId) ?? "",
      completed: enrollments.filter((e) => e.completedLessonIds.includes(lessonId)).length,
    })),
  };
});
