import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Bot,
  Target,
  StickyNote,
  BarChart3,
  UserCircle,
  Settings,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";

/** Sidebar navigation items */
export const sidebarNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Learning Paths", href: "/courses", icon: BookOpen },
  { label: "Goals", href: "/roadmaps", icon: Target },
  { label: "Quiz Arena", href: "/quiz", icon: Trophy },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

/** Landing page navigation */
export const landingNavItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Capabilities", href: "#capabilities" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Mobile bottom nav items (subset of sidebar) */
export const bottomNavItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Paths", href: "/courses", icon: BookOpen },
  { label: "Quiz", href: "/quiz", icon: Trophy },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot },
  { label: "Profile", href: "/profile", icon: UserCircle },
] as const;

/** Teacher sidebar navigation items */
export const teacherNavItems = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
  { label: "Create Course", href: "/teacher/courses/create", icon: Plus },
  { label: "Students", href: "/teacher", icon: Users },
  { label: "Analytics", href: "/teacher", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

/** Teacher mobile bottom nav items */
export const teacherBottomNavItems = [
  { label: "Home", href: "/teacher", icon: GraduationCap },
  { label: "Courses", href: "/teacher/courses", icon: BookOpen },
  { label: "Create", href: "/teacher/courses/create", icon: Plus },
  { label: "Profile", href: "/profile", icon: UserCircle },
] as const;

