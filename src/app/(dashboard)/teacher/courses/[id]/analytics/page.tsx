"use client";

import { use } from "react";
import { ArrowLeft, Users, BookOpen, TrendingUp, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import Link from "next/link";

/**
 * Course Analytics — Placeholder page with sample charts.
 * In production, this would pull real analytics from the backend.
 */
export default function CourseAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Placeholder data
  const stats = [
    { label: "Total Enrollments", value: "0", icon: Users, color: "text-accent-cyan" },
    { label: "Completion Rate", value: "—", icon: TrendingUp, color: "text-accent-emerald" },
    { label: "Avg. Progress", value: "—", icon: BarChart3, color: "text-amber-400" },
    { label: "Total Modules", value: "—", icon: BookOpen, color: "text-primary-light" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <PageTransition>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link href={`/teacher/courses/${id}`} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
            <ArrowLeft className="h-4 w-4 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Course Analytics</h1>
            <p className="text-xs text-text-muted">Track student engagement and progress</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <GlassCard key={s.label} padding="sm" variant="elevated" className="text-center">
              <s.icon className={`mx-auto mb-1.5 h-5 w-5 ${s.color}`} />
              <p className="text-xl font-bold text-text-primary">{s.value}</p>
              <p className="text-[10px] text-text-muted">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Enrollment Chart Placeholder */}
        <GlassCard variant="elevated" padding="md">
          <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-accent-cyan" />
            Enrollment Over Time
          </h2>
          <div className="flex items-end gap-2 h-40">
            {months.map((month, i) => {
              const height = [15, 25, 20, 40, 35, 10][i];
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary/20 transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-text-muted">{month}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-text-muted">
            Analytics data is a placeholder. Connect your backend for real metrics.
          </p>
        </GlassCard>

        {/* Completion Rate Placeholder */}
        <GlassCard variant="elevated" padding="md">
          <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-amber-400" />
            Module Completion Rates
          </h2>
          <div className="space-y-3">
            {["Module 1", "Module 2", "Module 3"].map((mod, i) => (
              <div key={mod}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">{mod}</span>
                  <span className="text-[10px] text-text-muted">{[78, 54, 32][i]}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan"
                    style={{ width: `${[78, 54, 32][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-text-muted">
            Placeholder data — real completion tracking requires student progress integration.
          </p>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
