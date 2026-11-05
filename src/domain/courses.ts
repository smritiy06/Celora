import type {
  Course,
  CourseOutline,
  CourseProgress,
  CourseSummary,
  Difficulty,
  Enrollment,
  UserPreferences,
} from "@/types/domain";

export type CatalogSort = "recommended" | "newest" | "popular" | "shortest";

export interface CatalogQuery {
  q?: string;
  category?: string;
  difficulty?: string;
  duration?: string;
  status?: string;
  sort?: string;
}

type HasLessonIds = { modules: { lessons: { id: string }[] }[] };

export function lessonIds(course: HasLessonIds): string[] {
  return course.modules.flatMap((m) => m.lessons.map((l) => l.id));
}

export function toProgress(course: Course, enrollment: Enrollment | null): CourseProgress | null {
  if (!enrollment) return null;
  const ids = new Set(lessonIds(course));
  const completedCount = enrollment.completedLessonIds.filter((id) => ids.has(id)).length;
  return {
    percent: ids.size === 0 ? 0 : Math.round((completedCount / ids.size) * 100),
    completedCount,
    lastLessonId: enrollment.lastLessonId,
    completedAt: enrollment.completedAt,
  };
}

export function toSummary(course: Course, enrollment: Enrollment | null = null): CourseSummary {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    thumbnail: course.thumbnail,
    teacherName: course.teacherName,
    moduleCount: course.modules.length,
    lessonCount: lessonIds(course).length,
    durationMinutes: course.modules.reduce(
      (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0),
      0
    ),
    learnerCount: course.enrolledStudents.length,
    updatedAt: course.updatedAt,
    progress: toProgress(course, enrollment),
  };
}

export function toOutline(
  course: Course,
  enrollment: Enrollment | null,
  isOwner: boolean
): CourseOutline {
  return {
    ...toSummary(course, enrollment),
    outcomes: course.outcomes,
    enrollment,
    isOwner,
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map(({ id, title, type, duration }) => ({ id, title, type, duration })),
    })),
  };
}

/** Where a learner should go next: the first incomplete lesson, in course order. */
export function nextLessonId(course: HasLessonIds, completedLessonIds: string[]): string | null {
  const done = new Set(completedLessonIds);
  const ids = lessonIds(course);
  return ids.find((id) => !done.has(id)) ?? ids[0] ?? null;
}

const DURATION_BUCKETS: Record<string, (minutes: number) => boolean> = {
  short: (m) => m < 120,
  medium: (m) => m >= 120 && m <= 600,
  long: (m) => m > 600,
};

/** Scores a course for a learner from their stated interests and level. */
export function recommendationScore(
  course: Pick<CourseSummary, "category" | "difficulty">,
  preferences: UserPreferences | null
): number {
  if (!preferences) return 0;
  const interest = preferences.interests.includes(course.category) ? 2 : 0;
  const level = preferences.level === course.difficulty ? 1 : 0;
  return interest + level;
}

export function filterCatalog(
  courses: CourseSummary[],
  query: CatalogQuery,
  preferences: UserPreferences | null = null
): CourseSummary[] {
  const q = query.q?.trim().toLowerCase();
  const durationMatches = query.duration ? DURATION_BUCKETS[query.duration] : undefined;

  const filtered = courses.filter((c) => {
    if (q && !`${c.title} ${c.description} ${c.teacherName}`.toLowerCase().includes(q)) return false;
    if (query.category && c.category !== query.category) return false;
    if (query.difficulty && c.difficulty !== (query.difficulty as Difficulty)) return false;
    if (durationMatches && !durationMatches(c.durationMinutes)) return false;
    if (query.status === "enrolled" && !c.progress) return false;
    if (query.status === "in-progress" && (!c.progress || c.progress.completedAt)) return false;
    if (query.status === "completed" && !c.progress?.completedAt) return false;
    if (query.status === "not-enrolled" && c.progress) return false;
    return true;
  });

  const byNewest = (a: CourseSummary, b: CourseSummary) => b.updatedAt.localeCompare(a.updatedAt);
  switch ((query.sort ?? "recommended") as CatalogSort) {
    case "newest":
      return filtered.sort(byNewest);
    case "popular":
      return filtered.sort((a, b) => b.learnerCount - a.learnerCount || byNewest(a, b));
    case "shortest":
      return filtered.sort((a, b) => a.durationMinutes - b.durationMinutes);
    default:
      return filtered.sort(
        (a, b) =>
          recommendationScore(b, preferences) - recommendationScore(a, preferences) ||
          b.learnerCount - a.learnerCount ||
          byNewest(a, b)
      );
  }
}

/** Reasons a course can't be published yet. Empty means it is ready. */
export function publishProblems(course: Pick<Course, "title" | "description" | "modules">): string[] {
  const problems: string[] = [];
  if (!course.description.trim()) problems.push("Add a course description.");
  const lessons = course.modules.flatMap((m) => m.lessons);
  if (lessons.length === 0) problems.push("Add at least one lesson.");
  const empty = lessons.filter((l) => !l.content.trim() && !l.videoUrl.trim());
  if (empty.length > 0) {
    const names = empty.slice(0, 3).map((l) => `"${l.title}"`).join(", ");
    problems.push(`Add content to ${names}${empty.length > 3 ? ` and ${empty.length - 3} more` : ""}.`);
  }
  return problems;
}
