"use client";

import { ArrowRight, BookOpen, CheckCircle2, Circle, Flame, Lightbulb, Medal, Sparkles, StickyNote, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { CourseCard, IconTile, Section, SectionLink, StreakCalendar, TopicList, categoryIcon } from "@/components/shared/learning";
import { ButtonLink } from "@/components/ui/button";
import { Card, ErrorState, LoadingBlock, ProgressBar } from "@/components/ui/misc";
import { goalLabel } from "@/constants/catalog";
import { levelFromXp, visibleStreak } from "@/domain/gamification";
import { useDashboard } from "@/hooks/useLearning";
import { formatDate, plural } from "@/lib/utils";
import type { DashboardData } from "@/types/domain";

const QUICK_ACTIONS = [
  { label: "Browse courses", icon: BookOpen, href: "/courses", tone: "accent" as const },
  { label: "Start a quiz", icon: Trophy, href: "/quiz", tone: "warn" as const },
  { label: "View notes", icon: StickyNote, href: "/notes", tone: "info" as const },
  { label: "My goals", icon: Target, href: "/roadmaps", tone: "success" as const },
];

const resumeHref = (course: DashboardData["inProgress"][number]) =>
  course.progress?.lastLessonId ? `/courses/${course.id}/lessons/${course.progress.lastLessonId}` : `/courses/${course.id}`;

function dailyTasks(data: DashboardData) {
  const lessons = data.todayActivity?.lessons ?? 0;
  const quizzes = data.todayActivity?.quizzes ?? 0;
  const course = data.inProgress[0];
  return [
    {
      text: course ? `Continue ${course.title}` : "Start your first course",
      href: course ? resumeHref(course) : "/courses",
      done: lessons > 0,
    },
    {
      text: data.dailyQuiz ? `Take today's quiz: ${data.dailyQuiz.title}` : "Take a quiz",
      href: data.dailyQuiz ? `/quiz/${data.dailyQuiz.id}` : "/quiz",
      done: quizzes > 0,
    },
  ];
}

/** Observations worked out from the learner's own results, never invented. */
function insights(data: DashboardData) {
  const list: { tone: "success" | "danger" | "accent"; text: string }[] = [];
  const strongest = data.recentAttempts.slice().sort((a, b) => b.scorePercent - a.scorePercent)[0];
  if (strongest && strongest.scorePercent >= 80) {
    list.push({ tone: "success", text: `Strong result: ${strongest.scorePercent}% on ${strongest.quizTitle}.` });
  }
  const weak = data.weakTopics[0];
  if (weak) list.push({ tone: "danger", text: `${weak.topic} needs another look: ${weak.percent}% so far.` });
  const course = data.inProgress[0];
  if (course?.progress) {
    const left = course.lessonCount - course.progress.completedCount;
    list.push({ tone: "accent", text: `${plural(left, "lesson")} left in ${course.title}.` });
  }
  return list;
}

const DOT = { success: "bg-success", danger: "bg-danger", accent: "bg-accent" };

export default function DashboardPage() {
  const { data, error, isPending, refetch } = useDashboard();

  if (isPending) return <LoadingBlock label="Loading your dashboard" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const firstName = data.user.name.split(" ")[0];
  const goal = goalLabel(data.user.preferences.goal);
  const streak = visibleStreak(data.user.streak, data.today);
  const { level, next, percentToNext } = levelFromXp(data.user.xp);
  const tasks = dailyTasks(data);
  const notes = insights(data);

  return (
    <div className="space-y-5">
      <section className="dot-panel relative overflow-hidden rounded-card border p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Welcome back, {firstName}</h1>
            <p className="mt-1 text-ink-2">
              {streak > 0 ? `You're on a ${plural(streak, "day")} streak. Keep it going.` : "Finish one lesson or quiz today to start a streak."}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 text-warn"><Flame aria-hidden className="h-4 w-4" />{plural(streak, "day")} streak</span>
              <span className="flex items-center gap-1.5 text-accent-ink"><Zap aria-hidden className="h-4 w-4" />{data.user.xp.toLocaleString()} XP</span>
              <span className="flex items-center gap-1.5 text-info"><Medal aria-hidden className="h-4 w-4" />{data.user.xp > 0 ? `Rank #${data.rank}` : "Unranked"}</span>
              {goal && <span className="flex items-center gap-1.5 text-ink-2"><Target aria-hidden className="h-4 w-4" />{goal}</span>}
            </div>
          </div>
          <div className="w-full rounded-xl border bg-surface p-4 shadow-card lg:w-72">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-semibold text-ink">Level {level}</span>
              <span className="text-[13px] tabular-nums text-ink-3">
                {next ? `${(next.xpRequired - data.user.xp).toLocaleString()} XP to go` : "Top level"}
              </span>
            </div>
            <ProgressBar percent={percentToNext} label="Progress to next level" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.label} href={action.href} className="rounded-card">
            <Card interactive padding="sm" className="flex items-center gap-3">
              <IconTile icon={action.icon} tone={action.tone} size="sm" />
              <span className="min-w-0 text-[13px] font-medium text-ink">{action.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="Continue learning" icon={BookOpen} action={<SectionLink href="/courses">View all</SectionLink>}>
            {data.inProgress.length > 0 ? (
              <ul className="space-y-2.5">
                {data.inProgress.slice(0, 3).map((course) => (
                  <li key={course.id}>
                    <Link href={resumeHref(course)} className="flex items-center gap-4 rounded-xl border bg-canvas p-3 transition-colors hover:border-line-strong">
                      <IconTile icon={categoryIcon(course.category)} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{course.title}</p>
                        <p className="mb-1.5 text-[13px] text-ink-3">
                          {course.progress?.completedCount ?? 0} of {plural(course.lessonCount, "lesson")}
                        </p>
                        <ProgressBar percent={course.progress?.percent ?? 0} label={`${course.title} progress`} />
                      </div>
                      <span className="shrink-0 text-[13px] font-medium tabular-nums text-accent-ink">{course.progress?.percent ?? 0}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border bg-canvas p-6 text-center">
                <p className="text-sm font-medium text-ink">You haven&apos;t started a course yet</p>
                <p className="mt-1 text-[13px] text-ink-2">Enroll in one and your next lesson will always be here.</p>
                <ButtonLink href="/courses" size="sm" className="mt-4">Browse courses</ButtonLink>
              </div>
            )}
          </Section>

          <Section
            title="Daily tasks"
            icon={Target}
            tone="warn"
            action={<span className="text-[13px] tabular-nums text-ink-3">{tasks.filter((t) => t.done).length} of {tasks.length} done</span>}
          >
            <ul className="space-y-0.5">
              {tasks.map((task) => (
                <li key={task.text}>
                  <Link href={task.href} className="flex min-h-10 items-center gap-3 rounded-lg px-2 hover:bg-sunken">
                    {task.done ? (
                      <CheckCircle2 aria-hidden className="h-[18px] w-[18px] shrink-0 text-success" />
                    ) : (
                      <Circle aria-hidden className="h-[18px] w-[18px] shrink-0 text-ink-3" />
                    )}
                    <span className={task.done ? "min-w-0 truncate text-sm text-ink-3 line-through" : "min-w-0 truncate text-sm text-ink"}>
                      {task.text}
                      {task.done && <span className="sr-only"> (done)</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Recommended for you" icon={Sparkles} action={<SectionLink href="/courses">All courses</SectionLink>}>
            {data.recommended.length > 0 ? (
              <>
                <p className="-mt-2 mb-4 text-[13px] text-ink-3">Based on the interests and level you chose.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {data.recommended.slice(0, 2).map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-2">New courses will appear here as teachers publish them.</p>
            )}
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Insights" icon={Lightbulb}>
            {notes.length > 0 ? (
              <ul className="space-y-2.5">
                {notes.map((note) => (
                  <li key={note.text} className="flex items-start gap-2.5 text-[13px] text-ink-2">
                    <span aria-hidden className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[note.tone]}`} />
                    {note.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-2">Insights appear here once you&apos;ve started a course or taken a quiz.</p>
            )}
          </Section>

          <Section title="Streak" icon={Flame} tone="warn" action={<span className="text-[13px] font-medium tabular-nums text-warn">{plural(streak, "day")}</span>}>
            <StreakCalendar days={data.activity} today={data.today} />
          </Section>

          {data.dailyQuiz && (
            <Section title="Daily challenge" icon={Zap} tone="warn">
              <p className="text-sm font-medium text-ink">{data.dailyQuiz.title}</p>
              <p className="mb-3 mt-0.5 text-[13px] text-ink-3">
                {plural(data.dailyQuiz.questionCount, "question")} · {data.dailyQuiz.timeLimitMinutes} min
              </p>
              <ButtonLink href={`/quiz/${data.dailyQuiz.id}`} variant="secondary" size="sm">
                Start <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </ButtonLink>
            </Section>
          )}

          <Section title="Needs review" icon={TrendingUp} tone="danger">
            {data.weakTopics.length > 0 ? (
              <TopicList topics={data.weakTopics} />
            ) : (
              <p className="text-sm text-ink-2">Topics you score under 70% on will appear here after a quiz.</p>
            )}
          </Section>

          <Section title="Recent scores" icon={Trophy} tone="info" action={<SectionLink href="/analytics">All</SectionLink>}>
            {data.recentAttempts.length > 0 ? (
              <ul className="space-y-0.5">
                {data.recentAttempts.map((attempt) => (
                  <li key={attempt.id}>
                    <Link href={`/quiz/${attempt.quizId}/results/${attempt.id}`} className="flex items-center justify-between gap-3 rounded-lg p-2 text-sm hover:bg-sunken">
                      <span className="min-w-0">
                        <span className="block truncate text-ink">{attempt.quizTitle}</span>
                        <span className="text-xs text-ink-3">{formatDate(attempt.submittedAt)}</span>
                      </span>
                      <span className="font-medium tabular-nums text-ink">{attempt.scorePercent}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-2">Your quiz scores will show up here.</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
