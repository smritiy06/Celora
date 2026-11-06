import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/layout/Public";

export interface AuthPoint {
  icon: LucideIcon;
  title: string;
  text: string;
}

/** The two-panel frame around the sign-in and sign-up forms. */
export function AuthFrame({
  heading,
  points,
  badge,
  switchLink,
  children,
}: {
  heading: string;
  points: AuthPoint[];
  badge?: string;
  switchLink?: { prompt: string; label: string; href: string };
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex min-w-0 flex-1 flex-col px-4 py-8 sm:px-12">
        <div className="flex items-center gap-3">
          <Wordmark />
          {badge && <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[12px] font-medium text-accent-ink">{badge}</span>}
        </div>
        <main id="main" className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
          {children}
          {switchLink && (
            <p className="text-center text-sm text-ink-2">
              {switchLink.prompt}{" "}
              <Link href={switchLink.href} className="font-medium text-accent-ink underline-offset-4 hover:underline">
                {switchLink.label}
              </Link>
            </p>
          )}
        </main>
      </div>
      <aside className="dot-panel hidden w-[46%] flex-col justify-center border-l p-12 lg:flex xl:p-20">
        <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-ink">{heading}</h2>
        <ul className="mt-10 grid max-w-xl gap-3 xl:grid-cols-2">
          {points.map((point) => (
            <li key={point.title} className="rounded-card border bg-surface p-4 shadow-card">
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
                <point.icon aria-hidden className="h-[18px] w-[18px]" />
              </span>
              <p className="text-sm font-medium text-ink">{point.title}</p>
              <p className="mt-0.5 text-[13px] text-ink-2">{point.text}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
