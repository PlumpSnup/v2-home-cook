import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// Stripe calls this for card payments and Connect account updates.
// Subscribe to: checkout.session.completed, account.updated (include Connect events).
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sql = await db();

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      await sql`update orders set paid = true where stripe_session_id = ${session.id}`;
    }
  }

  if (event.type === "account.updated") {
    const account = event.data.object;
    await sql`
      update profiles set stripe_charges_enabled = ${account.charges_enabled}
      where stripe_account_id = ${account.id}`;
  }

  return NextResponse.json({ received: true });
}
