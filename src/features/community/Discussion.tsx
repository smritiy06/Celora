"use client";

import { Flag, MessagesSquare, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { ConfirmDialog, ErrorState, Skeleton, Tag } from "@/components/ui/misc";
import { useDiscussion, useDiscussionActions } from "@/hooks/useCommunity";
import { cn, plural, timeAgo } from "@/lib/utils";
import type { DiscussionPost } from "@/types/domain";

type Actions = ReturnType<typeof useDiscussionActions>;

function Composer({
  actions,
  parentId,
  placeholder,
  submitLabel,
  onDone,
  autoFocus,
}: {
  actions: Actions;
  parentId: string | null;
  placeholder: string;
  submitLabel: string;
  onDone?: () => void;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    actions.post.mutate(
      { body, parentId },
      {
        onSuccess: () => {
          setBody("");
          onDone?.();
        },
      }
    );
  };
  return (
    <form onSubmit={submit} className="space-y-2">
      <Textarea
        aria-label={placeholder}
        rows={parentId ? 2 : 3}
        maxLength={4000}
        value={body}
        autoFocus={autoFocus}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
      />
      {actions.post.error && <ErrorState error={actions.post.error} />}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!body.trim() || actions.post.isPending}>
          {actions.post.isPending ? "Posting…" : submitLabel}
        </Button>
        {onDone && <Button size="sm" variant="ghost" onClick={onDone}>Cancel</Button>}
      </div>
    </form>
  );
}

function Post({
  post,
  actions,
  onDelete,
  children,
}: {
  post: DiscussionPost;
  actions: Actions;
  onDelete: (post: DiscussionPost) => void;
  children?: React.ReactNode;
}) {
  return (
    <article className={cn("rounded-xl border p-4", post.isTeacher ? "border-accent/40 bg-accent-soft/40" : "bg-canvas")}>
      <header className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink">{post.authorName}</span>
        {post.isTeacher && <Tag tone="accent">Teacher</Tag>}
        {post.isYou && !post.isTeacher && <Tag>You</Tag>}
        <span className="text-[13px] text-ink-3">{timeAgo(post.createdAt)}</span>
      </header>
      <p className="whitespace-pre-line text-sm leading-relaxed text-ink-2">{post.body}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        {children}
        {!post.isYou && (
          <button
            onClick={() => actions.report.mutate(post.id)}
            disabled={post.reportedByYou || actions.report.isPending}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] text-ink-3 hover:bg-sunken hover:text-ink disabled:pointer-events-none"
          >
            <Flag aria-hidden className="h-3.5 w-3.5" />
            {post.reportedByYou ? "Reported" : "Report"}
          </button>
        )}
        {post.canDelete && (
          <button
            onClick={() => onDelete(post)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] text-ink-3 hover:bg-danger-soft hover:text-danger"
          >
            <Trash2 aria-hidden className="h-3.5 w-3.5" />
            Remove
          </button>
        )}
      </div>
    </article>
  );
}

/** Questions and answers beside a lesson, for its learners and teacher. */
export function LessonDiscussion({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { data, error, isPending, refetch } = useDiscussion(courseId, lessonId);
  const actions = useDiscussionActions(courseId, lessonId);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<DiscussionPost | null>(null);

  return (
    <section id="discussion" className="max-w-[66ch] scroll-mt-20">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <MessagesSquare aria-hidden className="h-5 w-5 text-ink-3" /> Discussion
        </h2>
        {data && data.length > 0 && <span className="text-[13px] text-ink-3">{plural(data.length, "question")}</span>}
      </div>

      <Composer actions={actions} parentId={null} placeholder="Ask a question about this lesson" submitLabel="Post question" />

      <div className="mt-5 space-y-4">
        {isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : data.length === 0 ? (
          <p className="text-sm text-ink-2">No questions yet. If something here is unclear, ask: your teacher is notified.</p>
        ) : (
          data.map((thread) => (
            <div key={thread.id} className="space-y-2">
              <Post post={thread} actions={actions} onDelete={setDeleting}>
                <button
                  onClick={() => setReplyingTo(replyingTo === thread.id ? null : thread.id)}
                  aria-expanded={replyingTo === thread.id}
                  className="inline-flex min-h-9 items-center rounded-lg px-2 text-[13px] font-medium text-accent-ink hover:bg-sunken"
                >
                  Reply{thread.replies.length > 0 && ` (${thread.replies.length})`}
                </button>
              </Post>
              {(thread.replies.length > 0 || replyingTo === thread.id) && (
                <div className="ml-4 space-y-2 border-l pl-4 sm:ml-6">
                  {thread.replies.map((reply) => (
                    <Post key={reply.id} post={reply} actions={actions} onDelete={setDeleting} />
                  ))}
                  {replyingTo === thread.id && (
                    <Composer
                      actions={actions}
                      parentId={thread.id}
                      placeholder={`Reply to ${thread.authorName}`}
                      submitLabel="Post reply"
                      onDone={() => setReplyingTo(null)}
                      autoFocus
                    />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <p className="mt-4 text-[13px] text-ink-3">
        Be kind and stay on topic. Posts reported by several learners are hidden until the teacher reviews them.
      </p>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={deleting?.parentId ? "Remove this reply?" : "Remove this question?"}
        description={deleting && !deleting.parentId && deleting.replies.length > 0 ? `Its ${deleting.replies.length === 1 ? "reply" : `${deleting.replies.length} replies`} will be removed too.` : undefined}
        confirmLabel="Remove"
        destructive
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) actions.remove.mutate(deleting.id);
          setDeleting(null);
        }}
      />
    </section>
  );
}
