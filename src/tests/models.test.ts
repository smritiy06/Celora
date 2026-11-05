import { beforeEach, describe, expect, it } from "vitest";
import { createCourse, getCourse, listPublishedCourses, setCoursePublished } from "@/models/Course";
import { completeLesson, enroll, getEnrollment } from "@/models/Enrollment";
import { createGoal, deleteGoal, listGoals, updateGoal } from "@/models/Goal";
import { getNote, listNotes, saveNote, deleteNoteById } from "@/models/Note";
import { createQuiz, submitAttempt, toQuizForAttempt } from "@/models/Quiz";
import { attemptSchema, courseCreateSchema, courseUpdateSchema, goalSchema, quizUpdateSchema } from "@/models/schemas";
import { completeOnboarding, getActivity, getLeaderboard, getOrCreateUser, getRank, getUser, updateProfile } from "@/models/User";
import { installFakeFirestore } from "./fake-firestore";

const TODAY = "2026-03-10";
const identity = async () => ({ email: "a@example.test", name: "Ann Lee" });
const teacher = { id: "teacher", name: "Tess" };

const lesson = (id: string) => ({
  id, title: id, type: "article" as const, content: "text", videoUrl: "", duration: 5, resources: [], check: null,
});

async function publishedCourse() {
  const course = await createCourse(teacher, {
    title: "SQL",
    description: "Joins",
    modules: [{ id: "m", title: "M", lessons: [lesson("l1"), lesson("l2")] }],
  });
  return setCoursePublished(course.id, true);
}

beforeEach(() => {
  installFakeFirestore();
});

describe("users", () => {
  it("creates a profile once and keeps it", async () => {
    const created = await getOrCreateUser("u1", identity);
    expect(created).toMatchObject({ clerkId: "u1", name: "Ann Lee", role: "student", xp: 0, onboardingCompleted: false });
    await updateProfile("u1", { bio: "Hi" });
    expect(await getOrCreateUser("u1", async () => ({ email: "x", name: "Other" }))).toMatchObject({ name: "Ann Lee", bio: "Hi" });
  });

  it("completes onboarding", async () => {
    await getOrCreateUser("u1", identity);
    const user = await completeOnboarding("u1", { role: "teacher", goal: null, level: "advanced", interests: ["dsa"] });
    expect(user).toMatchObject({ role: "teacher", onboardingCompleted: true, preferences: { level: "advanced", interests: ["dsa"] } });
  });

  it("shows only safe names on the leaderboard and respects opting out", async () => {
    await getOrCreateUser("u1", identity);
    await getOrCreateUser("u2", async () => ({ email: "b@example.test", name: "Bo" }));
    await getOrCreateUser("u3", async () => ({ email: "c@example.test", name: "Cy" }));
    await updateProfile("u1", {});
    const store = (global.firestoreDb as unknown as { collection: (n: string) => { doc: (id: string) => { update: (d: object) => Promise<void> } } }).collection("users");
    await store.doc("u1").update({ xp: 50 });
    await store.doc("u2").update({ xp: 80 });
    await store.doc("u3").update({ xp: 90, showOnLeaderboard: false });

    const board = await getLeaderboard("u1");
    expect(board).toEqual([
      { rank: 1, name: "Bo", xp: 80, isYou: false },
      { rank: 2, name: "Ann L.", xp: 50, isYou: true },
    ]);
    expect(JSON.stringify(board)).not.toContain("example.test");
    expect(await getRank(50)).toBe(3);
  });
});

describe("enrollment and progress", () => {
  beforeEach(async () => {
    await getOrCreateUser("u1", identity);
  });

  it("won't enroll in a draft", async () => {
    const draft = await createCourse(teacher, { title: "Draft" });
    expect(await enroll("u1", draft.id)).toBeNull();
    expect(await enroll("u1", "missing")).toBeNull();
  });

  it("enrolling twice does nothing extra", async () => {
    const course = await publishedCourse();
    await enroll("u1", course.id);
    await enroll("u1", course.id);
    expect((await getCourse(course.id))!.enrolledStudents).toEqual(["u1"]);
  });

  it("needs enrollment and a real lesson to complete", async () => {
    const course = await publishedCourse();
    expect(await completeLesson("u1", course.id, "l1", TODAY)).toBeNull();
    await enroll("u1", course.id);
    expect(await completeLesson("u1", course.id, "nope", TODAY)).toBeNull();
  });

  it("awards XP once per lesson, a bonus on finishing, and records the day", async () => {
    const course = await publishedCourse();
    await enroll("u1", course.id);

    expect(await completeLesson("u1", course.id, "l1", TODAY)).toMatchObject({ xpEarned: 10, courseCompleted: false });
    expect(await completeLesson("u1", course.id, "l1", TODAY)).toMatchObject({ xpEarned: 0 });
    expect(await completeLesson("u1", course.id, "l2", TODAY)).toMatchObject({ xpEarned: 60, courseCompleted: true });

    const user = await getUser("u1");
    expect(user).toMatchObject({ xp: 70, streak: { current: 1, lastActiveDate: TODAY } });
    expect((await getEnrollment("u1", course.id))!.completedAt).not.toBeNull();
    expect(await getActivity("u1", "2026-01-01")).toEqual([{ date: TODAY, lessons: 2, quizzes: 0, xp: 70, minutes: 10 }]);
  });
});

describe("quizzes", () => {
  const question = { id: "q1", prompt: "P", options: ["a", "b"], correctIndex: 1, explanation: "why", topic: "SQL" };

  it("never sends answers before submission", async () => {
    const quiz = await createQuiz(teacher, { title: "Q", questions: [question] });
    const payload = JSON.stringify(toQuizForAttempt(quiz, null));
    expect(payload).not.toContain("correctIndex");
    expect(payload).not.toContain("why");
  });

  it("grades on the server and pays XP only for improvement", async () => {
    await getOrCreateUser("u1", identity);
    const quiz = await createQuiz(teacher, {
      title: "Q",
      questions: [question, { ...question, id: "q2" }],
    });
    const answer = (a: number | null, b: number | null) => ({
      answers: [{ questionId: "q1", selectedIndex: a }, { questionId: "q2", selectedIndex: b }],
      durationSeconds: 60,
    });

    const first = await submitAttempt("u1", quiz, answer(1, 0), TODAY);
    expect(first).toMatchObject({ correct: 1, scorePercent: 50, xpEarned: 10 });
    const worse = await submitAttempt("u1", quiz, answer(0, 0), TODAY);
    expect(worse.xpEarned).toBe(0);
    const better = await submitAttempt("u1", quiz, answer(1, 1), TODAY);
    expect(better.xpEarned).toBe(10);
    expect((await getUser("u1"))!.xp).toBe(20);
  });
});

describe("notes", () => {
  const where = { courseId: "c", lessonId: "l", courseTitle: "C", lessonTitle: "L" };

  it("saves, lists, and removes an emptied note", async () => {
    await saveNote("u1", where, "First");
    await saveNote("u1", where, "Second");
    expect((await listNotes("u1")).map((n) => n.content)).toEqual(["Second"]);
    expect(await saveNote("u1", where, "   ")).toBeNull();
    expect(await getNote("u1", "c", "l")).toBeNull();
  });

  it("keeps notes private to their author", async () => {
    await saveNote("u1", where, "Mine");
    expect(await listNotes("u2")).toEqual([]);
    const [note] = await listNotes("u1");
    await deleteNoteById("u2", note.id);
    expect(await listNotes("u1")).toHaveLength(1);
  });
});

describe("goals", () => {
  it("creates, updates and lists goals privately", async () => {
    const created = await createGoal("u1", { title: "Learn SQL", category: "web-dev", targetDate: null, milestones: [{ id: "m", title: "Joins", done: false }] });
    expect((await listGoals("u1")).map((g) => g.id)).toEqual([created.id]);
    expect(await listGoals("u2")).toEqual([]);
    const updated = await updateGoal("u1", created.id, { title: "Learn SQL", category: null, targetDate: "2027-01-01", milestones: [{ id: "m", title: "Joins", done: true }] });
    expect(updated?.milestones[0].done).toBe(true);
  });

  it("won't let another user change or delete a goal", async () => {
    const goal = await createGoal("u1", { title: "Mine", category: null, targetDate: null, milestones: [] });
    expect(await updateGoal("u2", goal.id, { title: "Hacked", category: null, targetDate: null, milestones: [] })).toBeNull();
    expect(await deleteGoal("u2", goal.id)).toBe(false);
    expect(await deleteGoal("u1", goal.id)).toBe(true);
    expect(await listGoals("u1")).toEqual([]);
  });

  it("validates input", () => {
    expect(goalSchema.safeParse({}).error?.issues[0].message).toBe("Name your goal");
    expect(goalSchema.safeParse({ title: "A", targetDate: "soon" }).success).toBe(false);
    expect(goalSchema.parse({ title: "A" })).toEqual({ title: "A", category: null, targetDate: null, milestones: [] });
  });
});

describe("request validation", () => {
  it("strips fields a client must not set", () => {
    const parsed = courseCreateSchema.parse({ title: "T", isPublished: true, teacherId: "evil", enrolledStudents: ["x"] });
    expect(Object.keys(parsed)).toEqual(["title"]);
  });
  it("doesn't add defaults to a partial update", () => {
    expect(courseUpdateSchema.parse({ title: "New" })).toEqual({ title: "New" });
  });
  it("requires a title with a clear message", () => {
    expect(courseCreateSchema.safeParse({}).error?.issues[0].message).toBe("Course title is required");
  });
  it("only allows https links", () => {
    const withVideo = (videoUrl: string) => ({ modules: [{ id: "m", title: "M", lessons: [{ id: "l", title: "L", videoUrl }] }] });
    expect(courseUpdateSchema.safeParse(withVideo("https://youtu.be/abc")).success).toBe(true);
    expect(courseUpdateSchema.safeParse(withVideo("javascript:alert(1)")).success).toBe(false);
    expect(courseUpdateSchema.safeParse({ thumbnail: "http://x.test/a.png" }).success).toBe(false);
    expect(courseUpdateSchema.safeParse({ thumbnail: "" }).success).toBe(true);
  });
  it("rejects a course too large for one Firestore document", () => {
    const big = "x".repeat(150_000);
    const lessons = Array.from({ length: 7 }, (_, i) => ({ id: String(i), title: "L", content: big }));
    const result = courseUpdateSchema.safeParse({ modules: [{ id: "m", title: "M", lessons }] });
    expect(result.error?.issues[0].message).toContain("too long");
  });
  it("rejects a correct answer that doesn't exist", () => {
    const q = { id: "q", prompt: "P", options: ["a", "b"], correctIndex: 5, topic: "T" };
    expect(quizUpdateSchema.safeParse({ questions: [q] }).success).toBe(false);
  });
  it("accepts unanswered questions in an attempt", () => {
    expect(attemptSchema.safeParse({ answers: [{ questionId: "q", selectedIndex: null }], durationSeconds: 1 }).success).toBe(true);
  });
});

describe("catalog visibility", () => {
  it("lists only published courses", async () => {
    await createCourse(teacher, { title: "Draft" });
    const live = await publishedCourse();
    expect((await listPublishedCourses()).map((c) => c.id)).toEqual([live.id]);
  });
});
