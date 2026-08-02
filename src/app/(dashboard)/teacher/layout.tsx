"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useSidebarStore } from "@/store/sidebarStore";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";

/**
 * Teacher Layout — wraps teacher routes.
 * Redirects non-teachers back to /dashboard.
 */
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();
  const { profile, fetchProfile } = useUserStore();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkRole() {
      let p = profile;
      if (!p) {
        p = await fetchProfile();
      }
      if (!p || p.role !== "teacher") {
        router.replace("/dashboard");
        return;
      }
      setChecked(true);
    }
    checkRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <div className={cn("transition-all duration-300 lg:ml-[260px]", isCollapsed && "lg:ml-[72px]")}>
        <TopBar />
        <main className="min-h-[calc(100vh-64px)] p-4 pb-20 md:p-6 lg:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
