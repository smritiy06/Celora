"use client";

import { ArrowRight, Brain, Clock, Flame, Medal, Target, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DifficultyTag, IconTile, Section, categoryIcon } from "@/components/shared/learning";
import { ButtonLink } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { Card, EmptyState, ErrorState, LoadingBlock, PageHeader, ProgressBar } from "@/components/ui/misc";
import { CATEGORIES, categoryLabel, DIFFICULTIES } from "@/constants/catalog";
import { pickForDay, visibleStreak, dateKey } from "@/domain/gamification";
import { useMe, useSession } from "@/hooks/useAccount";
import { useLeaderboard, useProgress, useQuizzes } from "@/hooks/useLearning";
import { cn, plural } from "@/lib/utils";

function SignedInPanels() {
  const { data: me } = useMe();
  const progress = useProgress();
  const leaderboard = useLeaderboard(true);
  const today = dateKey(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div className="space-y-5">
      <Section title="Your stats" icon={Zap}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-canvas p-3 text-center">
            <p className="text-lg font-semibold tabular-nums text-ink">{(me?.xp ?? 0).toLocaleString()}</p>
            <p className="text-xs text-ink-3">Total XP</p>
          </div>
          <div className="rounded-xl border bg-canvas p-3 text-center">
            <p className="flex items-center justify-center gap-1 text-lg font-semibold tabular-nums text-ink">
              <Flame aria-hidden className="h-4 w-4 text-warn" />
              {me ? visibleStreak(me.streak, today) : 0}
            </p>
            <p className="text-xs text-ink-3">Day streak</p>
          </div>
        </div>
      </Section>

      <Section title="Performance" icon={Brain} tone="info">
        {progress.data?.averageScore != null ? (
          <div className="space-y-3 text-[13px]">
            <div>
              <div className="mb-1.5 flex justify-between">
                <span className="text-ink-2">Average score</span>
                <span className="font-medium tabular-nums text-accent-ink">{progress.data.averageScore}%</span>
              </div>
              <ProgressBar percent={progress.data.averageScore} label="Average quiz score" />
            </div>
            <div className="flex justify-between">
              <span className="text-ink-2">Recent quizzes</span>
              <span className="font-medium tabular-nums text-ink">{progress.data.attempts.length}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-2">Take a quiz to see your performance here.</p>
        )}
      </Section>

      <Section title="Leaderboard" icon={Medal} tone="warn">
        {leaderboard.isPending ? (
          <LoadingBlock label="Loading leaderboard" rows={1} />
        ) : leaderboard.error ? (
          <ErrorState error={leaderboard.error} onRetry={leaderboard.refetch} />
        ) : leaderboard.data.length === 0 ? (
          <p className="text-sm text-ink-2">Earn XP from lessons and quizzes to be the first on the board.</p>
        ) : (
          <ol className="space-y-1">
            {leaderboard.data.map((entry) => (
              <li key={entry.rank} className={cn("flex items-center gap-3 rounded-lg px-2 py-1.5 text-[13px]", entry.isYou && "bg-accent-soft font-medium")}>
                <span className="w-5 tabular-nums text-ink-3">{entry.rank}</span>
                <span className="min-w-0 flex-1 truncate text-ink">{entry.name}{entry.isYou && " (you)"}</span>
                <span className="tabular-nums text-ink-2">{entry.xp.toLocaleString()} XP</span>
              </li>
            ))}
          </ol>
        )}
        {me && !me.showOnLeaderboard && (
          <p className="mt-3 text-xs text-ink-3">
            You&apos;re hidden from this list. Change that in <Link href="/settings" className="underline">Settings</Link>.
          </p>
        )}
      </Section>
    </div>
  );
}

export default function QuizArenaPage() {
  const { isSignedIn } = useSession();
  const { data, error, isPending, refetch } = useQuizzes();
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const quizzes = useMemo(
    () => (data ?? []).filter((q) => (!category || q.category === category) && (!difficulty || q.difficulty === difficulty)),
    [data, category, difficulty]
  );
  const today = dateKey(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone);
  const daily = useMemo(() => pickForDay((data ?? []).slice().sort((a, b) => a.id.localeCompare(b.id)), today), [data, today]);

  return (
    <div>
      <PageHeader title="Quiz Arena" description="Test your knowledge, earn XP, and find the topics worth revisiting." />

      {daily && (
        <section className="dot-panel mb-5 flex flex-col gap-4 rounded-card border p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <IconTile icon={Zap} tone="warn" size="lg" />
            <div>
              <h2 className="font-semibold text-ink">Daily challenge</h2>
              <p className="mt-0.5 text-sm text-ink">{daily.title}</p>
              <p className="text-[13px] text-ink-3">{plural(daily.questionCount, "question")} · {daily.timeLimitMinutes} min</p>
            </div>
          </div>
          <ButtonLink href={`/quiz/${daily.id}`} className="shrink-0">
            Start challenge <ArrowRight aria-hidden className="h-4 w-4" />
          </ButtonLink>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className={cn("min-w-0", isSignedIn ? "lg:col-span-2" : "lg:col-span-3")}>
          <div className="mb-4 grid gap-2 min-[400px]:grid-cols-2 sm:max-w-md">
            <Select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </Select>
            <Select aria-label="Level" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">All levels</option>
              {DIFFICULTIES.map((d) => (<option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>))}
            </Select>
          </div>

          {isPending ? (
            <LoadingBlock label="Loading quizzes" />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : quizzes.length === 0 ? (
            <EmptyState
              icon={<Trophy aria-hidden className="h-5 w-5" />}
              title={data.length === 0 ? "No quizzes published yet" : "No quizzes match"}
              description={data.length === 0 ? "Quizzes appear here as soon as a teacher publishes them." : "Try another category or level."}
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {quizzes.map((quiz) => (
                <li key={quiz.id}>
                  <Link href={`/quiz/${quiz.id}`} className="group block h-full rounded-card">
                    <Card interactive className="flex h-full flex-col">
                      <div className="mb-3 flex items-center justify-between">
                        <IconTile icon={categoryIcon(quiz.category)} size="sm" />
                        <DifficultyTag difficulty={quiz.difficulty} />
                      </div>
                      <h2 className="font-medium text-ink group-hover:text-accent-ink">{quiz.title}</h2>
                      {quiz.description && <p className="mt-1 line-clamp-2 text-[13px] text-ink-2">{quiz.description}</p>}
                      <p className="mt-1 mb-3 text-[13px] text-ink-3">{categoryLabel(quiz.category)}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-[13px] text-ink-3">
                        <span className="flex items-center gap-1"><Target aria-hidden className="h-3.5 w-3.5" />{plural(quiz.questionCount, "question")}</span>
                        <span className="flex items-center gap-1"><Clock aria-hidden className="h-3.5 w-3.5" />{quiz.timeLimitMinutes} min</span>
                        {quiz.bestScore !== null && <span className="ml-auto font-medium text-success">Best: {quiz.bestScore}%</span>}
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isSignedIn && <SignedInPanels />}
      </div>
    </div>
  );
}
