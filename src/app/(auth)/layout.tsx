import { BarChart3, BookOpen, StickyNote, Trophy } from "lucide-react";
import { Wordmark } from "@/components/layout/Public";

const POINTS = [
  { icon: BookOpen, title: "Structured courses", text: "Lessons in text and video, taught by teachers" },
  { icon: Trophy, title: "Explained quizzes", text: "See why every answer is right or wrong" },
  { icon: StickyNote, title: "Notes beside each lesson", text: "Saved automatically as you write" },
  { icon: BarChart3, title: "Honest progress", text: "Scores by topic, weakest first" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col px-6 py-8 sm:px-12">
        <Wordmark />
        <main id="main" className="flex flex-1 items-center justify-center py-8">
          {children}
        </main>
      </div>
      <aside className="dot-panel hidden w-[46%] flex-col justify-center border-l p-12 lg:flex xl:p-20">
        <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-ink">
          Know what you&apos;ve learned, and what to learn next.
        </h2>
        <ul className="mt-10 grid max-w-xl gap-3 xl:grid-cols-2">
          {POINTS.map((point) => (
            <li key={point.title} className="rounded-card border bg-surface p-4 shadow-card">
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
                <point.icon aria-hidden className="h-[18px] w-[18px]" />
              </span>
              <p className="text-sm font-medium text-ink">{point.title}</p>
              <p className="mt-0.5 text-[13px] text-ink-2">{point.text}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
