"use client";

import { Award, Bell, MessageCircle, MessagesSquare, Star, UserPlus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMarkNotificationsRead, useNotifications } from "@/hooks/useCommunity";
import { cn, timeAgo } from "@/lib/utils";
import type { NotificationType } from "@/types/domain";

const ICONS: Record<NotificationType, LucideIcon> = {
  reply: MessageCircle,
  question: MessagesSquare,
  review: Star,
  enrollment: UserPlus,
  completion: Award,
};

export function NotificationBell() {
  const pathname = usePathname();
  const { data, error } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const unread = data?.filter((n) => !n.read).length ?? 0;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !panel.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={panel} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-sunken hover:text-ink"
      >
        <Bell aria-hidden className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-on-accent tabular-nums">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[68px] z-50 overflow-hidden rounded-card border bg-surface shadow-card-hover sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">Notifications</h2>
            {unread > 0 && (
              <button
                onClick={() => markRead.mutate(undefined)}
                disabled={markRead.isPending}
                className="text-[13px] font-medium text-accent-ink hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {error ? (
              <p className="p-4 text-sm text-danger">Couldn&apos;t load notifications. They&apos;ll retry shortly.</p>
            ) : !data ? (
              <p className="p-4 text-sm text-ink-3">Loading…</p>
            ) : data.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-medium text-ink">You&apos;re all caught up</p>
                <p className="mt-1 text-[13px] text-ink-3">Replies, reviews and course activity show up here.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {data.map((item) => {
                  const Icon = ICONS[item.type] ?? Bell;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => !item.read && markRead.mutate([item.id])}
                        className={cn("flex gap-3 px-4 py-3 hover:bg-sunken", !item.read && "bg-accent-soft/40")}
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-2">
                          <Icon aria-hidden className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block text-sm", item.read ? "text-ink-2" : "font-medium text-ink")}>
                            {item.title}
                            {!item.read && <span className="sr-only"> (unread)</span>}
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[13px] text-ink-3">{item.body}</span>
                          <span className="mt-1 block text-[12px] text-ink-3">{timeAgo(item.createdAt)}</span>
                        </span>
                        {!item.read && <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
