"use client";

import { ArrowLeft, ArrowRight, Flag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, ErrorState, LoadingBlock } from "@/components/ui/misc";
import { formatClock, secondsRemaining } from "@/domain/grading";
import { useQuiz, useSubmitAttempt } from "@/hooks/useLearning";
import { cn, plural } from "@/lib/utils";
import type { QuizForAttempt } from "@/types/domain";

interface SavedAttempt {
  startedAt: number;
  answers: Record<string, number>;
  flagged: string[];
  current: number;
}

/** Keeps an attempt safe across an accidental refresh. Storage can be unavailable. */
const store = {
  key: (quizId: string) => `celora.attempt.${quizId}`,
  read(quizId: string): SavedAttempt | null {
    try {
      const raw = sessionStorage.getItem(this.key(quizId));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  write(quizId: string, value: SavedAttempt) {
    try {
      sessionStorage.setItem(this.key(quizId), JSON.stringify(value));
    } catch {
      /* The attempt still works; it just won't survive a refresh. */
    }
  },
  clear(quizId: string) {
    try {
      sessionStorage.removeItem(this.key(quizId));
    } catch {
      /* Nothing to clear. */
    }
  },
};

function Attempt({ quiz }: { quiz: QuizForAttempt }) {
  const router = useRouter();
  const submit = useSubmitAttempt(quiz.id);
  const [state, setState] = useState<SavedAttempt>(
    () => store.read(quiz.id) ?? { startedAt: Date.now(), answers: {}, flagged: [], current: 0 }
  );
  const [now, setNow] = useState(() => Date.now());
  const [dialog, setDialog] = useState<"submit" | "exit" | null>(null);
  const submitted = useRef(false);

  const deadline = state.startedAt + quiz.timeLimitMinutes * 60_000;
  const remaining = secondsRemaining(deadline, now);
  const question = quiz.questions[state.current];
  const answeredCount = Object.keys(state.answers).length;
  const unanswered = quiz.questions.length - answeredCount;
  const isLast = state.current === quiz.questions.length - 1;

  useEffect(() => store.write(quiz.id, state), [quiz.id, state]);

  const send = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    setDialog(null);
    submit.mutate(
      {
        answers: quiz.questions.map((q) => ({ questionId: q.id, selectedIndex: state.answers[q.id] ?? null })),
        durationSeconds: Math.min(
          quiz.timeLimitMinutes * 60,
          Math.round((Date.now() - state.startedAt) / 1000)
        ),
      },
      {
        onSuccess: (attempt) => {
          store.clear(quiz.id);
          router.replace(`/quiz/${quiz.id}/results/${attempt.id}`);
        },
        onError: () => {
          submitted.current = false;
        },
      }
    );
  }, [quiz, state, submit, router]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remaining === 0) send();
  }, [remaining, send]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const toggleFlag = () =>
    setState((s) => ({
      ...s,
      flagged: s.flagged.includes(question.id)
        ? s.flagged.filter((id) => id !== question.id)
        : [...s.flagged, question.id],
    }));

  const lowTime = remaining <= 60;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-surface">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <button onClick={() => setDialog("exit")} aria-label="Exit quiz" className="-ml-2 rounded p-2 text-ink-2 hover:bg-sunken">
            <X aria-hidden className="h-5 w-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm font-medium">{quiz.title}</p>
          <p role="timer" aria-label="Time remaining" className={cn("font-mono text-sm tabular-nums", lowTime && "font-semibold text-danger")}>
            {formatClock(remaining)}
          </p>
          {/* Announced once rather than every second, which would be unusable with a screen reader. */}
          <span role="status" className="sr-only">{remaining === 60 ? "One minute remaining" : ""}</span>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {submit.error && (
          <div className="mb-6">
            <ErrorState error={submit.error} onRetry={send} />
          </div>
        )}

        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-sm text-ink-3">
            Question {state.current + 1} of {quiz.questions.length} · {question.topic}
          </p>
          <button
            onClick={toggleFlag}
            aria-pressed={state.flagged.includes(question.id)}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded px-2 text-sm hover:bg-sunken",
              state.flagged.includes(question.id) ? "font-medium text-warn" : "text-ink-3"
            )}
          >
            <Flag aria-hidden className="h-4 w-4" />
            {state.flagged.includes(question.id) ? "Flagged" : "Flag for review"}
          </button>
        </div>

        <fieldset key={question.id}>
          <legend className="text-2xl font-semibold leading-snug">{question.prompt}</legend>
          <div className="mt-6 space-y-2">
            {question.options.map((option, index) => {
              const selected = state.answers[question.id] === index;
              return (
                <label
                  key={index}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center gap-3 rounded-card border bg-surface shadow-card px-4 py-3",
                    selected ? "border-accent bg-accent-soft" : "hover:border-line-strong"
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={selected}
                    onChange={() => setState((s) => ({ ...s, answers: { ...s.answers, [question.id]: index } }))}
                    className="accent-[var(--accent)]"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <nav aria-label="Questions" className="mt-10">
          <p className="mb-2 text-sm text-ink-3">
            {answeredCount} answered · {state.flagged.length} flagged
          </p>
          <ol className="flex flex-wrap gap-1.5">
            {quiz.questions.map((q, index) => {
              const answered = state.answers[q.id] !== undefined;
              const flagged = state.flagged.includes(q.id);
              return (
                <li key={q.id}>
                  <button
                    onClick={() => setState((s) => ({ ...s, current: index }))}
                    aria-current={index === state.current ? "step" : undefined}
                    aria-label={`Question ${index + 1}${answered ? ", answered" : ", not answered"}${flagged ? ", flagged" : ""}`}
                    className={cn(
                      "relative h-10 w-10 rounded border text-sm tabular-nums",
                      answered ? "border-transparent bg-accent-soft" : "bg-surface",
                      index === state.current && "border-accent font-semibold"
                    )}
                  >
                    {index + 1}
                    {flagged && <Flag aria-hidden className="absolute -right-1 -top-1 h-3 w-3 fill-current text-warn" />}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </main>

      <footer className="sticky bottom-0 border-t bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5">
          <Button
            variant="ghost"
            disabled={state.current === 0}
            onClick={() => setState((s) => ({ ...s, current: s.current - 1 }))}
          >
            <ArrowLeft aria-hidden className="h-4 w-4" /> Previous
          </Button>
          {isLast ? (
            <Button onClick={() => setDialog("submit")} disabled={submit.isPending}>
              {submit.isPending ? "Submitting…" : "Finish quiz"}
            </Button>
          ) : (
            <Button onClick={() => setState((s) => ({ ...s, current: s.current + 1 }))}>
              Next <ArrowRight aria-hidden className="h-4 w-4" />
            </Button>
          )}
        </div>
      </footer>

      <ConfirmDialog
        open={dialog === "submit"}
        title="Submit your answers?"
        description={
          unanswered > 0
            ? `You have ${plural(unanswered, "unanswered question")}. They'll count as incorrect.`
            : "You've answered every question."
        }
        confirmLabel="Submit"
        cancelLabel="Keep working"
        onConfirm={send}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "exit"}
        title="Leave this quiz?"
        description="Your answers won't be saved or scored."
        confirmLabel="Leave quiz"
        cancelLabel="Stay"
        destructive
        onConfirm={() => {
          store.clear(quiz.id);
          router.push(`/quiz/${quiz.id}`);
        }}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
}

export default function TakeQuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const { data: quiz, error, isPending, refetch } = useQuiz(quizId);

  if (isPending) return <div className="p-6"><LoadingBlock label="Loading quiz" /></div>;
  if (error) return <div className="p-6"><ErrorState error={error} onRetry={refetch} /></div>;
  if (quiz.questions.length === 0) return <div className="p-6"><ErrorState error={new Error("This quiz has no questions yet.")} /></div>;
  return <Attempt quiz={quiz} />;
}
