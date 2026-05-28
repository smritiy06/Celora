"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Clock, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockLearningPaths } from "@/data/learningPaths";
import { categories } from "@/constants/categories";
import { cn } from "@/lib/utils";

export default function LearningPathsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filtered = mockLearningPaths.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchDiff = selectedDifficulty === "all" || p.difficulty === selectedDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Learning Paths</h1>
          <p className="text-sm text-text-muted">Personalized paths to reach your learning goals</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search learning paths..."
              className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-secondary outline-none focus:border-primary/50"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-secondary outline-none focus:border-primary/50"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Path Grid */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((path) => (
            <motion.div key={path.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <Link href={`/courses/${path.id}`}>
                <GlassCard className="group h-full cursor-pointer" variant="elevated" hover>
                  <div className="mb-4 h-28 rounded-lg bg-gradient-to-br from-primary/20 via-bg-elevated to-accent-cyan/10 flex items-center justify-center text-4xl relative overflow-hidden">
                    {path.icon || "📚"}
                    {path.aiGenerated && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/15 border border-primary/25 px-2 py-0.5 text-[10px] font-medium text-primary-light">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI Generated
                      </div>
                    )}
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium",
                      path.difficulty === "beginner" ? "bg-emerald-500/10 text-emerald-400" :
                      path.difficulty === "intermediate" ? "bg-amber-500/10 text-amber-400" :
                      "bg-rose-500/10 text-rose-400"
                    )}>
                      {path.difficulty}
                    </span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-text-primary group-hover:gradient-text transition-all line-clamp-2">
                    {path.title}
                  </h3>
                  <p className="mb-3 text-xs text-text-muted line-clamp-2">{path.description}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{(path.duration / 60).toFixed(0)}h</span>
                    <span>{path.totalModules} modules</span>
                  </div>
                  {path.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-text-muted">Progress</span>
                        <span className="text-primary-light font-medium">{path.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan transition-all" style={{ width: `${path.progress}%` }} />
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
