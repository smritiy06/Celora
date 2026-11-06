"use client";

import {
  Brain,
  Clock,
  Code,
  Cpu,
  Database,
  Globe,
  Layers,
  Shield,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, ProgressBar, Tag } from "@/components/ui/misc";
import { categoryLabel } from "@/constants/catalog";
import { RatingBadge } from "@/components/shared/rating";
import { cn, formatDuration, plural } from "@/lib/utils";
import type { ActivityDay, CourseSummary, TopicScore } from "@/types/domain";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "ai-ml": Brain,
  "web-dev": Globe,
  dsa: Cpu,
  cybersecurity: Shield,
  electronics: Zap,
  "data-science": Database,
  "app-dev": Smartphone,
};

export const categoryIcon = (id: string): LucideIcon => CATEGORY_ICONS[id] ?? Code;

export function DifficultyTag({ difficulty }: { difficulty: string }) {
  const tone = difficulty === "beginner" ? "success" : difficulty === "intermediate" ? "warn" : "danger";
  return (
    <Tag tone={tone}>
      <span className="capitalize">{difficulty}</span>
    </Tag>
  );
}

/** A soft tinted square holding an icon: the app's main visual motif. */
export function IconTile({
  icon: Icon,
  tone = "accent",
  size = "md",
}: {
  icon: LucideIcon;
  tone?: "accent" | "info" | "success" | "warn" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    accent: "bg-accent-soft text-accent-ink",
    info: "bg-info-soft text-info",
    success: "bg-success-soft text-success",
    warn: "bg-warn-soft text-warn",
    danger: "bg-danger-soft text-danger",
  };
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  const icons = { sm: "h-4 w-4", md: "h-[18px] w-[18px]", lg: "h-5 w-5" };
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-xl", tones[tone], sizes[size])}>
      <Icon aria-hidden className={icons[size]} />
    </div>
  );
}

function CourseCover({ course }: { course: CourseSummary }) {
  if (course.thumbnail) {
    return (
      // Teachers can link images from any host, so next/image's allow-list doesn't fit.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={course.thumbnail} alt="" loading="lazy" className="mb-4 h-28 w-full rounded-lg border object-cover" />
    );
  }
  const Icon = categoryIcon(course.category);
  return (
    <div aria-hidden className="dot-panel mb-4 flex h-28 items-center justify-center rounded-lg border">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-surface text-accent-ink shadow-card">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

export function CourseCard({ course }: { course: CourseSummary }) {
  const { progress } = course;
  return (
    <Link href={`/courses/${course.id}`} className="group block h-full rounded-card">
      <Card interactive className="flex h-full flex-col">
        <CourseCover course={course} />
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <DifficultyTag difficulty={course.difficulty} />
          {progress?.completedAt && <Tag tone="success">Completed</Tag>}
        </div>
        <h3 className="mb-1 line-clamp-2 font-medium leading-snug text-ink group-hover:text-accent-ink">{course.title}</h3>
        <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{course.description}</p>
        <div className="mt-auto">
          <p className="mb-1 truncate text-[13px] text-ink-3">
            {course.teacherName} · {categoryLabel(course.category)}
          </p>
          <p className="mb-2"><RatingBadge rating={course.rating} /></p>
          <div className="flex items-center justify-between text-[13px] text-ink-3">
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="h-3.5 w-3.5" />
              {course.durationMinutes > 0 ? formatDuration(course.durationMinutes) : "Self-paced"}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers aria-hidden className="h-3.5 w-3.5" />
              {plural(course.lessonCount, "lesson")}
            </span>
          </div>
          {progress && !progress.completedAt && (
            <div className="mt-3 border-t pt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-ink-3">Progress</span>
                <span className="font-medium tabular-nums text-accent-ink">{progress.percent}%</span>
              </div>
              <ProgressBar percent={progress.percent} label={`${course.title} progress`} />
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="lesson-text">
      {/* react-markdown drops raw HTML by default, so teacher content can't inject markup. */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

const shade = (minutes: number, count: number) => {
  if (count === 0) return "bg-sunken";
  if (minutes < 15) return "bg-accent/30";
  if (minutes < 45) return "bg-accent/60";
  return "bg-accent";
};

function activityCells(days: ActivityDay[], today: string, length: number) {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const end = new Date(`${today}T00:00:00Z`);
  return Array.from({ length }, (_, i) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - (length - 1 - i));
    const key = date.toISOString().slice(0, 10);
    const day = byDate.get(key);
    return { key, minutes: day?.minutes ?? 0, count: (day?.lessons ?? 0) + (day?.quizzes ?? 0) };
  });
}

const cellTitle = (cell: { key: string; minutes: number; count: number }) =>
  `${cell.key}: ${cell.count > 0 ? `${cell.count} ${cell.count === 1 ? "activity" : "activities"}, ${cell.minutes} min` : "no activity"}`;

/** The dashboard's four-week calendar. */
export function StreakCalendar({ days, today }: { days: ActivityDay[]; today: string }) {
  const cells = activityCells(days, today, 28);
  const active = cells.filter((c) => c.count > 0).length;
  return (
    <div>
      <div aria-hidden className="grid grid-cols-7 gap-1">
        {cells.map((cell) => (
          <div key={cell.key} title={cellTitle(cell)} className={cn("h-4 rounded-[4px]", shade(cell.minutes, cell.count))} />
        ))}
      </div>
      <div aria-hidden className="mt-2 flex justify-between text-xs text-ink-3">
        <span>4 weeks ago</span>
        <span>Today</span>
      </div>
      <p className="sr-only">Active on {plural(active, "day")} in the last 4 weeks.</p>
    </div>
  );
}

/** Twelve weeks of activity, with a sentence and a list for screen readers. */
export function ActivityHeatmap({ days, today }: { days: ActivityDay[]; today: string }) {
  const cells = activityCells(days, today, 84);
  const activeDays = days.filter((d) => d.lessons + d.quizzes > 0);

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div aria-hidden className="grid w-max grid-flow-col grid-rows-7 gap-1">
          {cells.map((cell) => (
            <div key={cell.key} title={cellTitle(cell)} className={cn("h-3.5 w-3.5 rounded-[3px]", shade(cell.minutes, cell.count))} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-3">
        <span>Active on {plural(activeDays.length, "day")} in the last 12 weeks</span>
        <span aria-hidden className="flex items-center gap-1.5">
          Less
          {["bg-sunken", "bg-accent/30", "bg-accent/60", "bg-accent"].map((tone) => (
            <span key={tone} className={cn("h-3 w-3 rounded-[3px]", tone)} />
          ))}
          More
        </span>
      </div>
      <ul className="sr-only">
        {activeDays.map((d) => (
          <li key={d.date}>
            {d.date}: {plural(d.lessons, "lesson")}, {d.quizzes} {d.quizzes === 1 ? "quiz" : "quizzes"}, {d.minutes} minutes
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Topic accuracy as a number and a bar, coloured by how strong it is. */
export function TopicList({ topics }: { topics: TopicScore[] }) {
  return (
    <ul className="space-y-3.5">
      {topics.map((t) => (
        <li key={t.topic}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-[13px]">
            <span className="font-medium text-ink">{t.topic}</span>
            <span className="tabular-nums text-ink-3">
              {t.percent}% ({t.correct}/{t.total})
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={`${t.topic} accuracy`}
            aria-valuenow={t.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 overflow-hidden rounded-full bg-sunken"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500",
                t.percent < 50 ? "bg-danger" : t.percent < 70 ? "bg-warn" : "bg-success"
              )}
              style={{ width: `${t.percent}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A small figure with a label. Pass an icon for the tiled version used in stat rows. */
export function Stat({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "accent" | "info" | "success" | "warn" | "danger";
}) {
  return (
    <Card padding="sm" className="flex items-center gap-3.5">
      {icon && <IconTile icon={icon} tone={tone} />}
      <dl className="min-w-0">
        <dt className="truncate text-[13px] text-ink-3">{label}</dt>
        <dd className="text-xl font-semibold tabular-nums tracking-tight text-ink">{value}</dd>
        {hint && <dd className="truncate text-xs text-ink-3">{hint}</dd>}
      </dl>
    </Card>
  );
}

/** A titled card, the main building block of the app's pages. */
export function Section({
  title,
  icon: Icon,
  tone = "accent",
  action,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  tone?: "accent" | "info" | "success" | "warn" | "danger";
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-semibold text-ink">
          {Icon && <IconTile icon={Icon} tone={tone} size="sm" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-[13px] font-medium text-accent-ink hover:underline">
      {children}
    </Link>
  );
}
