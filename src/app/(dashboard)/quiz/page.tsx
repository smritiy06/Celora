"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Flame, Clock, Target, Swords } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockQuizzes, mockDailyChallenge, mockLeaderboard } from "@/data/quizzes";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function QuizArenaPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Quiz Arena</h1>
          <p className="text-sm text-text-muted">Test your knowledge, earn XP, and climb the leaderboard</p>
        </div>

        {/* Daily Challenge Banner */}
        <GlassCard className="relative overflow-hidden" variant="elevated" padding="md">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/15 blur-[60px]" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <h2 className="font-semibold text-text-primary">Daily Challenge</h2>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">+{mockDailyChallenge.xpReward} XP</span>
              </div>
              <p className="text-sm text-text-primary font-medium">{mockDailyChallenge.title}</p>
              <p className="text-xs text-text-muted">{mockDailyChallenge.description}</p>
            </div>
            <button className="shrink-0 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all">
              Start Challenge
            </button>
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quiz Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-text-primary">Topic Quizzes</h2>
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial="hidden" animate="show"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            >
              {mockQuizzes.map((quiz) => (
                <motion.div key={quiz.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  <Link href={`/quiz/${quiz.id}`}>
                    <GlassCard className="group h-full cursor-pointer" variant="elevated">
                      <div className="mb-3 flex items-center justify-between">
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium",
                          quiz.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400" :
                          quiz.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" :
                          "bg-rose-500/10 text-rose-400"
                        )}>{quiz.difficulty}</span>
                        <span className="text-xs text-text-muted">+{quiz.xpReward} XP</span>
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-text-primary group-hover:gradient-text transition-all">{quiz.title}</h3>
                      <p className="mb-3 text-xs text-text-muted line-clamp-2">{quiz.description}</p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><Target className="h-3 w-3" />{quiz.questionCount} Q</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{quiz.duration}m</span>
                        {quiz.bestScore > 0 && <span className="flex items-center gap-1 text-accent-emerald">Best: {quiz.bestScore}%</span>}
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Multiplayer Section */}
            <GlassCard variant="elevated" padding="md" className="relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-[50px]" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan">
                  <Swords className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">Multiplayer Quiz Battles</h3>
                  <p className="text-xs text-text-muted">Challenge friends in real-time quiz duels</p>
                </div>
                <button className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-medium text-primary-light hover:bg-primary/20 transition-colors">
                  Coming Soon
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* XP & Streak */}
            <GlassCard variant="elevated" padding="md">
              <h3 className="mb-3 font-semibold text-text-primary">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <Zap className="mx-auto mb-1 h-5 w-5 text-primary-light" />
                  <p className="text-lg font-bold text-text-primary">4,200</p>
                  <p className="text-[10px] text-text-muted">Total XP</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <Flame className="mx-auto mb-1 h-5 w-5 text-amber-400" />
                  <p className="text-lg font-bold text-text-primary">12</p>
                  <p className="text-[10px] text-text-muted">Day Streak</p>
                </div>
              </div>
            </GlassCard>

            {/* Leaderboard */}
            <GlassCard variant="elevated" padding="md">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
                <Trophy className="h-4 w-4 text-amber-400" /> Leaderboard
              </h3>
              <div className="space-y-2">
                {mockLeaderboard.slice(0, 5).map((entry) => (
                  <div key={entry.rank} className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs", entry.userId === "current" && "bg-primary/5 border border-primary/20")}>
                    <span className={cn("w-5 font-bold", entry.rank <= 3 ? "text-amber-400" : "text-text-muted")}>
                      {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <span className="flex-1 text-text-secondary truncate">{entry.userName}</span>
                    <span className="font-medium text-primary-light">{(entry.xp / 1000).toFixed(1)}K</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
