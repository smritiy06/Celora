import { Star } from "lucide-react";
import { cn, plural } from "@/lib/utils";
import type { RatingSummary } from "@/types/domain";

/** Read-only stars. Screen readers hear the number instead. */
export function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-[18px] w-[18px]";
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn(icon, n <= Math.round(value) ? "fill-warn text-warn" : "text-line-strong")}
        />
      ))}
    </span>
  );
}

export function RatingBadge({ rating }: { rating: RatingSummary | null }) {
  if (!rating) return <span className="text-[13px] text-ink-3">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-2">
      <Star aria-hidden className="h-3.5 w-3.5 fill-warn text-warn" />
      <span className="font-medium tabular-nums text-ink">{rating.average.toFixed(1)}</span>
      <span className="text-ink-3">({rating.count.toLocaleString()})</span>
      <span className="sr-only">average from {plural(rating.count, "review")}</span>
    </span>
  );
}
