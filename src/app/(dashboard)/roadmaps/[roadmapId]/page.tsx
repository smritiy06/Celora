"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Circle, Clock, BookOpen, Code, Trophy } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockRoadmaps } from "@/data/roadmaps";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, typeof BookOpen> = { learn: BookOpen, practice: Code, project: Code, quiz: Trophy };

export default function RoadmapDetailPage({ params }: { params: Promise<{ roadmapId: string }> }) {
  const { roadmapId } = use(params);
  const roadmap = mockRoadmaps.find((r) => r.id === roadmapId) || mockRoadmaps[0];

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link href="/roadmaps" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to roadmaps
        </Link>

        <GlassCard variant="elevated" padding="lg">
          <h1 className="mb-2 text-2xl font-bold text-text-primary">{roadmap.title}</h1>
          <p className="mb-4 text-sm text-text-muted">{roadmap.description}</p>
          <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{roadmap.estimatedDuration}</span>
            <span>{roadmap.totalCheckpoints} checkpoints</span>
            <span>{roadmap.enrolledCount.toLocaleString()} enrolled</span>
          </div>
          {roadmap.progress > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-muted">Overall Progress</span>
                <span className="text-primary-light font-medium">{roadmap.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${roadmap.progress}%` }} />
              </div>
            </div>
          )}
        </GlassCard>

        {/* Milestones */}
        <div className="space-y-4">
          {roadmap.milestones.map((milestone, mi) => (
            <GlassCard key={milestone.id} variant="elevated" padding="md" className={cn(milestone.isActive && "border-primary/30")}>
              <div className="flex items-center gap-3 mb-4">
                {milestone.isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-accent-emerald shrink-0" />
                ) : milestone.isActive ? (
                  <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/20 shrink-0 animate-pulse" />
                ) : (
                  <Circle className="h-6 w-6 text-text-muted shrink-0" />
                )}
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    Milestone {mi + 1}: {milestone.title}
                  </h3>
                  <p className="text-xs text-text-muted">{milestone.description}</p>
                </div>
              </div>
              <div className="ml-8 space-y-2">
                {milestone.checkpoints.map((cp) => {
                  const Icon = typeIcons[cp.type] || BookOpen;
                  return (
                    <div key={cp.id} className={cn("flex items-center gap-3 rounded-lg p-2.5 text-sm transition-colors", cp.isCompleted ? "bg-accent-emerald/5" : "bg-white/[0.02] hover:bg-white/[0.04]")}>
                      {cp.isCompleted ? <CheckCircle className="h-4 w-4 text-accent-emerald shrink-0" /> : <Icon className="h-4 w-4 text-text-muted shrink-0" />}
                      <div className="flex-1">
                        <span className={cn("text-sm", cp.isCompleted ? "text-text-muted line-through" : "text-text-secondary")}>{cp.title}</span>
                        <p className="text-xs text-text-muted">{cp.description}</p>
                      </div>
                      <span className="text-xs text-text-muted shrink-0">{cp.estimatedTime}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
