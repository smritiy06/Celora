"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * FAQ Section — answers to common questions about the AI learning platform.
 * Inline data — no external mock file needed.
 */

const faqs = [
  {
    id: "faq-1",
    question: "What is Celora?",
    answer: "Celora is an AI-powered adaptive learning platform. You set a learning goal, and AI generates a personalized roadmap with modules, quizzes, and tasks. Think of it as your intelligent study companion.",
  },
  {
    id: "faq-2",
    question: "How does the AI create my learning path?",
    answer: "When you set a goal (like 'Become an ML Engineer'), our AI analyzes the skills needed, your current level, and your learning style to create a structured roadmap with modules in the optimal order.",
  },
  {
    id: "faq-3",
    question: "How does the AI Tutor work?",
    answer: "The AI Tutor uses advanced language models to explain concepts, answer doubts, generate practice questions, create summaries, and build flashcards — all personalized to your current learning context.",
  },
  {
    id: "faq-4",
    question: "Can I track my learning progress?",
    answer: "Absolutely! Celora provides detailed analytics including study time tracking, quiz performance, streak tracking, skill heatmaps, and AI-generated recommendations on what to focus on next.",
  },
  {
    id: "faq-5",
    question: "Is this different from Udemy or Coursera?",
    answer: "Yes. Celora is not a course marketplace. There are no random courses to browse. Instead, you set a learning goal, and AI builds a personalized path specifically for you, with continuous guidance and adaptation.",
  },
  {
    id: "faq-6",
    question: "What topics does Celora cover?",
    answer: "We cover AI/ML, Web Development, Data Structures & Algorithms, Cybersecurity, Mobile Development, Databases, UI/UX Design, and more. AI can generate paths for nearly any tech topic.",
  },
] as const;

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary">
            Everything you need to know about Celora.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-glass-border bg-bg-elevated overflow-hidden transition-all duration-200 hover:border-primary/15"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-text-primary pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4 text-sm leading-relaxed text-text-secondary">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
