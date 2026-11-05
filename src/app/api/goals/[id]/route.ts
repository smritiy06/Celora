import { handle, notFound, parseBody, requireUser } from "@/lib/api-route";
import { deleteGoal, updateGoal } from "@/models/Goal";
import { goalSchema } from "@/models/schemas";

type Params = { id: string };

export const PUT = handle<Params>(async (request, { id }) => {
  const user = await requireUser();
  const goal = await updateGoal(user.clerkId, id, await parseBody(request, goalSchema));
  if (!goal) throw notFound("Goal");
  return goal;
});

export const DELETE = handle<Params>(async (_request, { id }) => {
  const user = await requireUser();
  if (!(await deleteGoal(user.clerkId, id))) throw notFound("Goal");
});
