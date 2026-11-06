"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, FolderKanban, GraduationCap, Rocket, Sprout, Target, TrendingUp, Trophy, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/layout/Public";
import { categoryIcon } from "@/components/shared/learning";
import { Button } from "@/components/ui/button";
import { ErrorState, ProgressBar } from "@/components/ui/misc";
import { CATEGORIES, DIFFICULTIES, LEARNING_GOALS } from "@/constants/catalog";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { Difficulty, Role } from "@/types/domain";

interface Answers {
  role: Role | null;
  interests: string[];
  goal: string | null;
  level: Difficulty | null;
}

const STORAGE_KEY = "celora.onboarding";

const LEVELS: Record<Difficulty, { hint: string; icon: LucideIcon }> = {
  beginner: { hint: "I'm just starting out. Teach me the fundamentals.", icon: Sprout },
  intermediate: { hint: "I have some experience. Help me go deeper.", icon: TrendingUp },
  advanced: { hint: "I'm experienced. Show me advanced concepts.", icon: Rocket },
};

const GOAL_ICONS: Record<string, LucideIcon> = {
  "career-switch": Target,
  "exam-prep": Trophy,
  portfolio: FolderKanban,
  curiosity: Compass,
};

function Choice({
  type,
  name,
  checked,
  onChange,
  label,
  hint,
  icon: Icon,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-16 cursor-pointer items-center gap-3.5 rounded-card border bg-surface p-4 shadow-card transition-colors",
        checked ? "border-accent bg-accent-soft" : "hover:border-line-strong"
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", checked ? "bg-accent text-on-accent" : "bg-accent-soft text-accent-ink")}>
        <Icon aria-hidden className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[13px] text-ink-2">{hint}</span>}
      </span>
      {checked && <Check aria-hidden className="h-[18px] w-[18px] shrink-0 text-accent-ink" />}
    </label>
  );
}

function Step({ title, hint, children, grid }: { title: string; hint?: string; children: ReactNode; grid?: boolean }) {
  return (
    <fieldset>
      <legend className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</legend>
      {hint && <p className="mt-2 text-sm text-ink-2">{hint}</p>}
      <div className={cn("mt-7 gap-3", grid ? "grid sm:grid-cols-2" : "space-y-3")}>{children}</div>
    </fieldset>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const client = useQueryClient();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({ role: null, interests: [], goal: null, level: null });

  // Answers survive a refresh or an accidental back.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {
      /* Start fresh if storage is unavailable. */
    }
    // Arriving from the teacher portal's sign-up means they're here to teach.
    if (new URLSearchParams(window.location.search).get("as") === "teacher") {
      setAnswers((a) => ({ ...a, role: a.role ?? "teacher" }));
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* Answers still work for this page view. */
    }
  }, [answers]);

  const finish = useMutation({
    mutationFn: async () => {
      // Creates the profile first if this is the very first request after sign-up.
      await api.me();
      return api.completeOnboarding({ ...answers, role: answers.role ?? "student" });
    },
    onSuccess: (user) => {
      client.setQueryData(["me"], user);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* Nothing to clear. */
      }
      router.replace(user.role === "teacher" ? "/teacher" : "/dashboard");
    },
  });

  const teaching = answers.role === "teacher";
  const steps = teaching ? ["role", "interests"] : ["role", "interests", "goal", "level"];
  const current = steps[Math.min(step, steps.length - 1)];
  const isLast = step >= steps.length - 1;
  const canContinue = current === "role" ? Boolean(answers.role) : current === "interests" ? answers.interests.length > 0 : true;
  const go = (delta: number) => {
    setDirection(delta);
    setStep((s) => s + delta);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <Wordmark href="#" />
        <span className="text-[13px] text-ink-3">Step {step + 1} of {steps.length}</span>
      </div>
      <ProgressBar percent={Math.round(((step + 1) / steps.length) * 100)} label="Setup progress" className="mt-5" />

      <main id="main" className="flex flex-1 flex-col justify-center py-10">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current}
            initial={{ x: direction * 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -24, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {current === "role" && (
              <Step title="How will you use Celora?">
                <Choice type="radio" name="role" icon={BookOpen} label="To learn" hint="Take courses and quizzes and track your progress." checked={answers.role === "student"} onChange={() => setAnswers({ ...answers, role: "student" })} />
                <Choice type="radio" name="role" icon={GraduationCap} label="To teach" hint="Create courses and quizzes. You can still learn too." checked={answers.role === "teacher"} onChange={() => setAnswers({ ...answers, role: "teacher" })} />
              </Step>
            )}
            {current === "interests" && (
              <Step title={teaching ? "What do you teach?" : "What do you want to learn?"} hint="Choose at least one. You can change this later." grid>
                {CATEGORIES.map((category) => (
                  <Choice
                    key={category.id}
                    type="checkbox"
                    name="interests"
                    icon={categoryIcon(category.id)}
                    label={category.label}
                    checked={answers.interests.includes(category.id)}
                    onChange={() =>
                      setAnswers({
                        ...answers,
                        interests: answers.interests.includes(category.id)
                          ? answers.interests.filter((i) => i !== category.id)
                          : [...answers.interests, category.id],
                      })
                    }
                  />
                ))}
              </Step>
            )}
            {current === "goal" && (
              <Step title="What's your learning goal?" hint="Optional. This helps us suggest where to start." grid>
                {LEARNING_GOALS.map((goal) => (
                  <Choice key={goal.id} type="radio" name="goal" icon={GOAL_ICONS[goal.id] ?? Target} label={goal.label} hint={goal.hint} checked={answers.goal === goal.id} onChange={() => setAnswers({ ...answers, goal: goal.id })} />
                ))}
              </Step>
            )}
            {current === "level" && (
              <Step title="What's your experience level?" hint="Optional. We'll show courses at your level first.">
                {DIFFICULTIES.map((level) => (
                  <Choice key={level} type="radio" name="level" icon={LEVELS[level].icon} label={level[0].toUpperCase() + level.slice(1)} hint={LEVELS[level].hint} checked={answers.level === level} onChange={() => setAnswers({ ...answers, level })} />
                ))}
              </Step>
            )}
          </motion.div>
        </AnimatePresence>
        {finish.error && (
          <div className="mt-6">
            <ErrorState error={finish.error} onRetry={() => finish.mutate()} />
          </div>
        )}
      </main>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="ghost" disabled={step === 0} onClick={() => go(-1)}>
          <ArrowLeft aria-hidden className="h-4 w-4" /> Back
        </Button>
        {isLast ? (
          <Button disabled={!canContinue || finish.isPending} onClick={() => finish.mutate()}>
            {finish.isPending ? "Saving…" : "Finish"}
          </Button>
        ) : (
          <Button disabled={!canContinue} onClick={() => go(1)}>
            Continue <ArrowRight aria-hidden className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
