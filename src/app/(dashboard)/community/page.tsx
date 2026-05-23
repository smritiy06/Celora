"use client";

import { motion } from "framer-motion";
import { MessageSquare, Code, Rocket, Users, ThumbsUp } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "challenges", label: "Challenges", icon: Code },
  { id: "projects", label: "Projects", icon: Rocket },
  { id: "groups", label: "Study Groups", icon: Users },
];

const mockPosts = [
  { id: "p-1", author: "Emma Watson", avatar: "EW", title: "How to prepare for a Google interview?", tags: ["Interview", "DSA"], likes: 42, comments: 18, time: "2h ago" },
  { id: "p-2", author: "Raj Patel", avatar: "RP", title: "My journey from beginner to full-stack developer", tags: ["Career", "Web Dev"], likes: 128, comments: 45, time: "5h ago" },
  { id: "p-3", author: "Sophia Lee", avatar: "SL", title: "Best resources for learning machine learning in 2026", tags: ["ML", "Resources"], likes: 89, comments: 32, time: "1d ago" },
];

const mockChallenges = [
  { id: "ch-1", title: "Two Sum", difficulty: "easy", language: "Python", submissions: 15000, successRate: 78, xpReward: 25 },
  { id: "ch-2", title: "Valid Parentheses", difficulty: "easy", language: "JavaScript", submissions: 12000, successRate: 72, xpReward: 25 },
  { id: "ch-3", title: "Merge Sort Implementation", difficulty: "medium", language: "C++", submissions: 8500, successRate: 55, xpReward: 50 },
  { id: "ch-4", title: "LRU Cache", difficulty: "hard", language: "Python", submissions: 4200, successRate: 35, xpReward: 100 },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Community</h1>
          <p className="text-sm text-text-muted">Learn together, grow together</p>
        </div>

        <div className="flex gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all", activeTab === tab.id ? "bg-primary/10 text-primary-light" : "text-text-muted hover:text-text-secondary")}>
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "discussions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {mockPosts.map((post) => (
              <GlassCard key={post.id} variant="elevated" className="group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent-cyan/30 text-xs font-bold text-white">{post.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary group-hover:gradient-text transition-all">{post.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                      <span>{post.author}</span>
                      <span>{post.time}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{post.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.comments}</span>
                      {post.tags.map((t) => <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary-light">{t}</span>)}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {activeTab === "challenges" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {mockChallenges.map((ch) => (
              <GlassCard key={ch.id} variant="elevated" className="flex items-center justify-between group cursor-pointer">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-text-primary">{ch.title}</h3>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium",
                      ch.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400" :
                      ch.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" :
                      "bg-rose-500/10 text-rose-400"
                    )}>{ch.difficulty}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-text-muted">
                    <span>{ch.language}</span>
                    <span>{ch.submissions.toLocaleString()} submissions</span>
                    <span>{ch.successRate}% success rate</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-primary-light">+{ch.xpReward} XP</span>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard variant="elevated" className="flex flex-col items-center py-12 text-center">
              <Rocket className="mb-3 h-10 w-10 text-text-muted" />
              <h3 className="text-lg font-semibold text-text-primary">Project Showcase</h3>
              <p className="text-sm text-text-muted">Share your projects with the community — coming soon!</p>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "groups" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard variant="elevated" className="flex flex-col items-center py-12 text-center">
              <Users className="mb-3 h-10 w-10 text-text-muted" />
              <h3 className="text-lg font-semibold text-text-primary">Study Groups</h3>
              <p className="text-sm text-text-muted">Join study groups and learn with peers — coming soon!</p>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
