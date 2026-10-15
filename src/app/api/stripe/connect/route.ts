import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/format";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

// Sends a cook to Stripe's hosted onboarding so card payments go straight to their bank.
export async function GET() {
  if (!stripeEnabled) return NextResponse.redirect(`${siteUrl()}/cook/settings?stripe=unavailable`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${siteUrl()}/login?next=/cook/settings`);

  const admin = createServiceClient();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single<Profile>();
  if (!profile?.is_cook) return NextResponse.redirect(`${siteUrl()}/cook/onboarding`);

  let accountId = profile.stripe_account_id;
  if (!accountId) {
    const account = await stripe().accounts.create({
      type: "express",
      country: "CA",
      email: user.email,
      business_type: "individual",
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      business_profile: {
        product_description: "Home-cooked food",
        url: profile.slug ? `${siteUrl()}/c/${profile.slug}` : undefined,
      },
    });
    accountId = account.id;
    await admin.from("profiles").update({ stripe_account_id: accountId }).eq("id", user.id);
  }

  const link = await stripe().accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    refresh_url: `${siteUrl()}/api/stripe/connect`,
    return_url: `${siteUrl()}/cook/settings?stripe=done`,
  });
  return NextResponse.redirect(link.url);
}
