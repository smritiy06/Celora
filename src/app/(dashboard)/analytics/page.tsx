"use client";

import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { BarChart3, Clock, Target, TrendingUp, Brain, Zap } from "lucide-react";

const weeklyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.0 },
  { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 5.0 },
  { day: "Sun", hours: 3.5 },
];

const topicMastery = [
  { topic: "React", mastery: 85, color: "from-cyan-500 to-blue-500" },
  { topic: "Python", mastery: 78, color: "from-emerald-500 to-green-500" },
  { topic: "Machine Learning", mastery: 62, color: "from-violet-500 to-purple-500" },
  { topic: "Data Structures", mastery: 70, color: "from-amber-500 to-orange-500" },
  { topic: "SQL", mastery: 88, color: "from-rose-500 to-pink-500" },
  { topic: "TypeScript", mastery: 75, color: "from-indigo-500 to-blue-500" },
];

const maxHours = Math.max(...weeklyData.map(d => d.hours));

export default function AnalyticsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="text-sm text-text-muted">Track your learning progress and performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "This Week", value: "21.5h", sub: "+15%", icon: Clock, color: "text-primary-light" },
            { label: "Avg. Quiz Score", value: "82%", sub: "+5%", icon: Target, color: "text-amber-400" },
            { label: "Courses Active", value: "4", sub: "2 near complete", icon: TrendingUp, color: "text-accent-cyan" },
            { label: "XP This Month", value: "1,250", sub: "+320", icon: Zap, color: "text-accent-emerald" },
          ].map((s) => (
            <GlassCard key={s.label} variant="elevated" padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-text-muted">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-accent-emerald">{s.sub}</p>
            </GlassCard>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Study Time Chart (CSS bars) */}
          <GlassCard variant="elevated" padding="md">
            <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-light" /> Weekly Study Time
            </h2>
            <div className="flex items-end gap-3 h-40">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-text-muted">{d.hours}h</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary/20 transition-all duration-500" style={{ height: `${(d.hours / maxHours) * 100}%` }} />
                  <span className="text-[10px] text-text-muted">{d.day}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Topic Mastery */}
          <GlassCard variant="elevated" padding="md">
            <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent-cyan" /> Topic Mastery
            </h2>
            <div className="space-y-3">
              {topicMastery.map((t) => (
                <div key={t.topic}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary">{t.topic}</span>
                    <span className="font-medium text-text-primary">{t.mastery}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <div className={`h-full rounded-full bg-gradient-to-r ${t.color} transition-all duration-500`} style={{ width: `${t.mastery}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Activity Heatmap */}
        <GlassCard variant="elevated" padding="md">
          <h2 className="mb-4 font-semibold text-text-primary">Activity Heatmap</h2>
          <div className="grid grid-cols-7 gap-1 sm:grid-cols-14 lg:grid-cols-26">
            {Array.from({ length: 182 }).map((_, i) => {
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  className="aspect-square rounded-sm transition-colors"
                  style={{
                    backgroundColor: intensity > 0.7
                      ? "rgba(139,92,246,0.6)"
                      : intensity > 0.4
                      ? "rgba(139,92,246,0.3)"
                      : intensity > 0.15
                      ? "rgba(139,92,246,0.12)"
                      : "rgba(255,255,255,0.03)",
                  }}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-text-muted">
            <span>Less</span>
            {[0.03, 0.12, 0.3, 0.6].map((o) => (
              <div key={o} className="h-3 w-3 rounded-sm" style={{ backgroundColor: `rgba(139,92,246,${o})` }} />
            ))}
            <span>More</span>
          </div>
        </GlassCard>

        {/* AI Recommendations */}
        <GlassCard variant="elevated" padding="md">
          <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary-light" /> AI Recommendations
          </h2>
          <div className="space-y-2.5">
            {[
              { type: "focus", text: "Spend more time on Machine Learning — your mastery is below average", priority: "high" },
              { type: "quiz", text: "Take the Data Structures quiz to reinforce recent learning", priority: "medium" },
              { type: "course", text: "Complete the Neural Networks module in your AI/ML course", priority: "high" },
              { type: "practice", text: "Practice SQL joins — your accuracy dropped in recent quizzes", priority: "medium" },
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${rec.priority === "high" ? "bg-accent-rose" : "bg-amber-400"}`} />
                <span className="text-xs text-text-secondary">{rec.text}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
