"use client";

import { NewDraftForm } from "@/features/teaching/shared";
import { useCreateCourse } from "@/hooks/useTeaching";

export default function NewCoursePage() {
  const create = useCreateCourse();
  return (
    <NewDraftForm
      kind="course"
      placeholder="For example: Python for data analysis"
      create={{
        mutate: (input, options) => create.mutate(input, options),
        isPending: create.isPending,
        error: create.error,
      }}
      editHref={(id) => `/teacher/courses/${id}`}
    />
  );
}
