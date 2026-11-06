"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ErrorState, LoadingBlock } from "@/components/ui/misc";
import { useMe } from "@/hooks/useAccount";
import { api } from "@/services/api";

/** The API enforces teacher access; learner accounts are offered the switch here. */
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const { data: me, error, isPending, refetch } = useMe();
  const become = useMutation({
    mutationFn: () => api.setRole("teacher"),
    onSuccess: (user) => client.setQueryData(["me"], user),
  });

  if (isPending) return <LoadingBlock label="Checking access" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (me.role === "teacher") return <>{children}</>;

  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="rounded-card border bg-surface p-6 shadow-card sm:p-8">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
          <GraduationCap aria-hidden className="h-5 w-5" />
        </span>
        <h1 className="text-xl font-semibold text-ink">This is a learner account</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Turn on teaching to create courses and quizzes. Your learning progress, notes and XP stay exactly as they are, and you can switch between learning and teaching at any time.
        </p>
        {become.error && <div className="mt-4"><ErrorState error={become.error} /></div>}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => become.mutate()} disabled={become.isPending}>
            {become.isPending ? "Turning on…" : "Start teaching"}
          </Button>
          <ButtonLink href="/dashboard" variant="ghost">Back to learning</ButtonLink>
        </div>
      </div>
    </div>
  );
}
