"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

/**
 * Footer — AI learning platform branding.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-glass-border bg-bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              AI-powered adaptive learning platform. Set goals, get personalized paths, and learn with an intelligent companion.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Platform</h4>
            <ul className="space-y-2.5">
              {["Learning Paths", "AI Tutor", "Quiz Arena", "Goals"].map((item) => (
                <li key={item}>
                  <Link href="/dashboard" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Resources</h4>
            <ul className="space-y-2.5">
              {["Documentation", "API", "Blog", "Changelog"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-text-primary">Company</h4>
            <ul className="space-y-2.5">
              {["About", "Careers", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-glass-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {currentYear} Celora. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built with AI, designed for learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
