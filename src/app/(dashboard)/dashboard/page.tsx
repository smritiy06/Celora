"use client";

import { motion } from "framer-motion";
import { Flame, Target, Zap, Bot, BookOpen, Trophy, StickyNote, Route, ArrowRight, CheckCircle2, Circle, Brain, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockCurrentUser, mockUserStats } from "@/data/users";
import { mockContinueLearning } from "@/data/learningPaths";
import { mockDailyChallenge } from "@/data/quizzes";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Mini streak calendar — last 28 days */
const streakData = Array.from({ length: 28 }, (_, i) => {
  if (i >= 16 && i <= 27) return 2; // active streak
  if (i >= 10 && i <= 14) return 1; // light activity
  if (i === 8 || i === 5) return 1;
  return 0;
});

/** AI insights — these would come from AI analysis in production */
const aiInsights = [
  { text: "You're excelling in Python — 92% quiz accuracy", type: "strength" as const },
  { text: "Consider reviewing SQL joins — last quiz was 64%", type: "weakness" as const },
  { text: "Try the Neural Networks module next — it aligns with your ML goal", type: "suggestion" as const },
];

/** Daily tasks — auto-generated style */
const dailyTasks = [
  { id: 1, text: "Complete Logistic Regression lesson", done: false },
  { id: 2, text: "Practice 5 algorithm problems", done: false },
  { id: 3, text: "Review AI-generated notes on Supervised Learning", done: true },
  { id: 4, text: "Take the Python Fundamentals quiz", done: true },
];

/** Weak topics */
const weakTopics = [
  { topic: "SQL Joins", accuracy: 64, category: "Databases" },
  { topic: "Backpropagation", accuracy: 58, category: "Deep Learning" },
  { topic: "Dynamic Programming", accuracy: 71, category: "DSA" },
];

export default function DashboardPage() {
  return (
    <PageTransition>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
        {/* ── Welcome Banner ── */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-bg-elevated to-accent-cyan/10 border border-white/[0.08] p-6 sm:p-8">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
            <div className="relative z-10">
              <h1 className="mb-1 text-2xl font-bold sm:text-3xl">
                Welcome back, {mockCurrentUser.name.split(" ")[0]}! 👋
              </h1>
              <p className="mb-4 text-text-muted">
                Keep pushing — you&apos;re on a {mockUserStats.currentStreak}-day streak!
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-amber-400"><Flame className="h-4 w-4" />{mockUserStats.currentStreak} day streak</span>
                <span className="flex items-center gap-1.5 text-primary-light"><Zap className="h-4 w-4" />{mockUserStats.totalXp.toLocaleString()} XP</span>
                <span className="flex items-center gap-1.5 text-accent-cyan"><Target className="h-4 w-4" />{mockCurrentUser.learningGoals[0]}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Ask AI Tutor", icon: Bot, href: "/ai-tutor", color: "text-primary-light" },
            { label: "Start Quiz", icon: Trophy, href: "/quiz", color: "text-amber-400" },
            { label: "View Notes", icon: StickyNote, href: "/notes", color: "text-accent-cyan" },
            { label: "My Goals", icon: Route, href: "/roadmaps", color: "text-accent-emerald" },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <GlassCard padding="sm" className="group cursor-pointer text-center hover:border-primary/20 transition-all">
                <action.icon className={`mx-auto mb-2 h-5 w-5 ${action.color} transition-transform group-hover:scale-110`} />
                <p className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{action.label}</p>
              </GlassCard>
            </Link>
          ))}
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* ── Left Column: Continue Learning + Daily Tasks ── */}
          <div className="space-y-5 lg:col-span-2">
            {/* Continue Learning */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-text-primary flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5 text-primary-light" />
                    Continue Learning
                  </h2>
                  <Link href="/courses" className="text-xs text-primary-light hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {mockContinueLearning.map((path) => (
                    <Link
                      key={path.id}
                      href={`/courses/${path.id}`}
                      className="flex items-center gap-4 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent-cyan/20 text-lg">
                        {path.icon || "📚"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{path.title}</p>
                        <p className="text-xs text-text-muted">{path.completedModules}/{path.totalModules} modules</p>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${path.progress}%` }} />
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-primary-light">{path.progress}%</span>
                    </Link>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Daily Tasks */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-text-primary flex items-center gap-2">
                    <Target className="h-4.5 w-4.5 text-accent-amber" />
                    Daily Tasks
                  </h2>
                  <span className="text-xs text-text-muted">{dailyTasks.filter(t => t.done).length}/{dailyTasks.length} done</span>
                </div>
                <div className="space-y-2">
                  {dailyTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 rounded-lg px-2 py-2">
                      {task.done ? (
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-accent-emerald" />
                      ) : (
                        <Circle className="h-4.5 w-4.5 shrink-0 text-text-disabled" />
                      )}
                      <span className={`text-sm ${task.done ? "text-text-muted line-through" : "text-text-secondary"}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* ── Right Column: AI Insights + Streak + Challenge + Weak Topics ── */}
          <div className="space-y-5">
            {/* AI Insights */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md">
                <div className="mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary-light" />
                  <h3 className="font-semibold text-text-primary">AI Insights</h3>
                </div>
                <div className="space-y-2.5">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        insight.type === "strength" ? "bg-accent-emerald" :
                        insight.type === "weakness" ? "bg-accent-rose" :
                        "bg-primary/60"
                      }`} />
                      <span className="text-text-secondary">{insight.text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/ai-tutor" className="mt-3 inline-flex items-center gap-1 text-xs text-primary-light hover:underline">
                  Ask AI for more insights
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </GlassCard>
            </motion.div>

            {/* Learning Streak Calendar */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md">
                <div className="mb-3 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-text-primary">Streak</h3>
                  <span className="ml-auto text-xs font-medium text-amber-400">{mockUserStats.currentStreak} days 🔥</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {streakData.map((val, i) => (
                    <div
                      key={i}
                      className={`h-4 w-full rounded-[3px] ${
                        val === 2 ? "bg-primary/60" :
                        val === 1 ? "bg-primary/25" :
                        "bg-white/[0.04]"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
                  <span>4 weeks ago</span>
                  <span>Today</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Daily Challenge */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md" className="relative overflow-hidden">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-[40px]" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <h3 className="font-semibold text-text-primary">Daily Challenge</h3>
                  </div>
                  <p className="mb-1 text-sm font-medium text-text-primary">{mockDailyChallenge.title}</p>
                  <p className="mb-3 text-xs text-text-muted">{mockDailyChallenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-medium">+{mockDailyChallenge.xpReward} XP</span>
                    <Link href="/quiz" className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors">
                      Start
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Weak Topics */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent-rose" />
                  <h3 className="font-semibold text-text-primary">Needs Review</h3>
                </div>
                <div className="space-y-3">
                  {weakTopics.map((topic) => (
                    <div key={topic.topic}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text-secondary">{topic.topic}</span>
                        <span className="text-[10px] text-text-muted">{topic.accuracy}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${topic.accuracy < 65 ? "bg-accent-rose/70" : "bg-accent-amber/70"}`}
                          style={{ width: `${topic.accuracy}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-[10px] text-text-muted">{topic.category}</p>
                    </div>
                  ))}
                </div>
                <Link href="/quiz" className="mt-3 inline-flex items-center gap-1 text-xs text-accent-rose hover:underline">
                  Practice weak areas
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
}
