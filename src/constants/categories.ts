import { Brain, Globe, Shield, Cpu, Code, Smartphone, Database, Palette } from "lucide-react";

/** Learning categories displayed on landing page and course filters */
export const categories = [
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    courseCount: 42,
  },
  {
    id: "web-dev",
    label: "Web Development",
    icon: Globe,
    color: "from-cyan-500 to-blue-600",
    courseCount: 68,
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    icon: Shield,
    color: "from-emerald-500 to-green-600",
    courseCount: 24,
  },
  {
    id: "dsa",
    label: "Data Structures & Algorithms",
    icon: Cpu,
    color: "from-amber-500 to-orange-600",
    courseCount: 36,
  },
  {
    id: "programming",
    label: "Programming Languages",
    icon: Code,
    color: "from-rose-500 to-pink-600",
    courseCount: 55,
  },
  {
    id: "mobile-dev",
    label: "Mobile Development",
    icon: Smartphone,
    color: "from-indigo-500 to-blue-600",
    courseCount: 31,
  },
  {
    id: "databases",
    label: "Databases & Backend",
    icon: Database,
    color: "from-teal-500 to-cyan-600",
    courseCount: 28,
  },
  {
    id: "ui-ux",
    label: "UI/UX Design",
    icon: Palette,
    color: "from-fuchsia-500 to-purple-600",
    courseCount: 19,
  },
] as const;
