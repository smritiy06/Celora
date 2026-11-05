import { publishProblems } from "@/domain/courses";
import { ApiError, handle, notFound, requireTeacher } from "@/lib/api-route";
import { getCourse, setCoursePublished } from "@/models/Course";

/** Toggles publishing. A course must be complete before learners can see it. */
export const PUT = handle<{ id: string }>(async (_request, { id }) => {
  const teacher = await requireTeacher();
  const course = await getCourse(id);
  if (!course) throw notFound("Course");
  if (course.teacherId !== teacher.clerkId) throw new ApiError(403, "This course belongs to another teacher");

  if (!course.isPublished) {
    const problems = publishProblems(course);
    if (problems.length > 0) throw new ApiError(400, problems.join(" "));
  }
  return setCoursePublished(id, !course.isPublished);
});
