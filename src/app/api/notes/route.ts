import { handle, requireUser } from "@/lib/api-route";
import { listNotes } from "@/models/Note";

export const GET = handle(async () => {
  const user = await requireUser();
  return listNotes(user.clerkId);
});
