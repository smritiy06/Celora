import { handle, parseBody, requireUser } from "@/lib/api-route";
import { createGoal, listGoals } from "@/models/Goal";
import { goalSchema } from "@/models/schemas";

export const GET = handle(async () => {
  const user = await requireUser();
  return listGoals(user.clerkId);
});

export const POST = handle(async (request) => {
  const user = await requireUser();
  return createGoal(user.clerkId, await parseBody(request, goalSchema));
});
