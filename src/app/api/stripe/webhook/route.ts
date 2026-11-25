import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { emailBuyer, emailCookNewOrder } from "@/lib/email";
import type { Order, Profile } from "@/lib/types";

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
      const [order] = await sql<Order[]>`
        update orders set paid = true where stripe_session_id = ${session.id} and not paid returning *`;
      // A card order only reaches the cook once it's paid, so this is when the emails go out.
      if (order) {
        const [cook] = await sql<Profile[]>`select * from profiles where id = ${order.cook_id}`;
        const kitchen = cook?.kitchen_name || cook?.full_name || "The cook";
        await Promise.all([
          cook?.email_alerts ? emailCookNewOrder(cook.email, kitchen, order) : null,
          emailBuyer("placed", kitchen, order),
        ]);
      }
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
