import { handle, requireUser } from "@/lib/api-route";
import { getLeaderboard } from "@/models/User";

export const GET = handle(async () => {
  const user = await requireUser();
  return getLeaderboard(user.clerkId);
});
