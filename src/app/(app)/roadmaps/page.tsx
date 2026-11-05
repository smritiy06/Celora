"use client";

import { CalendarDays, Check, Plus, Target, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Card, ConfirmDialog, EmptyState, ErrorState, LoadingBlock, PageHeader, ProgressBar, Tag } from "@/components/ui/misc";
import { categoryIcon, IconTile } from "@/components/shared/learning";
import { CATEGORIES, categoryLabel } from "@/constants/catalog";
import { useCreateGoal, useDeleteGoal, useGoals, useUpdateGoal } from "@/hooks/useLearning";
import { cn, formatDate, generateId, plural } from "@/lib/utils";
import type { LearningGoal } from "@/types/domain";

function NewGoalForm({ onDone }: { onDone: () => void }) {
  const create = useCreateGoal();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate(
      { title, category: category || null, targetDate: targetDate || null, milestones: [] },
      { onSuccess: onDone }
    );
  };

  return (
    <Card className="mb-6">
      <form onSubmit={submit} className="space-y-4">
        <Field label="What do you want to achieve?">
          {(id) => <Input id={id} value={title} required maxLength={150} autoFocus placeholder="For example: Build my first web app" onChange={(e) => setTitle(e.target.value)} />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject (optional)">
            {(id) => (
              <Select id={id} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">None</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Target date (optional)">
            {(id) => <Input id={id} type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />}
          </Field>
        </div>
        {create.error ? <ErrorState error={create.error} /> : null}
        <div className="flex gap-2">
          <Button type="submit" disabled={create.isPending || !title.trim()}>{create.isPending ? "Saving…" : "Create goal"}</Button>
          <Button variant="ghost" onClick={onDone}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

function GoalCard({ goal }: { goal: LearningGoal }) {
  const update = useUpdateGoal();
  const remove = useDeleteGoal();
  const [step, setStep] = useState("");
  const [confirming, setConfirming] = useState(false);

  const done = goal.milestones.filter((m) => m.done).length;
  const total = goal.milestones.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const finished = total > 0 && done === total;

  const save = (milestones: LearningGoal["milestones"]) =>
    update.mutate({
      id: goal.id,
      input: { title: goal.title, category: goal.category, targetDate: goal.targetDate, milestones },
    });

  const addStep = (event: FormEvent) => {
    event.preventDefault();
    if (!step.trim()) return;
    save([...goal.milestones, { id: generateId(), title: step.trim(), done: false }]);
    setStep("");
  };

  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex items-start gap-3">
        <IconTile icon={goal.category ? categoryIcon(goal.category) : Target} />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold leading-snug text-ink">{goal.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-3">
            {goal.category && <span>{categoryLabel(goal.category)}</span>}
            {goal.targetDate && (
              <span className="flex items-center gap-1">
                <CalendarDays aria-hidden className="h-3.5 w-3.5" />
                {formatDate(`${goal.targetDate}T12:00:00`)}
              </span>
            )}
          </div>
        </div>
        {finished && <Tag tone="success">Achieved</Tag>}
        <button onClick={() => setConfirming(true)} aria-label={`Delete goal: ${goal.title}`} className="-m-1 rounded-lg p-2 text-ink-3 hover:text-danger">
          <Trash2 aria-hidden className="h-4 w-4" />
        </button>
      </div>

      {total > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-ink-3">{done} of {plural(total, "step")} done</span>
            <span className="font-medium tabular-nums text-accent-ink">{percent}%</span>
          </div>
          <ProgressBar percent={percent} label={`${goal.title} progress`} />
        </div>
      )}

      <ul className="space-y-0.5">
        {goal.milestones.map((milestone) => (
          <li key={milestone.id} className="group flex items-center gap-1">
            <label className="flex min-h-10 min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 text-sm hover:bg-sunken">
              <input
                type="checkbox"
                className="sr-only"
                checked={milestone.done}
                onChange={() => save(goal.milestones.map((m) => (m.id === milestone.id ? { ...m, done: !m.done } : m)))}
              />
              <span aria-hidden className={cn("flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border border-line-strong", milestone.done && "border-accent bg-accent text-on-accent")}>
                {milestone.done && <Check className="h-3 w-3" />}
              </span>
              <span className={cn("min-w-0 truncate", milestone.done ? "text-ink-3 line-through" : "text-ink")}>{milestone.title}</span>
            </label>
            <button
              onClick={() => save(goal.milestones.filter((m) => m.id !== milestone.id))}
              aria-label={`Remove step: ${milestone.title}`}
              className="rounded-lg p-2 text-ink-3 hover:text-danger"
            >
              <Trash2 aria-hidden className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={addStep} className="mt-3 flex gap-2 border-t pt-3">
        <Input aria-label={`Add a step to ${goal.title}`} placeholder="Add a step" value={step} maxLength={150} onChange={(e) => setStep(e.target.value)} />
        <Button type="submit" variant="secondary" aria-label="Add step" disabled={!step.trim() || update.isPending}>
          <Plus aria-hidden className="h-4 w-4" />
        </Button>
      </form>

      {update.error ? <div className="mt-3"><ErrorState error={update.error} /></div> : null}

      <ConfirmDialog
        open={confirming}
        title="Delete this goal?"
        description="Its steps will be deleted too. This can't be undone."
        confirmLabel="Delete goal"
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          remove.mutate(goal.id);
          setConfirming(false);
        }}
      />
    </Card>
  );
}

export default function GoalsPage() {
  const { data, error, isPending, refetch } = useGoals();
  const [adding, setAdding] = useState(false);

  return (
    <>
      <PageHeader
        title="Goals"
        description="Set what you're working towards and break it into steps."
        action={!adding && (
          <Button onClick={() => setAdding(true)}>
            <Plus aria-hidden className="h-4 w-4" /> New goal
          </Button>
        )}
      />

      {adding && <NewGoalForm onDone={() => setAdding(false)} />}

      {isPending ? (
        <LoadingBlock label="Loading goals" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.length === 0 ? (
        !adding && (
          <EmptyState
            icon={<Target aria-hidden className="h-5 w-5" />}
            title="No goals yet"
            description="A goal gives your learning a direction. Add one and break it into steps you can tick off."
            action={<Button onClick={() => setAdding(true)}>Create your first goal</Button>}
          />
        )
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </>
  );
}
