"use client";

import { BookOpen, Eye, EyeOff, FileText, ListChecks, Plus, Users } from "lucide-react";
import Link from "next/link";
import { IconTile, Section, SectionLink, Stat, categoryIcon } from "@/components/shared/learning";
import { ButtonLink } from "@/components/ui/button";
import { Card, ErrorState, LoadingBlock, Tag } from "@/components/ui/misc";
import { useMe } from "@/hooks/useAccount";
import { useTeacherCourses, useTeacherQuizzes } from "@/hooks/useTeaching";
import { plural } from "@/lib/utils";

const QUICK = [
  { label: "New course", icon: Plus, href: "/teacher/courses/new", tone: "accent" as const },
  { label: "New quiz", icon: ListChecks, href: "/teacher/quizzes/new", tone: "warn" as const },
  { label: "Manage courses", icon: BookOpen, href: "/teacher/courses", tone: "info" as const },
];

export default function TeacherOverviewPage() {
  const { data: me } = useMe();
  const courses = useTeacherCourses();
  const quizzes = useTeacherQuizzes();

  const all = courses.data ?? [];
  const published = all.filter((c) => c.isPublished).length;
  const learners = new Set(all.flatMap((c) => c.enrolledStudents)).size;

  return (
    <div className="space-y-5">
      <section className="dot-panel rounded-card border p-6 shadow-card sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Welcome, {me?.name.split(" ")[0]}</h1>
        <p className="mb-5 mt-1 text-ink-2">Manage your courses and quizzes, and see how learners are getting on.</p>
        <ButtonLink href="/teacher/courses/new"><Plus aria-hidden className="h-4 w-4" /> Create new course</ButtonLink>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total courses" value={courses.data ? all.length : "–"} icon={BookOpen} />
        <Stat label="Published" value={courses.data ? published : "–"} icon={Eye} tone="success" />
        <Stat label="Drafts" value={courses.data ? all.length - published : "–"} icon={EyeOff} tone="warn" />
        <Stat label="Learners" value={courses.data ? learners : "–"} icon={Users} tone="info" />
      </div>

      <Section title="Your courses" icon={FileText} action={<SectionLink href="/teacher/courses">View all</SectionLink>}>
        {courses.isPending ? (
          <LoadingBlock label="Loading courses" rows={2} />
        ) : courses.error ? (
          <ErrorState error={courses.error} onRetry={courses.refetch} />
        ) : all.length === 0 ? (
          <div className="rounded-xl border bg-canvas p-6 text-center">
            <p className="text-sm font-medium text-ink">You haven&apos;t created a course yet</p>
            <p className="mt-1 text-[13px] text-ink-2">Start with a title. Nothing is public until you publish.</p>
            <ButtonLink href="/teacher/courses/new" size="sm" className="mt-4">Create a course</ButtonLink>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {all.slice(0, 5).map((course) => (
              <li key={course.id}>
                <Link href={`/teacher/courses/${course.id}`} className="flex items-center gap-4 rounded-xl border bg-canvas p-3 hover:border-line-strong">
                  <IconTile icon={categoryIcon(course.category)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{course.title}</span>
                    <span className="text-[13px] text-ink-3">
                      {plural(course.modules.length, "module")} · {plural(course.enrolledStudents.length, "learner")}
                    </span>
                  </span>
                  <Tag tone={course.isPublished ? "success" : "neutral"}>{course.isPublished ? "Published" : "Draft"}</Tag>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Your quizzes" icon={ListChecks} tone="warn" action={<SectionLink href="/teacher/quizzes">View all</SectionLink>}>
        {quizzes.isPending ? (
          <LoadingBlock label="Loading quizzes" rows={1} />
        ) : quizzes.error ? (
          <ErrorState error={quizzes.error} onRetry={quizzes.refetch} />
        ) : quizzes.data.length === 0 ? (
          <p className="text-sm text-ink-2">
            <Link href="/teacher/quizzes/new" className="text-accent-ink underline">Create a quiz</Link> to show learners which topics to revisit.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {quizzes.data.slice(0, 5).map((quiz) => (
              <li key={quiz.id}>
                <Link href={`/teacher/quizzes/${quiz.id}`} className="flex items-center gap-4 rounded-xl border bg-canvas p-3 hover:border-line-strong">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{quiz.title}</span>
                    <span className="text-[13px] text-ink-3">{plural(quiz.questions.length, "question")} · {quiz.timeLimitMinutes} min</span>
                  </span>
                  <Tag tone={quiz.isPublished ? "success" : "neutral"}>{quiz.isPublished ? "Published" : "Draft"}</Tag>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="grid gap-3 sm:grid-cols-3">
        {QUICK.map((action) => (
          <Link key={action.label} href={action.href} className="rounded-card">
            <Card interactive padding="sm" className="flex items-center gap-3">
              <IconTile icon={action.icon} tone={action.tone} size="sm" />
              <span className="text-[13px] font-medium text-ink">{action.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
