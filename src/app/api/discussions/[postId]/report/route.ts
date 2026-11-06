import { ApiError, handle, notFound, requireUser } from "@/lib/api-route";
import { getPost, reportPost } from "@/models/Discussion";
import { getEnrollment } from "@/models/Enrollment";

export const POST = handle<{ postId: string }>(async (_request, { postId }) => {
  const user = await requireUser();
  const post = await getPost(postId);
  if (!post) throw notFound("Post");
  if (!(await getEnrollment(user.clerkId, post.courseId))) throw new ApiError(403, "Enroll in this course to report posts");
  await reportPost(postId, user.clerkId);
});
