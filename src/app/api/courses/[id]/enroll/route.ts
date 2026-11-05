import { handle, notFound, requireUser } from "@/lib/api-route";
import { enroll } from "@/models/Enrollment";

export const POST = handle<{ id: string }>(async (_request, { id }) => {
  const user = await requireUser();
  const enrollment = await enroll(user.clerkId, id);
  if (!enrollment) throw notFound("Course");
  return enrollment;
});
