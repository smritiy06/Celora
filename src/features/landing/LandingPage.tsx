"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  FileText,
  GraduationCap,
  Layers,
  Menu,
  Route,
  Search,
  Target,
  TrendingUp,
  BarChart3,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Footer, Wordmark } from "@/components/layout/Public";
import { IconTile } from "@/components/shared/learning";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/misc";

const NAV = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "FAQ", href: "#faq" },
  { label: "Courses", href: "/courses" },
  { label: "Teach", href: "/teach" },
];

const GOALS = [
  "a Machine Learning Engineer",
  "a Full Stack Developer",
  "a Data Scientist",
  "a Cybersecurity Expert",
  "a Mobile App Developer",
];

type Tone = "accent" | "info" | "success" | "warn" | "danger";

const STEPS: { icon: LucideIcon; tone: Tone; title: string; text: string }[] = [
  { icon: Target, tone: "accent", title: "Set your goal", text: "Tell us what you want to learn and where you're starting from, and we'll suggest where to begin." },
  { icon: Layers, tone: "info", title: "Follow structured courses", text: "Work through modules and lessons from teachers, with your notes saved beside each one." },
  { icon: BookOpen, tone: "warn", title: "Practice with quizzes", text: "Take timed quizzes and get a clear explanation for every answer, right or wrong." },
  { icon: TrendingUp, tone: "success", title: "Track and grow", text: "Build a streak, earn XP, and see your weakest topics so you know what to revisit." },
];

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Layers, title: "Goal-based learning", text: "Tell us your goal, level, and interests. Suggestions are ordered around them, so the next step is always clear." },
  { icon: GraduationCap, title: "Teacher-led courses", text: "Teachers write every course and quiz, then see how learners are doing and which lesson they stop at." },
  { icon: BarChart3, title: "Honest progress", text: "Scores are broken down by topic, weakest first. Retakes only earn XP when you beat your best, so the numbers mean something." },
];

const CAPABILITIES: { icon: LucideIcon; tone: Tone; title: string; text: string }[] = [
  { icon: BookOpen, tone: "accent", title: "Focused lessons", text: "Read or watch in a distraction-free player, with resources and a quick knowledge check." },
  { icon: FileText, tone: "info", title: "Notes that save themselves", text: "Write beside any lesson and search all your notes in one place later." },
  { icon: Brain, tone: "warn", title: "Explained quizzes", text: "Timed quizzes tagged by topic, with an explanation for every question when you finish." },
  { icon: Route, tone: "success", title: "Personal suggestions", text: "Courses ordered around your interests and level, with your next lesson one click away." },
  { icon: Search, tone: "danger", title: "Weak-area detection", text: "Your results show exactly which topics need another look." },
  { icon: Zap, tone: "accent", title: "Daily quiz and streaks", text: "Stay sharp with a new quiz each day, build streaks, and earn XP as you grow." },
];

const FAQS = [
  { q: "What is Celora?", a: "A learning platform that combines structured courses, quizzes that explain every answer, and progress tracking, so you always know what to learn next." },
  { q: "Who creates the courses?", a: "Teachers on Celora. Anyone can sign up to teach, and a course only goes live once its author publishes it." },
  { q: "Is there an AI Tutor?", a: "Yes. It explains concepts, writes study notes and practice questions, helps debug code, and can read the lesson you have open. Its answers are AI-generated, so check important details against your course." },
  { q: "Can I track my progress?", a: "Yes. Celora tracks lessons, quiz scores by topic, learning time, streaks, and XP, and shows which topics are worth revisiting." },
  { q: "Who can see my progress?", a: "Your notes and scores are private. If you stay on the leaderboard, others see your first name, last initial, and XP. You can turn that off in Settings." },
  { q: "How much does it cost?", a: "Courses and quizzes are currently free." },
];

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function Heading({ title, text }: { title: string; text: string }) {
  return (
    <Reveal>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        <p className="mt-3 text-ink-2">{text}</p>
      </div>
    </Reveal>
  );
}

function GoalTyper() {
  const [goalIndex, setGoalIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const goal = GOALS[goalIndex];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < goal.length) {
      timer = setTimeout(() => setText(goal.slice(0, text.length + 1)), 55);
    } else if (!deleting) {
      timer = setTimeout(() => setDeleting(true), 2200);
    } else if (text.length > 0) {
      timer = setTimeout(() => setText(text.slice(0, -1)), 30);
    } else {
      timer = setTimeout(() => {
        setDeleting(false);
        setGoalIndex((i) => (i + 1) % GOALS.length);
      }, 150);
    }
    return () => clearTimeout(timer);
  }, [text, deleting, goalIndex]);

  return (
    <Card padding="none" className="mx-auto mb-8 max-w-xl p-1.5">
      <div className="flex min-h-14 items-center gap-3 rounded-lg bg-sunken px-4 text-left">
        <Target aria-hidden className="h-5 w-5 shrink-0 text-accent-ink" />
        <p className="text-[15px] text-ink sm:text-base" aria-label="I want to become a professional in my chosen field">
          <span aria-hidden>
            I want to become <span className="font-semibold text-accent-ink">{text}</span>
            <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-accent" />
          </span>
        </p>
      </div>
    </Card>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2.5">
      {FAQS.map((faq, index) => {
        const isOpen = open === index;
        return (
          <Card key={faq.q} padding="none" className="overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left text-sm font-medium text-ink"
            >
              {faq.q}
              <ChevronDown aria-hidden className={`h-4 w-4 shrink-0 text-ink-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-ink-2">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Wordmark />
          <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-ink-2 hover:text-ink">{item.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href="/login" variant="ghost" size="sm" className="hidden md:inline-flex">Log in</ButtonLink>
            <ButtonLink href="/signup" size="sm" className="hidden md:inline-flex">Sign up</ButtonLink>
            <button onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={menuOpen} className="rounded-lg p-2 text-ink-2 md:hidden">
              {menuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav aria-label="Mobile" className="border-t px-4 py-3 md:hidden">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center text-sm text-ink-2">{item.label}</Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t pt-3">
              <ButtonLink href="/login" variant="secondary" size="sm">Log in</ButtonLink>
              <ButtonLink href="/signup" size="sm">Sign up</ButtonLink>
            </div>
          </nav>
        )}
      </header>

      <main id="main">
        <section className="px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-4xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-lg border bg-surface px-3 py-1.5 text-[13px] font-medium text-accent-ink shadow-card">
              <Target aria-hidden className="h-3.5 w-3.5" /> Goal-based learning
            </p>
            <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              What do you want
              <br />
              to <span className="text-accent-ink">become</span>?
            </h1>
            <p className="mx-auto mb-10 mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
              Set your goal, follow structured courses, and test yourself with quizzes that explain every answer and show you what to revisit.
            </p>
            <GoalTyper />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/signup" size="lg" className="w-full sm:w-auto">
                Start your journey <ArrowRight aria-hidden className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/courses" size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore courses
              </ButtonLink>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-16 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Heading title="How Celora works" text="Four simple steps from setting your goal to mastering new skills." />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <Reveal delay={i * 0.06}>
                    <Card className="relative h-full">
                      <span className="absolute right-5 top-5 text-sm font-medium tabular-nums text-ink-3">0{i + 1}</span>
                      <div className="mb-4"><IconTile icon={step.icon} tone={step.tone} size="lg" /></div>
                      <h3 className="mb-2 font-semibold text-ink">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-ink-2">{step.text}</p>
                    </Card>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 border-y bg-surface px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Heading title="More than watching lessons" text="Celora connects courses, practice, and progress, so you always know what you've understood and what to do next." />
            <div className="grid gap-4 md:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 0.06}>
                  <div className="h-full rounded-card border bg-canvas p-7">
                    <div className="mb-5"><IconTile icon={feature.icon} size="lg" /></div>
                    <h3 className="mb-2 text-lg font-semibold text-ink">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-2">{feature.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-16 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Heading title="Built around your learning" text="Everything you need to study, practice, and see real progress in one place." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((cap, i) => (
                <Reveal key={cap.title} delay={i * 0.04}>
                  <Card className="h-full">
                    <div className="mb-4"><IconTile icon={cap.icon} tone={cap.tone} /></div>
                    <h3 className="mb-1.5 font-semibold text-ink">{cap.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-2">{cap.text}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-16 px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <Heading title="Frequently asked questions" text="Everything you need to know about Celora." />
            <Faq />
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="dot-panel mx-auto max-w-5xl rounded-card border p-8 text-center shadow-card sm:p-14">
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Ready to start learning?</h2>
            <p className="mx-auto mb-8 mt-3 max-w-lg text-ink-2">Pick a goal, start your first course, and see your progress from day one.</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/signup" size="lg">
                <BookOpen aria-hidden className="h-4 w-4" /> Start as a student
              </ButtonLink>
              <ButtonLink href="/teach/signup" size="lg" variant="secondary">
                <GraduationCap aria-hidden className="h-4 w-4" /> Start as a teacher
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
