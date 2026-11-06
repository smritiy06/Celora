"use client";

import { Star } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Section } from "@/components/shared/learning";
import { Stars } from "@/components/shared/rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { ErrorState, Skeleton, Tag } from "@/components/ui/misc";
import { useReviews, useSaveReview } from "@/hooks/useCommunity";
import { cn, plural, timeAgo } from "@/lib/utils";

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const labels = ["Poor", "Fair", "Good", "Very good", "Excellent"];
  const shown = hover || value;
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-ink">Your rating</legend>
      <div className="flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                className="peer sr-only"
              />
              <Star
                aria-hidden
                className={cn(
                  "h-7 w-7 rounded-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                  n <= shown ? "fill-warn text-warn" : "text-line-strong"
                )}
              />
              <span className="sr-only">{labels[n - 1]}, {plural(n, "star")}</span>
            </label>
          ))}
        </div>
        <span className="text-sm text-ink-2" aria-hidden>{shown ? labels[shown - 1] : "Choose"}</span>
      </div>
    </fieldset>
  );
}

function ReviewForm({ courseId, initial }: { courseId: string; initial: { rating: number; text: string } | null }) {
  const { save, remove } = useSaveReview(courseId);
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [text, setText] = useState(initial?.text ?? "");
  const [editing, setEditing] = useState(!initial);

  useEffect(() => {
    setRating(initial?.rating ?? 0);
    setText(initial?.text ?? "");
  }, [initial?.rating, initial?.text]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate({ rating, text }, { onSuccess: () => setEditing(false) });
  };

  if (!editing && initial) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-canvas p-4">
        <p className="text-sm text-ink-2">You rated this course {plural(initial.rating, "star")}.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit review</Button>
          <Button size="sm" variant="ghost" onClick={() => remove.mutate()} disabled={remove.isPending}>
            {remove.isPending ? "Removing…" : "Remove"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border bg-canvas p-4">
      <StarInput value={rating} onChange={setRating} />
      <div>
        <label htmlFor="review-text" className="mb-1.5 block text-sm font-medium text-ink">
          Your review <span className="font-normal text-ink-3">(optional)</span>
        </label>
        <Textarea
          id="review-text"
          rows={3}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What was most useful? What could be clearer?"
        />
      </div>
      {save.error && <ErrorState error={save.error} />}
      <div className="flex gap-2">
        <Button type="submit" disabled={rating === 0 || save.isPending}>
          {save.isPending ? "Saving…" : initial ? "Update review" : "Post review"}
        </Button>
        {initial && <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>}
      </div>
      <p className="text-[13px] text-ink-3">Your review shows your first name and last initial.</p>
    </form>
  );
}

export function CourseReviewsSection({ courseId }: { courseId: string }) {
  const { data, error, isPending, refetch } = useReviews(courseId);

  return (
    <div id="reviews" className="scroll-mt-20">
      <Section title="Reviews" icon={Star} tone="warn">
        {isPending ? (
          <Skeleton className="h-32 w-full" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <div className="space-y-5">
            {data.summary.count > 0 && (
              <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="text-center sm:pr-4">
                  <p className="text-4xl font-semibold tabular-nums text-ink">{data.summary.average.toFixed(1)}</p>
                  <Stars value={data.summary.average} size="md" />
                  <p className="mt-1 text-[13px] text-ink-3">{plural(data.summary.count, "review")}</p>
                </div>
                <ul className="space-y-1.5" aria-label="Ratings breakdown">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count = data.distribution[n - 1];
                    const percent = Math.round((count / data.summary.count) * 100);
                    return (
                      <li key={n} className="flex items-center gap-3 text-[13px]">
                        <span className="w-12 text-ink-2">{plural(n, "star")}</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-sunken" aria-hidden>
                          <span className="block h-full rounded-full bg-warn" style={{ width: `${percent}%` }} />
                        </span>
                        <span className="w-10 text-right tabular-nums text-ink-3">{count}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {data.canReview && (
              <ReviewForm courseId={courseId} initial={data.mine && { rating: data.mine.rating, text: data.mine.text }} />
            )}

            {data.reviews.length === 0 ? (
              <p className="text-sm text-ink-2">
                No reviews yet.{data.canReview ? " Be the first to share what you thought." : " Learners who enrol can leave one."}
              </p>
            ) : (
              <ul className="divide-y">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-ink">{review.authorName}</span>
                      {review.isYou && <Tag tone="accent">You</Tag>}
                      <Stars value={review.rating} />
                      <span className="text-[13px] text-ink-3">{timeAgo(review.updatedAt)}</span>
                    </div>
                    {review.text && <p className="whitespace-pre-line text-sm leading-relaxed text-ink-2">{review.text}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
