"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CourseCard } from "@/components/shared/learning";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { EmptyState, ErrorState, LoadingBlock, PageHeader } from "@/components/ui/misc";
import { CATEGORIES, DIFFICULTIES } from "@/constants/catalog";
import { useSession } from "@/hooks/useAccount";
import { useCatalog } from "@/hooks/useLearning";
import { plural } from "@/lib/utils";

const FILTERS = ["category", "difficulty", "duration", "status"] as const;

function Catalog() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { isSignedIn } = useSession();
  const urlQuery = params.get("q") ?? "";
  const [search, setSearch] = useState(urlQuery);

  /** Filters live in the URL, so a filtered list can be shared or returned to. */
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next}`, { scroll: false });
  };

  // Keeps the box in step with the URL, such as a search from the top bar.
  useEffect(() => setSearch(urlQuery), [urlQuery]);

  useEffect(() => {
    if (search === urlQuery) return;
    const timer = setTimeout(() => update("q", search.trim()), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the typed text restarts the debounce
  }, [search]);

  const query = {
    q: urlQuery,
    category: params.get("category") ?? "",
    difficulty: params.get("difficulty") ?? "",
    duration: params.get("duration") ?? "",
    status: params.get("status") ?? "",
    sort: params.get("sort") ?? "",
  };
  const { data, error, isPending, isFetching, refetch } = useCatalog(query);
  const hasFilters = Boolean(query.q) || FILTERS.some((key) => query[key]);

  return (
    <>
      <PageHeader title="Learning Paths" description="Structured courses from teachers, with your progress saved as you go." />

      <div className="mb-3 relative">
        <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input
          type="search"
          aria-label="Search courses"
          placeholder="Search by title, topic or teacher"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-10 text-base placeholder:text-ink-3 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-2 text-ink-3 hover:text-ink"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-6 grid gap-2 min-[400px]:grid-cols-2 md:grid-cols-5">
        <Select aria-label="Category" value={query.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </Select>
        <Select aria-label="Level" value={query.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
          <option value="">All levels</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d} className="capitalize">{d[0].toUpperCase() + d.slice(1)}</option>
          ))}
        </Select>
        <Select aria-label="Length" value={query.duration} onChange={(e) => update("duration", e.target.value)}>
          <option value="">Any length</option>
          <option value="short">Under 2 hours</option>
          <option value="medium">2 to 10 hours</option>
          <option value="long">Over 10 hours</option>
        </Select>
        {isSignedIn && (
          <Select aria-label="Your status" value={query.status} onChange={(e) => update("status", e.target.value)}>
            <option value="">Any status</option>
            <option value="not-enrolled">Not started</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </Select>
        )}
        <Select aria-label="Sort by" value={query.sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="">Recommended</option>
          <option value="newest">Newest</option>
          <option value="popular">Most learners</option>
          <option value="shortest">Shortest</option>
        </Select>
      </div>

      {isPending ? (
        <LoadingBlock label="Loading courses" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.length === 0 ? (
        hasFilters ? (
          <EmptyState
            title="No courses match"
            description="Try a different search or remove a filter."
            action={<Button variant="secondary" onClick={() => router.replace(pathname)}>Clear all</Button>}
          />
        ) : (
          <EmptyState title="No courses published yet" description="Courses appear here as soon as a teacher publishes them." />
        )
      ) : (
        <>
          <p aria-live="polite" className="mb-3 text-sm text-ink-3">
            {plural(data.length, "course")}
            {isFetching && " · updating"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<LoadingBlock label="Loading courses" />}>
      <Catalog />
    </Suspense>
  );
}
