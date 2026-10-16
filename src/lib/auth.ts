import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "./db";
import type { Profile } from "./types";

/** The signed-in user's profile id, or null. */
export async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const id = await currentUserId();
  if (!id) return null;
  const sql = await db();
  const [profile] = await sql<Profile[]>`select * from profiles where id = ${id}`;
  return profile ?? null;
}

/** For cook pages: signed in and finished onboarding, otherwise redirect. */
export async function requireCook(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/cook");
  if (!profile.is_cook) redirect("/cook/onboarding");
  return profile;
}
