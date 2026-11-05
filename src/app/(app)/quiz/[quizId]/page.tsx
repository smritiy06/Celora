"use client";

import Link from "next/link";
import { use } from "react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/misc";
import { categoryLabel } from "@/constants/catalog";
import { useQuiz } from "@/hooks/useLearning";
import { plural } from "@/lib/utils";

export default function QuizIntroPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const { data: quiz, error, isPending, refetch } = useQuiz(quizId);

  if (isPending) return <LoadingBlock label="Loading quiz" rows={2} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-2xl">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-3">
        <Link href="/quiz" className="hover:underline">Quizzes</Link>
        <span aria-hidden> / </span>
        {categoryLabel(quiz.category)}
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{quiz.title}</h1>
      {quiz.description && <p className="mt-3 text-lg text-ink-2">{quiz.description}</p>}
      <p className="mt-2 text-sm text-ink-3">By {quiz.teacherName}</p>

      {quiz.questionCount === 0 ? (
        <div className="mt-8">
          <EmptyState title="This quiz has no questions yet" />
        </div>
      ) : (
        <>
          <dl className="mt-8 grid grid-cols-3 divide-x rounded-card border bg-surface shadow-card text-center">
            <div className="p-4">
              <dt className="text-sm text-ink-3">Questions</dt>
              <dd className="text-2xl tabular-nums">{quiz.questionCount}</dd>
            </div>
            <div className="p-4">
              <dt className="text-sm text-ink-3">Time limit</dt>
              <dd className="text-2xl tabular-nums">{quiz.timeLimitMinutes} min</dd>
            </div>
            <div className="p-4">
              <dt className="text-sm text-ink-3">Your best</dt>
              <dd className="text-2xl tabular-nums">{quiz.bestScore !== null ? `${quiz.bestScore}%` : "None"}</dd>
            </div>
          </dl>
          <ul className="mt-6 list-disc space-y-1.5 pl-5 text-sm text-ink-2">
            <li>The timer starts when you begin and can&apos;t be paused. When it ends, your answers are submitted.</li>
            <li>You can move between questions and flag any you want to come back to.</li>
            <li>You&apos;ll see {plural(quiz.questionCount, "explanation")} when you finish. Retakes earn XP only if you beat your best.</li>
          </ul>
          <ButtonLink href={`/quiz/${quizId}/take`} size="lg" className="mt-8 w-full sm:w-auto">
            Start quiz
          </ButtonLink>
        </>
      )}
    </div>
  );
}
