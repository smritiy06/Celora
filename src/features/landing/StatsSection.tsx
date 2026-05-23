"use client";

import { motion } from "framer-motion";

/**
 * Stats Section — wide unified container with gradient border.
 *
 * 3-column layout: "200+ Expert Courses", "150+ Industry Experts",
 * "10k+ Active Learners" with small circle decorations.
 */
const stats = [
  {
    value: "200",
    suffix: "+",
    label: "Expert Courses",
    description: "From beginner to advanced AI topics.",
  },
  {
    value: "150",
    suffix: "+",
    label: "Industry Experts",
    description: "Learn from AI professionals and researchers.",
  },
  {
    value: "10k",
    suffix: "+",
    label: "Active Learners",
    description: "Join a global community of builders.",
  },
] as const;

export function StatsSection() {
  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-primary/15 bg-bg-elevated p-8 md:p-12 lg:p-14"
        >
          {/* Subtle gradient glow behind the card */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/[0.04] via-transparent to-primary/[0.04]" />

          <div className="relative grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-glass-border">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center md:px-8"
              >
                {/* Circle decoration */}
                <div className="relative mb-5">
                  <span className="text-5xl font-black tracking-tight text-text-primary md:text-6xl">
                    {stat.value}
                    <span className="text-primary">{stat.suffix}</span>
                  </span>
                  <div className="absolute -right-3 -top-1 h-2.5 w-2.5 rounded-full border-[1.5px] border-text-muted/40" />
                </div>
                <h3 className="mb-1.5 text-base font-bold text-text-primary">
                  {stat.label}
                </h3>
                <p className="max-w-[200px] text-sm leading-relaxed text-text-secondary">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
