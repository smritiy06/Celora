import { handle, notFound, parseBody, requireUser } from "@/lib/api-route";
import { getCourse } from "@/models/Course";
import { getNote, saveNote } from "@/models/Note";
import { noteSchema } from "@/models/schemas";

type Params = { id: string; lessonId: string };

export const GET = handle<Params>(async (_request, { id, lessonId }) => {
  const user = await requireUser();
  return { note: await getNote(user.clerkId, id, lessonId) };
});

export const PUT = handle<Params>(async (request, { id, lessonId }) => {
  const user = await requireUser();
  const { content } = await parseBody(request, noteSchema);
  const course = await getCourse(id);
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!course || !lesson) throw notFound("Lesson");

  const note = await saveNote(
    user.clerkId,
    { courseId: id, lessonId, courseTitle: course.title, lessonTitle: lesson.title },
    content
  );
  return { note };
});
