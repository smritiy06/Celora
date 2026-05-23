"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowRight } from "lucide-react";

/**
 * Hero Section — exact replica of the Celora design reference.
 *
 * Layout: 2-column grid (copy left, illustration right).
 * Features: "AI LEARNING PLATFORM" badge, headline, subtitle,
 *           dual CTA buttons, avatar social-proof row.
 *
 * The illustration uses a 3D flip animation (rotateY) when
 * the user toggles between light and dark themes.
 */

/** Flip animation variants — rotates around the Y axis */
const flipVariants = {
  initial: { rotateY: 90, opacity: 0, scale: 0.92 },
  animate: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    rotateY: -90,
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
  },
};

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const heroSrc = isDark
    ? "/images/landing/hero-dark.png"
    : "/images/landing/hero-light.png";

  return (
    <section className="relative overflow-hidden pt-28 pb-8 sm:pt-32 sm:pb-12 md:pt-36 md:pb-16">
      {/* Decorative background circles (dark mode only) */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-3xl dark:bg-primary/[0.06]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-text-muted/10 dark:block hidden" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── Left Column: Copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="max-w-xl"
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
              AI Learning Platform
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-[2.75rem] font-black leading-[1.1] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-[4rem]">
              Learn AI.
              <br />
              Build the Future
              <span className="text-primary">.</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg">
              Master AI with hands-on courses, real-world projects,
              and a community that grows with you.
            </p>

            {/* Dual CTA */}
            <div className="mb-12 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Learning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/courses"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-text-primary transition-colors hover:text-primary"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-bg-primary bg-bg-tertiary"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent-amber/30" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-secondary">
                Join <span className="font-semibold text-text-primary">25,000+</span> learners worldwide
              </p>
            </div>
          </motion.div>

          {/* ── Right Column: Illustration with 3D Flip ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            style={{ perspective: 1200 }}
          >
            <div className="relative aspect-square w-full">
              {!mounted ? (
                /* SSR placeholder — avoids hydration mismatch */
                <Image
                  src="/images/landing/hero-dark.png"
                  alt="Person learning AI at a desk"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={resolvedTheme}
                    variants={flipVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0"
                    style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                  >
                    <Image
                      src={heroSrc}
                      alt="Person learning AI at a desk"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
