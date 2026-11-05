import { toOutline } from "@/domain/courses";
import { ApiError, handle, notFound, optionalUserId, parseBody, requireTeacher } from "@/lib/api-route";
import { deleteCourse, getCourse, updateCourse } from "@/models/Course";
import { getEnrollment } from "@/models/Enrollment";
import { courseUpdateSchema } from "@/models/schemas";

type Params = { id: string };

async function ownedCourse(id: string, teacherId: string) {
  const course = await getCourse(id);
  if (!course) throw notFound("Course");
  if (course.teacherId !== teacherId) throw new ApiError(403, "This course belongs to another teacher");
  return course;
}

/**
 * Anyone can read the outline of a published course. Drafts are visible only to
 * their owner and existing learners. `?edit=true` returns the full course to its owner.
 */
export const GET = handle<Params>(async (request, { id }) => {
  const userId = await optionalUserId();
  const course = await getCourse(id);
  if (!course) throw notFound("Course");

  const isOwner = course.teacherId === userId;
  if (new URL(request.url).searchParams.get("edit") === "true") {
    if (!isOwner) throw new ApiError(403, "This course belongs to another teacher");
    return course;
  }

  const enrollment = userId ? await getEnrollment(userId, id) : null;
  if (!course.isPublished && !isOwner && !enrollment) throw notFound("Course");
  return toOutline(course, enrollment, isOwner);
});

export const PUT = handle<Params>(async (request, { id }) => {
  const teacher = await requireTeacher();
  await ownedCourse(id, teacher.clerkId);
  return updateCourse(id, await parseBody(request, courseUpdateSchema));
});

export const DELETE = handle<Params>(async (_request, { id }) => {
  const teacher = await requireTeacher();
  await ownedCourse(id, teacher.clerkId);
  await deleteCourse(id);
});
