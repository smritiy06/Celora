"use client";

import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, PlayCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Markdown } from "@/components/shared/learning";
import { Button, ButtonLink } from "@/components/ui/button";
import { ErrorState, LoadingBlock, ProgressBar } from "@/components/ui/misc";
import { KnowledgeCheck, LessonNotes, LessonResources, LessonVideo } from "@/features/learning/lesson-parts";
import { useCompleteLesson, useCourse, useLesson } from "@/hooks/useLearning";
import { cn, plural } from "@/lib/utils";
import type { CourseOutline } from "@/types/domain";

function Curriculum({
  course,
  lessonId,
  completed,
  onNavigate,
}: {
  course: CourseOutline;
  lessonId: string;
  completed: Set<string>;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Course content">
      {course.modules.map((module) => (
        <div key={module.id} className="border-b last:border-b-0">
          <h3 className="px-4 pb-1 pt-4 text-xs font-medium text-ink-3">{module.title}</h3>
          <ul className="pb-2">
            {module.lessons.map((lesson) => {
              const current = lesson.id === lessonId;
              const done = completed.has(lesson.id);
              const Icon = done ? Check : lesson.type === "video" ? PlayCircle : FileText;
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                    onClick={onNavigate}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-start gap-2.5 px-4 py-2 text-sm",
                      current ? "bg-accent-soft font-medium" : "text-ink-2 hover:bg-sunken"
                    )}
                  >
                    <Icon aria-hidden className={cn("mt-0.5 h-4 w-4 shrink-0", done ? "text-success" : "text-ink-3")} />
                    <span className="min-w-0 flex-1">
                      {lesson.title}
                      {done && <span className="sr-only"> (completed)</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = use(params);
  const router = useRouter();
  const course = useCourse(courseId);
  const lesson = useLesson(courseId, lessonId);
  const complete = useCompleteLesson(courseId);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [earned, setEarned] = useState<{ xp: number; finished: boolean } | null>(null);

  if (course.isPending) return <div className="p-6"><LoadingBlock label="Loading lesson" /></div>;
  if (course.error) return <div className="p-6"><ErrorState error={course.error} onRetry={course.refetch} /></div>;

  const outline = course.data;
  const completed = new Set(outline.enrollment?.completedLessonIds ?? []);
  const flat = outline.modules.flatMap((m) => m.lessons);
  const index = flat.findIndex((l) => l.id === lessonId);
  const previous = flat[index - 1];
  const next = flat[index + 1];
  const isDone = completed.has(lessonId);
  const isEnrolled = Boolean(outline.enrollment);
  const backHref = `/courses/${courseId}`;
  const lessonHref = (id: string) => `/courses/${courseId}/lessons/${id}`;

  const finishAndContinue = () => {
    if (isDone || !isEnrolled) {
      if (next) router.push(lessonHref(next.id));
      return;
    }
    complete.mutate(lessonId, {
      onSuccess: (result) => {
        setEarned({ xp: result.xpEarned, finished: result.courseCompleted });
        if (next) router.push(lessonHref(next.id));
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-surface">
        <div className="flex h-16 items-center gap-3 px-4">
          <Link href={backHref} aria-label={`Back to ${outline.title}`} className="rounded p-2 -ml-2 text-ink-2 hover:bg-sunken">
            <X aria-hidden className="h-5 w-5" />
          </Link>
          <p className="min-w-0 flex-1 truncate text-sm font-medium">{outline.title}</p>
          {outline.progress && (
            <div className="hidden w-40 items-center gap-2 sm:flex">
              <ProgressBar percent={outline.progress.percent} label="Course progress" />
              <span className="text-xs tabular-nums text-ink-3">{outline.progress.percent}%</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r bg-surface lg:block">
          <Curriculum course={outline} lessonId={lessonId} completed={completed} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b bg-surface lg:hidden">
            <button
              onClick={() => setOutlineOpen((v) => !v)}
              aria-expanded={outlineOpen}
              className="flex min-h-11 w-full items-center justify-between px-4 text-sm text-ink-2"
            >
              Lesson {index + 1} of {flat.length}
              <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", outlineOpen && "rotate-180")} />
            </button>
            {outlineOpen && (
              <div className="max-h-[50vh] overflow-y-auto border-t">
                <Curriculum course={outline} lessonId={lessonId} completed={completed} onNavigate={() => setOutlineOpen(false)} />
              </div>
            )}
          </div>

          <main id="main" className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-8 sm:px-8 sm:py-12">
            {lesson.isPending ? (
              <LoadingBlock label="Loading lesson" rows={4} />
            ) : lesson.error ? (
              <ErrorState error={lesson.error} onRetry={lesson.refetch} />
            ) : (
              <>
                <header>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{lesson.data.title}</h1>
                  {lesson.data.duration > 0 && <p className="mt-2 text-sm text-ink-3">{lesson.data.duration} min</p>}
                </header>
                {lesson.data.videoUrl && <LessonVideo url={lesson.data.videoUrl} title={lesson.data.title} />}
                {lesson.data.content && <Markdown>{lesson.data.content}</Markdown>}
                {lesson.data.check && <KnowledgeCheck key={lessonId} check={lesson.data.check} />}
                <LessonResources resources={lesson.data.resources} />
                {isEnrolled && <LessonNotes key={`notes-${lessonId}`} courseId={courseId} lessonId={lessonId} />}
                {earned && !next && (
                  <div role="status" className="max-w-[66ch] rounded-lg border bg-success-soft p-4 text-sm">
                    <p className="font-medium">{earned.finished ? "Course complete. Well done." : "Lesson complete."}</p>
                    <p className="mt-1 text-ink-2">+{earned.xp} XP</p>
                    <Link href={backHref} className="mt-2 inline-block text-accent-ink underline">Back to course</Link>
                  </div>
                )}
                {complete.error && <ErrorState error={complete.error} onRetry={finishAndContinue} />}
              </>
            )}
          </main>

          <footer className="sticky bottom-0 border-t bg-surface">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5 sm:px-8">
              {previous ? (
                <ButtonLink href={lessonHref(previous.id)} variant="ghost" aria-label={`Previous: ${previous.title}`}>
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </ButtonLink>
              ) : (
                <span />
              )}
              {next || (isEnrolled && !isDone) ? (
                <Button onClick={finishAndContinue} disabled={complete.isPending || lesson.isPending}>
                  {complete.isPending
                    ? "Saving…"
                    : !isEnrolled || isDone
                      ? "Next lesson"
                      : next
                        ? "Complete and continue"
                        : "Complete course"}
                  {next && <ArrowRight aria-hidden className="h-4 w-4" />}
                </Button>
              ) : (
                <ButtonLink href={backHref} variant="secondary">
                  {completed.size >= flat.length ? `All ${plural(flat.length, "lesson")} done` : "Back to course"}
                </ButtonLink>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
