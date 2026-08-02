"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Eye, EyeOff } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { generateId } from "@/lib/utils";
import Link from "next/link";
import type { TeacherCourse, TeacherCourseModule, TeacherCourseLesson } from "@/types/teacherCourse";

const categories = [
  { id: "programming", label: "Programming" },
  { id: "ai-ml", label: "AI & Machine Learning" },
  { id: "web-dev", label: "Web Development" },
  { id: "mobile-dev", label: "Mobile Development" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "dsa", label: "Data Structures & Algorithms" },
  { id: "databases", label: "Databases" },
  { id: "ui-ux", label: "UI/UX Design" },
];

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<TeacherCourse | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("programming");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [thumbnail, setThumbnail] = useState("");
  const [modules, setModules] = useState<TeacherCourseModule[]>([]);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data: TeacherCourse = await res.json();
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setDifficulty(data.difficulty);
        setThumbnail(data.thumbnail);
        setModules(data.modules || []);
      } catch {
        router.replace("/teacher/courses");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id, router]);

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      { id: generateId(), title: "", order: prev.length, lessons: [] },
    ]);
  };

  const removeModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const updateModule = (moduleId: string, t: string) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, title: t } : m)));
  };

  const addLesson = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                { id: generateId(), title: "", type: "article" as const, content: "", duration: 0, order: m.lessons.length },
              ],
            }
          : m
      )
    );
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      )
    );
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<TeacherCourseLesson>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
          : m
      )
    );
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required");
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, difficulty, thumbnail, modules }),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/teacher/courses");
    } catch {
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    const res = await fetch(`/api/courses/${id}/publish`, { method: "PUT" });
    if (res.ok) {
      const updated = await res.json();
      setCourse(updated);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this course permanently?")) return;
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/teacher/courses");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/teacher/courses" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
              <ArrowLeft className="h-4 w-4 text-text-secondary" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Edit Course</h1>
              <p className="text-xs text-text-muted">Update course details and modules</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleTogglePublish} className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-xs font-medium text-text-secondary hover:bg-white/[0.08] transition-colors">
              {course?.isPublished ? <><EyeOff className="h-3.5 w-3.5" /> Unpublish</> : <><Eye className="h-3.5 w-3.5" /> Publish</>}
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Course form — same layout as create page */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <GlassCard variant="elevated" padding="md">
              <h2 className="mb-4 font-semibold text-text-primary">Course Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary/50 transition-colors resize-none" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")} className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Thumbnail URL</label>
                  <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50 transition-colors" />
                </div>
              </div>
            </GlassCard>

            {/* Modules */}
            <GlassCard variant="elevated" padding="md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Modules & Lessons</h2>
                <button onClick={addModule} className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary-light hover:bg-primary/20 transition-colors">
                  <Plus className="h-3 w-3" /> Add Module
                </button>
              </div>
              {modules.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-muted">No modules. <button onClick={addModule} className="text-primary-light hover:underline">Add one</button></p>
              ) : (
                <div className="space-y-4">
                  {modules.map((mod, modIdx) => (
                    <motion.div key={mod.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-text-disabled" />
                        <span className="text-xs text-text-muted">Module {modIdx + 1}</span>
                        <input type="text" value={mod.title} onChange={(e) => updateModule(mod.id, e.target.value)} placeholder="Module title" className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none" />
                        <button onClick={() => removeModule(mod.id)} className="text-text-muted hover:text-accent-rose"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="ml-6 space-y-2">
                        {mod.lessons.map((lesson, li) => (
                          <div key={lesson.id} className="flex items-center gap-2 rounded-md bg-white/[0.03] border border-white/[0.04] px-3 py-2">
                            <span className="text-[10px] text-text-disabled">{li + 1}.</span>
                            <input type="text" value={lesson.title} onChange={(e) => updateLesson(mod.id, lesson.id, { title: e.target.value })} placeholder="Lesson title" className="flex-1 bg-transparent text-xs text-text-primary outline-none" />
                            <select value={lesson.type} onChange={(e) => updateLesson(mod.id, lesson.id, { type: e.target.value as TeacherCourseLesson["type"] })} className="rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] text-text-muted outline-none">
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="quiz">Quiz</option>
                              <option value="practice">Practice</option>
                            </select>
                            <button onClick={() => removeLesson(mod.id, lesson.id)} className="text-text-disabled hover:text-accent-rose"><Trash2 className="h-3 w-3" /></button>
                          </div>
                        ))}
                        <button onClick={() => addLesson(mod.id)} className="flex items-center gap-1 text-[10px] text-primary-light hover:underline"><Plus className="h-2.5 w-2.5" /> Add Lesson</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <GlassCard variant="elevated" padding="md">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">Course Info</h3>
              <div className="space-y-2 text-xs text-text-muted">
                <p>Status: <span className={course?.isPublished ? "text-accent-emerald" : "text-amber-400"}>{course?.isPublished ? "Published" : "Draft"}</span></p>
                <p>Students: {course?.enrolledStudents?.length || 0}</p>
                <p>Modules: {modules.length}</p>
                <p>Total lessons: {modules.reduce((s, m) => s + m.lessons.length, 0)}</p>
              </div>
            </GlassCard>
            <GlassCard variant="elevated" padding="md">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">Quick Links</h3>
              <div className="space-y-2">
                <Link href={`/teacher/courses/${id}/students`} className="block text-xs text-primary-light hover:underline">View enrolled students →</Link>
                <Link href={`/teacher/courses/${id}/analytics`} className="block text-xs text-primary-light hover:underline">View analytics →</Link>
              </div>
            </GlassCard>
            <button onClick={handleDelete} className="w-full rounded-lg border border-accent-rose/20 bg-accent-rose/5 px-4 py-2.5 text-xs font-medium text-accent-rose hover:bg-accent-rose/10 transition-colors">
              Delete Course
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
