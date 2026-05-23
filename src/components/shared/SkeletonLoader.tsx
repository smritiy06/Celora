"use client";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "card" | "text" | "avatar" | "button";
  lines?: number;
}

/** Skeleton loading component with shimmer animation */
export function SkeletonLoader({ className, variant = "card", lines = 3 }: Props) {
  if (variant === "avatar") {
    return <div className={cn("h-10 w-10 rounded-full bg-white/[0.06] animate-shimmer", className)} />;
  }

  if (variant === "button") {
    return <div className={cn("h-10 w-24 rounded-lg bg-white/[0.06] animate-shimmer", className)} />;
  }

  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={cn("h-4 rounded bg-white/[0.06] animate-shimmer", i === lines - 1 ? "w-3/4" : "w-full")} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-4", className)}>
      <div className="h-32 rounded-lg bg-white/[0.06] animate-shimmer" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/[0.06] animate-shimmer" />
        <div className="h-4 w-1/2 rounded bg-white/[0.06] animate-shimmer" />
      </div>
    </div>
  );
}
