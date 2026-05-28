"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, FileText, BookOpen, Sparkles, Bot, Brain } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockLearningPaths } from "@/data/learningPaths";
import { cn } from "@/lib/utils";

export default function PathDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const path = mockLearningPaths.find((p) => p.id === courseId) || mockLearningPaths[0];

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to learning paths
        </Link>

        {/* Path Header */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard variant="elevated" padding="lg">
              <div className="mb-4 flex items-center gap-3 flex-wrap">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light">{path.category}</span>
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium",
                  path.difficulty === "beginner" ? "bg-emerald-500/10 text-emerald-400" :
                  path.difficulty === "intermediate" ? "bg-amber-500/10 text-amber-400" :
                  "bg-rose-500/10 text-rose-400"
                )}>{path.difficulty}</span>
                {path.aiGenerated && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary-light">
                    <Sparkles className="h-3 w-3" /> AI Generated
                  </span>
                )}
              </div>
              <h1 className="mb-3 text-2xl font-bold text-text-primary">{path.title}</h1>
              <p className="mb-4 text-sm text-text-muted leading-relaxed">{path.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{(path.duration / 60).toFixed(0)} hours</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{path.totalModules} modules</span>
              </div>
              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {path.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-text-secondary">{tag}</span>
                ))}
              </div>
            </GlassCard>

            {/* Module Content */}
            <GlassCard variant="elevated" padding="md">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">Modules</h2>
              {path.modules.length > 0 ? (
                <div className="space-y-3">
                  {path.modules.map((mod, mi) => (
                    <div key={mod.id} className="rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          {mod.isCompleted ? <CheckCircle className="h-5 w-5 text-accent-emerald" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-xs text-text-muted">{mi + 1}</span>}
                          <span className="text-sm font-medium text-text-primary">{mod.title}</span>
                        </div>
                        <span className="text-xs text-text-muted">{mod.lessons.length} lessons</span>
                      </div>
                      <div className="border-t border-white/[0.04] px-4 pb-3 pt-2">
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 py-2 text-sm">
                            {lesson.isCompleted ? <CheckCircle className="h-4 w-4 text-accent-emerald shrink-0" /> :
                              <FileText className="h-4 w-4 text-text-muted shrink-0" />}
                            <span className={cn("flex-1", lesson.isCompleted ? "text-text-muted line-through" : "text-text-secondary")}>{lesson.title}</span>
                            <span className="text-xs text-text-muted">{lesson.duration}m</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">Module content will be available soon. AI is preparing your learning materials.</p>
              )}
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <GlassCard variant="strong" padding="md" className="sticky top-20">
              {path.progress > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-muted">Your progress</span>
                      <span className="font-semibold text-primary-light">{path.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${path.progress}%` }} />
                    </div>
                  </div>
                  <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
                    Continue Learning
                  </button>
                </>
              ) : (
                <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
                  Start Learning
                </button>
              )}
              <div className="mt-4 space-y-2 text-xs text-text-muted">
                <p className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> {path.totalModules} structured modules</p>
                <p className="flex items-center gap-2"><Brain className="h-3.5 w-3.5" /> AI-generated quizzes & practice</p>
                <p className="flex items-center gap-2"><Bot className="h-3.5 w-3.5" /> AI Tutor access included</p>
                <p className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Personalized to your pace</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
