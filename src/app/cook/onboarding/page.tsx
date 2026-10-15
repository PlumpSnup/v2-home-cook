import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CookProfileForm } from "@/components/CookProfileForm";
import { getCurrentProfile } from "@/lib/auth";
import { stripeEnabled } from "@/lib/stripe";

export const metadata: Metadata = { title: "Open your kitchen" };

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/cook/onboarding");
  if (profile.is_cook) redirect("/cook");

  return (
    <div className="space-y-6 pt-6">
      <div>
        <p className="text-sm font-medium text-brand">Step 1 of 2</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Set up your kitchen</h1>
        <p className="mt-1 text-muted">Takes about a minute. You can change this any time.</p>
      </div>
      <CookProfileForm profile={profile} onboarding stripeAvailable={stripeEnabled} />
    </div>
  );
}
