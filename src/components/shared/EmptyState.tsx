"use client";

import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** Empty state component for when no data is available */
export function EmptyState({
  title = "Nothing here yet",
  description = "Content will appear here once available.",
  icon,
  action,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="mb-4 rounded-2xl bg-white/[0.04] p-4">
        {icon || <Inbox className="h-10 w-10 text-text-muted" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-text-muted">{description}</p>
      {action}
    </div>
  );
}
