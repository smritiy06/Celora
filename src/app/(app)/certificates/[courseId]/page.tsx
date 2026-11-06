"use client";

import { ArrowLeft, Award, Printer } from "lucide-react";
import { use } from "react";
import { Wordmark } from "@/components/layout/Public";
import { Button, ButtonLink } from "@/components/ui/button";
import { ErrorState, LoadingBlock } from "@/components/ui/misc";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, plural } from "@/lib/utils";
import { api } from "@/services/api";

export default function CertificatePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { data, error, isPending, refetch } = useQuery({
    queryKey: ["certificate", courseId],
    queryFn: () => api.certificate(courseId),
  });

  const completed = data
    ? new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(new Date(data.completedAt))
    : "";

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6">
      <div className="no-print mb-6 flex items-center justify-between gap-3">
        <ButtonLink href={`/courses/${courseId}`} variant="ghost" size="sm">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Back to course
        </ButtonLink>
        {data && (
          <Button size="sm" onClick={() => window.print()}>
            <Printer aria-hidden className="h-4 w-4" /> Print or save as PDF
          </Button>
        )}
      </div>

      <main id="main" className="flex flex-1 items-center">
        {isPending ? (
          <div className="w-full"><LoadingBlock label="Loading certificate" rows={2} /></div>
        ) : error ? (
          <div className="w-full"><ErrorState error={error} onRetry={refetch} /></div>
        ) : (
          <article className="certificate dot-panel w-full rounded-card border p-3 shadow-card sm:p-5">
            <div className="rounded-[0.625rem] border border-line-strong bg-surface px-6 py-10 text-center sm:px-14 sm:py-16">
              <div className="flex justify-center"><Wordmark href="/dashboard" /></div>
              <p className="mt-10 text-[13px] font-medium uppercase tracking-[0.18em] text-accent-ink">Certificate of completion</p>
              <p className="mt-6 text-sm text-ink-2">This certifies that</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">{data.learnerName}</h1>
              <p className="mt-6 text-sm text-ink-2">has completed every lesson of</p>
              <h2 className="mx-auto mt-2 max-w-2xl text-xl font-semibold text-ink sm:text-2xl">{data.courseTitle}</h2>
              <p className="mt-3 text-sm text-ink-3">
                {plural(data.lessonCount, "lesson")}
                {data.durationMinutes > 0 && ` · ${formatDuration(data.durationMinutes)} of material`}
              </p>

              <div className="mx-auto mt-12 grid max-w-2xl gap-6 border-t pt-6 text-left sm:grid-cols-3">
                <div>
                  <p className="text-[12px] text-ink-3">Taught by</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{data.teacherName}</p>
                </div>
                <div className="sm:text-center">
                  <Award aria-hidden className="mx-0 h-8 w-8 text-accent-ink sm:mx-auto" />
                </div>
                <div className="sm:text-right">
                  <p className="text-[12px] text-ink-3">Completed</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{completed}</p>
                </div>
              </div>
              <p className="mt-8 font-mono text-[11px] tracking-wider text-ink-3">Certificate ID {data.id}</p>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
