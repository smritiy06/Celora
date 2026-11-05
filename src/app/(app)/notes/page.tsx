"use client";

import { Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { ConfirmDialog, EmptyState, ErrorState, LoadingBlock, PageHeader } from "@/components/ui/misc";
import { useDeleteNote, useNotes } from "@/hooks/useLearning";
import { formatDate } from "@/lib/utils";
import type { LessonNote } from "@/types/domain";

export default function NotesPage() {
  const { data, error, isPending, refetch } = useNotes();
  const remove = useDeleteNote();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<LessonNote | null>(null);

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = (data ?? []).filter(
      (n) => !q || `${n.content} ${n.lessonTitle} ${n.courseTitle}`.toLowerCase().includes(q)
    );
    const byCourse = new Map<string, LessonNote[]>();
    for (const note of matches) {
      byCourse.set(note.courseTitle, [...(byCourse.get(note.courseTitle) ?? []), note]);
    }
    return [...byCourse.entries()];
  }, [data, search]);

  return (
    <>
      <PageHeader title="Notes" description="Everything you've written while learning, kept with the lesson it came from." />

      {isPending ? (
        <LoadingBlock label="Loading notes" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Open any lesson and write in the notes box beneath it. Your notes will collect here."
          action={<ButtonLink href="/courses" variant="secondary">Go to courses</ButtonLink>}
        />
      ) : (
        <>
          <div className="relative mb-6 max-w-md">
            <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
            <input
              type="search"
              aria-label="Search your notes"
              placeholder="Search your notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-base placeholder:text-ink-3 sm:text-sm"
            />
          </div>
          {groups.length === 0 && <EmptyState title="No notes match your search" />}
          <div className="space-y-8">
            {groups.map(([course, notes]) => (
              <section key={course}>
                <h2 className="mb-3 text-xl font-semibold">{course}</h2>
                <ul className="space-y-3">
                  {notes.map((note) => (
                    <li key={note.id} className="rounded-card border bg-surface shadow-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={`/courses/${note.courseId}/lessons/${note.lessonId}`} className="text-sm font-medium hover:underline">
                            {note.lessonTitle}
                          </Link>
                          <p className="text-xs text-ink-3">{formatDate(note.updatedAt)}</p>
                        </div>
                        <button onClick={() => setPendingDelete(note)} aria-label={`Delete note on ${note.lessonTitle}`} className="-m-1 rounded p-2 text-ink-3 hover:text-danger">
                          <Trash2 aria-hidden className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-ink-2">{note.content}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this note?"
        description="This can't be undone."
        confirmLabel="Delete note"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </>
  );
}
