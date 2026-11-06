import { BarChart3, FileText, ListChecks, MessagesSquare } from "lucide-react";
import { AuthFrame } from "@/components/layout/AuthFrame";

const POINTS = [
  { icon: FileText, title: "Write courses your way", text: "Markdown lessons, video links, resources and knowledge checks" },
  { icon: ListChecks, title: "Quizzes by topic", text: "Graded on the server, with an explanation for every answer" },
  { icon: BarChart3, title: "See where learners stop", text: "Progress for each learner and a lesson-by-lesson funnel" },
  { icon: MessagesSquare, title: "Hear from learners", text: "Reviews and lesson questions arrive as notifications" },
];

export default function TeacherAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthFrame
      badge="Teacher portal"
      heading="Teach what you know, and see what's landing."
      points={POINTS}
      switchLink={{ prompt: "Here to learn?", label: "Use the learner login", href: "/login" }}
    >
      {children}
    </AuthFrame>
  );
}
