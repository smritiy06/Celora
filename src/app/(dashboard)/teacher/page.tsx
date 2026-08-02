"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, BarChart3, Plus, FileText, Eye, EyeOff } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { TeacherCourse, TeacherStats } from "@/types/teacherCourse";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function TeacherDashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || "Teacher";
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [stats, setStats] = useState<TeacherStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses?teacherOnly=true");
        if (res.ok) {
          const data: TeacherCourse[] = await res.json();
          setCourses(data);
          const published = data.filter((c) => c.isPublished).length;
          setStats({
            totalCourses: data.length,
            publishedCourses: published,
            draftCourses: data.length - published,
            totalStudents: data.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0),
          });
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <PageTransition>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
        {/* Welcome Banner */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-cyan/20 via-bg-elevated to-primary/10 border border-white/[0.08] p-6 sm:p-8">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent-cyan/10 blur-[80px]" />
            <div className="relative z-10">
              <h1 className="mb-1 text-2xl font-bold sm:text-3xl">
                Welcome, {firstName}! 👩‍🏫
              </h1>
              <p className="mb-4 text-text-muted">
                Manage your courses and track student progress.
              </p>
              <Link
                href="/teacher/courses/create"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-dark"
              >
                <Plus className="h-4 w-4" />
                Create New Course
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-primary-light" },
            { label: "Published", value: stats.publishedCourses, icon: Eye, color: "text-accent-emerald" },
            { label: "Drafts", value: stats.draftCourses, icon: EyeOff, color: "text-amber-400" },
            { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-accent-cyan" },
          ].map((s) => (
            <GlassCard key={s.label} padding="sm" variant="elevated" className="text-center">
              <s.icon className={`mx-auto mb-1.5 h-5 w-5 ${s.color}`} />
              <p className="text-xl font-bold text-text-primary">{loading ? "—" : s.value}</p>
              <p className="text-[10px] text-text-muted">{s.label}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Recent Courses */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="elevated" padding="md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-text-primary flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-primary-light" />
                Your Courses
              </h2>
              <Link href="/teacher/courses" className="text-xs text-primary-light hover:underline">
                View all
              </Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 rounded-2xl bg-white/[0.04] p-4">
                  <BookOpen className="h-8 w-8 text-text-muted" />
                </div>
                <p className="mb-1 text-sm font-medium text-text-primary">No courses yet</p>
                <p className="mb-4 text-xs text-text-muted">Create your first course to get started</p>
                <Link
                  href="/teacher/courses/create"
                  className="rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-medium text-primary-light hover:bg-primary/20 transition-colors"
                >
                  Create Course
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 5).map((course) => (
                  <Link
                    key={course._id}
                    href={`/teacher/courses/${course._id}`}
                    className="flex items-center gap-4 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent-cyan/20 text-lg">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{course.title}</p>
                      <p className="text-xs text-text-muted">
                        {course.modules?.length || 0} modules · {course.enrolledStudents?.length || 0} students
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      course.isPublished
                        ? "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Create Course", icon: Plus, href: "/teacher/courses/create", color: "text-primary-light" },
            { label: "Manage Courses", icon: BookOpen, href: "/teacher/courses", color: "text-accent-cyan" },
            { label: "Analytics", icon: BarChart3, href: "/teacher", color: "text-amber-400" },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <GlassCard padding="sm" className="group cursor-pointer text-center hover:border-primary/20 transition-all">
                <action.icon className={`mx-auto mb-2 h-5 w-5 ${action.color} transition-transform group-hover:scale-110`} />
                <p className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{action.label}</p>
              </GlassCard>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
