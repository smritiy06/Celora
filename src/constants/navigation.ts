import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Bot,
  Map,
  StickyNote,
  Users,
  BarChart3,
  UserCircle,
  Settings,
} from "lucide-react";

/** Sidebar navigation items */
export const sidebarNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Quiz Arena", href: "/quiz", icon: Trophy },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot },
  { label: "Roadmaps", href: "/roadmaps", icon: Map },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Community", href: "/community", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

/** Landing page navigation */
export const landingNavItems = [
  { label: "Courses", href: "#courses" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Community", href: "#community" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
] as const;

/** Mobile bottom nav items (subset of sidebar) */
export const bottomNavItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Quiz", href: "/quiz", icon: Trophy },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot },
  { label: "Profile", href: "/profile", icon: UserCircle },
] as const;
