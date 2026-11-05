import { ApiError, handle, notFound, parseBody, requireTeacher, requireUser } from "@/lib/api-route";
import { bestScores, deleteQuiz, getQuiz, listAttempts, toQuizForAttempt, updateQuiz } from "@/models/Quiz";
import { quizUpdateSchema } from "@/models/schemas";

type Params = { id: string };

async function ownedQuiz(id: string, teacherId: string) {
  const quiz = await getQuiz(id);
  if (!quiz) throw notFound("Quiz");
  if (quiz.teacherId !== teacherId) throw new ApiError(403, "This quiz belongs to another teacher");
  return quiz;
}

/** Learners get questions without answers. `?edit=true` returns everything to the owner. */
export const GET = handle<Params>(async (request, { id }) => {
  const user = await requireUser();
  const quiz = await getQuiz(id);
  if (!quiz) throw notFound("Quiz");

  const isOwner = quiz.teacherId === user.clerkId;
  if (new URL(request.url).searchParams.get("edit") === "true") {
    if (!isOwner) throw new ApiError(403, "This quiz belongs to another teacher");
    return quiz;
  }
  if (!quiz.isPublished && !isOwner) throw notFound("Quiz");

  const attempts = await listAttempts(user.clerkId);
  return toQuizForAttempt(quiz, bestScores(attempts).get(id) ?? null);
});

export const PUT = handle<Params>(async (request, { id }) => {
  const teacher = await requireTeacher();
  await ownedQuiz(id, teacher.clerkId);
  return updateQuiz(id, await parseBody(request, quizUpdateSchema));
});

export const DELETE = handle<Params>(async (_request, { id }) => {
  const teacher = await requireTeacher();
  await ownedQuiz(id, teacher.clerkId);
  await deleteQuiz(id);
});
