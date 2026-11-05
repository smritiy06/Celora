"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { useNote } from "@/hooks/useLearning";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { LessonCheck, LessonResource } from "@/types/domain";

/** YouTube links become a privacy-enhanced embed; other https video plays natively. */
export function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

export function LessonVideo({ url, title }: { url: string; title: string }) {
  const embed = youtubeEmbedUrl(url);
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
      {embed ? (
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          className="h-full w-full"
        />
      ) : (
        <video src={url} controls preload="metadata" className="h-full w-full">
          <a href={url}>Open the video</a>
        </video>
      )}
    </div>
  );
}

export function LessonResources({ resources }: { resources: LessonResource[] }) {
  if (resources.length === 0) return null;
  return (
    <section className="max-w-[66ch] border-t pt-6">
      <h2 className="text-xl font-semibold">Resources</h2>
      <ul className="mt-3 space-y-2">
        {resources.map((resource) => (
          <li key={resource.url}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent-ink hover:underline">
              {resource.title}
              <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A low-stakes question for checking understanding. It carries no score or XP. */
export function KnowledgeCheck({ check }: { check: LessonCheck }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selected === check.correctIndex;

  return (
    <section className="max-w-[66ch] rounded-card border bg-surface shadow-card p-5">
      <h2 className="text-sm text-ink-3">Check your understanding</h2>
      <fieldset className="mt-2">
        <legend className="font-medium">{check.question}</legend>
        <div className="mt-3 space-y-2">
          {check.options.map((option, index) => (
            <label
              key={index}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                selected === index ? "border-accent bg-accent-soft" : "hover:bg-sunken"
              )}
            >
              <input
                type="radio"
                name="knowledge-check"
                checked={selected === index}
                onChange={() => {
                  setSelected(index);
                  setChecked(false);
                }}
                className="accent-[var(--accent)]"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      {checked ? (
        <div role="status" className="mt-4 flex gap-2.5 text-sm">
          {isCorrect ? (
            <CheckCircle2 aria-hidden className="h-5 w-5 shrink-0 text-success" />
          ) : (
            <XCircle aria-hidden className="h-5 w-5 shrink-0 text-danger" />
          )}
          <div>
            <p className="font-medium">{isCorrect ? "That's right." : `Not quite. The answer is "${check.options[check.correctIndex]}".`}</p>
            {check.explanation && <p className="mt-1 text-ink-2">{check.explanation}</p>}
          </div>
        </div>
      ) : (
        <Button variant="secondary" size="sm" className="mt-4" disabled={selected === null} onClick={() => setChecked(true)}>
          Check answer
        </Button>
      )}
    </section>
  );
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function LessonNotes({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const client = useQueryClient();
  const { data, isPending } = useNote(courseId, lessonId);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<SaveState>("idle");
  const lastSaved = useRef("");
  const loaded = useRef(false);

  const save = useMutation({
    mutationFn: (text: string) => api.saveNote(courseId, lessonId, text),
    onMutate: () => setStatus("saving"),
    onSuccess: (_result, text) => {
      lastSaved.current = text;
      setStatus("saved");
      client.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => setStatus("error"),
  });

  useEffect(() => {
    if (data && !loaded.current) {
      loaded.current = true;
      const text = data.note?.content ?? "";
      lastSaved.current = text;
      setContent(text);
    }
  }, [data]);

  useEffect(() => {
    if (!loaded.current || content === lastSaved.current) return;
    const timer = setTimeout(() => save.mutate(content), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only typing restarts the autosave timer
  }, [content]);

  const statusText = {
    idle: content ? "Saved" : "Notes save automatically",
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save. Keep this tab open and try typing again.",
  }[status];

  return (
    <section className="max-w-[66ch]">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold">Your notes</h2>
        <p role="status" className={cn("text-xs", status === "error" ? "text-danger" : "text-ink-3")}>
          {statusText}
        </p>
      </div>
      <Textarea
        aria-label="Your notes on this lesson"
        rows={6}
        disabled={isPending}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="In your own words, what matters here?"
      />
    </section>
  );
}
