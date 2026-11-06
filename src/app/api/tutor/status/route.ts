import { handle, learnerToday, requireUserId } from "@/lib/api-route";
import { tutorAvailable } from "@/lib/tutor";
import { questionsAskedToday, TUTOR_DAILY_LIMIT } from "@/models/Tutor";

export const GET = handle(async (request) => {
  const userId = await requireUserId();
  const available = tutorAvailable();
  const asked = available ? await questionsAskedToday(userId, learnerToday(request)) : 0;
  return { available, remainingToday: Math.max(0, TUTOR_DAILY_LIMIT - asked), dailyLimit: TUTOR_DAILY_LIMIT };
});
