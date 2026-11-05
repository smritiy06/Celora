"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ErrorState, LoadingBlock } from "@/components/ui/misc";
import { useMe } from "@/hooks/useAccount";

/** The API enforces teacher access; this just sends others somewhere useful. */
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: me, error, isPending, refetch } = useMe();

  useEffect(() => {
    if (me && me.role !== "teacher") router.replace("/dashboard");
  }, [me, router]);

  if (isPending) return <LoadingBlock label="Checking access" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (me.role !== "teacher") return null;
  return <>{children}</>;
}
