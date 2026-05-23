"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Users, Star, CheckCircle, Play, FileText, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { mockCourses } from "@/data/courses";
import { cn } from "@/lib/utils";

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>

        {/* Course Header */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard variant="elevated" padding="lg">
              <div className="mb-4 flex items-center gap-3 flex-wrap">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light">{course.category}</span>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-text-muted">{course.difficulty}</span>
              </div>
              <h1 className="mb-3 text-2xl font-bold text-text-primary">{course.title}</h1>
              <p className="mb-4 text-sm text-text-muted leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400 fill-amber-400" />{course.rating} ({course.totalRatings.toLocaleString()} ratings)</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course.enrolledCount.toLocaleString()} enrolled</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{(course.duration / 60).toFixed(0)} hours</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{course.totalLessons} lessons</span>
              </div>
              {/* Instructor */}
              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center text-xs font-bold text-white">
                  {course.instructor.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{course.instructor.name}</p>
                  <p className="text-xs text-text-muted">{course.instructor.title}</p>
                </div>
              </div>
            </GlassCard>

            {/* Course Content / Modules */}
            <GlassCard variant="elevated" padding="md">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">Course Content</h2>
              {course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules.map((mod, mi) => (
                    <div key={mod.id} className="rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          {mod.isCompleted ? <CheckCircle className="h-5 w-5 text-accent-emerald" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-xs text-text-muted">{mi + 1}</span>}
                          <span className="text-sm font-medium text-text-primary">{mod.title}</span>
                        </div>
                        <span className="text-xs text-text-muted">{mod.lessons.length} lessons</span>
                      </div>
                      <div className="border-t border-white/[0.04] px-4 pb-3 pt-2">
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 py-2 text-sm">
                            {lesson.isCompleted ? <CheckCircle className="h-4 w-4 text-accent-emerald shrink-0" /> :
                              lesson.type === "video" ? <Play className="h-4 w-4 text-text-muted shrink-0" /> :
                              <FileText className="h-4 w-4 text-text-muted shrink-0" />}
                            <span className={cn("flex-1", lesson.isCompleted ? "text-text-muted line-through" : "text-text-secondary")}>{lesson.title}</span>
                            <span className="text-xs text-text-muted">{lesson.duration}m</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">Course modules will be displayed here.</p>
              )}
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <GlassCard variant="strong" padding="md" className="sticky top-20">
              {course.isEnrolled ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-muted">Your progress</span>
                      <span className="font-semibold text-primary-light">{course.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
                    Continue Learning
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-4 text-2xl font-bold text-text-primary">
                    {course.isFree ? "Free" : `$${course.price}`}
                  </p>
                  <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
                    {course.isFree ? "Enroll for Free" : "Buy Now"}
                  </button>
                </>
              )}
              <div className="mt-4 space-y-2 text-xs text-text-muted">
                <p>✓ Full lifetime access</p>
                <p>✓ Certificate of completion</p>
                <p>✓ Downloadable resources</p>
                <p>✓ Practice exercises</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
