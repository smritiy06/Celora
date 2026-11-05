"use client";

import { BookOpen, ListChecks, Pencil, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DifficultyTag, IconTile, categoryIcon } from "@/components/shared/learning";
import { ButtonLink } from "@/components/ui/button";
import { Card, EmptyState, ErrorState, LoadingBlock, PageHeader, Tag } from "@/components/ui/misc";
import { useTeacherCourses, useTeacherQuizzes } from "@/hooks/useTeaching";
import { cn, plural } from "@/lib/utils";

type Filter = "all" | "published" | "draft";

function useFiltered<T extends { title: string; isPublished: boolean }>(items: T[] | undefined) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = useMemo(
    () =>
      (items ?? []).filter(
        (item) =>
          item.title.toLowerCase().includes(search.trim().toLowerCase()) &&
          (filter === "all" || (filter === "published") === item.isPublished)
      ),
    [items, search, filter]
  );
  return { search, setSearch, filter, setFilter, filtered };
}

function Toolbar({
  search,
  setSearch,
  filter,
  setFilter,
  placeholder,
}: {
  search: string;
  setSearch: (value: string) => void;
  filter: Filter;
  setFilter: (value: Filter) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input
          type="search"
          aria-label={placeholder}
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-base text-ink outline-none placeholder:text-ink-3 focus:border-accent sm:text-sm"
        />
      </div>
      <div role="group" aria-label="Filter by status" className="flex gap-1 rounded-lg bg-sunken p-1">
        {(["all", "published", "draft"] as const).map((value) => (
          <button
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn("min-h-9 flex-1 rounded-md px-3 text-[13px] font-medium capitalize", filter === value ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink")}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

const StatusTag = ({ published }: { published: boolean }) => (
  <Tag tone={published ? "success" : "neutral"}>{published ? "Published" : "Draft"}</Tag>
);

export function TeacherCourseList() {
  const { data, error, isPending, refetch } = useTeacherCourses();
  const list = useFiltered(data);

  return (
    <>
      <PageHeader
        title="My Courses"
        description="Manage and organize your courses."
        action={<ButtonLink href="/teacher/courses/new"><Plus aria-hidden className="h-4 w-4" /> New course</ButtonLink>}
      />
      <Toolbar {...list} placeholder="Search your courses" />
      {isPending ? (
        <LoadingBlock label="Loading courses" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : list.filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen aria-hidden className="h-5 w-5" />}
          title={data.length === 0 ? "No courses yet" : "No matching courses"}
          description={data.length === 0 ? "Start with a title. Nothing is public until you publish." : "Try a different search or filter."}
          action={data.length === 0 && <ButtonLink href="/teacher/courses/new">Create your first course</ButtonLink>}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.filtered.map((course) => {
            const lessons = course.modules.flatMap((m) => m.lessons).length;
            return (
              <li key={course.id}>
                <Card className="flex h-full flex-col">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <IconTile icon={categoryIcon(course.category)} />
                    <StatusTag published={course.isPublished} />
                  </div>
                  <Link href={`/teacher/courses/${course.id}`} className="font-medium text-ink hover:text-accent-ink">{course.title}</Link>
                  <p className="mt-1 mb-3 line-clamp-2 text-[13px] text-ink-2">{course.description || "No description yet."}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-3">
                    <DifficultyTag difficulty={course.difficulty} />
                    <span>{plural(lessons, "lesson")}</span>
                  </div>
                  <div className="mt-4 flex gap-2 border-t pt-3">
                    <ButtonLink href={`/teacher/courses/${course.id}`} variant="secondary" size="sm">
                      <Pencil aria-hidden className="h-3.5 w-3.5" /> Edit
                    </ButtonLink>
                    <ButtonLink href={`/teacher/courses/${course.id}/learners`} variant="ghost" size="sm">
                      <Users aria-hidden className="h-3.5 w-3.5" /> {plural(course.enrolledStudents.length, "learner")}
                    </ButtonLink>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export function TeacherQuizList() {
  const { data, error, isPending, refetch } = useTeacherQuizzes();
  const list = useFiltered(data);

  return (
    <>
      <PageHeader
        title="My Quizzes"
        description="Build quizzes tagged by topic, so learners can see where to focus."
        action={<ButtonLink href="/teacher/quizzes/new"><Plus aria-hidden className="h-4 w-4" /> New quiz</ButtonLink>}
      />
      <Toolbar {...list} placeholder="Search your quizzes" />
      {isPending ? (
        <LoadingBlock label="Loading quizzes" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : list.filtered.length === 0 ? (
        <EmptyState
          icon={<ListChecks aria-hidden className="h-5 w-5" />}
          title={data.length === 0 ? "No quizzes yet" : "No matching quizzes"}
          description={data.length === 0 ? "Quizzes show learners which topics they need to revisit." : "Try a different search or filter."}
          action={data.length === 0 && <ButtonLink href="/teacher/quizzes/new">Create your first quiz</ButtonLink>}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.filtered.map((quiz) => (
            <li key={quiz.id}>
              <Link href={`/teacher/quizzes/${quiz.id}`} className="group block h-full rounded-card">
                <Card interactive className="flex h-full flex-col">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <IconTile icon={categoryIcon(quiz.category)} />
                    <StatusTag published={quiz.isPublished} />
                  </div>
                  <h2 className="font-medium text-ink group-hover:text-accent-ink">{quiz.title}</h2>
                  <p className="mt-1 mb-3 line-clamp-2 text-[13px] text-ink-2">{quiz.description || "No description yet."}</p>
                  <p className="mt-auto text-[13px] text-ink-3">{plural(quiz.questions.length, "question")} · {quiz.timeLimitMinutes} min</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
