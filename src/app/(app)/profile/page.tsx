"use client";

import { Award, Calendar, CheckCircle2, Flame, GraduationCap, Lock, Medal, Sparkles, Target, Trophy, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ActivityHeatmap, IconTile, Section, Stat } from "@/components/shared/learning";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Card, ErrorState, LoadingBlock, ProgressBar, Tag } from "@/components/ui/misc";
import { categoryLabel } from "@/constants/catalog";
import { dateKey, levelFromXp, visibleStreak } from "@/domain/gamification";
import { useProgress } from "@/hooks/useLearning";
import { useUpdateProfile } from "@/hooks/useProfile";
import { cn, formatDate, plural } from "@/lib/utils";
import type { ProgressData, User } from "@/types/domain";

function EditForm({ user, onDone }: { user: User; onDone: () => void }) {
  const update = useUpdateProfile();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    update.mutate({ name, bio }, { onSuccess: onDone });
  };

  return (
    <Card>
      <form onSubmit={submit} className="max-w-xl space-y-4">
        <Field label="Name">{(id) => <Input id={id} value={name} required maxLength={80} onChange={(e) => setName(e.target.value)} />}</Field>
        <Field label="About you" hint="Shown only on your own profile for now.">
          {(id) => <Textarea id={id} rows={3} maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} />}
        </Field>
        {update.error && <ErrorState error={update.error} />}
        <div className="flex gap-2">
          <Button type="submit" disabled={update.isPending}>{update.isPending ? "Saving…" : "Save"}</Button>
          <Button variant="ghost" onClick={onDone}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

/** Achievements earned from the learner's real record. */
function achievements(data: ProgressData): { icon: LucideIcon; title: string; hint: string; earned: boolean }[] {
  const lessonsDone = data.activity.reduce((sum, d) => sum + d.lessons, 0);
  return [
    { icon: Sparkles, title: "First steps", hint: "Complete a lesson", earned: lessonsDone > 0 || data.coursesCompleted.length > 0 },
    { icon: GraduationCap, title: "Graduate", hint: "Complete a course", earned: data.coursesCompleted.length > 0 },
    { icon: Trophy, title: "Quiz taker", hint: "Finish a quiz", earned: data.attempts.length > 0 },
    { icon: Target, title: "Top marks", hint: "Score 100% on a quiz", earned: data.attempts.some((a) => a.scorePercent === 100) },
    { icon: Flame, title: "On a roll", hint: "Reach a 7-day streak", earned: data.user.streak.longest >= 7 },
    { icon: Medal, title: "Dedicated", hint: "Reach a 30-day streak", earned: data.user.streak.longest >= 30 },
  ];
}

export default function ProfilePage() {
  const { data, error, isPending, refetch } = useProgress();
  const [editing, setEditing] = useState(false);

  if (isPending) return <LoadingBlock label="Loading your profile" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const { user } = data;
  const { level, next, percentToNext } = levelFromXp(user.xp);
  const today = dateKey(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone);
  const initials = user.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const earned = achievements(data);

  return (
    <div className="space-y-5">
      <section className="dot-panel rounded-card border p-6 shadow-card sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="relative shrink-0">
            <div aria-hidden className="flex h-24 w-24 items-center justify-center rounded-2xl bg-accent text-2xl font-semibold text-on-accent shadow-card">
              {initials}
            </div>
            <span className="absolute -bottom-2 -right-2 rounded-lg border bg-surface px-2 py-0.5 text-xs font-semibold text-ink shadow-card">Lv {level}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{user.name}</h1>
            <p className="mt-0.5 text-sm capitalize text-ink-3">{user.role}</p>
            {user.bio && <p className="mt-2 max-w-2xl text-sm text-ink-2">{user.bio}</p>}
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[13px] sm:justify-start">
              <span className="flex items-center gap-1.5 text-accent-ink"><Zap aria-hidden className="h-3.5 w-3.5" />{user.xp.toLocaleString()} XP</span>
              <span className="flex items-center gap-1.5 text-warn"><Flame aria-hidden className="h-3.5 w-3.5" />{plural(visibleStreak(user.streak, today), "day")} streak</span>
              <span className="flex items-center gap-1.5 text-ink-3"><Calendar aria-hidden className="h-3.5 w-3.5" />Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
          {!editing && (
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit profile</Button>
              <ButtonLink href="/settings" variant="ghost" size="sm">Settings</ButtonLink>
            </div>
          )}
        </div>
        <div className="mx-auto mt-6 max-w-md sm:mx-0">
          <p className="mb-1.5 text-[13px] text-ink-3">
            {next ? `${(next.xpRequired - user.xp).toLocaleString()} XP to level ${next.level}` : "You've reached the top level"}
          </p>
          <ProgressBar percent={percentToNext} label="Progress to next level" />
        </div>
      </section>

      {editing && <EditForm user={user} onDone={() => setEditing(false)} />}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Courses done" value={data.coursesCompleted.length} icon={GraduationCap} />
        <Stat label="Recent quizzes" value={data.attempts.length} icon={Trophy} tone="warn" />
        <Stat label="Average score" value={data.averageScore !== null ? `${data.averageScore}%` : "None"} icon={Target} tone="info" />
        <Stat label="Longest streak" value={plural(user.streak.longest, "day")} icon={Flame} tone="danger" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Interests" icon={Sparkles}>
          {user.preferences.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.preferences.interests.map((interest) => (<Tag key={interest} tone="accent">{categoryLabel(interest)}</Tag>))}
            </div>
          ) : (
            <p className="text-sm text-ink-2">Add interests in <Link href="/settings" className="text-accent-ink underline">Settings</Link> to get better suggestions.</p>
          )}
        </Section>
        <Section title="Achievements" icon={Award} tone="warn">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {earned.map((item) => (
              <li key={item.title} className={cn("rounded-xl border p-3", item.earned ? "bg-canvas" : "opacity-55")}>
                <IconTile icon={item.earned ? item.icon : Lock} tone={item.earned ? "accent" : "info"} size="sm" />
                <p className="mt-2 text-[13px] font-medium text-ink">{item.title}</p>
                <p className="text-xs text-ink-3">
                  {item.earned && <span className="sr-only">Earned. </span>}
                  {item.hint}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Activity" icon={Flame} tone="warn">
        <ActivityHeatmap days={data.activity} today={today} />
      </Section>

      <Section title="Certificates" icon={Award} tone="success">
        {data.coursesCompleted.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.coursesCompleted.map((course) => (
              <li key={course.id}>
                <Link href={`/certificates/${course.id}`} className="flex items-center gap-3 rounded-xl border bg-canvas p-3 hover:border-line-strong">
                  <IconTile icon={CheckCircle2} tone="success" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{course.title}</span>
                    <span className="text-[13px] text-ink-3">
                      {course.progress?.completedAt && `Finished ${formatDate(course.progress.completedAt)} · `}View certificate
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-2">Finish every lesson in a course to earn its certificate.</p>
        )}
      </Section>
    </div>
  );
}
