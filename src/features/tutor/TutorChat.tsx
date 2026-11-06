"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUp,
  BookOpen,
  Bot,
  Bug,
  Copy,
  History,
  ListChecks,
  Mic,
  NotebookPen,
  Plus,
  RotateCcw,
  Sparkles,
  Square,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, EmptyState, ErrorState, LoadingBlock, Skeleton } from "@/components/ui/misc";
import { useDeleteTutorChat, useTutorChat, useTutorChats, useTutorStatus } from "@/hooks/useTutor";
import { cn, timeAgo } from "@/lib/utils";
import { api } from "@/services/api";
import type { TutorMessage } from "@/types/domain";
import { TutorMarkdown } from "./TutorMarkdown";

interface Suggestion {
  icon: LucideIcon;
  label: string;
  prompt: string;
  needsLesson?: boolean;
}

const SUGGESTIONS: Suggestion[] = [
  { icon: BookOpen, label: "Summarise this lesson", prompt: "Summarise this lesson in a few key points I should remember.", needsLesson: true },
  { icon: Sparkles, label: "Explain a concept", prompt: "Explain this concept simply, with an example: " },
  { icon: NotebookPen, label: "Make study notes", prompt: "Turn this into concise study notes: " },
  { icon: ListChecks, label: "Practice questions", prompt: "Write 5 multiple-choice practice questions on " },
  { icon: Bug, label: "Debug my code", prompt: "Help me find the bug in this code:\n\n```\n\n```" },
];

type Turn = TutorMessage & { pending?: boolean };

function HistoryList({
  activeId,
  onSelect,
  onNew,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const { data, isPending, error, refetch } = useTutorChats();
  const remove = useDeleteTutorChat();
  const [deleting, setDeleting] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <Button variant="secondary" className="w-full" onClick={onNew}>
          <Plus aria-hidden className="h-4 w-4" /> New chat
        </Button>
      </div>
      <nav aria-label="Chat history" className="flex-1 overflow-y-auto p-2">
        {isPending ? (
          <div className="space-y-2 p-1"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        ) : error ? (
          <div className="p-2"><ErrorState error={error} onRetry={refetch} /></div>
        ) : data.length === 0 ? (
          <p className="p-3 text-[13px] text-ink-3">Your chats are saved here.</p>
        ) : (
          <ul className="space-y-0.5">
            {data.map((chat) => (
              <li key={chat.id} className="group relative">
                <button
                  onClick={() => onSelect(chat.id)}
                  aria-current={chat.id === activeId ? "page" : undefined}
                  className={cn(
                    "block w-full rounded-lg px-3 py-2 pr-9 text-left",
                    chat.id === activeId ? "bg-accent-soft" : "hover:bg-sunken"
                  )}
                >
                  <span className={cn("block truncate text-sm", chat.id === activeId ? "font-medium text-ink" : "text-ink-2")}>{chat.title}</span>
                  <span className="block truncate text-[12px] text-ink-3">
                    {chat.context ? `${chat.context.lessonTitle} · ` : ""}
                    {timeAgo(chat.updatedAt)}
                  </span>
                </button>
                <button
                  onClick={() => setDeleting(chat.id)}
                  aria-label={`Delete chat: ${chat.title}`}
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-3 hover:bg-danger-soft hover:text-danger sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100"
                >
                  <Trash2 aria-hidden className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this chat?"
        description="The conversation is removed for good."
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            remove.mutate(deleting);
            if (deleting === activeId) onNew();
          }
          setDeleting(null);
        }}
      />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* Clipboard blocked; nothing else to do. */
        }
      }}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-[12px] text-ink-3 hover:bg-sunken hover:text-ink"
    >
      <Copy aria-hidden className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function TutorChatPage() {
  const router = useRouter();
  const params = useSearchParams();
  const client = useQueryClient();
  const status = useTutorStatus();

  const urlChatId = params.get("chat");
  const lessonRef =
    params.get("courseId") && params.get("lessonId")
      ? { courseId: params.get("courseId")!, lessonId: params.get("lessonId")! }
      : null;

  const [chatId, setChatId] = useState<string | null>(urlChatId);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  const saved = useTutorChat(urlChatId);
  const course = useQuery({
    queryKey: ["course", lessonRef?.courseId],
    queryFn: () => api.course(lessonRef!.courseId),
    enabled: Boolean(lessonRef),
  });
  const context =
    saved.data?.context ??
    (lessonRef && course.data
      ? { ...lessonRef, courseTitle: course.data.title, lessonTitle: course.data.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonRef.lessonId)?.title ?? "Lesson" }
      : null);

  // Opening a saved chat from the URL loads its messages, unless we're mid-answer.
  useEffect(() => {
    if (streaming) return;
    setChatId(urlChatId);
    if (!urlChatId) setTurns([]);
    else if (saved.data) setTurns(saved.data.messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reacts to which chat is open
  }, [urlChatId, saved.data]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  useEffect(() => () => abort.current?.abort(), []);

  const openChat = (id: string | null) => {
    abort.current?.abort();
    setHistoryOpen(false);
    setError(null);
    router.push(id ? `/ai-tutor?chat=${id}` : "/ai-tutor");
  };

  const run = async (message: string, regenerate = false) => {
    setError(null);
    setStreaming(true);
    const controller = new AbortController();
    abort.current = controller;
    const now = new Date().toISOString();
    setTurns((current) => {
      const base = regenerate && current.at(-1)?.role === "assistant" ? current.slice(0, -1) : current;
      return [
        ...base,
        ...(regenerate ? [] : [{ role: "user" as const, content: message, createdAt: now }]),
        { role: "assistant" as const, content: "", createdAt: now, pending: true },
      ];
    });

    const updateLast = (fn: (turn: Turn) => Turn) =>
      setTurns((current) => [...current.slice(0, -1), fn(current[current.length - 1])]);

    let newChatId = chatId;
    try {
      await api.askTutor(
        { chatId, message, regenerate, context: chatId ? null : lessonRef },
        (event) => {
          if (event.type === "messageStart") {
            newChatId = event.chatId;
            setChatId(event.chatId);
          } else if (event.type === "delta") {
            updateLast((t) => ({ ...t, content: t.content + event.text }));
          } else if (event.type === "error") {
            setError(event.message);
          }
        },
        controller.signal
      );
      updateLast((t) => ({ ...t, pending: false }));
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        updateLast((t) => ({ ...t, pending: false, stopped: true }));
      } else {
        setError(caught instanceof Error ? caught.message : "Something went wrong.");
        // Nothing arrived, so drop the empty answer bubble.
        setTurns((current) => (current.at(-1)?.content ? current : current.slice(0, -1)));
      }
    } finally {
      setStreaming(false);
      abort.current = null;
      setTurns((current) => current.filter((t) => t.role === "user" || t.content || t.pending));
      client.invalidateQueries({ queryKey: ["tutor"] });
      if (newChatId && newChatId !== urlChatId) router.replace(`/ai-tutor?chat=${newChatId}`);
    }
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const message = input.trim();
    if (!message || streaming) return;
    setInput("");
    run(message);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const pickSuggestion = (s: Suggestion) => {
    if (s.needsLesson) return run(s.prompt);
    setInput(s.prompt);
    textarea.current?.focus();
  };

  if (status.isPending) return <LoadingBlock label="Loading AI Tutor" />;
  if (status.error) return <ErrorState error={status.error} onRetry={status.refetch} />;
  if (!status.data.available) {
    return (
      <EmptyState
        icon={<Bot aria-hidden className="h-5 w-5" />}
        title="The AI Tutor isn't connected yet"
        description="It needs an Anthropic API key on the server. Until then, every quiz answer comes with an explanation from its teacher."
        action={<Link href="/quiz" className="text-sm font-medium text-accent-ink underline-offset-4 hover:underline">Go to Quiz Arena</Link>}
      />
    );
  }

  const lastTurn = turns.at(-1);
  const canRegenerate = !streaming && lastTurn?.role === "assistant";
  const outOfQuestions = status.data.remainingToday === 0;

  return (
    <div className="flex h-[calc(100dvh-4rem-3.5rem)] overflow-hidden lg:h-[calc(100dvh-4rem)]">
      <aside className="hidden w-64 shrink-0 border-r bg-surface lg:block">
        <HistoryList activeId={chatId} onSelect={openChat} onNew={() => openChat(null)} />
      </aside>

      {historyOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close chat history" className="absolute inset-0 bg-ink/30" onClick={() => setHistoryOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r bg-surface shadow-card-hover">
            <div className="flex h-14 items-center justify-between border-b px-3">
              <span className="text-sm font-semibold">Chats</span>
              <button onClick={() => setHistoryOpen(false)} aria-label="Close" className="rounded-lg p-2 hover:bg-sunken"><X aria-hidden className="h-4 w-4" /></button>
            </div>
            <div className="h-[calc(100%-3.5rem)]">
              <HistoryList activeId={chatId} onSelect={openChat} onNew={() => openChat(null)} />
            </div>
          </div>
        </div>
      )}

      <section className="flex min-w-0 flex-1 flex-col" aria-label="AI Tutor conversation">
        <div className="flex min-h-12 items-center gap-2 border-b bg-surface px-3 sm:px-5">
          <button onClick={() => setHistoryOpen(true)} className="rounded-lg p-2 text-ink-2 hover:bg-sunken lg:hidden" aria-label="Open chat history">
            <History aria-hidden className="h-[18px] w-[18px]" />
          </button>
          <h1 className="flex items-center gap-2 text-sm font-semibold">
            <Bot aria-hidden className="h-4 w-4 text-accent-ink" /> AI Tutor
          </h1>
          {context && (
            <Link
              href={`/courses/${context.courseId}/lessons/${context.lessonId}`}
              className="ml-1 inline-flex min-w-0 items-center gap-1.5 truncate rounded-md bg-accent-soft px-2 py-1 text-[12px] font-medium text-accent-ink"
              title={`${context.courseTitle}: ${context.lessonTitle}`}
            >
              <BookOpen aria-hidden className="h-3 w-3 shrink-0" />
              <span className="truncate">{context.lessonTitle}</span>
            </Link>
          )}
          <span className="ml-auto shrink-0 text-[12px] tabular-nums text-ink-3">
            {status.data.remainingToday} of {status.data.dailyLimit} left today
          </span>
        </div>

        <div ref={scroller} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            {urlChatId && saved.isPending && turns.length === 0 ? (
              <LoadingBlock label="Loading chat" rows={2} />
            ) : saved.error && turns.length === 0 ? (
              <ErrorState error={saved.error} onRetry={saved.refetch} />
            ) : turns.length === 0 ? (
              <div className="py-6 text-center sm:py-12">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
                  <Bot aria-hidden className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold text-ink">What are you working on?</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">
                  {context
                    ? `Ask anything about "${context.lessonTitle}". The tutor can see the lesson text.`
                    : "Ask for an explanation, notes, practice questions or help with code."}
                </p>
                <div className="mx-auto mt-7 grid max-w-xl gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.filter((s) => !s.needsLesson || context).map((s) => (
                    <button
                      key={s.label}
                      onClick={() => pickSuggestion(s)}
                      disabled={outOfQuestions}
                      className="flex min-h-12 items-center gap-3 rounded-card border bg-surface px-4 py-3 text-left text-sm text-ink-2 shadow-card transition-colors hover:border-line-strong hover:text-ink disabled:opacity-50"
                    >
                      <s.icon aria-hidden className="h-4 w-4 shrink-0 text-accent-ink" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ol className="space-y-6" aria-live="polite" aria-busy={streaming}>
                {turns.map((turn, index) =>
                  turn.role === "user" ? (
                    <li key={index} className="flex justify-end">
                      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-accent-soft px-4 py-2.5 text-[15px] leading-relaxed text-ink">
                        <span className="sr-only">You: </span>
                        {turn.content}
                      </div>
                    </li>
                  ) : (
                    <li key={index} className="flex gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-accent-ink shadow-card">
                        <Bot aria-hidden className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="sr-only">AI Tutor: </span>
                        {turn.content ? (
                          <TutorMarkdown>{turn.content}</TutorMarkdown>
                        ) : (
                          <p className="flex items-center gap-1.5 py-1.5 text-sm text-ink-3" role="status">
                            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                            <span className="sr-only">The tutor is writing</span>
                          </p>
                        )}
                        {!turn.pending && turn.content && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            <CopyButton text={turn.content} />
                            {canRegenerate && index === turns.length - 1 && (
                              <button
                                onClick={() => run("", true)}
                                disabled={outOfQuestions}
                                className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-[12px] text-ink-3 hover:bg-sunken hover:text-ink disabled:opacity-50"
                              >
                                <RotateCcw aria-hidden className="h-3.5 w-3.5" /> Regenerate
                              </button>
                            )}
                            {turn.stopped && <span className="px-2 text-[12px] text-ink-3">Stopped</span>}
                          </div>
                        )}
                      </div>
                    </li>
                  )
                )}
              </ol>
            )}
            {error && (
              <div className="mt-5">
                <ErrorState
                  error={new Error(error)}
                  onRetry={!streaming && turns.at(-1)?.role === "user" ? () => run("", true) : undefined}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t bg-surface px-3 py-3 sm:px-5">
          <form onSubmit={submit} className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-card border border-line-strong bg-canvas p-2 focus-within:border-accent">
              <textarea
                ref={textarea}
                aria-label="Message the AI Tutor"
                rows={1}
                value={input}
                maxLength={8000}
                disabled={outOfQuestions}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={outOfQuestions ? "You've used today's questions. They reset at midnight." : "Ask a question…"}
                className="max-h-48 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-base text-ink outline-none [field-sizing:content] placeholder:text-ink-3 sm:text-sm"
              />
              <button
                type="button"
                disabled
                title="Voice input is coming later"
                aria-label="Voice input (coming later)"
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-3 opacity-50 sm:flex"
              >
                <Mic aria-hidden className="h-[18px] w-[18px]" />
              </button>
              {streaming ? (
                <button
                  type="button"
                  onClick={() => abort.current?.abort()}
                  aria-label="Stop answering"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-canvas"
                >
                  <Square aria-hidden className="h-3.5 w-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() || outOfQuestions}
                  aria-label="Send"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent disabled:opacity-40"
                >
                  <ArrowUp aria-hidden className="h-[18px] w-[18px]" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-[12px] text-ink-3">
              Answers are AI-generated and can be wrong. Check important details against your course.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
