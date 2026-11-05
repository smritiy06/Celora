import { handle, requireUser } from "@/lib/api-route";
import { deleteNoteById } from "@/models/Note";

export const DELETE = handle<{ id: string }>(async (_request, { id }) => {
  const user = await requireUser();
  await deleteNoteById(user.clerkId, id);
});
