import { handle, notFound, requireUser } from "@/lib/api-route";
import { getAttempt } from "@/models/Quiz";

export const GET = handle<{ id: string }>(async (_request, { id }) => {
  const user = await requireUser();
  const attempt = await getAttempt(id);
  if (!attempt || attempt.userId !== user.clerkId) throw notFound("Result");
  return attempt;
});
