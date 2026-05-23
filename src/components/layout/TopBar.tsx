"use client";

import { Search, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useSidebarStore } from "@/store/sidebarStore";
import { mockCurrentUser } from "@/data/users";

export function TopBar() {
  const { toggle } = useSidebarStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-bg-primary/80 backdrop-blur-xl px-4 md:px-6 transition-all duration-300",
        "lg:ml-0" // Sidebar handles its own space
      )}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4 text-text-secondary" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search courses, quizzes, topics..."
            className="h-9 w-64 rounded-lg bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-text-secondary" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-rose text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <div className="ml-1 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center text-xs font-bold text-white">
            {mockCurrentUser.name.split(" ").map(n => n[0]).join("")}
          </div>
          <span className="hidden md:block text-sm font-medium text-text-primary">{mockCurrentUser.name.split(" ")[0]}</span>
        </div>
      </div>
    </header>
  );
}
