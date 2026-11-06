import { beforeEach, describe, expect, it } from "vitest";
import { ratingOf } from "@/domain/courses";
import { createCourse, getCourse, setCoursePublished } from "@/models/Course";
import { createPost, deletePost, HIDE_AFTER_REPORTS, listLessonPosts, reportPost } from "@/models/Discussion";
import { listNotifications, markRead, notify } from "@/models/Notification";
import { deleteReview, listReviews, saveReview } from "@/models/Review";
import { discussionPostSchema, reviewSchema, tutorRequestSchema } from "@/models/schemas";
import { createChat, deleteChat, getChat, saveMessages, takeQuestion, TUTOR_DAILY_LIMIT } from "@/models/Tutor";
import { timeAgo } from "@/lib/utils";
import { installFakeFirestore } from "./fake-firestore";

const teacher = { id: "teacher", name: "Tess Teach" };

async function course() {
  const c = await createCourse(teacher, { title: "SQL", description: "d", modules: [{ id: "m", title: "M", lessons: [] }] });
  return setCoursePublished(c.id, true);
}

beforeEach(() => {
  installFakeFirestore();
});

describe("reviews", () => {
  it("keeps one review per learner and the course totals in step", async () => {
    const c = await course();
    expect((await saveReview({ id: "a", publicName: "Ann L." }, c.id, { rating: 4, text: "Good" })).isNew).toBe(true);
    await saveReview({ id: "b", publicName: "Bo" }, c.id, { rating: 2, text: "" });
    expect((await saveReview({ id: "a", publicName: "Ann L." }, c.id, { rating: 5, text: "Great" })).isNew).toBe(false);

    const result = await listReviews(c.id, "a", true);
    expect(result.summary).toEqual({ average: 3.5, count: 2 });
    expect(result.distribution).toEqual([0, 1, 0, 0, 1]);
    expect(result.mine).toMatchObject({ rating: 5, text: "Great", isYou: true });
    expect(ratingOf((await getCourse(c.id))!)).toEqual({ average: 3.5, count: 2 });

    await deleteReview("b", c.id);
    expect(ratingOf((await getCourse(c.id))!)).toEqual({ average: 5, count: 1 });
  });

  it("requires a rating from 1 to 5", () => {
    expect(reviewSchema.safeParse({ rating: 0 }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 6 }).success).toBe(false);
    expect(reviewSchema.parse({ rating: 3 })).toEqual({ rating: 3, text: "" });
  });
});

describe("discussions", () => {
  const base = { courseId: "c1", lessonId: "l1", isTeacher: false };

  it("threads replies under questions and lets owners delete", async () => {
    const q = await createPost({ ...base, parentId: null, authorId: "a", authorName: "Ann L.", body: "Why?" });
    await createPost({ ...base, parentId: q.id, authorId: "teacher", authorName: "Tess", isTeacher: true, body: "Because." });
    await createPost({ ...base, lessonId: "other", parentId: null, authorId: "a", authorName: "Ann L.", body: "Elsewhere" });

    const [thread, ...rest] = await listLessonPosts("c1", "l1", "a", false);
    expect(rest).toHaveLength(0);
    expect(thread).toMatchObject({ body: "Why?", isYou: true, canDelete: true });
    expect(thread.replies).toEqual([expect.objectContaining({ body: "Because.", isTeacher: true, isYou: false, canDelete: false })]);

    await deletePost(q.id);
    expect(await listLessonPosts("c1", "l1", "a", false)).toEqual([]);
  });

  it("hides heavily reported posts from learners but not the teacher", async () => {
    const q = await createPost({ ...base, parentId: null, authorId: "a", authorName: "Ann L.", body: "Spam" });
    for (let i = 0; i < HIDE_AFTER_REPORTS; i++) await reportPost(q.id, `r${i}`);
    await reportPost(q.id, "r0"); // reporting twice counts once
    expect(await listLessonPosts("c1", "l1", "b", false)).toEqual([]);
    expect(await listLessonPosts("c1", "l1", "teacher", true)).toHaveLength(1);
  });

  it("rejects empty posts", () => {
    expect(discussionPostSchema.safeParse({ body: "   " }).success).toBe(false);
  });
});

describe("notifications", () => {
  it("skips the actor and marks read", async () => {
    await notify("a", [
      { userId: "a", type: "reply", title: "self", body: "", href: "/" },
      { userId: "b", type: "reply", title: "for b", body: "x".repeat(300), href: "/x" },
    ]);
    expect(await listNotifications("a")).toEqual([]);
    const [item] = await listNotifications("b");
    expect(item).toMatchObject({ title: "for b", read: false });
    expect(item.body).toHaveLength(200);
    await markRead("b");
    expect((await listNotifications("b"))[0].read).toBe(true);
  });
});

describe("tutor", () => {
  it("keeps chats private to their owner", async () => {
    const id = await createChat("a", "Joins", null);
    await saveMessages(id, [{ role: "user", content: "hi", createdAt: "2026-01-01T00:00:00Z" }]);
    expect((await getChat("a", id))?.messages).toHaveLength(1);
    expect(await getChat("b", id)).toBeNull();
    expect(await deleteChat("b", id)).toBe(false);
    expect(await deleteChat("a", id)).toBe(true);
  });

  it("caps questions per day", async () => {
    for (let i = 0; i < TUTOR_DAILY_LIMIT; i++) expect(await takeQuestion("a", "2026-01-01")).toBe(true);
    expect(await takeQuestion("a", "2026-01-01")).toBe(false);
    expect(await takeQuestion("a", "2026-01-02")).toBe(true);
  });

  it("validates tutor requests", () => {
    expect(tutorRequestSchema.parse({ message: " hi " })).toEqual({ chatId: null, message: "hi", regenerate: false, context: null });
    expect(tutorRequestSchema.safeParse({ message: "x".repeat(8001) }).success).toBe(false);
  });
});

describe("timeAgo", () => {
  const now = Date.parse("2026-01-10T12:00:00Z");
  it("formats recent times", () => {
    expect(timeAgo("2026-01-10T11:59:30Z", now)).toBe("just now");
    expect(timeAgo("2026-01-10T11:00:00Z", now)).toBe("1h ago");
    expect(timeAgo("2026-01-08T12:00:00Z", now)).toBe("2d ago");
  });
});
