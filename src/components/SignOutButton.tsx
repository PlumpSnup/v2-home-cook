"use client";

import posthog from "posthog-js";
import { signOutAction } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction} onSubmit={() => posthog.__loaded && posthog.reset()}>
      <button type="submit" className="btn-ghost w-full py-3 text-sm">
        Sign out
      </button>
    </form>
  );
}
