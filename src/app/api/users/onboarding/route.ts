import { handle, parseBody, requireUser } from "@/lib/api-route";
import { onboardingSchema } from "@/models/schemas";
import { completeOnboarding } from "@/models/User";

export const PUT = handle(async (request) => {
  const user = await requireUser();
  return completeOnboarding(user.clerkId, await parseBody(request, onboardingSchema));
});
