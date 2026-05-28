"use client";

import { motion } from "framer-motion";
import { Layers, GraduationCap, BarChart3 } from "lucide-react";

/**
 * Features Section — focused on AI learning capabilities.
 * Clean 3-column layout with icon-driven feature cards.
 */

const features = [
  {
    icon: Layers,
    title: "Goal-Based Learning",
    description:
      "No random courses. Every module, quiz, and task is connected to your personal learning goal. AI keeps you on track.",
  },
  {
    icon: GraduationCap,
    title: "Mentor-Guided Growth",
    description:
      "Expert mentors create structured paths and review your projects. AI assists, mentors guide — the best of both worlds.",
  },
  {
    icon: BarChart3,
    title: "Intelligent Progress",
    description:
      "AI tracks your strengths, identifies gaps, and adjusts your roadmap. Real insights, not vanity metrics.",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl">
            Not a Course Marketplace.
            <br />
            <span className="gradient-text">A Learning Ecosystem.</span>
          </h2>
          <p className="mx-auto max-w-lg text-text-secondary">
            Celora isn&apos;t about buying courses. It&apos;s about setting a goal and letting AI build the fastest path to get you there.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <div className="rounded-2xl border border-glass-border bg-bg-elevated p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-card-hover h-full">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/15">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
