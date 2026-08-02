"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Eye, EyeOff, Pencil, Users } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TeacherCourse } from "@/types/teacherCourse";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch("/api/courses?teacherOnly=true");
      if (res.ok) setCourses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string) {
    const res = await fetch(`/api/courses/${id}/publish`, { method: "PUT" });
    if (res.ok) {
      const updated = await res.json();
      setCourses((prev) => prev.map((c) => (c._id === id ? updated : c)));
    }
  }

  async function deleteCourse(id: string) {
    if (!confirm("Are you sure you want to delete this course?")) return;
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c._id !== id));
    }
  }

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ? true : filter === "published" ? c.isPublished : !c.isPublished;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageTransition>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Courses</h1>
            <p className="text-sm text-text-muted">Manage and organize your courses</p>
          </div>
          <Link
            href="/teacher/courses/create"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            New Course
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors",
                  filter === f
                    ? "bg-primary/10 text-primary-light border border-primary/20"
                    : "bg-white/[0.04] text-text-muted hover:text-text-secondary border border-white/[0.06]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-2xl bg-white/[0.04] p-5">
              <Plus className="h-10 w-10 text-text-muted" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-text-primary">
              {courses.length === 0 ? "No courses yet" : "No matching courses"}
            </h3>
            <p className="mb-6 text-sm text-text-muted">
              {courses.length === 0
                ? "Create your first course to get started teaching."
                : "Try a different search or filter."}
            </p>
            {courses.length === 0 && (
              <Link
                href="/teacher/courses/create"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Create Course
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((course) => (
              <GlassCard
                key={course._id}
                variant="elevated"
                padding="md"
                className="flex flex-col"
              >
                {/* Thumbnail placeholder */}
                <div className="mb-4 h-32 w-full rounded-lg bg-gradient-to-br from-primary/20 to-accent-cyan/10 flex items-center justify-center text-3xl">
                  📚
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        course.isPublished
                          ? "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      )}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="text-[10px] text-text-muted capitalize">
                      {course.difficulty}
                    </span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-text-primary line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="mb-3 text-xs text-text-muted line-clamp-2">
                    {course.description || "No description"}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-text-muted">
                    <span>{course.modules?.length || 0} modules</span>
                    <span className="flex items-center gap-0.5">
                      <Users className="h-3 w-3" />
                      {course.enrolledStudents?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                  <Link
                    href={`/teacher/courses/${course._id}`}
                    className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-light hover:bg-primary/20 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => togglePublish(course._id)}
                    className="flex items-center gap-1 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-white/[0.08] transition-colors"
                  >
                    {course.isPublished ? (
                      <>
                        <EyeOff className="h-3 w-3" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" /> Publish
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-accent-rose hover:bg-accent-rose/10 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
