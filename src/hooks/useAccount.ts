"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

/** Signed-in state. The only place app code touches the auth provider's hooks. */
export function useSession() {
  const { isLoaded, isSignedIn } = useAuth();
  const { openUserProfile, signOut } = useClerk();
  return { isLoaded, isSignedIn: Boolean(isSignedIn), openAccount: () => openUserProfile(), signOut };
}

/** The Celora profile of the signed-in user, or undefined while loading or signed out. */
export function useMe() {
  const { isSignedIn } = useSession();
  return useQuery({ queryKey: ["me"], queryFn: api.me, enabled: isSignedIn });
}
