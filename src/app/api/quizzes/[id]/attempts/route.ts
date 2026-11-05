import { handle, learnerToday, notFound, parseBody, requireUser } from "@/lib/api-route";
import { getQuiz, submitAttempt } from "@/models/Quiz";
import { attemptSchema } from "@/models/schemas";

export const POST = handle<{ id: string }>(async (request, { id }) => {
  const user = await requireUser();
  const quiz = await getQuiz(id);
  if (!quiz || (!quiz.isPublished && quiz.teacherId !== user.clerkId)) throw notFound("Quiz");
  return submitAttempt(user.clerkId, quiz, await parseBody(request, attemptSchema), learnerToday(request));
});
