"use client";

import { motion } from "framer-motion";
import { Target, Sparkles, BookOpen, TrendingUp } from "lucide-react";

/**
 * How It Works — 4-step flow showing the AI-first learning journey.
 * Set Goal → AI Creates Path → Learn with AI → Track & Grow
 */

const steps = [
  {
    icon: Target,
    title: "Set Your Goal",
    description: "Tell us what you want to become. Pick a career goal, skill, or interest area.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Sparkles,
    title: "AI Creates Your Path",
    description: "Our AI generates a personalized roadmap with modules, tasks, and milestones.",
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
    border: "border-accent-cyan/20",
  },
  {
    icon: BookOpen,
    title: "Learn with AI Guidance",
    description: "Study with an AI tutor that explains concepts, generates quizzes, and adapts to your pace.",
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
    border: "border-accent-amber/20",
  },
  {
    icon: TrendingUp,
    title: "Track & Grow",
    description: "Monitor progress, identify weak areas, and watch your skills evolve with AI insights.",
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/10",
    border: "border-accent-emerald/20",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
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
            How <span className="gradient-text">Celora</span> Works
          </h2>
          <p className="mx-auto max-w-md text-text-secondary">
            Four simple steps from setting your goal to mastering new skills — all powered by AI.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={itemVariants}>
              <div className="group relative h-full rounded-2xl border border-glass-border bg-bg-elevated p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-card-hover">
                {/* Step number */}
                <div className="absolute -top-3 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-bg-primary border border-glass-border text-xs font-bold text-text-muted">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${step.bg} border ${step.border}`}>
                  <step.icon className={`h-5.5 w-5.5 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-base font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>

                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-glass-border lg:block" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
