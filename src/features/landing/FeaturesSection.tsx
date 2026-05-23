"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Zap, Globe } from "lucide-react";

/**
 * Features Section — 4-column icon grid at bottom of landing page.
 *
 * Exact content from design:
 * "Learn Hands-on", "Expert Mentorship", "Career Growth", "Community First"
 */
const features = [
  {
    title: "Learn Hands-on",
    description: "Practice with real projects and interactive notebooks.",
    icon: BookOpen,
  },
  {
    title: "Expert Mentorship",
    description: "Get guidance from industry experts and mentors.",
    icon: Users,
  },
  {
    title: "Career Growth",
    description: "Build in-demand skills and land your dream role.",
    icon: Zap,
  },
  {
    title: "Community First",
    description: "Learn, share and grow with a global community.",
    icon: Globe,
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-20" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="flex flex-col"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border bg-bg-elevated text-text-secondary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-text-primary">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
