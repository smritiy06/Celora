/**
 * Custom hook for learning path data fetching via TanStack Query.
 * Abstracts the service layer so UI never calls services directly.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { learningPathsService } from "@/services/courses.service";

/** Fetch all learning paths */
export function useLearningPaths() {
  return useQuery({
    queryKey: ["learningPaths"],
    queryFn: () => learningPathsService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** Fetch a single learning path by ID */
export function useLearningPath(pathId: string) {
  return useQuery({
    queryKey: ["learningPath", pathId],
    queryFn: () => learningPathsService.getById(pathId),
    enabled: !!pathId,
  });
}
