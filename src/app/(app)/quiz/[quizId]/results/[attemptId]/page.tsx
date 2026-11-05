"use client";

import { CheckCircle2, Circle, XCircle } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { Section, TopicList } from "@/components/shared/learning";
import { ButtonLink } from "@/components/ui/button";
import { ErrorState, LoadingBlock } from "@/components/ui/misc";
import { categoryLabel } from "@/constants/catalog";
import { weakTopics } from "@/domain/gamification";
import { formatClock } from "@/domain/grading";
import { useAttempt } from "@/hooks/useLearning";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/types/domain";

function ReviewCard({ item, number }: { item: ReviewItem; number: number }) {
  const status = item.selectedIndex === null ? "Not answered" : item.isCorrect ? "Correct" : "Incorrect";
  const StatusIcon = item.selectedIndex === null ? Circle : item.isCorrect ? CheckCircle2 : XCircle;

  return (
    <li className="rounded-card border bg-surface shadow-card p-5">
      <p className={cn("mb-2 flex items-center gap-1.5 text-sm font-medium", item.isCorrect ? "text-success" : item.selectedIndex === null ? "text-ink-2" : "text-danger")}>
        <StatusIcon aria-hidden className="h-4 w-4" />
        {status}
        <span className="font-normal text-ink-3">· Question {number} · {item.topic}</span>
      </p>
      <p className="font-medium">{item.prompt}</p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {item.options.map((option, index) => {
          const isAnswer = index === item.correctIndex;
          const isChoice = index === item.selectedIndex;
          return (
            <li
              key={index}
              className={cn(
                "flex flex-wrap justify-between gap-x-3 rounded border px-3 py-2",
                isAnswer ? "border-success bg-success-soft" : isChoice ? "border-danger bg-danger-soft" : "border-transparent"
              )}
            >
              <span>{option}</span>
              {(isAnswer || isChoice) && (
                <span className="text-xs text-ink-2">
                  {isAnswer && isChoice ? "Your answer, correct" : isAnswer ? "Correct answer" : "Your answer"}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {item.explanation && <p className="mt-3 border-t pt-3 text-sm text-ink-2">{item.explanation}</p>}
    </li>
  );
}

export default function QuizResultsPage({ params }: { params: Promise<{ quizId: string; attemptId: string }> }) {
  const { quizId, attemptId } = use(params);
  const { data: attempt, error, isPending, refetch } = useAttempt(attemptId);
  const [filter, setFilter] = useState<"all" | "missed">("all");

  if (isPending) return <LoadingBlock label="Loading your results" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const weak = weakTopics(attempt.topics);
  const missed = attempt.review.filter((r) => !r.isCorrect);
  const items = filter === "missed" ? missed : attempt.review;
  const numberOf = (item: ReviewItem) => attempt.review.indexOf(item) + 1;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-3">
          <Link href="/quiz" className="hover:underline">Quizzes</Link>
          <span aria-hidden> / </span>
          <Link href={`/quiz/${quizId}`} className="hover:underline">{attempt.quizTitle}</Link>
        </nav>
        <h1 className="text-5xl font-semibold tabular-nums tracking-tight">{attempt.scorePercent}%</h1>
        <p className="mt-2 text-lg text-ink-2">
          {attempt.correct} of {attempt.total} correct on {attempt.quizTitle}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-y py-4 sm:grid-cols-5">
          {[
            ["Correct", attempt.correct],
            ["Incorrect", attempt.incorrect],
            ["Unanswered", attempt.unanswered],
            ["Time", formatClock(attempt.durationSeconds)],
            ["XP earned", `+${attempt.xpEarned}`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-ink-3">{label}</dt>
              <dd className="text-2xl tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        {attempt.xpEarned === 0 && attempt.correct > 0 && (
          <p className="mt-3 text-sm text-ink-3">Retakes earn XP when you beat your previous best.</p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href={`/quiz/${quizId}/take`}>Retake quiz</ButtonLink>
          <ButtonLink href={`/courses?category=${attempt.category}`} variant="secondary">
            {categoryLabel(attempt.category)} courses
          </ButtonLink>
        </div>
      </header>

      <Section title="By topic">
        <TopicList topics={attempt.topics} />
        {weak.length > 0 && (
          <p className="mt-4 text-sm text-ink-2">
            Spend some time on {weak.map((t) => t.topic).join(", ")} before retaking. Those are where you lost the most marks.
          </p>
        )}
      </Section>

      <Section
        title="Review your answers"
        action={
          missed.length > 0 && missed.length < attempt.review.length ? (
            <div role="group" aria-label="Show questions" className="flex gap-1 text-sm">
              {(["all", "missed"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={cn("min-h-9 rounded px-2.5", filter === value ? "bg-sunken font-medium" : "text-ink-3 hover:text-ink")}
                >
                  {value === "all" ? `All (${attempt.review.length})` : `Missed (${missed.length})`}
                </button>
              ))}
            </div>
          ) : undefined
        }
      >
        <ol className="space-y-3">
          {items.map((item) => (
            <ReviewCard key={item.questionId} item={item} number={numberOf(item)} />
          ))}
        </ol>
      </Section>
    </div>
  );
}
