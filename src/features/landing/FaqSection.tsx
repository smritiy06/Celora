"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { mockFaq } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="px-6 py-24 bg-bg-secondary/30">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold text-primary-light uppercase tracking-wider">FAQ</span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {mockFaq.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.08}>
              <div
                className={cn(
                  "rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden transition-colors",
                  openId === item.id && "bg-white/[0.05] border-white/[0.1]"
                )}
              >
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-text-primary">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-text-muted transition-transform duration-300",
                      openId === item.id && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-4 text-sm text-text-muted leading-relaxed">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
