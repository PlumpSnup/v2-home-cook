"use server";

import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { acceptedPayments } from "@/lib/cook";
import { db } from "@/lib/db";
import { normalizePhone, siteUrl } from "@/lib/format";
import { getProfile, isUuid } from "@/lib/queries";
import { platformFeeCents, stripe } from "@/lib/stripe";
import type { Dish, Fulfillment, PaymentMethod } from "@/lib/types";

export type OrderFormState = { error?: string };

const MAX_LINES = 30;
const MAX_PER_DISH = 50;

/** Turns the cart sent by the browser into clean { dishId, quantity } lines. */
function parseCart(raw: string) {
  try {
    const lines = JSON.parse(raw) as { dishId?: unknown; quantity?: unknown }[];
    if (!Array.isArray(lines)) return null;
    const merged = new Map<string, number>();
    for (const line of lines.slice(0, MAX_LINES)) {
      const id = String(line.dishId ?? "");
      const qty = Number(line.quantity);
      if (!isUuid(id) || !Number.isInteger(qty) || qty < 1 || qty > MAX_PER_DISH) return null;
      merged.set(id, Math.min(MAX_PER_DISH, (merged.get(id) ?? 0) + qty));
    }
    return [...merged].map(([dishId, quantity]) => ({ dishId, quantity }));
  } catch {
    return null;
  }
}

export async function placeOrder(_prev: OrderFormState, form: FormData): Promise<OrderFormState> {
  const cookId = String(form.get("cook_id") ?? "");
  const lines = parseCart(String(form.get("cart") ?? ""));
  const buyerName = String(form.get("buyer_name") ?? "").trim();
  const buyerPhone = normalizePhone(String(form.get("buyer_phone") ?? ""));
  const note = String(form.get("note") ?? "").trim().slice(0, 300) || null;
  const payment = String(form.get("payment_method") ?? "") as PaymentMethod;
  const fulfillment: Fulfillment = form.get("fulfillment") === "delivery" ? "delivery" : "pickup";

  if (!lines || lines.length === 0) return { error: "Your cart is empty." };
  if (!buyerName) return { error: "Please add your name." };
  if (buyerPhone.length < 10) return { error: "Please add a phone number the cook can reach you on." };
  if (!isUuid(cookId)) return { error: "Something went wrong. Please go back to the kitchen and try again." };

  // Prices, availability and options always come from the database, never from the browser.
  const cook = await getProfile(cookId);
  if (!cook?.is_cook) return { error: "Sorry, this kitchen isn't taking orders right now." };

  const sql = await db();
  const dishes = await sql<Dish[]>`
    select * from dishes where cook_id = ${cook.id} and id in ${sql(lines.map((l) => l.dishId))}`;
  const byId = new Map(dishes.map((d) => [d.id, d]));
  const unavailable = lines.filter((l) => !byId.get(l.dishId)?.available).map((l) => byId.get(l.dishId)?.name ?? "A dish");
  if (unavailable.length > 0) {
    return { error: `Sorry, ${unavailable.join(", ")} ${unavailable.length === 1 ? "isn't" : "aren't"} available right now. Please remove it from your cart.` };
  }

  if (!acceptedPayments(cook).includes(payment)) return { error: "Please choose a payment method this cook accepts." };
  if (fulfillment === "delivery" ? !cook.offers_delivery : !cook.offers_pickup) {
    return { error: "Please choose pickup or delivery." };
  }

  const items = lines.map((l) => {
    const dish = byId.get(l.dishId)!;
    return { dish_id: dish.id, dish_name: dish.name, unit_price_cents: dish.price_cents, quantity: l.quantity };
  });
  const meals = items.reduce((n, i) => n + i.quantity, 0);
  const deliveryFee = fulfillment === "delivery" ? cook.delivery_fee_cents : 0;
  const total = items.reduce((n, i) => n + i.unit_price_cents * i.quantity, 0) + deliveryFee;
  const summary = items.map((i) => `${i.quantity} × ${i.dish_name}`).join(", ").slice(0, 200);
  const buyerId = await currentUserId();

  let orderId: string;
  try {
    orderId = await sql.begin(async (tx) => {
      const [order] = await tx<{ id: string }[]>`
        insert into orders ${tx({
          cook_id: cook.id,
          buyer_id: buyerId,
          dish_name: summary,
          quantity: meals,
          delivery_fee_cents: deliveryFee,
          total_cents: total,
          buyer_name: buyerName.slice(0, 80),
          buyer_phone: buyerPhone,
          note,
          fulfillment,
          payment_method: payment,
        })}
        returning id`;
      await tx`insert into order_items ${tx(items.map((i) => ({ ...i, order_id: order.id })))}`;
      return order.id;
    });
  } catch {
    return { error: "Something went wrong placing your order. Please try again." };
  }

  if (payment === "card") {
    const lineItems = items.map((i) => ({
      quantity: i.quantity,
      price_data: { currency: "cad", unit_amount: i.unit_price_cents, product_data: { name: i.dish_name } },
    }));
    if (deliveryFee > 0) {
      lineItems.push({
        quantity: 1,
        price_data: { currency: "cad", unit_amount: deliveryFee, product_data: { name: "Delivery" } },
      });
    }
    const fee = platformFeeCents(total);
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      payment_intent_data: {
        transfer_data: { destination: cook.stripe_account_id! },
        ...(fee > 0 ? { application_fee_amount: fee } : {}),
      },
      metadata: { order_id: orderId },
      success_url: `${siteUrl()}/order/${orderId}?paid=1&new=1`,
      cancel_url: `${siteUrl()}/checkout?k=${cook.slug}`,
    });
    await sql`update orders set stripe_session_id = ${session.id} where id = ${orderId}`;
    redirect(session.url!);
  }

  redirect(`/order/${orderId}?new=1`);
}
