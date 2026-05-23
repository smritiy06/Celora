"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockQuizQuestions } from "@/data/quizzes";
import { cn } from "@/lib/utils";

export default function QuizTakingPage({ params }: { params: Promise<{ quizId: string }> }) {
  use(params);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mockQuizQuestions.length).fill(null));

  const question = mockQuizQuestions[currentQ];
  const isLast = currentQ === mockQuizQuestions.length - 1;

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === question.correctAnswer) setScore(s => s + 1);

    if (isLast) {
      setShowResult(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
    }
  };

  if (showResult) {
    const accuracy = Math.round((score / mockQuizQuestions.length) * 100);
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <GlassCard variant="elevated" padding="lg" className="text-center">
            <div className="mb-4 text-6xl">{accuracy >= 80 ? "🏆" : accuracy >= 60 ? "👍" : "📚"}</div>
            <h1 className="mb-2 text-2xl font-bold text-text-primary">Quiz Complete!</h1>
            <p className="mb-6 text-text-muted">You scored {score}/{mockQuizQuestions.length}</p>
            <div className="mb-6 flex justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${accuracy * 2.64} ${264 - accuracy * 2.64}`} />
                  <defs><linearGradient id="gradient"><stop stopColor="var(--color-primary)" /><stop offset="1" stopColor="var(--color-accent-cyan)" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-text-primary">{accuracy}%</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/quiz" className="rounded-lg bg-white/[0.04] border border-white/[0.08] px-6 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/[0.08] transition-colors">
                Back to Quizzes
              </Link>
              <button onClick={() => { setCurrentQ(0); setSelectedAnswer(null); setShowResult(false); setScore(0); setAnswers(new Array(mockQuizQuestions.length).fill(null)); }} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
                Retry
              </button>
            </div>
          </GlassCard>

          {/* Answer Review */}
          <GlassCard variant="elevated" padding="md">
            <h2 className="mb-4 font-semibold text-text-primary">Answer Review</h2>
            <div className="space-y-3">
              {mockQuizQuestions.map((q, i) => {
                const isCorrect = answers[i] === q.correctAnswer;
                return (
                  <div key={q.id} className={cn("rounded-lg p-3 border", isCorrect ? "bg-accent-emerald/5 border-accent-emerald/20" : "bg-accent-rose/5 border-accent-rose/20")}>
                    <div className="flex items-start gap-2 mb-1">
                      {isCorrect ? <CheckCircle className="h-4 w-4 text-accent-emerald mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 text-accent-rose mt-0.5 shrink-0" />}
                      <span className="text-sm text-text-primary">{q.question}</span>
                    </div>
                    <p className="ml-6 text-xs text-text-muted">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/quiz" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Exit Quiz
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">Q{currentQ + 1}/{mockQuizQuestions.length}</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan transition-all" style={{ width: `${((currentQ + 1) / mockQuizQuestions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <GlassCard variant="elevated" padding="lg">
            <span className={cn("mb-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
              question.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400" :
              question.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" :
              "bg-rose-500/10 text-rose-400"
            )}>{question.difficulty}</span>
            <h2 className="mb-6 text-lg font-semibold text-text-primary">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(i)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left text-sm transition-all",
                    selectedAnswer === i
                      ? "bg-primary/10 border-primary/40 text-primary-light"
                      : "bg-white/[0.02] border-white/[0.06] text-text-secondary hover:bg-white/[0.04] hover:border-white/[0.1]"
                  )}
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40 transition-all flex items-center justify-center gap-2"
        >
          {isLast ? "Submit Quiz" : "Next Question"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </PageTransition>
  );
}
