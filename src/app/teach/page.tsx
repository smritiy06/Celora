import { ArrowRight, BarChart3, CheckCircle2, FileText, GraduationCap, ListChecks, MessagesSquare, Star, type LucideIcon } from "lucide-react";
import { Footer, PublicHeader } from "@/components/layout/Public";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/misc";

export const metadata = { title: "Teach on Celora" };

type Tone = "accent" | "info" | "success" | "warn" | "danger";

const TONES: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent-ink",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
};

const TOOLS: { icon: LucideIcon; tone: Tone; title: string; text: string }[] = [
  { icon: FileText, tone: "accent", title: "Course editor", text: "Organise modules and lessons, write in Markdown or link a video, and attach resources and a knowledge check to any lesson." },
  { icon: ListChecks, tone: "info", title: "Quiz builder", text: "Tag every question with a topic and an explanation. Learners see scores by topic, weakest first." },
  { icon: CheckCircle2, tone: "success", title: "Publish checklist", text: "A course goes live only when it's complete. Celora tells you exactly what's still missing." },
  { icon: BarChart3, tone: "warn", title: "Learner insights", text: "See each learner's progress, your completion rate, and the lesson where learners tend to stop." },
  { icon: Star, tone: "accent", title: "Reviews", text: "Learners who enrol can rate and review your course, and you're notified when they do." },
  { icon: MessagesSquare, tone: "info", title: "Lesson discussions", text: "Answer questions beside each lesson. Your replies are marked as coming from the teacher." },
];

const STEPS = [
  { title: "Create a teacher account", text: "Sign up through the teacher portal. If you already learn on Celora, log in and turn on teaching." },
  { title: "Build your first course", text: "Start a draft, add modules and lessons, and preview it the way learners will see it." },
  { title: "Publish and follow along", text: "Publish when the checklist is clear, then watch progress and answer questions as learners work through it." },
];

export default function TeachPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main id="main" className="flex-1">
        <section className="px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 rounded-lg border bg-surface px-3 py-1.5 text-[13px] font-medium text-accent-ink shadow-card">
                <GraduationCap aria-hidden className="h-3.5 w-3.5" /> Teacher portal
              </p>
              <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Teach what you know.
                <br />
                See what <span className="text-accent-ink">lands</span>.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
                Write courses and quizzes, publish them when they&apos;re ready, and see exactly where your learners are doing well and where they get stuck.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/teach/signup" size="lg">
                  Create a teacher account <ArrowRight aria-hidden className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/teach/login" size="lg" variant="secondary">
                  Teacher log in
                </ButtonLink>
              </div>
            </div>
            <Card padding="lg" className="dot-panel">
              <ol className="space-y-5">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4 rounded-card border bg-surface p-4 shadow-card">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-on-accent tabular-nums">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </section>

        <section className="border-y bg-surface px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Everything in the teacher portal</h2>
              <p className="mt-3 text-ink-2">The same tools for every teacher, with no setup and no fees.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => (
                <div key={tool.title} className="h-full rounded-card border bg-canvas p-6">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${TONES[tool.tone]}`}>
                    <tool.icon aria-hidden className="h-[18px] w-[18px]" />
                  </div>
                  <h3 className="mb-1.5 font-semibold text-ink">{tool.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-2">{tool.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="dot-panel mx-auto max-w-4xl rounded-card border p-8 text-center shadow-card sm:p-14">
            <h2 className="text-3xl font-semibold tracking-tight text-ink">Ready to write your first course?</h2>
            <p className="mx-auto mb-8 mt-3 max-w-lg text-ink-2">Teaching accounts keep full access to learning, so you can take courses too.</p>
            <ButtonLink href="/teach/signup" size="lg">
              <GraduationCap aria-hidden className="h-4 w-4" /> Start teaching
            </ButtonLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
