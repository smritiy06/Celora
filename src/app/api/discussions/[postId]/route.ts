import { ApiError, handle, notFound, requireUser } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { deletePost, getPost } from "@/models/Discussion";

/** Authors can remove their own posts; teachers can remove any post in their course. */
export const DELETE = handle<{ postId: string }>(async (_request, { postId }) => {
  const user = await requireUser();
  const post = await getPost(postId);
  if (!post) throw notFound("Post");
  const course = await getCourse(post.courseId);
  if (post.authorId !== user.clerkId && course?.teacherId !== user.clerkId) {
    throw new ApiError(403, "You can only remove your own posts");
  }
  await deletePost(postId);
});
