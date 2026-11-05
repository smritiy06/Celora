"use client";

import { ArrowDown, ArrowUp, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Markdown } from "@/components/shared/learning";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ConfirmDialog, ErrorState, Tag } from "@/components/ui/misc";
import { CATEGORIES, DIFFICULTIES } from "@/constants/catalog";
import { publishProblems } from "@/domain/courses";
import { useDeleteCourse, useToggleCourse, useUpdateCourse } from "@/hooks/useTeaching";
import { cn, generateId, plural } from "@/lib/utils";
import type { Course, CourseModule, Lesson } from "@/types/domain";
import { ChoiceEditor, move, useUnsavedWarning } from "./shared";

const newLesson = (): Lesson => ({
  id: generateId(),
  title: "Untitled lesson",
  type: "article",
  content: "",
  videoUrl: "",
  duration: 0,
  resources: [],
  check: null,
});

function LessonEditor({ lesson, onChange }: { lesson: Lesson; onChange: (next: Lesson) => void }) {
  const [preview, setPreview] = useState(false);
  const set = (fields: Partial<Lesson>) => onChange({ ...lesson, ...fields });

  return (
    <div className="space-y-5">
      <Field label="Lesson title">
        {(id) => <Input id={id} value={lesson.title} onChange={(e) => set({ title: e.target.value })} />}
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Format">
          {(id) => (
            <Select id={id} value={lesson.type} onChange={(e) => set({ type: e.target.value as Lesson["type"] })}>
              <option value="article">Article</option>
              <option value="video">Video</option>
            </Select>
          )}
        </Field>
        <Field label="Length (minutes)">
          {(id) => <Input id={id} type="number" min={0} max={1000} value={lesson.duration} onChange={(e) => set({ duration: Number(e.target.value) })} />}
        </Field>
      </div>

      {lesson.type === "video" && (
        <Field label="Video link" hint="A YouTube link or a direct https link to a video file.">
          {(id) => <Input id={id} type="url" value={lesson.videoUrl} placeholder="https://" onChange={(e) => set({ videoUrl: e.target.value })} />}
        </Field>
      )}

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium">{lesson.type === "video" ? "Notes or transcript" : "Lesson text"}</span>
          <div role="group" aria-label="Editor view" className="flex text-sm">
            {[false, true].map((value) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={preview === value}
                onClick={() => setPreview(value)}
                className={cn("min-h-9 rounded px-2.5", preview === value ? "bg-sunken font-medium" : "text-ink-3 hover:text-ink")}
              >
                {value ? "Preview" : "Write"}
              </button>
            ))}
          </div>
        </div>
        {preview ? (
          <div className="min-h-64 rounded-lg border bg-canvas p-4">
            {lesson.content.trim() ? <Markdown>{lesson.content}</Markdown> : <p className="text-sm text-ink-3">Nothing written yet.</p>}
          </div>
        ) : (
          <Textarea
            aria-label="Lesson text"
            rows={14}
            className="font-mono !text-sm"
            placeholder={"Write in Markdown.\n\n## A heading\nA paragraph with **bold** text and `code`."}
            value={lesson.content}
            onChange={(e) => set({ content: e.target.value })}
          />
        )}
      </div>

      <fieldset className="border-t pt-5">
        <legend className="font-medium">Resources</legend>
        <p className="mb-3 text-sm text-ink-3">Links to readings, slides, or starter files.</p>
        <div className="space-y-2">
          {lesson.resources.map((resource, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                aria-label={`Resource ${index + 1} title`}
                placeholder="Title"
                value={resource.title}
                onChange={(e) => set({ resources: lesson.resources.map((r, i) => (i === index ? { ...r, title: e.target.value } : r)) })}
              />
              <Input
                aria-label={`Resource ${index + 1} link`}
                type="url"
                placeholder="https://"
                value={resource.url}
                onChange={(e) => set({ resources: lesson.resources.map((r, i) => (i === index ? { ...r, url: e.target.value } : r)) })}
              />
              <Button variant="ghost" aria-label={`Remove resource ${index + 1}`} onClick={() => set({ resources: lesson.resources.filter((_, i) => i !== index) })}>
                <Trash2 aria-hidden className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => set({ resources: [...lesson.resources, { title: "", url: "" }] })}>
          <Plus aria-hidden className="h-4 w-4" /> Add resource
        </Button>
      </fieldset>

      <fieldset className="border-t pt-5">
        <legend className="font-medium">Knowledge check</legend>
        <p className="mb-3 text-sm text-ink-3">An optional question at the end of the lesson. It isn&apos;t graded.</p>
        {lesson.check ? (
          <div className="space-y-4">
            <Field label="Question">
              {(id) => <Input id={id} value={lesson.check!.question} onChange={(e) => set({ check: { ...lesson.check!, question: e.target.value } })} />}
            </Field>
            <ChoiceEditor name={`check-${lesson.id}`} value={lesson.check} onChange={(check) => set({ check })} />
            <Field label="Explanation">
              {(id) => <Textarea id={id} rows={2} value={lesson.check!.explanation} onChange={(e) => set({ check: { ...lesson.check!, explanation: e.target.value } })} />}
            </Field>
            <Button variant="ghost" size="sm" onClick={() => set({ check: null })}>Remove knowledge check</Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => set({ check: { question: "", options: ["", ""], correctIndex: 0, explanation: "" } })}>
            <Plus aria-hidden className="h-4 w-4" /> Add a question
          </Button>
        )}
      </fieldset>
    </div>
  );
}

export function CourseEditor({ course }: { course: Course }) {
  const router = useRouter();
  const update = useUpdateCourse(course.id);
  const toggle = useToggleCourse();
  const remove = useDeleteCourse();
  const [draft, setDraft] = useState(course);
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(course);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedWarning(isDirty);

  const set = (fields: Partial<Course>) => setDraft((d) => ({ ...d, ...fields }));
  const setModule = (id: string, fields: Partial<CourseModule>) =>
    set({ modules: draft.modules.map((m) => (m.id === id ? { ...m, ...fields } : m)) });
  const setLesson = (next: Lesson) =>
    set({ modules: draft.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => (l.id === next.id ? next : l)) })) });

  const addModule = () =>
    set({ modules: [...draft.modules, { id: generateId(), title: `Module ${draft.modules.length + 1}`, lessons: [] }] });
  const addLesson = (moduleId: string) => {
    const lesson = newLesson();
    set({ modules: draft.modules.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m)) });
    setSelected(lesson.id);
  };

  const save = () => {
    const { title, description, outcomes, category, difficulty, thumbnail, modules } = draft;
    update.mutate(
      { title, description, outcomes: outcomes.filter((o) => o.trim()), category, difficulty, thumbnail, modules },
      {
        onSuccess: (result) => {
          setDraft(result);
          setSaved(result);
        },
      }
    );
  };

  const selectedLesson = draft.modules.flatMap((m) => m.lessons).find((l) => l.id === selected);
  const problems = publishProblems(draft);
  const lessonCount = draft.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const error = update.error ?? toggle.error ?? remove.error;

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-2 border-b bg-canvas px-4 py-3 sm:-mx-6 sm:px-6">
        <Link href="/teacher" className="text-sm text-ink-3 hover:underline">Teaching</Link>
        <span aria-hidden className="text-ink-3">/</span>
        <p className="min-w-0 max-w-xs truncate text-sm font-medium">{draft.title}</p>
        <Tag tone={saved.isPublished ? "success" : "neutral"}>{saved.isPublished ? "Published" : "Draft"}</Tag>
        <div className="ml-auto flex items-center gap-2">
          <span role="status" className="hidden text-xs text-ink-3 sm:inline">
            {update.isPending ? "Saving…" : isDirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <Button variant="secondary" size="sm" onClick={save} disabled={!isDirty || update.isPending}>Save</Button>
          <Button
            size="sm"
            disabled={toggle.isPending || isDirty || (!saved.isPublished && problems.length > 0)}
            title={isDirty ? "Save your changes first" : undefined}
            onClick={() =>
              toggle.mutate(course.id, {
                onSuccess: (result) => {
                  setSaved(result);
                  setDraft((d) => ({ ...d, isPublished: result.isPublished }));
                },
              })
            }
          >
            {saved.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {error ? <div className="mb-6"><ErrorState error={error} /></div> : null}

      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-36 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto">
          <button
            onClick={() => setSelected(null)}
            aria-current={selected === null ? "true" : undefined}
            className={cn("mb-3 flex min-h-10 w-full items-center rounded-lg border px-3 text-left text-sm", selected === null ? "border-accent bg-accent-soft font-medium" : "bg-surface hover:border-line-strong")}
          >
            Course details
          </button>
          <div className="space-y-3">
            {draft.modules.map((module, moduleIndex) => (
              <section key={module.id} className="rounded-card border bg-surface shadow-card">
                <div className="flex items-center gap-1 border-b p-1.5">
                  <input
                    aria-label={`Module ${moduleIndex + 1} title`}
                    value={module.title}
                    onChange={(e) => setModule(module.id, { title: e.target.value })}
                    className="min-h-9 min-w-0 flex-1 rounded bg-transparent px-1.5 text-sm font-medium"
                  />
                  <button aria-label={`Move ${module.title} up`} disabled={moduleIndex === 0} onClick={() => set({ modules: move(draft.modules, moduleIndex, -1) })} className="rounded p-1.5 text-ink-3 hover:text-ink disabled:opacity-30">
                    <ArrowUp aria-hidden className="h-3.5 w-3.5" />
                  </button>
                  <button aria-label={`Move ${module.title} down`} disabled={moduleIndex === draft.modules.length - 1} onClick={() => set({ modules: move(draft.modules, moduleIndex, 1) })} className="rounded p-1.5 text-ink-3 hover:text-ink disabled:opacity-30">
                    <ArrowDown aria-hidden className="h-3.5 w-3.5" />
                  </button>
                  <button aria-label={`Delete ${module.title}`} onClick={() => set({ modules: draft.modules.filter((m) => m.id !== module.id) })} className="rounded p-1.5 text-ink-3 hover:text-danger">
                    <Trash2 aria-hidden className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ul className="p-1">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <li key={lesson.id} className={cn("group flex items-center rounded", selected === lesson.id && "bg-accent-soft")}>
                      <button onClick={() => setSelected(lesson.id)} className="flex min-h-9 min-w-0 flex-1 items-center gap-2 px-1.5 text-left text-sm">
                        <FileText aria-hidden className={cn("h-3.5 w-3.5 shrink-0", lesson.content.trim() || lesson.videoUrl ? "text-success" : "text-ink-3")} />
                        <span className="truncate">{lesson.title}</span>
                      </button>
                      <button aria-label={`Move ${lesson.title} up`} disabled={lessonIndex === 0} onClick={() => setModule(module.id, { lessons: move(module.lessons, lessonIndex, -1) })} className="rounded p-1 text-ink-3 hover:text-ink disabled:opacity-30">
                        <ArrowUp aria-hidden className="h-3.5 w-3.5" />
                      </button>
                      <button aria-label={`Delete ${lesson.title}`} onClick={() => { setModule(module.id, { lessons: module.lessons.filter((l) => l.id !== lesson.id) }); if (selected === lesson.id) setSelected(null); }} className="rounded p-1 text-ink-3 hover:text-danger">
                        <Trash2 aria-hidden className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => addLesson(module.id)} className="flex min-h-9 w-full items-center gap-1.5 border-t px-3 text-sm text-accent-ink hover:bg-sunken">
                  <Plus aria-hidden className="h-3.5 w-3.5" /> Add lesson
                </button>
              </section>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={addModule}>
            <Plus aria-hidden className="h-4 w-4" /> Add module
          </Button>
        </aside>

        <div className="min-w-0 rounded-card border bg-surface shadow-card p-5 sm:p-6">
          {selectedLesson ? (
            <LessonEditor key={selectedLesson.id} lesson={selectedLesson} onChange={setLesson} />
          ) : (
            <div className="space-y-5">
              <Field label="Course title">
                {(id) => <Input id={id} value={draft.title} onChange={(e) => set({ title: e.target.value })} />}
              </Field>
              <Field label="Description" hint="Who is this for, and what will they get out of it?">
                {(id) => <Textarea id={id} rows={4} value={draft.description} onChange={(e) => set({ description: e.target.value })} />}
              </Field>
              <Field label="What learners will be able to do" hint="One per line. Start each with a verb.">
                {(id) => <Textarea id={id} rows={4} value={draft.outcomes.join("\n")} onChange={(e) => set({ outcomes: e.target.value.split("\n") })} />}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  {(id) => (
                    <Select id={id} value={draft.category} onChange={(e) => set({ category: e.target.value })}>
                      {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
                    </Select>
                  )}
                </Field>
                <Field label="Level">
                  {(id) => (
                    <Select id={id} value={draft.difficulty} onChange={(e) => set({ difficulty: e.target.value as Course["difficulty"] })}>
                      {DIFFICULTIES.map((d) => (<option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>))}
                    </Select>
                  )}
                </Field>
              </div>
              <Field label="Cover image link" hint="Optional. Must start with https://">
                {(id) => <Input id={id} type="url" value={draft.thumbnail} placeholder="https://" onChange={(e) => set({ thumbnail: e.target.value })} />}
              </Field>

              {!saved.isPublished && (
                <div className="border-t pt-5">
                  <h3 className="font-medium">Before you publish</h3>
                  {problems.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">
                      {problems.map((p) => (<li key={p}>{p}</li>))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-ink-2">Ready: {plural(lessonCount, "lesson")} with content.</p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 border-t pt-5">
                <ButtonLink href={`/teacher/courses/${course.id}/learners`} variant="secondary" size="sm">View learners</ButtonLink>
                <ButtonLink href={`/courses/${course.id}`} variant="ghost" size="sm">See course page</ButtonLink>
                <Button variant="danger" size="sm" className="ml-auto" onClick={() => setConfirmDelete(true)}>Delete course</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete "${course.title}"?`}
        description={
          course.enrolledStudents.length > 0
            ? `${plural(course.enrolledStudents.length, "learner")} will lose access. This can't be undone.`
            : "This can't be undone."
        }
        confirmLabel="Delete course"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => remove.mutate(course.id, { onSuccess: () => router.replace("/teacher") })}
      />
    </div>
  );
}
