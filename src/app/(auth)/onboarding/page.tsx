"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Brain, Code, Shield, Smartphone, Database, Palette, Check } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

/**
 * Onboarding — 4-step wizard collecting learning preferences.
 *
 * Step 1: Learning goal
 * Step 2: Experience level
 * Step 3: Learning style
 * Step 4: Interests
 *
 * On completion → mock AI loading → redirect to dashboard.
 */

const TOTAL_STEPS = 4;

const goalOptions = [
  { id: "ai-ml", label: "AI / ML Engineer", icon: Brain, color: "bg-violet-500/10 border-violet-500/20 text-violet-400" },
  { id: "web-dev", label: "Full Stack Developer", icon: Code, color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
  { id: "data-science", label: "Data Scientist", icon: Database, color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  { id: "mobile-dev", label: "Mobile App Developer", icon: Smartphone, color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
  { id: "cybersecurity", label: "Cybersecurity Expert", icon: Shield, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  { id: "ui-ux", label: "UI/UX Designer", icon: Palette, color: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400" },
];

const levelOptions = [
  { id: "beginner", label: "Beginner", description: "I'm just starting out. Teach me the fundamentals.", emoji: "🌱" },
  { id: "intermediate", label: "Intermediate", description: "I have some experience. Help me go deeper.", emoji: "🚀" },
  { id: "advanced", label: "Advanced", description: "I'm experienced. Show me advanced concepts.", emoji: "⚡" },
];

const styleOptions = [
  { id: "visual", label: "Visual", description: "Diagrams, videos, and visual explanations", emoji: "👁️" },
  { id: "reading", label: "Reading", description: "Articles, documentation, and text-based content", emoji: "📖" },
  { id: "hands-on", label: "Hands-On", description: "Projects, coding exercises, and practice", emoji: "🛠️" },
  { id: "mixed", label: "Mixed", description: "A blend of all styles, adapted by AI", emoji: "🎯" },
];

const interestTags = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning",
  "Data Analysis", "SQL", "MongoDB", "AWS", "Docker",
  "Git", "REST APIs", "GraphQL", "Tailwind CSS", "Figma",
  "Algorithms", "System Design", "Ethical Hacking", "Networking",
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Selections
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedGoal;
      case 2: return !!selectedLevel;
      case 3: return !!selectedStyle;
      case 4: return selectedInterests.length >= 3;
      default: return false;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      // Complete onboarding
      setIsGenerating(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }
  };

  const prev = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  // ── Generating screen ──
  if (isGenerating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* Background orb */}
        <motion.div
          className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-primary/[0.08] blur-[100px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-7 w-7 text-primary" />
          </motion.div>
          <h2 className="mb-2 text-xl font-bold text-text-primary">AI is creating your path...</h2>
          <p className="text-sm text-text-secondary">Analyzing your goals and preferences</p>
          {/* Progress dots */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-primary/60"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Background ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-accent-cyan/[0.03] blur-[80px]" />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <Logo size="sm" />
        <span className="text-xs text-text-muted">Step {step} of {TOTAL_STEPS}</span>
      </div>

      {/* ── Progress Bar ── */}
      <div className="relative z-10 mx-auto w-full max-w-xl px-6">
        <div className="h-1 w-full rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Step 1: Goal */}
              {step === 1 && (
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">
                    What&apos;s your <span className="gradient-text">learning goal</span>?
                  </h2>
                  <p className="mb-8 text-sm text-text-secondary">
                    Pick a goal — AI will create a personalized learning path for you.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {goalOptions.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = selectedGoal === goal.id;
                      return (
                        <button
                          key={goal.id}
                          onClick={() => setSelectedGoal(goal.id)}
                          className={cn(
                            "relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                            isSelected
                              ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_rgba(226,135,102,0.1)]"
                              : "border-glass-border bg-bg-elevated hover:border-primary/20 hover:bg-bg-hover"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border", goal.color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-semibold text-text-primary">{goal.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Level */}
              {step === 2 && (
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">
                    What&apos;s your <span className="gradient-text">experience level</span>?
                  </h2>
                  <p className="mb-8 text-sm text-text-secondary">
                    This helps AI calibrate the difficulty of your learning path.
                  </p>
                  <div className="space-y-3">
                    {levelOptions.map((level) => {
                      const isSelected = selectedLevel === level.id;
                      return (
                        <button
                          key={level.id}
                          onClick={() => setSelectedLevel(level.id)}
                          className={cn(
                            "relative flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200",
                            isSelected
                              ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_rgba(226,135,102,0.1)]"
                              : "border-glass-border bg-bg-elevated hover:border-primary/20 hover:bg-bg-hover"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <span className="text-2xl">{level.emoji}</span>
                          <div>
                            <p className="text-sm font-bold text-text-primary">{level.label}</p>
                            <p className="text-xs text-text-secondary">{level.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Style */}
              {step === 3 && (
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">
                    How do you like to <span className="gradient-text">learn</span>?
                  </h2>
                  <p className="mb-8 text-sm text-text-secondary">
                    AI will prioritize content that matches your preferred style.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {styleOptions.map((style) => {
                      const isSelected = selectedStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={cn(
                            "relative flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition-all duration-200",
                            isSelected
                              ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_rgba(226,135,102,0.1)]"
                              : "border-glass-border bg-bg-elevated hover:border-primary/20 hover:bg-bg-hover"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <span className="text-2xl">{style.emoji}</span>
                          <p className="text-sm font-bold text-text-primary">{style.label}</p>
                          <p className="text-xs text-text-secondary">{style.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Interests */}
              {step === 4 && (
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">
                    Pick your <span className="gradient-text">interests</span>
                  </h2>
                  <p className="mb-8 text-sm text-text-secondary">
                    Select at least 3 topics you&apos;re interested in. AI will incorporate these into your path.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interestTags.map((tag) => {
                      const isSelected = selectedInterests.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleInterest(tag)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                            isSelected
                              ? "border-primary/40 bg-primary/15 text-primary shadow-[0_0_12px_rgba(226,135,102,0.1)]"
                              : "border-glass-border bg-bg-elevated text-text-secondary hover:border-primary/20 hover:text-text-primary"
                          )}
                        >
                          {isSelected && <Check className="mr-1.5 inline h-3 w-3" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs text-text-muted">
                    {selectedInterests.length}/3 minimum selected
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-between px-6 pb-8">
        <button
          onClick={prev}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary disabled:opacity-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={next}
          disabled={!canProceed()}
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === TOTAL_STEPS ? (
            <>
              <Sparkles className="h-4 w-4" />
              Generate My Path
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
