"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StickyNote, CreditCard, Bookmark, Code, Plus, Pin } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "flashcards", label: "Flashcards", icon: CreditCard },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "snippets", label: "Snippets", icon: Code },
];

const mockNotes = [
  { id: "n-1", title: "Neural Network Basics", content: "A neural network consists of layers of interconnected nodes...", tags: ["AI", "ML"], isPinned: true, updatedAt: "2 hours ago" },
  { id: "n-2", title: "React Hooks Cheat Sheet", content: "useState, useEffect, useContext, useReducer, useMemo...", tags: ["React", "Web Dev"], isPinned: true, updatedAt: "1 day ago" },
  { id: "n-3", title: "SQL Joins Explained", content: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN...", tags: ["SQL", "Database"], isPinned: false, updatedAt: "3 days ago" },
  { id: "n-4", title: "Big O Notation", content: "O(1) < O(log n) < O(n) < O(n log n) < O(n²)...", tags: ["DSA", "Algorithms"], isPinned: false, updatedAt: "1 week ago" },
];

const mockFlashcards = [
  { id: "f-1", front: "What is closure in JavaScript?", back: "A closure is a function that remembers variables from its outer scope.", category: "JavaScript", mastery: 80 },
  { id: "f-2", front: "Difference between TCP and UDP?", back: "TCP is connection-oriented and reliable. UDP is connectionless and faster.", category: "Networking", mastery: 60 },
  { id: "f-3", front: "What is gradient descent?", back: "An optimization algorithm that minimizes a loss function by iteratively moving towards the steepest descent.", category: "ML", mastery: 45 },
];

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Notes & Resources</h1>
            <p className="text-sm text-text-muted">Your personal knowledge base</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
            <Plus className="h-4 w-4" /> New Note
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === tab.id ? "bg-primary/10 text-primary-light" : "text-text-muted hover:text-text-secondary"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockNotes.map((note) => (
              <GlassCard key={note.id} variant="elevated" className="group cursor-pointer">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-text-primary group-hover:gradient-text transition-all">{note.title}</h3>
                  {note.isPinned && <Pin className="h-3.5 w-3.5 text-primary-light shrink-0" />}
                </div>
                <p className="mb-3 text-xs text-text-muted line-clamp-3">{note.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {note.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary-light">{tag}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-text-muted">{note.updatedAt}</span>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {/* Flashcards Tab */}
        {activeTab === "flashcards" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockFlashcards.map((card) => (
              <GlassCard key={card.id} variant="elevated" className="group cursor-pointer">
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary-light">{card.category}</span>
                <h3 className="mb-2 text-sm font-semibold text-text-primary">{card.front}</h3>
                <p className="mb-3 text-xs text-text-muted">{card.back}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Mastery</span>
                  <span className="text-accent-emerald font-medium">{card.mastery}%</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-accent-emerald" style={{ width: `${card.mastery}%` }} />
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {activeTab === "bookmarks" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard variant="elevated" className="flex flex-col items-center py-12 text-center">
              <Bookmark className="mb-3 h-10 w-10 text-text-muted" />
              <h3 className="text-lg font-semibold text-text-primary">No bookmarks yet</h3>
              <p className="text-sm text-text-muted">Save courses, articles, and resources here for quick access.</p>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "snippets" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard variant="elevated" className="flex flex-col items-center py-12 text-center">
              <Code className="mb-3 h-10 w-10 text-text-muted" />
              <h3 className="text-lg font-semibold text-text-primary">No snippets yet</h3>
              <p className="text-sm text-text-muted">Save useful code snippets here for reference.</p>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
