"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "elevated";
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

/**
 * Glassmorphism card component.
 *
 * Uses CSS variable-based colors so it automatically adapts
 * between light (solid white) and dark (translucent glass) themes.
 */
export function GlassCard({ children, className, variant = "default", hover = true, padding = "md" }: Props) {
  const variants = {
    default: "glass",
    strong: "glass-strong",
    elevated: "border border-glass-border bg-bg-elevated shadow-card",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        variants[variant],
        paddings[padding],
        hover && "hover:border-glass-border-hover hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
