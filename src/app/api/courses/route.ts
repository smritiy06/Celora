import { filterCatalog, toSummary } from "@/domain/courses";
import { ApiError, handle, optionalUserId, parseBody, requireTeacher, requireUser } from "@/lib/api-route";
import { createCourse, listCoursesByTeacher, listPublishedCourses } from "@/models/Course";
import { listEnrollments } from "@/models/Enrollment";
import { courseCreateSchema } from "@/models/schemas";
import { getUser } from "@/models/User";

export const GET = handle(async (request) => {
  const params = new URL(request.url).searchParams;

  if (params.get("teacherOnly") === "true") {
    const user = await requireUser();
    return listCoursesByTeacher(user.clerkId);
  }

  const userId = await optionalUserId();
  const [courses, enrollments, user] = await Promise.all([
    listPublishedCourses(),
    userId ? listEnrollments(userId) : [],
    userId ? getUser(userId) : null,
  ]);
  const byCourse = new Map(enrollments.map((e) => [e.courseId, e]));
  const summaries = courses.map((c) => toSummary(c, byCourse.get(c.id) ?? null));

  return filterCatalog(
    summaries,
    Object.fromEntries(params.entries()),
    user?.preferences ?? null
  );
});

export const POST = handle(async (request) => {
  const teacher = await requireTeacher();
  const input = await parseBody(request, courseCreateSchema);
  if (!input) throw new ApiError(400, "Invalid course");
  return createCourse({ id: teacher.clerkId, name: teacher.name }, input);
});
