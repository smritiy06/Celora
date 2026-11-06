import { Suspense } from "react";
import { LoadingBlock } from "@/components/ui/misc";
import { TutorChatPage } from "@/features/tutor/TutorChat";

export const metadata = { title: "AI Tutor" };

export default function AiTutorPage() {
  return (
    <Suspense fallback={<LoadingBlock label="Loading AI Tutor" />}>
      <TutorChatPage />
    </Suspense>
  );
}
