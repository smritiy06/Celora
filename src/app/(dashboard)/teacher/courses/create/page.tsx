"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import Link from "next/link";
import type { TeacherCourseModule, TeacherCourseLesson } from "@/types/teacherCourse";

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

export default function CreateCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("programming");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [thumbnail, setThumbnail] = useState("");
  const [modules, setModules] = useState<TeacherCourseModule[]>([]);

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      { id: generateId(), title: "", order: prev.length, lessons: [] },
    ]);
  };

  const removeModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const updateModule = (moduleId: string, title: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, title } : m))
    );
  };

  const addLesson = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: generateId(),
                  title: "",
                  type: "article" as const,
                  content: "",
                  duration: 0,
                  order: m.lessons.length,
                },
              ],
            }
          : m
      )
    );
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<TeacherCourseLesson>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : m
      )
    );
  };

  const handleSave = async (publish: boolean = false) => {
    if (!title.trim()) {
      alert("Course title is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          difficulty,
          thumbnail,
          modules,
        }),
      });

      if (!res.ok) throw new Error("Failed to create course");

      const course = await res.json();

      if (publish) {
        await fetch(`/api/courses/${course._id}/publish`, { method: "PUT" });
      }

      router.push("/teacher/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to save course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/courses"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-text-secondary" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Create New Course</h1>
              <p className="text-xs text-text-muted">Fill in the details and add modules</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-2 text-sm font-medium text-text-secondary hover:bg-white/[0.08] transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              Publish
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Course Details */}
          <div className="space-y-5 lg:col-span-2">
            <GlassCard variant="elevated" padding="md">
              <h2 className="mb-4 font-semibold text-text-primary">Course Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Complete Python for Data Science"
                    className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will students learn in this course?"
                    rows={4}
                    className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")}
                      className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary outline-none focus:border-primary/50"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Thumbnail URL</label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Modules */}
            <GlassCard variant="elevated" padding="md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Modules & Lessons</h2>
                <button
                  onClick={addModule}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary-light hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add Module
                </button>
              </div>

              {modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="mb-2 text-sm text-text-muted">No modules yet</p>
                  <button
                    onClick={addModule}
                    className="text-xs text-primary-light hover:underline"
                  >
                    Add your first module
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((mod, modIdx) => (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-text-disabled cursor-grab" />
                        <span className="text-xs font-medium text-text-muted">Module {modIdx + 1}</span>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => updateModule(mod.id, e.target.value)}
                          placeholder="Module title"
                          className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
                        />
                        <button
                          onClick={() => removeModule(mod.id)}
                          className="text-text-muted hover:text-accent-rose transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Lessons */}
                      <div className="ml-6 space-y-2">
                        {mod.lessons.map((lesson, lesIdx) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-2 rounded-md bg-white/[0.03] border border-white/[0.04] px-3 py-2"
                          >
                            <span className="text-[10px] text-text-disabled">{lesIdx + 1}.</span>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(mod.id, lesson.id, { title: e.target.value })
                              }
                              placeholder="Lesson title"
                              className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-muted"
                            />
                            <select
                              value={lesson.type}
                              onChange={(e) =>
                                updateLesson(mod.id, lesson.id, {
                                  type: e.target.value as TeacherCourseLesson["type"],
                                })
                              }
                              className="rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] text-text-muted outline-none"
                            >
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="quiz">Quiz</option>
                              <option value="practice">Practice</option>
                            </select>
                            <button
                              onClick={() => removeLesson(mod.id, lesson.id)}
                              className="text-text-disabled hover:text-accent-rose transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addLesson(mod.id)}
                          className="flex items-center gap-1 text-[10px] text-primary-light hover:underline"
                        >
                          <Plus className="h-2.5 w-2.5" />
                          Add Lesson
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right: Preview */}
          <div>
            <GlassCard variant="elevated" padding="md" className="sticky top-20">
              <h3 className="mb-3 text-sm font-semibold text-text-primary">Course Preview</h3>
              <div className="mb-3 h-32 w-full rounded-lg bg-gradient-to-br from-primary/20 to-accent-cyan/10 flex items-center justify-center text-3xl">
                {thumbnail ? "🖼️" : "📚"}
              </div>
              <h4 className="mb-1 text-sm font-semibold text-text-primary">
                {title || "Course Title"}
              </h4>
              <p className="mb-2 text-xs text-text-muted line-clamp-3">
                {description || "Course description will appear here."}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-text-muted">
                <span className={cn(
                  "rounded-full px-2 py-0.5 font-semibold capitalize",
                  difficulty === "beginner" ? "bg-accent-emerald/10 text-accent-emerald" :
                  difficulty === "intermediate" ? "bg-amber-500/10 text-amber-400" :
                  "bg-accent-rose/10 text-accent-rose"
                )}>
                  {difficulty}
                </span>
                <span>{modules.length} modules</span>
                <span>{modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
