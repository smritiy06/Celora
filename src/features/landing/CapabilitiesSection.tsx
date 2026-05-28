"use client";

import { motion } from "framer-motion";
import { Bot, FileText, Brain, Route, Search, Zap } from "lucide-react";

/**
 * Capabilities Section — bento grid showing AI platform features.
 * Glassmorphism cards with hover glow effects and micro-animations.
 */

const capabilities = [
  {
    icon: Bot,
    title: "AI Tutor",
    description: "Ask anything, get instant explanations. Your personal AI study companion available 24/7.",
    color: "text-primary",
    bg: "bg-primary/10",
    glow: "group-hover:shadow-[0_0_30px_rgba(226,135,102,0.12)]",
    span: "sm:col-span-2 lg:col-span-1",
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description: "AI-generated summaries, flashcards, and revision notes from any topic you study.",
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
    glow: "group-hover:shadow-[0_0_30px_rgba(130,197,244,0.12)]",
    span: "",
  },
  {
    icon: Brain,
    title: "Adaptive Quizzes",
    description: "Questions that adapt to your level. AI identifies weak spots and creates targeted practice.",
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
    glow: "group-hover:shadow-[0_0_30px_rgba(244,211,130,0.12)]",
    span: "",
  },
  {
    icon: Route,
    title: "Personalized Paths",
    description: "AI-crafted learning roadmaps tailored to your goals, pace, and learning style.",
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/10",
    glow: "group-hover:shadow-[0_0_30px_rgba(130,212,160,0.12)]",
    span: "",
  },
  {
    icon: Search,
    title: "Weak Area Detection",
    description: "AI analyzes your quiz results and study patterns to pinpoint exactly what to review.",
    color: "text-accent-rose",
    bg: "bg-accent-rose/10",
    glow: "group-hover:shadow-[0_0_30px_rgba(244,130,158,0.12)]",
    span: "",
  },
  {
    icon: Zap,
    title: "Daily Challenges",
    description: "Stay sharp with daily AI-generated practice. Build streaks and earn XP as you grow.",
    color: "text-primary-light",
    bg: "bg-primary-light/10",
    glow: "group-hover:shadow-[0_0_30px_rgba(242,153,122,0.12)]",
    span: "sm:col-span-2 lg:col-span-1",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl">
            AI That Understands <span className="gradient-text">Your Learning</span>
          </h2>
          <p className="mx-auto max-w-md text-text-secondary">
            Every feature is powered by AI to make your learning experience smarter, faster, and more effective.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((cap) => (
            <motion.div key={cap.title} variants={cardVariants} className={cap.span}>
              <div className={`group h-full rounded-2xl border border-glass-border bg-bg-elevated p-6 transition-all duration-300 hover:border-primary/15 ${cap.glow}`}>
                {/* Icon */}
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${cap.bg}`}>
                  <cap.icon className={`h-5 w-5 ${cap.color}`} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-base font-bold text-text-primary">
                  {cap.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
