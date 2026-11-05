"use client";

import { use } from "react";
import { ErrorState, LoadingBlock } from "@/components/ui/misc";
import { QuizEditor } from "@/features/teaching/QuizEditor";
import { useTeacherQuiz } from "@/hooks/useTeaching";

export default function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, isPending, refetch } = useTeacherQuiz(id);

  if (isPending) return <LoadingBlock label="Loading quiz" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return <QuizEditor key={data.id} quiz={data} />;
}
