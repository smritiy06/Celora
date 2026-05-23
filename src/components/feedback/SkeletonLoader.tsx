"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  /** Number of lines to render for text skeletons */
  lines?: number;
  /** Render as a circle (for avatars) */
  circle?: boolean;
}

/** Shimmer loading skeleton matching the design system */
export function SkeletonLoader({ className, lines = 1, circle }: SkeletonProps) {
  if (circle) {
    return (
      <div
        className={cn(
          "animate-shimmer rounded-full bg-bg-tertiary",
          className
        )}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 animate-shimmer rounded-md bg-bg-tertiary",
            i === lines - 1 && lines > 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  );
}

/** Card skeleton for course/quiz grid items */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-glass-border bg-bg-elevated p-5",
        className
      )}
    >
      <div className="mb-4 h-40 animate-shimmer rounded-xl bg-bg-tertiary" />
      <div className="mb-3 h-5 w-3/4 animate-shimmer rounded bg-bg-tertiary" />
      <div className="mb-2 h-4 w-full animate-shimmer rounded bg-bg-tertiary" />
      <div className="h-4 w-1/2 animate-shimmer rounded bg-bg-tertiary" />
    </div>
  );
}
