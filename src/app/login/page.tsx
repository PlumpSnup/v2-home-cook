import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";
import { getCurrentProfile } from "@/lib/auth";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Log in" };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next = "/", error } = await searchParams;
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  if (await getCurrentProfile()) redirect(safeNext);
  const forCooks = safeNext.startsWith("/cook");

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-16 text-center">
      <div>
        <p className="text-4xl" aria-hidden>
          {forCooks ? "👩🏽‍🍳" : "🍲"}
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold">
          {forCooks ? "Open your kitchen" : `Welcome to ${APP_NAME}`}
        </h1>
        <p className="mt-2 text-muted">
          {forCooks
            ? "Sign in with your Gmail to start listing your dishes. It’s free."
            : "Sign in to keep track of your orders."}
        </p>
      </div>
      <GoogleButton next={safeNext} />
      {error && <p className="text-sm text-brand-dark">That didn’t work. Please try again.</p>}
    </div>
  );
}
