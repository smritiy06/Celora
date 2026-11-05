import { recommendationScore, toSummary } from "@/domain/courses";
import { mergeTopicScores, pickForDay, weakTopics } from "@/domain/gamification";
import { daysAgo, handle, learnerToday, requireUser } from "@/lib/api-route";
import { getCoursesByIds, listPublishedCourses } from "@/models/Course";
import { listEnrollments } from "@/models/Enrollment";
import { bestScores, listAttempts, listPublishedQuizzes, toQuizSummary } from "@/models/Quiz";
import { getActivity, getRank } from "@/models/User";
import type { DashboardData } from "@/types/domain";

export const GET = handle(async (request): Promise<DashboardData> => {
  const user = await requireUser();
  const today = learnerToday(request);

  const [enrollments, published, attempts, activity, quizzes, rank] = await Promise.all([
    listEnrollments(user.clerkId),
    listPublishedCourses(),
    listAttempts(user.clerkId),
    getActivity(user.clerkId, daysAgo(today, 83)),
    listPublishedQuizzes(),
    getRank(user.xp),
  ]);

  const enrolledCourses = new Map(
    (await getCoursesByIds(enrollments.map((e) => e.courseId))).map((c) => [c.id, c])
  );
  const inProgress = enrollments.flatMap((e) => {
    const course = enrolledCourses.get(e.courseId);
    return course && !e.completedAt ? [toSummary(course, e)] : [];
  });

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  const recommended = published
    .filter((c) => !enrolledIds.has(c.id))
    .map((c) => toSummary(c))
    .sort(
      (a, b) =>
        recommendationScore(b, user.preferences) - recommendationScore(a, user.preferences) ||
        b.learnerCount - a.learnerCount
    )
    .slice(0, 3);

  const daily = pickForDay(quizzes.slice().sort((a, b) => a.id.localeCompare(b.id)), today);
  const best = bestScores(attempts);

  return {
    user,
    today,
    todayActivity: activity.find((d) => d.date === today) ?? null,
    inProgress,
    recommended,
    recentAttempts: attempts.slice(0, 4).map(({ id, quizId, quizTitle, scorePercent, submittedAt }) => ({
      id,
      quizId,
      quizTitle,
      scorePercent,
      submittedAt,
    })),
    weakTopics: weakTopics(mergeTopicScores(attempts.map((a) => a.topics))).slice(0, 3),
    activity,
    dailyQuiz: daily && toQuizSummary(daily, best.get(daily.id) ?? null),
    rank,
  };
});
