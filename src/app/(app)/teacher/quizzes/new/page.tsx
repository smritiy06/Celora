"use client";

import { NewDraftForm } from "@/features/teaching/shared";
import { useCreateQuiz } from "@/hooks/useTeaching";

export default function NewQuizPage() {
  const create = useCreateQuiz();
  return (
    <NewDraftForm
      kind="quiz"
      placeholder="For example: SQL joins"
      create={{
        mutate: (input, options) => create.mutate(input, options),
        isPending: create.isPending,
        error: create.error,
      }}
      editHref={(id) => `/teacher/quizzes/${id}`}
    />
  );
}
