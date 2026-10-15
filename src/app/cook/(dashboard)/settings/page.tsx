import type { Metadata } from "next";
import Link from "next/link";
import { CookProfileForm } from "@/components/CookProfileForm";
import { SignOutButton } from "@/components/SignOutButton";
import { requireCook } from "@/lib/auth";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  let cook = await requireCook();
  const { welcome } = await searchParams;
  if (stripeEnabled && cook.stripe_account_id && !cook.stripe_charges_enabled) cook = await syncStripe(cook);

  return (
    <div className="space-y-8">
      {stripeEnabled && cook.accepts_card && (
        <section className="card space-y-3 p-4">
          <h2 className="font-semibold">Card payments</h2>
          {cook.stripe_charges_enabled ? (
            <p className="text-sm text-sage">✓ Connected. Card payments go straight to your bank account.</p>
          ) : (
            <>
              <p className="text-sm text-muted">
                {welcome ? "Last step before adding dishes: " : ""}
                Link your bank with Stripe so buyers can pay by card. It takes about 5 minutes. Until then, buyers will see your
                other payment options.
              </p>
              <a href="/api/stripe/connect" className="btn-primary w-full">
                {cook.stripe_account_id ? "Finish Stripe setup" : "Set up card payments"}
              </a>
            </>
          )}
          {welcome && (
            <Link href="/cook/menu/new?welcome=1" className="block text-center text-sm font-medium text-muted">
              Skip for now — add my first dish
            </Link>
          )}
        </section>
      )}

      <section className="space-y-4">
        <h1 className="font-display text-2xl font-semibold">Kitchen settings</h1>
        <CookProfileForm profile={cook} stripeAvailable={stripeEnabled} />
      </section>

      <SignOutButton />
    </div>
  );
}

/** Checks Stripe directly after onboarding, so cooks don't depend on a webhook arriving. */
async function syncStripe(cook: Profile): Promise<Profile> {
  try {
    const account = await stripe().accounts.retrieve(cook.stripe_account_id!);
    if (!account.charges_enabled) return cook;
    await createServiceClient().from("profiles").update({ stripe_charges_enabled: true }).eq("id", cook.id);
    return { ...cook, stripe_charges_enabled: true };
  } catch {
    return cook;
  }
}
