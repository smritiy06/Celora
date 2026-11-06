"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Monitor, Moon, Palette, Shield, Sun, Target, User as UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Section } from "@/components/shared/learning";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { ErrorState, LoadingBlock, PageHeader } from "@/components/ui/misc";
import { CATEGORIES, DIFFICULTIES, LEARNING_GOALS } from "@/constants/catalog";
import { useMe, useSession } from "@/hooks/useAccount";
import { useUpdateProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { Difficulty } from "@/types/domain";

const THEMES = [
  { id: "dark", label: "Dark", hint: "Easy on the eyes", icon: Moon },
  { id: "light", label: "Light", hint: "Warm and bright", icon: Sun },
  { id: "system", label: "System", hint: "Match your device", icon: Monitor },
];

const TABS = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "learning", label: "Learning", icon: Target },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "account", label: "Account", icon: UserIcon },
];

function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <fieldset>
      <legend className="sr-only">Theme</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {THEMES.map((option) => {
          const selected = mounted && theme === option.id;
          return (
            <label key={option.id} className={cn("cursor-pointer rounded-xl border p-4 text-center transition-colors", selected ? "border-accent bg-accent-soft" : "bg-canvas hover:border-line-strong")}>
              <input type="radio" name="theme" checked={selected} onChange={() => setTheme(option.id)} className="sr-only" />
              <option.icon aria-hidden className={cn("mx-auto mb-2 h-5 w-5", selected ? "text-accent-ink" : "text-ink-3")} />
              <span className="block text-sm font-medium text-ink">{option.label}</span>
              <span className="block text-xs text-ink-3">{option.hint}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function TeachingSetting({ isTeacher }: { isTeacher: boolean }) {
  const client = useQueryClient();
  const change = useMutation({
    mutationFn: () => api.setRole(isTeacher ? "student" : "teacher"),
    onSuccess: (user) => client.setQueryData(["me"], user),
  });
  return (
    <div className="mt-5">
      <Section title="Teaching" icon={GraduationCap}>
        <p className="mb-4 text-sm text-ink-2">
          {isTeacher
            ? "Teaching is on. You can create courses and quizzes from the teacher portal. Turning it off hides the portal; your courses stay published."
            : "Turn on teaching to create courses and quizzes. Your learning progress stays as it is."}
        </p>
        {change.error && <div className="mb-3"><ErrorState error={change.error} /></div>}
        <div className="flex flex-wrap gap-2">
          <Button variant={isTeacher ? "secondary" : "primary"} onClick={() => change.mutate()} disabled={change.isPending}>
            {change.isPending ? "Saving…" : isTeacher ? "Turn off teaching" : "Start teaching"}
          </Button>
          {isTeacher && <ButtonLink href="/teacher" variant="ghost">Open teacher portal</ButtonLink>}
        </div>
      </Section>
    </div>
  );
}

export default function SettingsPage() {
  const { data: me, error, isPending, refetch } = useMe();
  const { openAccount } = useSession();
  const update = useUpdateProfile();
  const [tab, setTab] = useState("appearance");

  if (isPending) return <LoadingBlock label="Loading settings" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const prefs = me.preferences;
  const toggleInterest = (id: string) =>
    update.mutate({
      preferences: {
        ...prefs,
        interests: prefs.interests.includes(id) ? prefs.interests.filter((i) => i !== id) : [...prefs.interests, id],
      },
    });

  return (
    <div>
      <PageHeader title="Settings" description="Customize your Celora experience." />

      <div className="grid gap-5 lg:grid-cols-4">
        <div role="tablist" aria-label="Settings sections" aria-orientation="vertical" className="hide-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
          {TABS.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm",
                tab === item.id ? "bg-accent-soft font-medium text-accent-ink" : "text-ink-2 hover:bg-sunken hover:text-ink"
              )}
            >
              <item.icon aria-hidden className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="min-w-0 space-y-4 lg:col-span-3">
          {update.error && <ErrorState error={update.error} />}

          {tab === "appearance" && (
            <Section title="Appearance"><ThemeSetting /></Section>
          )}

          {tab === "learning" && (
            <Section title="What you're learning">
              <p className="-mt-2 mb-4 text-[13px] text-ink-3">We use these to order course suggestions.</p>
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your goal">
                    {(id) => (
                      <Select id={id} value={prefs.goal ?? ""} onChange={(e) => update.mutate({ preferences: { ...prefs, goal: e.target.value || null } })}>
                        <option value="">No specific goal</option>
                        {LEARNING_GOALS.map((g) => (<option key={g.id} value={g.id}>{g.label}</option>))}
                      </Select>
                    )}
                  </Field>
                  <Field label="Your level">
                    {(id) => (
                      <Select id={id} value={prefs.level ?? ""} onChange={(e) => update.mutate({ preferences: { ...prefs, level: (e.target.value || null) as Difficulty | null } })}>
                        <option value="">Not sure</option>
                        {DIFFICULTIES.map((d) => (<option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>))}
                      </Select>
                    )}
                  </Field>
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-ink">Interests</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CATEGORIES.map((category) => (
                      <label key={category.id} className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border bg-canvas px-3 text-sm text-ink">
                        <input type="checkbox" checked={prefs.interests.includes(category.id)} onChange={() => toggleInterest(category.id)} className="accent-[var(--accent)]" />
                        {category.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </Section>
          )}

          {tab === "privacy" && (
            <Section title="Privacy">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-ink">Show me on the leaderboard</span>
                  <span className="mt-0.5 block text-[13px] text-ink-2">Others see your first name, last initial, and XP.</span>
                </span>
                <span className="relative inline-flex shrink-0">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={me.showOnLeaderboard}
                    onChange={(e) => update.mutate({ showOnLeaderboard: e.target.checked })}
                    className="peer sr-only"
                  />
                  <span aria-hidden className="h-6 w-11 rounded-full border border-line-strong bg-sunken transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
                  <span aria-hidden className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-ink-2 transition-transform peer-checked:translate-x-5 peer-checked:bg-on-accent" />
                </span>
              </label>
            </Section>
          )}

          {tab === "account" && (
            <Section title="Account">
              <p className="mb-4 text-sm text-ink-2">
                Signed in as <span className="font-medium text-ink">{me.email || me.name}</span>. Change your email or password, connect Google or GitHub, or delete your account.
              </p>
              <Button variant="secondary" onClick={openAccount}>Manage account</Button>
            </Section>
          )}

          {tab === "account" && <TeachingSetting isTeacher={me.role === "teacher"} />}
        </div>
      </div>
    </div>
  );
}
