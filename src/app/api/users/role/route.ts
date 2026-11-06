import { z } from "zod";
import { handle, parseBody, requireUser } from "@/lib/api-route";
import { setRole } from "@/models/User";

const roleSchema = z.object({ role: z.enum(["student", "teacher"]) });

/** Anyone may teach on Celora; teachers keep full access to learning. */
export const PUT = handle(async (request) => {
  const user = await requireUser();
  const { role } = await parseBody(request, roleSchema);
  return setRole(user.clerkId, role);
});
