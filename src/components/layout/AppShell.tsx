"use client";

import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  BookOpen,
  ChevronLeft,
  Flame,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Menu,
  Search,
  Settings,
  StickyNote,
  Target,
  Trophy,
  UserCircle,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Footer, PublicHeader, Wordmark } from "@/components/layout/Public";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { dateKey, levelFromXp, visibleStreak } from "@/domain/gamification";
import { useMe, useSession } from "@/hooks/useAccount";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
}

const LEARN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Learning Paths", href: "/courses", icon: BookOpen },
  { label: "Goals", href: "/roadmaps", icon: Target },
  { label: "Quiz Arena", href: "/quiz", icon: Trophy },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

const TEACH_NAV: NavItem[] = [
  { label: "Overview", href: "/teacher", icon: LayoutDashboard },
  { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
  { label: "My Quizzes", href: "/teacher/quizzes", icon: ListChecks },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

const isActive = (pathname: string, href: string) =>
  href === "/teacher" || href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

/** Learning and quiz-taking fill the screen, the way a good course player does. */
const isFocusRoute = (pathname: string) =>
  /^\/courses\/[^/]+\/lessons\//.test(pathname) ||
  /^\/quiz\/[^/]+\/take$/.test(pathname) ||
  pathname.startsWith("/certificates/");

/** Pages that manage their own height and scrolling, like the tutor chat. */
const isFullBleed = (pathname: string) => pathname === "/ai-tutor";

const COLLAPSE_KEY = "celora.sidebar.collapsed";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useSession();
  const { data: me } = useMe();
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* Storage can be blocked; the default is fine. */
    }
  }, []);

  useEffect(() => {
    if (me && !me.onboardingCompleted) router.replace("/onboarding");
  }, [me, router]);

  useEffect(() => setMoreOpen(false), [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, value ? "0" : "1");
      } catch {
        /* Not remembered next time, which is harmless. */
      }
      return !value;
    });
  };

  if (isFocusRoute(pathname)) return <div className="min-h-screen">{children}</div>;

  // Until sign-in state is known, show neither layout rather than flash the wrong one.
  if (!isLoaded) {
    return (
      <main id="main" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        {children}
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  const isTeacher = me?.role === "teacher";
  const onTeachRoute = pathname.startsWith("/teacher");
  const nav = isTeacher && onTeachRoute ? TEACH_NAV : LEARN_NAV;
  const today = dateKey(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone);
  const streak = me ? visibleStreak(me.streak, today) : 0;

  const primaryMobile = isTeacher && onTeachRoute ? nav.slice(0, 3) : [nav[0], nav[1], nav[3], nav[5]];
  const moreMobile = nav.filter((item) => !primaryMobile.includes(item));

  return (
    <div className="min-h-screen lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:bg-surface focus:p-2">
        Skip to content
      </a>

      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-surface transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-[252px]"
        )}
      >
        <div className={cn("flex h-16 items-center border-b px-4", collapsed && "justify-center")}>
          <Wordmark href={isTeacher && onTeachRoute ? "/teacher" : "/dashboard"} showText={!collapsed} />
          {isTeacher && onTeachRoute && !collapsed && (
            <span className="ml-auto rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-ink">Teacher</span>
          )}
        </div>

        {isTeacher && !collapsed && (
          <div className="border-b p-3">
            <div className="flex rounded-lg bg-sunken p-1">
              {[
                { label: "Student", href: "/dashboard", active: !onTeachRoute },
                { label: "Teacher", href: "/teacher", active: onTeachRoute },
              ].map((option) => (
                <Link
                  key={option.label}
                  href={option.href}
                  aria-current={option.active ? "page" : undefined}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-center text-[13px] font-medium",
                    option.active ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink"
                  )}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <nav aria-label="Main" className="hide-scrollbar flex-1 overflow-y-auto p-3">
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    aria-label={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm",
                      active ? "font-medium text-accent-ink" : "text-ink-2 hover:bg-sunken hover:text-ink",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-accent-soft"
                        transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      />
                    )}
                    <item.icon aria-hidden className="relative h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span className="relative truncate">{item.label}</span>}
                    {!collapsed && item.soon && (
                      <span className="relative ml-auto rounded bg-sunken px-1.5 py-0.5 text-[11px] text-ink-3">Soon</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t p-3">
          {me && !isTeacher && (
            <Link
              href="/teacher"
              title={collapsed ? "Teach on Celora" : undefined}
              aria-label={collapsed ? "Teach on Celora" : undefined}
              className={cn("flex min-h-9 items-center gap-3 rounded-lg px-3 text-sm text-ink-2 hover:bg-sunken hover:text-ink", collapsed && "justify-center px-0")}
            >
              <GraduationCap aria-hidden className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && "Teach on Celora"}
            </Link>
          )}
          <button
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex min-h-9 w-full items-center justify-center gap-2 rounded-lg text-sm text-ink-3 hover:bg-sunken hover:text-ink"
          >
            <ChevronLeft aria-hidden className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-surface px-4 sm:px-6">
          <span className="lg:hidden">
            <Wordmark href="/dashboard" showText={false} />
          </span>
          <CourseSearch />
          <div className="ml-auto flex items-center gap-2">
            {me && (
              <Link href="/analytics" className="flex items-center gap-2" aria-label={`${streak}-day streak, level ${levelFromXp(me.xp).level}, ${me.xp} XP. View analytics.`}>
                <span className="hidden items-center gap-1.5 rounded-lg bg-warn-soft px-2.5 py-1.5 text-[13px] font-medium text-warn tabular-nums sm:flex">
                  <Flame aria-hidden className="h-3.5 w-3.5" />
                  {streak}
                </span>
                <span className="hidden items-center gap-1.5 rounded-lg bg-accent-soft px-2.5 py-1.5 text-[13px] font-medium text-accent-ink tabular-nums sm:flex">
                  <Zap aria-hidden className="h-3.5 w-3.5" />
                  {me.xp.toLocaleString()}
                </span>
              </Link>
            )}
            <NotificationBell />
            <ThemeToggle />
            <div className="ml-1 flex items-center">
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link label="Profile" labelIcon={<UserCircle className="h-4 w-4" />} href="/profile" />
                  <UserButton.Link label="Settings" labelIcon={<Settings className="h-4 w-4" />} href="/settings" />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </div>
        </header>

        <main
          id="main"
          className={cn("mx-auto w-full flex-1", isFullBleed(pathname) ? "min-h-0" : "max-w-7xl p-4 pb-24 sm:p-6 lg:pb-8")}
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {moreOpen && (
        <div className="fixed inset-x-3 bottom-[72px] z-40 rounded-card border bg-surface p-2 shadow-card-hover lg:hidden">
          <ul>
            {moreMobile.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-ink-2 hover:bg-sunken">
                  <item.icon aria-hidden className="h-[18px] w-[18px]" />
                  {item.label}
                  {item.soon && <span className="ml-auto rounded bg-sunken px-1.5 py-0.5 text-[11px] text-ink-3">Soon</span>}
                </Link>
              </li>
            ))}
            {me && (
              <li>
                <Link href={onTeachRoute ? "/dashboard" : "/teacher"} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-accent-ink hover:bg-sunken">
                  <BookOpen aria-hidden className="h-[18px] w-[18px]" />
                  {!isTeacher ? "Teach on Celora" : `Switch to ${onTeachRoute ? "Student" : "Teacher"}`}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-surface lg:hidden">
        {primaryMobile.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px]",
                active ? "font-medium text-accent-ink" : "text-ink-3"
              )}
            >
              {active && <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-accent" />}
              <item.icon aria-hidden className="h-5 w-5" />
              {item.label === "Learning Paths" ? "Paths" : item.label === "Quiz Arena" ? "Quiz" : item.label === "Dashboard" ? "Home" : item.label.replace("My ", "")}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          className={cn("flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px]", moreOpen ? "font-medium text-accent-ink" : "text-ink-3")}
        >
          {moreOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          More
        </button>
      </nav>
    </div>
  );
}

function CourseSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/courses${value.trim() ? `?q=${encodeURIComponent(value.trim())}` : ""}`);
  };

  return (
    <form role="search" onSubmit={submit} className="relative hidden w-full max-w-xs sm:block">
      <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
      <input
        type="search"
        aria-label="Search courses"
        placeholder="Search paths and courses"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-10 w-full rounded-lg border bg-sunken pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-accent"
      />
    </form>
  );
}
