"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * AI Hero Section — the centrepiece of Celora's landing page.
 *
 * "What do you want to become?" with a typewriter-cycling input placeholder
 * and animated orb/particle background. Zero fake stats.
 */

const goals = [
  "a Machine Learning Engineer",
  "a Full Stack Developer",
  "a Data Scientist",
  "a Cybersecurity Expert",
  "a Mobile App Developer",
  "a Backend Engineer",
];

export function AIHeroSection() {
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const goal = goals[currentGoalIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < goal.length) {
        timeout = setTimeout(() => setDisplayText(goal.slice(0, displayText.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 35);
      } else {
        setIsDeleting(false);
        setCurrentGoalIndex((prev) => (prev + 1) % goals.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentGoalIndex]);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* ── Animated Background Orbs ── */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-cyan/[0.05] blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-accent-amber/[0.04] blur-[80px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Floating Particles ── */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -40 - i * 10, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Adaptive Learning
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 text-[2.75rem] font-black leading-[1.08] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
        >
          What do you want
          <br />
          to <span className="gradient-text">become</span>?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-12 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Set your goal. AI creates your learning path.
          Study with an intelligent companion that adapts to you.
        </motion.p>

        {/* Typewriter Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mb-10 max-w-xl"
        >
          <div className="group relative rounded-2xl border border-glass-border bg-bg-elevated/80 backdrop-blur-xl p-1.5 transition-all duration-300 hover:border-primary/30 focus-within:border-primary/40 shadow-card">
            <div className="flex items-center gap-3 rounded-xl bg-bg-primary/60 px-5 py-4">
              <Sparkles className="h-5 w-5 shrink-0 text-primary/60" />
              <div className="flex-1 text-left">
                <span className="text-base text-text-primary sm:text-lg">
                  I want to become{" "}
                </span>
                <span className="text-base text-primary font-semibold sm:text-lg">
                  {displayText}
                </span>
                <motion.span
                  className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Your Journey
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#how-it-works"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
          >
            See how it works
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Subtle AI hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-xs text-text-muted"
        >
          Powered by AI — personalized paths generated in seconds
        </motion.p>
      </div>
    </section>
  );
}
