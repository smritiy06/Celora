import { toSummary } from "@/domain/courses";
import { mergeTopicScores } from "@/domain/gamification";
import { daysAgo, handle, learnerToday, requireUser } from "@/lib/api-route";
import { getCoursesByIds } from "@/models/Course";
import { listEnrollments } from "@/models/Enrollment";
import { listAttempts } from "@/models/Quiz";
import { getActivity } from "@/models/User";
import type { ProgressData } from "@/types/domain";

export const GET = handle(async (request): Promise<ProgressData> => {
  const user = await requireUser();
  const today = learnerToday(request);

  const [enrollments, attempts, activity] = await Promise.all([
    listEnrollments(user.clerkId),
    listAttempts(user.clerkId),
    getActivity(user.clerkId, daysAgo(today, 83)),
  ]);

  const courses = new Map((await getCoursesByIds(enrollments.map((e) => e.courseId))).map((c) => [c.id, c]));
  const summaries = enrollments.flatMap((e) => {
    const course = courses.get(e.courseId);
    return course ? [toSummary(course, e)] : [];
  });

  return {
    user,
    activity,
    topics: mergeTopicScores(attempts.map((a) => a.topics)),
    attempts: attempts.slice(0, 20).map(({ id, quizId, quizTitle, scorePercent, submittedAt }) => ({
      id,
      quizId,
      quizTitle,
      scorePercent,
      submittedAt,
    })),
    coursesCompleted: summaries.filter((s) => s.progress?.completedAt),
    coursesInProgress: summaries.filter((s) => !s.progress?.completedAt),
    totalMinutes: activity.reduce((sum, d) => sum + d.minutes, 0),
    averageScore: attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + a.scorePercent, 0) / attempts.length)
      : null,
  };
});
