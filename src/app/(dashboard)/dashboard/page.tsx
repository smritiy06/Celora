"use client";

import { motion } from "framer-motion";
import { Flame, Target, Trophy, Bot, Calendar, TrendingUp, BookOpen, Zap } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockCurrentUser, mockUserStats } from "@/data/users";
import { mockContinueLearning, mockRecommendedCourses } from "@/data/courses";
import { mockDailyChallenge, mockLeaderboard } from "@/data/quizzes";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function DashboardPage() {
  return (
    <PageTransition>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
        {/* Welcome Banner */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-bg-elevated to-accent-cyan/10 border border-white/[0.08] p-6 sm:p-8">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
            <div className="relative z-10">
              <h1 className="mb-1 text-2xl font-bold sm:text-3xl">
                Welcome back, {mockCurrentUser.name.split(" ")[0]}! 👋
              </h1>
              <p className="mb-4 text-text-muted">Keep pushing — you&apos;re on a {mockUserStats.currentStreak}-day streak!</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-amber-400"><Flame className="h-4 w-4" />{mockUserStats.currentStreak} day streak</span>
                <span className="flex items-center gap-1.5 text-primary-light"><Zap className="h-4 w-4" />{mockUserStats.totalXp.toLocaleString()} XP</span>
                <span className="flex items-center gap-1.5 text-accent-cyan"><Trophy className="h-4 w-4" />Rank #{mockUserStats.rank}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Courses Completed", value: mockUserStats.coursesCompleted, icon: BookOpen, color: "text-primary-light" },
            { label: "Quizzes Taken", value: mockUserStats.quizzesTaken, icon: Trophy, color: "text-amber-400" },
            { label: "Study Hours", value: mockUserStats.totalStudyHours, icon: Target, color: "text-accent-cyan" },
            { label: "Accuracy", value: `${mockUserStats.accuracy}%`, icon: TrendingUp, color: "text-accent-emerald" },
          ].map((stat) => (
            <GlassCard key={stat.label} padding="sm" className="text-center">
              <stat.icon className={`mx-auto mb-2 h-5 w-5 ${stat.color}`} />
              <p className="text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted">{stat.label}</p>
            </GlassCard>
          ))}
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Continue Learning */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard variant="elevated" padding="md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Continue Learning</h2>
                <Link href="/courses" className="text-xs text-primary-light hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {mockContinueLearning.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="flex items-center gap-4 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent-cyan/20 text-lg">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{course.title}</p>
                      <p className="text-xs text-text-muted">{course.completedLessons}/{course.totalLessons} lessons</p>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-primary-light">{course.progress}%</span>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Right column */}
          <div className="space-y-5">
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

            {/* AI Suggestions */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md">
                <div className="mb-3 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary-light" />
                  <h3 className="font-semibold text-text-primary">AI Suggestions</h3>
                </div>
                <div className="space-y-2.5">
                  {["Review weak topics in Neural Networks", "Complete React hooks quiz", "Try the SQL optimization challenge"].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-text-muted">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      {s}
                    </div>
                  ))}
                </div>
                <Link href="/ai-tutor" className="mt-3 inline-block text-xs text-primary-light hover:underline">
                  Ask AI Tutor →
                </Link>
              </GlassCard>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div variants={itemVariants}>
              <GlassCard variant="elevated" padding="md">
                <div className="mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent-rose" />
                  <h3 className="font-semibold text-text-primary">Deadlines</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { task: "ML Project Submission", due: "2 days", urgent: true },
                    { task: "DSA Quiz Attempt", due: "5 days", urgent: false },
                    { task: "React Course Module 3", due: "1 week", urgent: false },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{d.task}</span>
                      <span className={d.urgent ? "text-accent-rose font-medium" : "text-text-muted"}>{d.due}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Recommended courses */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="elevated" padding="md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">Recommended for You</h2>
              <Link href="/courses" className="text-xs text-primary-light hover:underline">Browse all</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockRecommendedCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="group rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all">
                  <div className="mb-3 h-28 rounded-lg bg-gradient-to-br from-primary/20 to-accent-cyan/10 flex items-center justify-center text-3xl">
                    {course.category === "web-dev" ? "🌐" : course.category === "mobile-dev" ? "📱" : "🎓"}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-text-primary group-hover:gradient-text transition-all line-clamp-2">{course.title}</h3>
                  <p className="mb-2 text-xs text-text-muted">{course.instructor.name}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400">★ {course.rating}</span>
                    <span className="text-text-muted">{(course.duration / 60).toFixed(0)}h</span>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Leaderboard */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="elevated" padding="md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">🏆 Leaderboard</h2>
              <Link href="/quiz" className="text-xs text-primary-light hover:underline">Full rankings</Link>
            </div>
            <div className="space-y-2">
              {mockLeaderboard.slice(0, 5).map((entry) => (
                <div key={entry.rank} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${entry.userId === "current" ? "bg-primary/5 border border-primary/20" : "bg-white/[0.02]"}`}>
                  <span className={`w-6 text-center text-sm font-bold ${entry.rank <= 3 ? "text-amber-400" : "text-text-muted"}`}>
                    {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent-cyan/30 text-[10px] font-bold text-white">
                    {entry.userName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="flex-1 text-sm text-text-primary">{entry.userName}</span>
                  <span className="text-xs font-medium text-primary-light">{entry.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
