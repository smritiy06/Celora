/**
 * Custom hook for course data fetching via TanStack Query.
 * Abstracts the service layer so UI never calls services directly.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { coursesService } from "@/services/courses.service";

/** Fetch all courses */
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** Fetch a single course by ID */
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesService.getById(courseId),
    enabled: !!courseId,
  });
}
