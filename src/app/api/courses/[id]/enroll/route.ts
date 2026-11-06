import { handle, notFound, requireUser } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { enroll, getEnrollment } from "@/models/Enrollment";
import { notify } from "@/models/Notification";
import { publicName } from "@/models/User";

export const POST = handle<{ id: string }>(async (_request, { id }) => {
  const user = await requireUser();
  const wasEnrolled = Boolean(await getEnrollment(user.clerkId, id));
  const enrollment = await enroll(user.clerkId, id);
  if (!enrollment) throw notFound("Course");

  if (!wasEnrolled) {
    const course = await getCourse(id);
    if (course) {
      await notify(user.clerkId, [{
        userId: course.teacherId,
        type: "enrollment",
        title: `${publicName(user.name)} enrolled in ${course.title}`,
        body: `${course.enrolledStudents.length} ${course.enrolledStudents.length === 1 ? "learner" : "learners"} so far.`,
        href: `/teacher/courses/${id}/learners`,
      }]);
    }
  }
  return enrollment;
});
