import { Bot } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/misc";

export const metadata = { title: "AI Tutor" };

export default function AiTutorPage() {
  return (
    <>
      <PageHeader title="AI Tutor" description="Explanations and study help while you learn." />
      <EmptyState
        icon={<Bot aria-hidden className="h-5 w-5" />}
        title="The AI Tutor isn't available yet"
        description="We're still connecting it. Until then, every quiz answer comes with an explanation from its teacher."
        action={<ButtonLink href="/quiz" variant="secondary">Go to Quiz Arena</ButtonLink>}
      />
    </>
  );
}
