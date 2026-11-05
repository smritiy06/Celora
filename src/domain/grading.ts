import type { AnswerInput, QuizGrade, QuizQuestion, ReviewItem, TopicScore } from "@/types/domain";

/** Grades answers against the stored questions. Answers to unknown questions are ignored. */
export function gradeQuiz(questions: QuizQuestion[], answers: AnswerInput[]): QuizGrade {
  const selected = new Map(answers.map((a) => [a.questionId, a.selectedIndex]));

  const review: ReviewItem[] = questions.map((q) => {
    const choice = selected.get(q.id) ?? null;
    const selectedIndex = choice !== null && choice >= 0 && choice < q.options.length ? choice : null;
    return {
      questionId: q.id,
      prompt: q.prompt,
      options: q.options,
      selectedIndex,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      topic: q.topic,
      isCorrect: selectedIndex === q.correctIndex,
    };
  });

  const correct = review.filter((r) => r.isCorrect).length;
  const unanswered = review.filter((r) => r.selectedIndex === null).length;
  const total = questions.length;

  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const item of review) {
    const entry = byTopic.get(item.topic) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (item.isCorrect) entry.correct += 1;
    byTopic.set(item.topic, entry);
  }
  const topics: TopicScore[] = [...byTopic.entries()].map(([topic, t]) => ({
    topic,
    ...t,
    percent: Math.round((t.correct / t.total) * 100),
  }));

  return {
    correct,
    incorrect: total - correct - unanswered,
    unanswered,
    total,
    scorePercent: total === 0 ? 0 : Math.round((correct / total) * 100),
    review,
    topics,
  };
}

/** Seconds left before a deadline, never negative. */
export function secondsRemaining(deadlineMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}

export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
