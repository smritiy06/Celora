import { handle, parseBody, requireUser } from "@/lib/api-route";
import { profileUpdateSchema } from "@/models/schemas";
import { updateProfile } from "@/models/User";

export const GET = handle(() => requireUser());

export const PATCH = handle(async (request) => {
  const user = await requireUser();
  return updateProfile(user.clerkId, await parseBody(request, profileUpdateSchema));
});
