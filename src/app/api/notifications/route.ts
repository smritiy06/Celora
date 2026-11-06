import { z } from "zod";
import { handle, parseBody, requireUserId } from "@/lib/api-route";
import { listNotifications, markRead } from "@/models/Notification";

export const GET = handle(async () => listNotifications(await requireUserId()));

const readSchema = z.object({ ids: z.array(z.string()).max(100).optional() });

export const PATCH = handle(async (request) => {
  const userId = await requireUserId();
  const { ids } = await parseBody(request, readSchema);
  await markRead(userId, ids);
});
