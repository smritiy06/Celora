"use client";


import { Trophy, Flame, Zap, Target, Award, Calendar, GitBranch, Star } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockCurrentUser, mockUserStats } from "@/data/users";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Profile Header */}
        <GlassCard variant="elevated" padding="lg" className="relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/15 blur-[80px]" />
          <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-cyan text-2xl font-bold text-white ring-4 ring-primary/20">
                {mockCurrentUser.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent-emerald text-xs font-bold text-white border-2 border-bg-primary">
                {mockUserStats.currentLevel}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-text-primary">{mockCurrentUser.name}</h1>
              <p className="mb-2 text-sm text-text-muted">{mockCurrentUser.bio}</p>
              <div className="flex flex-wrap justify-center gap-3 text-xs sm:justify-start">
                <span className="flex items-center gap-1 text-primary-light"><Zap className="h-3.5 w-3.5" />{mockUserStats.totalXp.toLocaleString()} XP</span>
                <span className="flex items-center gap-1 text-amber-400"><Flame className="h-3.5 w-3.5" />{mockUserStats.currentStreak} day streak</span>
                <span className="flex items-center gap-1 text-accent-cyan"><Trophy className="h-3.5 w-3.5" />Rank #{mockUserStats.rank}</span>
                <span className="flex items-center gap-1 text-text-muted"><Calendar className="h-3.5 w-3.5" />Joined {mockCurrentUser.joinedAt}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Courses Done", value: mockUserStats.coursesCompleted, icon: Target, color: "text-primary-light" },
            { label: "Quizzes Taken", value: mockUserStats.quizzesTaken, icon: Trophy, color: "text-amber-400" },
            { label: "Study Hours", value: mockUserStats.totalStudyHours, icon: Star, color: "text-accent-cyan" },
            { label: "Accuracy", value: `${mockUserStats.accuracy}%`, icon: GitBranch, color: "text-accent-emerald" },
          ].map((s) => (
            <GlassCard key={s.label} padding="sm" variant="elevated" className="text-center">
              <s.icon className={cn("mx-auto mb-1.5 h-5 w-5", s.color)} />
              <p className="text-xl font-bold text-text-primary">{s.value}</p>
              <p className="text-[10px] text-text-muted">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Skills & Achievements */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Skills */}
          <GlassCard variant="elevated" padding="md">
            <h2 className="mb-4 font-semibold text-text-primary">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {mockCurrentUser.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary-light">
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Achievements */}
          <GlassCard variant="elevated" padding="md">
            <h2 className="mb-4 font-semibold text-text-primary">Achievements</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {mockCurrentUser.achievements.map((ach) => (
                <div key={ach.id} className="flex flex-col items-center gap-1 text-center">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl text-2xl border",
                    ach.rarity === "legendary" ? "bg-amber-500/10 border-amber-500/30" :
                    ach.rarity === "epic" ? "bg-purple-500/10 border-purple-500/30" :
                    ach.rarity === "rare" ? "bg-blue-500/10 border-blue-500/30" :
                    "bg-white/[0.04] border-white/[0.08]"
                  )}>
                    {ach.icon}
                  </div>
                  <p className="text-[10px] text-text-muted leading-tight">{ach.title}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Certificates */}
        <GlassCard variant="elevated" padding="md">
          <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" /> Certificates
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {mockCurrentUser.certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-xl">🏅</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{cert.title}</p>
                  <p className="text-xs text-text-muted">Issued {cert.issuedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
