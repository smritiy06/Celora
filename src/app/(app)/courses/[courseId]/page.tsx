"use client";

import { BookOpen, Check, CheckCircle2, ChevronDown, Clock, FileText, Layers, PlayCircle, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { DifficultyTag, Section } from "@/components/shared/learning";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, ErrorState, LoadingBlock, ProgressBar, Tag } from "@/components/ui/misc";
import { categoryLabel } from "@/constants/catalog";
import { nextLessonId } from "@/domain/courses";
import { useSession } from "@/hooks/useAccount";
import { useCourse, useEnroll } from "@/hooks/useLearning";
import { formatDuration, plural } from "@/lib/utils";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const { isSignedIn } = useSession();
  const { data: course, error, isPending, refetch } = useCourse(courseId);
  const enroll = useEnroll(courseId);

  if (isPending) return <LoadingBlock label="Loading course" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const completed = new Set(course.enrollment?.completedLessonIds ?? []);
  const nextId = nextLessonId(course, course.enrollment?.completedLessonIds ?? []);
  const canOpenLessons = Boolean(course.enrollment) || course.isOwner;
  const lessonHref = (id: string) => `/courses/${courseId}/lessons/${id}`;
  const progress = course.progress;

  const start = () => {
    enroll.mutate(undefined, { onSuccess: () => nextId && router.push(lessonHref(nextId)) });
  };

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-4 text-[13px] text-ink-3">
        <Link href="/courses" className="hover:text-ink">Learning Paths</Link>
        <span aria-hidden> / </span>
        <Link href={`/courses?category=${course.category}`} className="hover:text-ink">{categoryLabel(course.category)}</Link>
      </nav>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Card padding="lg">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Tag tone="accent">{categoryLabel(course.category)}</Tag>
              <DifficultyTag difficulty={course.difficulty} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{course.title}</h1>
            <p className="mt-3 leading-relaxed text-ink-2">{course.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-[13px] text-ink-2">
              <span>Taught by <span className="font-medium text-ink">{course.teacherName}</span></span>
              {course.durationMinutes > 0 && (
                <span className="flex items-center gap-1.5"><Clock aria-hidden className="h-3.5 w-3.5" />{formatDuration(course.durationMinutes)}</span>
              )}
              <span className="flex items-center gap-1.5"><Layers aria-hidden className="h-3.5 w-3.5" />{plural(course.moduleCount, "module")}</span>
              {course.learnerCount > 0 && (
                <span className="flex items-center gap-1.5"><Users aria-hidden className="h-3.5 w-3.5" />{plural(course.learnerCount, "learner")}</span>
              )}
            </div>
          </Card>

          {course.outcomes.length > 0 && (
            <Section title="What you'll be able to do" icon={CheckCircle2} tone="success">
              <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {course.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2.5 text-sm text-ink-2">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Course content" icon={BookOpen} action={<span className="text-[13px] text-ink-3">{plural(course.lessonCount, "lesson")}</span>}>
            <div className="space-y-2.5">
              {course.modules.map((module, index) => (
                <details key={module.id} open={index === 0 || course.moduleCount <= 3} className="group overflow-hidden rounded-xl border bg-canvas">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                    <span>{module.title}</span>
                    <span className="flex shrink-0 items-center gap-2 font-normal text-ink-3">
                      {plural(module.lessons.length, "lesson")}
                      <ChevronDown aria-hidden className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </span>
                  </summary>
                  <ul className="border-t">
                    {module.lessons.map((lesson) => {
                      const isDone = completed.has(lesson.id);
                      const Icon = isDone ? Check : lesson.type === "video" ? PlayCircle : FileText;
                      const row = (
                        <>
                          <Icon aria-hidden className={`h-4 w-4 shrink-0 ${isDone ? "text-success" : "text-ink-3"}`} />
                          <span className={`min-w-0 flex-1 ${isDone ? "text-ink-3" : "text-ink-2"}`}>
                            {lesson.title}
                            {isDone && <span className="sr-only"> (completed)</span>}
                          </span>
                          {lesson.duration > 0 && <span className="text-[13px] tabular-nums text-ink-3">{lesson.duration} min</span>}
                        </>
                      );
                      return (
                        <li key={lesson.id}>
                          {canOpenLessons ? (
                            <Link href={lessonHref(lesson.id)} className="flex min-h-11 items-center gap-3 px-4 py-2 text-sm hover:bg-sunken">{row}</Link>
                          ) : (
                            <div className="flex min-h-11 items-center gap-3 px-4 py-2 text-sm">{row}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
            </div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            {course.isOwner && !course.enrollment ? (
              <>
                <p className="text-sm text-ink-2">You teach this course.</p>
                <ButtonLink href={`/teacher/courses/${courseId}`} variant="secondary" className="mt-3 w-full">Edit course</ButtonLink>
              </>
            ) : progress ? (
              progress.completedAt ? (
                <>
                  <Tag tone="success">Completed</Tag>
                  <p className="mt-2 text-sm text-ink-2">You finished every lesson. Revisit any of them whenever you like.</p>
                </>
              ) : (
                <>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-ink-2">Your progress</span>
                    <span className="font-semibold tabular-nums text-accent-ink">{progress.percent}%</span>
                  </div>
                  <ProgressBar percent={progress.percent} label="Course progress" />
                  <p className="mt-2 text-[13px] text-ink-3">{progress.completedCount} of {plural(course.lessonCount, "lesson")} complete</p>
                  {nextId && (
                    <ButtonLink href={lessonHref(progress.lastLessonId ?? nextId)} className="mt-4 w-full">Continue learning</ButtonLink>
                  )}
                </>
              )
            ) : isSignedIn ? (
              <>
                <Button className="w-full" onClick={start} disabled={enroll.isPending || !nextId}>
                  {enroll.isPending ? "Enrolling…" : "Start learning"}
                </Button>
                <p className="mt-3 text-[13px] text-ink-3">Free. Your progress is saved as you go.</p>
                {enroll.error && <div className="mt-3"><ErrorState error={enroll.error} /></div>}
              </>
            ) : (
              <>
                <ButtonLink href={`/login?redirect_url=/courses/${courseId}`} className="w-full">Log in to start</ButtonLink>
                <p className="mt-3 text-[13px] text-ink-3">Free. Your progress is saved as you go.</p>
              </>
            )}
            <ul className="mt-4 space-y-2 border-t pt-4 text-[13px] text-ink-2">
              <li className="flex items-center gap-2"><Layers aria-hidden className="h-3.5 w-3.5 text-ink-3" />{plural(course.moduleCount, "structured module")}</li>
              <li className="flex items-center gap-2"><FileText aria-hidden className="h-3.5 w-3.5 text-ink-3" />Notes saved with each lesson</li>
              <li className="flex items-center gap-2"><CheckCircle2 aria-hidden className="h-3.5 w-3.5 text-ink-3" />Progress and XP tracked</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
