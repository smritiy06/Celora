"use client";

import Link from "next/link";
import { use } from "react";
import { Section, Stat } from "@/components/shared/learning";
import { EmptyState, ErrorState, LoadingBlock, PageHeader, ProgressBar, Tag } from "@/components/ui/misc";
import { useCourseInsights } from "@/hooks/useTeaching";
import { formatDate } from "@/lib/utils";

export default function LearnersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, isPending, refetch } = useCourseInsights(id);

  if (isPending) return <LoadingBlock label="Loading learners" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const count = data.learners.length;

  return (
    <div className="space-y-10">
      <div>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-3">
          <Link href={`/teacher/courses/${id}`} className="hover:underline">{data.course.title}</Link>
          <span aria-hidden> / </span>Learners
        </nav>
        <PageHeader title="Learners" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Enrolled" value={count} />
          <Stat label="Average progress" value={`${data.averageProgress}%`} />
          <Stat label="Completed" value={`${data.completionRate}%`} />
        </div>
      </div>

      {count === 0 ? (
        <EmptyState title="No one has enrolled yet" description="Learners and their progress will appear here once they start the course." />
      ) : (
        <>
          <Section title="Where learners stop">
            <p className="-mt-2 mb-4 text-sm text-ink-3">How many learners finished each lesson. A sudden drop is worth a look.</p>
            <ol className="space-y-3">
              {data.lessonFunnel.map((lesson, index) => (
                <li key={lesson.lessonId}>
                  <div className="mb-1 flex justify-between gap-4 text-sm">
                    <span className="min-w-0 truncate">{index + 1}. {lesson.title}</span>
                    <span className="shrink-0 tabular-nums text-ink-2">{lesson.completed} of {count}</span>
                  </div>
                  <ProgressBar percent={Math.round((lesson.completed / count) * 100)} label={`${lesson.title} completion`} />
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Everyone enrolled">
            <div className="overflow-x-auto rounded-card border bg-surface shadow-card">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b text-ink-3">
                    <th scope="col" className="p-3 font-medium">Learner</th>
                    <th scope="col" className="p-3 font-medium">Progress</th>
                    <th scope="col" className="p-3 font-medium">Last active</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.learners.map((learner) => (
                    <tr key={learner.userId}>
                      <td className="p-3">{learner.name}</td>
                      <td className="p-3 tabular-nums">
                        {learner.completedAt ? <Tag tone="success">Completed</Tag> : `${learner.percent}%`}
                      </td>
                      <td className="p-3 text-ink-2">{formatDate(learner.lastActivityAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
