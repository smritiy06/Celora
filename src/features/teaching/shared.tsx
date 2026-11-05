"use client";

import { Check, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { ErrorState, PageHeader } from "@/components/ui/misc";
import { CATEGORIES } from "@/constants/catalog";

/** Asks before the browser discards unsaved work. */
export function useUnsavedWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
}

/** Starting something new needs only a name; everything else happens in the editor. */
export function NewDraftForm({
  kind,
  placeholder,
  create,
  editHref,
}: {
  kind: "course" | "quiz";
  placeholder: string;
  create: {
    mutate: (
      input: { title: string; category: string },
      options: { onSuccess: (result: { id: string }) => void }
    ) => void;
    isPending: boolean;
    error: unknown;
  };
  editHref: (id: string) => string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].id);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate({ title, category }, { onSuccess: (result) => router.replace(editHref(result.id)) });
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={`New ${kind}`} description="You can change these later. Nothing is public until you publish." />
      <form onSubmit={submit} className="space-y-5">
        <Field label="Title">
          {(id) => <Input id={id} value={title} required maxLength={150} autoFocus placeholder={placeholder} onChange={(e) => setTitle(e.target.value)} />}
        </Field>
        <Field label="Category">
          {(id) => (
            <Select id={id} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </Select>
          )}
        </Field>
        {create.error ? <ErrorState error={create.error} /> : null}
        <Button type="submit" disabled={create.isPending || !title.trim()}>
          {create.isPending ? "Creating…" : `Create ${kind}`}
        </Button>
      </form>
    </div>
  );
}

export interface ChoiceDraft {
  options: string[];
  correctIndex: number;
}

/** Answer options for a question, with the correct one chosen by radio button. */
export function ChoiceEditor<T extends ChoiceDraft>({
  name,
  value,
  onChange,
}: {
  name: string;
  value: T;
  onChange: (next: T) => void;
}) {
  const setOption = (index: number, text: string) =>
    onChange({ ...value, options: value.options.map((o, i) => (i === index ? text : o)) });

  const remove = (index: number) =>
    onChange({
      ...value,
      options: value.options.filter((_, i) => i !== index),
      correctIndex:
        value.correctIndex === index ? 0 : value.correctIndex > index ? value.correctIndex - 1 : value.correctIndex,
    });

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">Answers</legend>
      <p className="mb-2 text-sm text-ink-3">Select the correct one.</p>
      <div className="space-y-2">
        {value.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name={name}
              aria-label={`Answer ${index + 1} is correct`}
              checked={value.correctIndex === index}
              onChange={() => onChange({ ...value, correctIndex: index })}
              className="h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <Input aria-label={`Answer ${index + 1}`} value={option} onChange={(e) => setOption(index, e.target.value)} />
            {value.correctIndex === index && <Check aria-hidden className="h-4 w-4 shrink-0 text-success" />}
            {value.options.length > 2 && (
              <button type="button" onClick={() => remove(index)} aria-label={`Remove answer ${index + 1}`} className="shrink-0 rounded p-2 text-ink-3 hover:text-danger">
                <Trash2 aria-hidden className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {value.options.length < 6 && (
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => onChange({ ...value, options: [...value.options, ""] })}>
          <Plus aria-hidden className="h-4 w-4" /> Add answer
        </Button>
      )}
    </fieldset>
  );
}

export function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
