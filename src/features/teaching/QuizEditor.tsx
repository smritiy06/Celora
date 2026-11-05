"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ConfirmDialog, EmptyState, ErrorState, Tag } from "@/components/ui/misc";
import { CATEGORIES, DIFFICULTIES } from "@/constants/catalog";
import { useDeleteQuiz, useToggleQuiz, useUpdateQuiz } from "@/hooks/useTeaching";
import { generateId } from "@/lib/utils";
import type { Quiz, QuizQuestion } from "@/types/domain";
import { ChoiceEditor, move, useUnsavedWarning } from "./shared";

export function QuizEditor({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const update = useUpdateQuiz(quiz.id);
  const toggle = useToggleQuiz();
  const remove = useDeleteQuiz();
  const [draft, setDraft] = useState(quiz);
  const [saved, setSaved] = useState(quiz);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedWarning(isDirty);

  const set = (fields: Partial<Quiz>) => setDraft((d) => ({ ...d, ...fields }));
  const setQuestion = (id: string, fields: Partial<QuizQuestion>) =>
    set({ questions: draft.questions.map((q) => (q.id === id ? { ...q, ...fields } : q)) });
  const addQuestion = () =>
    set({
      questions: [
        ...draft.questions,
        { id: generateId(), prompt: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", topic: draft.questions.at(-1)?.topic ?? "" },
      ],
    });

  const save = () => {
    const { title, description, category, difficulty, timeLimitMinutes, questions } = draft;
    update.mutate(
      { title, description, category, difficulty, timeLimitMinutes, questions },
      {
        onSuccess: (result) => {
          setDraft(result);
          setSaved(result);
        },
      }
    );
  };

  const error = update.error ?? toggle.error ?? remove.error;

  return (
    <div className="mx-auto max-w-3xl">
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
            disabled={toggle.isPending || isDirty}
            title={isDirty ? "Save your changes first" : undefined}
            onClick={() =>
              toggle.mutate(quiz.id, {
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

      <section className="space-y-5 rounded-card border bg-surface shadow-card p-5 sm:p-6">
        <Field label="Quiz title">
          {(id) => <Input id={id} value={draft.title} onChange={(e) => set({ title: e.target.value })} />}
        </Field>
        <Field label="Description">
          {(id) => <Textarea id={id} rows={2} value={draft.description} onChange={(e) => set({ description: e.target.value })} />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Category">
            {(id) => (
              <Select id={id} value={draft.category} onChange={(e) => set({ category: e.target.value })}>
                {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
              </Select>
            )}
          </Field>
          <Field label="Level">
            {(id) => (
              <Select id={id} value={draft.difficulty} onChange={(e) => set({ difficulty: e.target.value as Quiz["difficulty"] })}>
                {DIFFICULTIES.map((d) => (<option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>))}
              </Select>
            )}
          </Field>
          <Field label="Time limit (minutes)">
            {(id) => <Input id={id} type="number" min={1} max={180} value={draft.timeLimitMinutes} onChange={(e) => set({ timeLimitMinutes: Number(e.target.value) })} />}
          </Field>
        </div>
      </section>

      <h2 className="mb-3 mt-8 text-xl font-semibold">Questions</h2>
      {draft.questions.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Each question has a topic, so learners can see exactly which areas need work."
          action={<Button onClick={addQuestion}><Plus aria-hidden className="h-4 w-4" /> Add the first question</Button>}
        />
      ) : (
        <ol className="space-y-4">
          {draft.questions.map((question, index) => (
            <li key={question.id} className="space-y-4 rounded-card border bg-surface shadow-card p-5">
              <div className="flex items-center gap-1">
                <h3 className="flex-1 text-sm font-medium text-ink-3">Question {index + 1}</h3>
                <button aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => set({ questions: move(draft.questions, index, -1) })} className="rounded p-2 text-ink-3 hover:text-ink disabled:opacity-30">
                  <ArrowUp aria-hidden className="h-4 w-4" />
                </button>
                <button aria-label={`Move question ${index + 1} down`} disabled={index === draft.questions.length - 1} onClick={() => set({ questions: move(draft.questions, index, 1) })} className="rounded p-2 text-ink-3 hover:text-ink disabled:opacity-30">
                  <ArrowDown aria-hidden className="h-4 w-4" />
                </button>
                <button aria-label={`Delete question ${index + 1}`} onClick={() => set({ questions: draft.questions.filter((q) => q.id !== question.id) })} className="rounded p-2 text-ink-3 hover:text-danger">
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </div>
              <Field label="Question">
                {(id) => <Textarea id={id} rows={2} value={question.prompt} onChange={(e) => setQuestion(question.id, { prompt: e.target.value })} />}
              </Field>
              <ChoiceEditor name={`q-${question.id}`} value={question} onChange={(next) => setQuestion(question.id, next)} />
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <Field label="Topic" hint="Used to show weak areas.">
                  {(id) => <Input id={id} value={question.topic} onChange={(e) => setQuestion(question.id, { topic: e.target.value })} />}
                </Field>
                <Field label="Explanation" hint="Shown after the quiz. Say why the answer is right.">
                  {(id) => <Textarea id={id} rows={2} value={question.explanation} onChange={(e) => setQuestion(question.id, { explanation: e.target.value })} />}
                </Field>
              </div>
            </li>
          ))}
        </ol>
      )}

      {draft.questions.length > 0 && (
        <Button variant="secondary" className="mt-4 w-full" onClick={addQuestion}>
          <Plus aria-hidden className="h-4 w-4" /> Add question
        </Button>
      )}

      <div className="mt-10 border-t pt-5 text-right">
        <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete quiz</Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete "${quiz.title}"?`}
        description="This can't be undone."
        confirmLabel="Delete quiz"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => remove.mutate(quiz.id, { onSuccess: () => router.replace("/teacher") })}
      />
    </div>
  );
}
