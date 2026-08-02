"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { bottomNavItems, teacherBottomNavItems } from "@/constants/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";

/** Mobile bottom navigation bar */
export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useUserStore();

  const isTeacher = profile?.role === "teacher";
  const isOnTeacherRoute = pathname.startsWith("/teacher");
  const navItems = isTeacher && isOnTeacherRoute ? teacherBottomNavItems : bottomNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-bg-secondary/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors",
                isActive ? "text-primary-light" : "text-text-muted"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute -top-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
