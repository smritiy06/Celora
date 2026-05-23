"use client";

import { motion } from "framer-motion";
import { Map, Users, Clock } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockRoadmaps } from "@/data/roadmaps";
import Link from "next/link";


export default function RoadmapsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Learning Roadmaps</h1>
          <p className="text-sm text-text-muted">Structured career paths to guide your learning journey</p>
        </div>

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        >
          {mockRoadmaps.map((roadmap) => (
            <motion.div key={roadmap.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <Link href={`/roadmaps/${roadmap.id}`}>
                <GlassCard className="group h-full cursor-pointer" variant="elevated">
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 via-bg-elevated to-accent-cyan/10 text-4xl">
                    {roadmap.category === "ai-ml" ? "🤖" : roadmap.category === "web-dev" ? "🌐" : roadmap.category === "cybersecurity" ? "🔒" : "📱"}
                  </div>
                  <h3 className="mb-1 text-base font-semibold text-text-primary group-hover:gradient-text transition-all">{roadmap.title}</h3>
                  <p className="mb-3 text-xs text-text-muted line-clamp-2">{roadmap.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{roadmap.estimatedDuration}</span>
                    <span className="flex items-center gap-1"><Map className="h-3 w-3" />{roadmap.totalCheckpoints} checkpoints</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{(roadmap.enrolledCount / 1000).toFixed(0)}K</span>
                  </div>
                  {roadmap.progress > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-text-muted">Progress</span>
                        <span className="text-primary-light font-medium">{roadmap.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${roadmap.progress}%` }} />
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
