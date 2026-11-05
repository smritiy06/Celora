import { handle, optionalUserId, parseBody, requireTeacher, requireUser } from "@/lib/api-route";
import { bestScores, createQuiz, listAttempts, listPublishedQuizzes, listQuizzesByTeacher, toQuizSummary } from "@/models/Quiz";
import { quizCreateSchema } from "@/models/schemas";

export const GET = handle(async (request) => {
  const params = new URL(request.url).searchParams;

  if (params.get("teacherOnly") === "true") {
    const user = await requireUser();
    return listQuizzesByTeacher(user.clerkId);
  }

  const userId = await optionalUserId();
  const [quizzes, attempts] = await Promise.all([
    listPublishedQuizzes(),
    userId ? listAttempts(userId) : [],
  ]);
  const best = bestScores(attempts);
  return quizzes.map((q) => toQuizSummary(q, best.get(q.id) ?? null));
});

export const POST = handle(async (request) => {
  const teacher = await requireTeacher();
  return createQuiz(
    { id: teacher.clerkId, name: teacher.name },
    await parseBody(request, quizCreateSchema)
  );
});
