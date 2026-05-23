"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

/** Animated Celora logo */
export function Logo({ className, size = "md", showText = true }: Props) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <div className={cn("relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan p-1.5 transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]", sizes[size])}>
        <Sparkles className="h-full w-full text-white" />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight gradient-text", textSizes[size])}>
          Celora
        </span>
      )}
    </Link>
  );
}
