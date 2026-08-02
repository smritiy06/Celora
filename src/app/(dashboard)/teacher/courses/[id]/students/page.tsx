"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import Link from "next/link";

export default function CourseStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ totalStudents: number; students: string[] }>({
    totalStudents: 0,
    students: [],
  });

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/courses/${id}/students`);
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [id]);

  return (
    <PageTransition>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link href={`/teacher/courses/${id}`} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
            <ArrowLeft className="h-4 w-4 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Enrolled Students</h1>
            <p className="text-xs text-text-muted">{data.totalStudents} students enrolled</p>
          </div>
        </div>

        <GlassCard variant="elevated" padding="md">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : data.totalStudents === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-2xl bg-white/[0.04] p-4">
                <Users className="h-10 w-10 text-text-muted" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-text-primary">No students yet</h3>
              <p className="text-sm text-text-muted">Students will appear here once they enroll in your course.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.students.map((studentId, i) => (
                <div key={studentId} className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent-cyan/20 text-xs font-bold text-text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Student {i + 1}</p>
                    <p className="text-xs text-text-muted">ID: {studentId.slice(0, 12)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
