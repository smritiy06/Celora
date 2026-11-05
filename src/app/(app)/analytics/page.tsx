"use client";

import { BarChart3, Brain, Clock, Flame, GraduationCap, History, Target } from "lucide-react";
import Link from "next/link";
import { ActivityHeatmap, CourseCard, Section, Stat, TopicList } from "@/components/shared/learning";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingBlock, PageHeader } from "@/components/ui/misc";
import { dateKey, visibleStreak } from "@/domain/gamification";
import { useProgress } from "@/hooks/useLearning";
import { formatDate, formatDuration, plural } from "@/lib/utils";
import type { ActivityDay } from "@/types/domain";

function WeeklyBars({ days, today }: { days: ActivityDay[]; today: string }) {
  const byDate = new Map(days.map((d) => [d.date, d.minutes]));
  const end = new Date(`${today}T00:00:00Z`);
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - (6 - i));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: new Intl.DateTimeFormat(undefined, { weekday: "short", timeZone: "UTC" }).format(date),
      minutes: byDate.get(key) ?? 0,
    };
  });
  const max = Math.max(1, ...week.map((d) => d.minutes));

  return (
    <table className="w-full table-fixed">
      <caption className="sr-only">Minutes of learning on each of the last 7 days</caption>
      <tbody>
        <tr className="h-40 align-bottom">
          {week.map((day) => (
            <td key={day.key} className="px-1 align-bottom">
              <div className="flex h-40 flex-col items-center justify-end gap-1">
                <span className="text-xs tabular-nums text-ink-3">{day.minutes > 0 ? `${day.minutes}m` : ""}</span>
                <div className="w-full max-w-10 rounded-t-md bg-accent/70" style={{ height: day.minutes > 0 ? `${Math.max(4, (day.minutes / max) * 80)}%` : 2 }} />
              </div>
            </td>
          ))}
        </tr>
        <tr>
          {week.map((day) => (
            <th key={day.key} scope="col" className="pt-2 text-xs font-normal text-ink-3">{day.label}</th>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default function AnalyticsPage() {
  const { data, error, isPending, refetch } = useProgress();

  if (isPending) return <LoadingBlock label="Loading your analytics" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const today = dateKey(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone);
  const hasActivity = data.activity.length > 0 || data.attempts.length > 0;

  return (
    <div className="space-y-5">
      <PageHeader title="Analytics" description="Track your learning progress and performance." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Learning time" value={formatDuration(data.totalMinutes)} hint="Last 12 weeks" icon={Clock} />
        <Stat label="Average quiz score" value={data.averageScore !== null ? `${data.averageScore}%` : "None yet"} icon={Target} tone="warn" />
        <Stat label="Current streak" value={plural(visibleStreak(data.user.streak, today), "day")} hint={`Longest: ${plural(data.user.streak.longest, "day")}`} icon={Flame} tone="danger" />
        <Stat label="Courses completed" value={data.coursesCompleted.length} hint={`${data.coursesInProgress.length} in progress`} icon={GraduationCap} tone="success" />
      </div>

      {!hasActivity ? (
        <EmptyState
          icon={<BarChart3 aria-hidden className="h-5 w-5" />}
          title="Nothing to show yet"
          description="Finish a lesson or a quiz and your activity and topic scores will start to fill in."
          action={<ButtonLink href="/courses">Find a course</ButtonLink>}
        />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <Section title="Weekly study time" icon={BarChart3}>
              <WeeklyBars days={data.activity} today={today} />
            </Section>
            <Section title="Topic mastery" icon={Brain} tone="info">
              {data.topics.length > 0 ? (
                <>
                  <p className="-mt-2 mb-4 text-[13px] text-ink-3">Weakest first.</p>
                  <TopicList topics={data.topics} />
                </>
              ) : (
                <p className="text-sm text-ink-2">Take a quiz to see how you&apos;re doing in each topic.</p>
              )}
            </Section>
          </div>

          <Section title="Activity heatmap" icon={Flame} tone="warn">
            <ActivityHeatmap days={data.activity} today={today} />
          </Section>

          {data.attempts.length > 0 && (
            <Section title="Quiz history" icon={History} tone="info">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[26rem] text-left text-sm">
                  <thead>
                    <tr className="border-b text-[13px] text-ink-3">
                      <th scope="col" className="pb-2 font-medium">Quiz</th>
                      <th scope="col" className="pb-2 font-medium">Date</th>
                      <th scope="col" className="pb-2 text-right font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.attempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td className="py-2.5"><Link href={`/quiz/${attempt.quizId}/results/${attempt.id}`} className="text-ink hover:underline">{attempt.quizTitle}</Link></td>
                        <td className="py-2.5 text-ink-2">{formatDate(attempt.submittedAt)}</td>
                        <td className="py-2.5 text-right font-medium tabular-nums text-ink">{attempt.scorePercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </>
      )}

      {data.coursesInProgress.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-ink">In progress</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.coursesInProgress.map((c) => (<CourseCard key={c.id} course={c} />))}
          </div>
        </div>
      )}
    </div>
  );
}
