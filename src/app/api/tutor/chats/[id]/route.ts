import { handle, notFound, requireUserId } from "@/lib/api-route";
import { deleteChat, getChat } from "@/models/Tutor";

type Params = { id: string };

export const GET = handle<Params>(async (_request, { id }) => {
  const chat = await getChat(await requireUserId(), id);
  if (!chat) throw notFound("Chat");
  return chat;
});

export const DELETE = handle<Params>(async (_request, { id }) => {
  if (!(await deleteChat(await requireUserId(), id))) throw notFound("Chat");
});
