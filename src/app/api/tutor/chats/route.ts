import { handle, requireUserId } from "@/lib/api-route";
import { listChats } from "@/models/Tutor";

export const GET = handle(async () => listChats(await requireUserId()));
