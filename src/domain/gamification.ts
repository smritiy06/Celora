import { XP_LEVELS, XP_PER_CORRECT_ANSWER } from "@/constants/catalog";
import type { Streak, TopicScore } from "@/types/domain";

export function levelFromXp(xp: number) {
  let index = 0;
  XP_LEVELS.forEach((l, i) => {
    if (xp >= l.xpRequired) index = i;
  });
  const current = XP_LEVELS[index];
  const next = XP_LEVELS[index + 1] ?? null;
  const percentToNext = next
    ? Math.round(((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100)
    : 100;
  return { level: current.level, next, percentToNext };
}

function dayNumber(date: string): number {
  return Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
}

/** Updates a streak for activity on `today`: same day no change, next day +1, otherwise restart. */
export function applyStreak(streak: Streak, today: string): Streak {
  if (streak.lastActiveDate === today) return streak;
  const continues =
    streak.lastActiveDate !== null && dayNumber(today) - dayNumber(streak.lastActiveDate) === 1;
  const current = continues ? streak.current + 1 : 1;
  return { current, longest: Math.max(streak.longest, current), lastActiveDate: today };
}

/** The streak to display: it has lapsed if the learner missed all of yesterday. */
export function visibleStreak(streak: Streak, today: string): number {
  if (!streak.lastActiveDate) return 0;
  return dayNumber(today) - dayNumber(streak.lastActiveDate) <= 1 ? streak.current : 0;
}

/** Retakes only earn XP for beating the learner's previous best. */
export function quizXpEarned(correct: number, bestPreviousCorrect: number): number {
  return Math.max(0, correct - bestPreviousCorrect) * XP_PER_CORRECT_ANSWER;
}

export function mergeTopicScores(lists: TopicScore[][]): TopicScore[] {
  const totals = new Map<string, { correct: number; total: number }>();
  for (const score of lists.flat()) {
    const entry = totals.get(score.topic) ?? { correct: 0, total: 0 };
    entry.correct += score.correct;
    entry.total += score.total;
    totals.set(score.topic, entry);
  }
  return [...totals.entries()]
    .map(([topic, t]) => ({ topic, ...t, percent: Math.round((t.correct / t.total) * 100) }))
    .sort((a, b) => a.percent - b.percent);
}

/** Topics with enough answers to trust and an accuracy under 70%, weakest first. */
export function weakTopics(scores: TopicScore[]): TopicScore[] {
  return scores.filter((s) => s.total >= 2 && s.percent < 70);
}

/** A date key in the given IANA time zone, falling back to UTC when invalid. */
export function dateKey(now: Date, timeZone?: string | null): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

/** A stable pick from a list for a given day, so everyone gets the same daily quiz. */
export function pickForDay<T>(items: T[], day: string): T | null {
  if (items.length === 0) return null;
  return items[dayNumber(day) % items.length];
}
