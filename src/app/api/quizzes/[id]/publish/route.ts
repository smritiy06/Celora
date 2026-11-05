import { ApiError, handle, notFound, requireTeacher } from "@/lib/api-route";
import { getQuiz, setQuizPublished } from "@/models/Quiz";

export const PUT = handle<{ id: string }>(async (_request, { id }) => {
  const teacher = await requireTeacher();
  const quiz = await getQuiz(id);
  if (!quiz) throw notFound("Quiz");
  if (quiz.teacherId !== teacher.clerkId) throw new ApiError(403, "This quiz belongs to another teacher");
  if (!quiz.isPublished && quiz.questions.length === 0) {
    throw new ApiError(400, "Add at least one question before publishing.");
  }
  return setQuizPublished(id, !quiz.isPublished);
});
