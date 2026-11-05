"use client";

import { use } from "react";
import { ErrorState, LoadingBlock } from "@/components/ui/misc";
import { CourseEditor } from "@/features/teaching/CourseEditor";
import { useTeacherCourse } from "@/hooks/useTeaching";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, isPending, refetch } = useTeacherCourse(id);

  if (isPending) return <LoadingBlock label="Loading course" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return <CourseEditor key={data.id} course={data} />;
}
