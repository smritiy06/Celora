import { ApiError, handle, learnerToday, notFound, requireUser } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { completeLesson, getEnrollment, recordLessonVisit } from "@/models/Enrollment";

type Params = { id: string; lessonId: string };

/** Lesson content is only sent to enrolled learners and the course's teacher. */
export const GET = handle<Params>(async (_request, { id, lessonId }) => {
  const user = await requireUser();
  const course = await getCourse(id);
  if (!course) throw notFound("Course");

  const enrollment = await getEnrollment(user.clerkId, id);
  if (!enrollment && course.teacherId !== user.clerkId) {
    throw new ApiError(403, "Enroll in this course to read its lessons");
  }

  const lesson = course.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!lesson) throw notFound("Lesson");

  if (enrollment) await recordLessonVisit(user.clerkId, id, lessonId);
  return lesson;
});

/** Marks the lesson complete. */
export const POST = handle<Params>(async (request, { id, lessonId }) => {
  const user = await requireUser();
  const result = await completeLesson(user.clerkId, id, lessonId, learnerToday(request));
  if (!result) throw new ApiError(403, "Enroll in this course to track your progress");
  return result;
});
