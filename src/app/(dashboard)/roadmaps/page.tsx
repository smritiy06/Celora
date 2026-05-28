"use client";

import { motion } from "framer-motion";
import { Target, Clock, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockGoals } from "@/data/goals";
import Link from "next/link";

export default function GoalsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Learning Goals</h1>
            <p className="text-sm text-text-muted">Your AI-crafted career paths and learning milestones</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-medium text-primary-light hover:bg-primary/20 transition-colors">
            <Sparkles className="h-3.5 w-3.5" />
            New Goal
          </button>
        </div>

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        >
          {mockGoals.map((goal) => (
            <motion.div key={goal.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <Link href={`/roadmaps/${goal.id}`}>
                <GlassCard className="group h-full cursor-pointer" variant="elevated">
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 via-bg-elevated to-accent-cyan/10 text-4xl relative">
                    {goal.category === "ai-ml" ? "🤖" : goal.category === "web-dev" ? "🌐" : goal.category === "cybersecurity" ? "🔒" : "📱"}
                    {goal.aiGenerated && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/15 border border-primary/25 px-2 py-0.5 text-[10px] font-medium text-primary-light">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI
                      </div>
                    )}
                  </div>
                  <h3 className="mb-1 text-base font-semibold text-text-primary group-hover:gradient-text transition-all">{goal.title}</h3>
                  <p className="mb-3 text-xs text-text-muted line-clamp-2">{goal.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{goal.estimatedDuration}</span>
                    <span className="flex items-center gap-1"><Target className="h-3 w-3" />{goal.totalCheckpoints} checkpoints</span>
                  </div>
                  {goal.progress > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-text-muted">Progress</span>
                        <span className="text-primary-light font-medium">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  )}
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
