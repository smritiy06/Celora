import { BarChart3, BookOpen, StickyNote, Trophy } from "lucide-react";
import { AuthFrame } from "@/components/layout/AuthFrame";

const POINTS = [
  { icon: BookOpen, title: "Structured courses", text: "Lessons in text and video, taught by teachers" },
  { icon: Trophy, title: "Explained quizzes", text: "See why every answer is right or wrong" },
  { icon: StickyNote, title: "Notes beside each lesson", text: "Saved automatically as you write" },
  { icon: BarChart3, title: "Honest progress", text: "Scores by topic, weakest first" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthFrame
      heading="Know what you've learned, and what to learn next."
      points={POINTS}
      switchLink={{ prompt: "Teaching on Celora?", label: "Go to the teacher portal", href: "/teach/login" }}
    >
      {children}
    </AuthFrame>
  );
}
