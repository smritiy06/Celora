"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { landingNavItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { AIHeroSection } from "@/features/landing/AIHeroSection";
import { HowItWorks } from "@/features/landing/HowItWorks";
import { FeaturesSection } from "@/features/landing/FeaturesSection";
import { CapabilitiesSection } from "@/features/landing/CapabilitiesSection";
import { FaqSection } from "@/features/landing/FaqSection";
import { Footer } from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

/**
 * Landing Page — Celora AI Learning Platform
 *
 * AI-first design: Hero → How It Works → Features → Capabilities → FAQ → CTA → Footer
 * No marketplace patterns: no course grids, no fake stats, no testimonials.
 */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ─── Navbar ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-bg-primary/80 backdrop-blur-xl border-b border-glass-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            {landingNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-5 md:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-text-primary transition-opacity hover:opacity-70"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-md hover:shadow-primary/25"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-glass-border bg-bg-primary/95 backdrop-blur-xl md:hidden"
            >
              <div className="px-6 py-4">
                {landingNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-4 flex flex-col gap-3 border-t border-glass-border pt-4">
                  <Link
                    href="/login"
                    className="block py-2 text-center text-sm font-medium text-text-primary"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── Page Sections ─── */}
      <AIHeroSection />
      <HowItWorks />
      <FeaturesSection />
      <CapabilitiesSection />
      <FaqSection />

      {/* ─── CTA Section ─── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-primary/15 bg-bg-elevated p-12 sm:p-16"
          >
            <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl">
              Ready to <span className="gradient-text">Start Learning</span>?
            </h2>
            <p className="mb-8 text-lg text-text-secondary">
              Set your first learning goal and let AI create your personalized path. Free to get started.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
            >
              Begin Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
