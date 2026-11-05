import { describe, expect, it } from "vitest";
import { filterCatalog, nextLessonId, publishProblems, recommendationScore, toOutline, toProgress } from "@/domain/courses";
import { applyStreak, dateKey, levelFromXp, mergeTopicScores, pickForDay, quizXpEarned, visibleStreak, weakTopics } from "@/domain/gamification";
import { formatClock, gradeQuiz, secondsRemaining } from "@/domain/grading";
import type { Course, CourseSummary, Enrollment, Lesson, QuizQuestion } from "@/types/domain";

const lesson = (id: string, content = "text"): Lesson => ({
  id, title: id, type: "article", content, videoUrl: "", duration: 10, resources: [], check: null,
});

const course = (overrides: Partial<Course> = {}): Course => ({
  id: "c1", teacherId: "t1", teacherName: "T", title: "Course", description: "About", outcomes: [],
  category: "web-dev", difficulty: "beginner", thumbnail: "", isPublished: true,
  modules: [{ id: "m1", title: "M", lessons: [lesson("a"), lesson("b")] }, { id: "m2", title: "N", lessons: [lesson("c")] }],
  enrolledStudents: [], createdAt: "2026-01-01", updatedAt: "2026-01-01", ...overrides,
});

const enrollment = (completedLessonIds: string[]): Enrollment => ({
  userId: "u", courseId: "c1", completedLessonIds, lastLessonId: null, enrolledAt: "", lastActivityAt: "", completedAt: null,
});

const question = (id: string, topic: string, correctIndex = 0): QuizQuestion => ({
  id, prompt: id, options: ["x", "y", "z"], correctIndex, explanation: "because", topic,
});

describe("gradeQuiz", () => {
  const questions = [question("q1", "SQL"), question("q2", "SQL", 1), question("q3", "HTTP", 2), question("q4", "HTTP")];

  it("counts correct, incorrect and unanswered separately", () => {
    const grade = gradeQuiz(questions, [
      { questionId: "q1", selectedIndex: 0 },
      { questionId: "q2", selectedIndex: 0 },
      { questionId: "q3", selectedIndex: null },
    ]);
    expect(grade).toMatchObject({ correct: 1, incorrect: 1, unanswered: 2, total: 4, scorePercent: 25 });
    expect(grade.review[1]).toMatchObject({ isCorrect: false, selectedIndex: 0, correctIndex: 1 });
    expect(grade.review[2]).toMatchObject({ isCorrect: false, selectedIndex: null });
  });

  it("breaks scores down by topic", () => {
    const grade = gradeQuiz(questions, [
      { questionId: "q1", selectedIndex: 0 },
      { questionId: "q2", selectedIndex: 1 },
    ]);
    expect(grade.topics).toEqual([
      { topic: "SQL", correct: 2, total: 2, percent: 100 },
      { topic: "HTTP", correct: 0, total: 2, percent: 0 },
    ]);
  });

  it("treats out-of-range answers as unanswered and ignores unknown questions", () => {
    const grade = gradeQuiz([question("q1", "SQL")], [
      { questionId: "q1", selectedIndex: 99 },
      { questionId: "nope", selectedIndex: 0 },
    ]);
    expect(grade).toMatchObject({ correct: 0, incorrect: 0, unanswered: 1 });
  });

  it("handles an empty quiz", () => {
    expect(gradeQuiz([], []).scorePercent).toBe(0);
  });
});

describe("quiz timer", () => {
  it("counts down and never goes negative", () => {
    expect(secondsRemaining(10_000, 0)).toBe(10);
    expect(secondsRemaining(10_000, 9_500)).toBe(1);
    expect(secondsRemaining(10_000, 20_000)).toBe(0);
  });
  it("formats as a clock", () => {
    expect(formatClock(65)).toBe("1:05");
    expect(formatClock(0)).toBe("0:00");
  });
});

describe("streaks", () => {
  const none = { current: 0, longest: 0, lastActiveDate: null };

  it("starts at one", () => {
    expect(applyStreak(none, "2026-03-10")).toEqual({ current: 1, longest: 1, lastActiveDate: "2026-03-10" });
  });
  it("doesn't change twice in one day", () => {
    const streak = { current: 3, longest: 5, lastActiveDate: "2026-03-10" };
    expect(applyStreak(streak, "2026-03-10")).toBe(streak);
  });
  it("continues on the next day, across a month boundary", () => {
    const streak = { current: 3, longest: 3, lastActiveDate: "2026-02-28" };
    expect(applyStreak(streak, "2026-03-01")).toEqual({ current: 4, longest: 4, lastActiveDate: "2026-03-01" });
  });
  it("restarts after a gap but keeps the longest", () => {
    const streak = { current: 7, longest: 7, lastActiveDate: "2026-03-01" };
    expect(applyStreak(streak, "2026-03-03")).toEqual({ current: 1, longest: 7, lastActiveDate: "2026-03-03" });
  });
  it("shows zero once a day has been missed", () => {
    const streak = { current: 7, longest: 7, lastActiveDate: "2026-03-01" };
    expect(visibleStreak(streak, "2026-03-02")).toBe(7);
    expect(visibleStreak(streak, "2026-03-03")).toBe(0);
  });
});

describe("dateKey", () => {
  const instant = new Date("2026-03-10T20:00:00Z");
  it("uses the learner's time zone", () => {
    expect(dateKey(instant, "Asia/Kolkata")).toBe("2026-03-11");
    expect(dateKey(instant, "UTC")).toBe("2026-03-10");
  });
  it("falls back to UTC for an invalid zone", () => {
    expect(dateKey(instant, "Not/AZone")).toBe("2026-03-10");
  });
});

describe("XP", () => {
  it("rewards only improvement on retakes", () => {
    expect(quizXpEarned(5, 0)).toBe(50);
    expect(quizXpEarned(7, 5)).toBe(20);
    expect(quizXpEarned(3, 5)).toBe(0);
  });
  it("calculates level and progress", () => {
    expect(levelFromXp(0)).toMatchObject({ level: 1, percentToNext: 0 });
    expect(levelFromXp(200)).toMatchObject({ level: 2, percentToNext: 50 });
    expect(levelFromXp(99_999)).toMatchObject({ level: 10, next: null, percentToNext: 100 });
  });
});

describe("weak topics", () => {
  it("merges attempts and keeps only weak topics with enough answers, weakest first", () => {
    const merged = mergeTopicScores([
      [{ topic: "SQL", correct: 1, total: 2, percent: 50 }, { topic: "CSS", correct: 0, total: 1, percent: 0 }],
      [{ topic: "SQL", correct: 0, total: 2, percent: 0 }, { topic: "HTTP", correct: 4, total: 4, percent: 100 }],
    ]);
    expect(merged[0].topic).toBe("CSS");
    expect(weakTopics(merged)).toEqual([{ topic: "SQL", correct: 1, total: 4, percent: 25 }]);
  });
});

describe("daily quiz", () => {
  it("is stable within a day and handles no quizzes", () => {
    expect(pickForDay(["a", "b", "c"], "2026-03-10")).toBe(pickForDay(["a", "b", "c"], "2026-03-10"));
    expect(pickForDay([], "2026-03-10")).toBeNull();
  });
});

describe("course progress", () => {
  it("calculates percent and ignores lessons since removed", () => {
    expect(toProgress(course(), enrollment(["a", "removed"]))).toMatchObject({ percent: 33, completedCount: 1 });
    expect(toProgress(course(), null)).toBeNull();
  });
  it("finds the next incomplete lesson across modules", () => {
    expect(nextLessonId(course(), ["a", "b"])).toBe("c");
    expect(nextLessonId(course(), ["a", "b", "c"])).toBe("a");
    expect(nextLessonId(course({ modules: [] }), [])).toBeNull();
  });
  it("never includes lesson content in an outline", () => {
    expect(JSON.stringify(toOutline(course({ modules: [{ id: "m", title: "M", lessons: [lesson("a", "SECRET")] }] }), null, false))).not.toContain("SECRET");
  });
});

describe("publish checks", () => {
  it("passes a complete course", () => {
    expect(publishProblems(course())).toEqual([]);
  });
  it("explains what is missing", () => {
    expect(publishProblems(course({ description: " ", modules: [] }))).toEqual([
      "Add a course description.",
      "Add at least one lesson.",
    ]);
    expect(publishProblems(course({ modules: [{ id: "m", title: "M", lessons: [lesson("Intro", "")] }] }))[0]).toContain('"Intro"');
  });
  it("accepts a video lesson with no text", () => {
    expect(publishProblems(course({ modules: [{ id: "m", title: "M", lessons: [{ ...lesson("v", ""), videoUrl: "https://x.test/v.mp4" }] }] }))).toEqual([]);
  });
});

describe("catalog", () => {
  const summary = (id: string, fields: Partial<CourseSummary>): CourseSummary => ({
    id, title: id, description: "", category: "web-dev", difficulty: "beginner", thumbnail: "", teacherName: "T",
    moduleCount: 1, lessonCount: 1, durationMinutes: 60, learnerCount: 0, updatedAt: "2026-01-01", progress: null, ...fields,
  });
  const list = [
    summary("react basics", { learnerCount: 5, updatedAt: "2026-01-01" }),
    summary("neural nets", { category: "ai-ml", difficulty: "advanced", durationMinutes: 700, updatedAt: "2026-02-01" }),
    summary("done", { progress: { percent: 100, completedCount: 1, lastLessonId: null, completedAt: "2026-01-02" } }),
  ];

  it("filters by text, category, level, length and status", () => {
    expect(filterCatalog([...list], { q: "REACT" }).map((c) => c.id)).toEqual(["react basics"]);
    expect(filterCatalog([...list], { category: "ai-ml" }).map((c) => c.id)).toEqual(["neural nets"]);
    expect(filterCatalog([...list], { duration: "long" }).map((c) => c.id)).toEqual(["neural nets"]);
    expect(filterCatalog([...list], { status: "completed" }).map((c) => c.id)).toEqual(["done"]);
    expect(filterCatalog([...list], { status: "not-enrolled" })).toHaveLength(2);
  });
  it("sorts", () => {
    expect(filterCatalog([...list], { sort: "newest" })[0].id).toBe("neural nets");
    expect(filterCatalog([...list], { sort: "popular" })[0].id).toBe("react basics");
    expect(filterCatalog([...list], { sort: "shortest" }).at(-1)!.id).toBe("neural nets");
  });
  it("puts courses matching the learner's interests first", () => {
    const prefs = { goal: null, level: "advanced" as const, interests: ["ai-ml"] };
    expect(filterCatalog([...list], {}, prefs)[0].id).toBe("neural nets");
    expect(recommendationScore(list[1], prefs)).toBe(3);
    expect(recommendationScore(list[0], null)).toBe(0);
  });
});
