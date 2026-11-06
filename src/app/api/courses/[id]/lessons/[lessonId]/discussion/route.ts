import { ApiError, handle, notFound, parseBody, requireUser } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { createPost, getPost, listLessonPosts } from "@/models/Discussion";
import { getEnrollment } from "@/models/Enrollment";
import { notify } from "@/models/Notification";
import { discussionPostSchema } from "@/models/schemas";
import { publicName } from "@/models/User";

type Params = { id: string; lessonId: string };

/** Discussions are open to the course's learners and its teacher. */
async function access(courseId: string, lessonId: string) {
  const user = await requireUser();
  const course = await getCourse(courseId);
  if (!course) throw notFound("Course");
  const lesson = course.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!lesson) throw notFound("Lesson");
  const isOwner = course.teacherId === user.clerkId;
  if (!isOwner && !(await getEnrollment(user.clerkId, courseId))) {
    throw new ApiError(403, "Enroll in this course to join the discussion");
  }
  return { user, course, lesson, isOwner };
}

export const GET = handle<Params>(async (_request, { id, lessonId }) => {
  const { user, isOwner } = await access(id, lessonId);
  return listLessonPosts(id, lessonId, user.clerkId, isOwner);
});

export const POST = handle<Params>(async (request, { id, lessonId }) => {
  const { user, course, lesson, isOwner } = await access(id, lessonId);
  const input = await parseBody(request, discussionPostSchema);
  const href = `/courses/${id}/lessons/${lessonId}#discussion`;

  let parent = null;
  if (input.parentId) {
    parent = await getPost(input.parentId);
    if (!parent || parent.courseId !== id || parent.lessonId !== lessonId || parent.parentId) {
      throw new ApiError(400, "You can only reply to a question in this lesson");
    }
  }

  const post = await createPost({
    courseId: id,
    lessonId,
    parentId: input.parentId,
    authorId: user.clerkId,
    authorName: isOwner ? user.name : publicName(user.name),
    isTeacher: isOwner,
    body: input.body,
  });

  await notify(user.clerkId, [
    parent
      ? { userId: parent.authorId, type: "reply", title: `${isOwner ? "Your teacher" : publicName(user.name)} replied in ${lesson.title}`, body: input.body, href }
      : { userId: course.teacherId, type: "question", title: `New question in ${lesson.title}`, body: input.body, href },
  ]);
  return post;
});
