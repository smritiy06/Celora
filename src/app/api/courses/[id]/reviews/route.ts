import { ApiError, handle, notFound, optionalUserId, parseBody, requireUser } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { getEnrollment } from "@/models/Enrollment";
import { notify } from "@/models/Notification";
import { deleteReview, listReviews, saveReview } from "@/models/Review";
import { reviewSchema } from "@/models/schemas";
import { publicName } from "@/models/User";

type Params = { id: string };

async function reviewableCourse(id: string, userId: string) {
  const course = await getCourse(id);
  if (!course) throw notFound("Course");
  if (course.teacherId === userId) throw new ApiError(403, "You can't review your own course");
  if (!(await getEnrollment(userId, id))) throw new ApiError(403, "Enroll in this course to review it");
  return course;
}

/** Reviews of a published course are public; only enrolled learners can write one. */
export const GET = handle<Params>(async (_request, { id }) => {
  const userId = await optionalUserId();
  const course = await getCourse(id);
  if (!course || (!course.isPublished && course.teacherId !== userId)) throw notFound("Course");
  const enrolled = userId && course.teacherId !== userId ? Boolean(await getEnrollment(userId, id)) : false;
  return listReviews(id, userId, enrolled);
});

export const PUT = handle<Params>(async (request, { id }) => {
  const user = await requireUser();
  const course = await reviewableCourse(id, user.clerkId);
  const input = await parseBody(request, reviewSchema);
  const { review, isNew } = await saveReview({ id: user.clerkId, publicName: publicName(user.name) }, id, input);
  if (isNew) {
    await notify(user.clerkId, [{
      userId: course.teacherId,
      type: "review",
      title: `New ${input.rating}-star review of ${course.title}`,
      body: input.text || "No written review.",
      href: `/courses/${id}#reviews`,
    }]);
  }
  return review;
});

export const DELETE = handle<Params>(async (_request, { id }) => {
  const user = await requireUser();
  await deleteReview(user.clerkId, id);
});
