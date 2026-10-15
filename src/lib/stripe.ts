import Stripe from "stripe";

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;

export function stripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export function platformFeeCents(totalCents: number) {
  const percent = Number(process.env.PLATFORM_FEE_PERCENT ?? 0);
  if (!Number.isFinite(percent) || percent <= 0) return 0;
  return Math.round((totalCents * percent) / 100);
}
