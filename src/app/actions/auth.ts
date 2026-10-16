"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGoogle(next: string) {
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  await signIn("google", { redirectTo: safeNext });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
