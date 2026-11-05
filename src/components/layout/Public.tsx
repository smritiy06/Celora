import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ButtonLink } from "@/components/ui/button";

export function Wordmark({ href = "/", showText = true }: { href?: string; showText?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-ink">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-on-accent shadow-card">
        <BookOpen aria-hidden className="h-[18px] w-[18px]" />
      </span>
      {showText ? <span className="text-lg font-semibold tracking-tight">Celora</span> : <span className="sr-only">Celora</span>}
    </Link>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-8 sm:px-6">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm text-ink-2 sm:flex">
          <Link href="/courses" className="hover:text-ink">Learning Paths</Link>
          <Link href="/quiz" className="hover:text-ink">Quiz Arena</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {/* The sign-up page links to log in, so the narrowest phones keep one button. */}
          <ButtonLink href="/login" variant="ghost" size="sm" className="hidden min-[400px]:inline-flex">Log in</ButtonLink>
          <ButtonLink href="/signup" size="sm">Sign up</ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const groups = [
    { title: "Platform", links: [{ label: "Learning Paths", href: "/courses" }, { label: "Quiz Arena", href: "/quiz" }] },
    { title: "Get started", links: [{ label: "Log in", href: "/login" }, { label: "Sign up", href: "/signup" }, { label: "Teach on Celora", href: "/signup" }] },
  ];
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
            Structured courses, quizzes that explain every answer, and progress you can trust.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="mb-3 text-sm font-semibold text-ink">{group.title}</h2>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-ink-2 hover:text-ink">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl border-t px-4 py-5 text-[13px] text-ink-3 sm:px-6">
        © {new Date().getFullYear()} Celora. All rights reserved.
      </div>
    </footer>
  );
}
