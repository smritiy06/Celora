"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useSidebarStore } from "@/store/sidebarStore";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();
  const { fetchProfile, syncProfile, profile } = useUserStore();

  // Fetch/sync user profile from MongoDB on app load
  useEffect(() => {
    async function init() {
      if (!profile) {
        const existing = await fetchProfile();
        if (!existing) {
          await syncProfile();
        }
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
