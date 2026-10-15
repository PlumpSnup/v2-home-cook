"use server";

import { redirect } from "next/navigation";
import { normalizePhone, siteUrl } from "@/lib/format";
import { platformFeeCents, stripe, stripeEnabled } from "@/lib/stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Dish, Fulfillment, PaymentMethod, Profile } from "@/lib/types";

export type OrderFormState = { error?: string };

export async function placeOrder(_prev: OrderFormState, form: FormData): Promise<OrderFormState> {
  const dishId = String(form.get("dish_id") ?? "");
  const quantity = Number(form.get("quantity") ?? 1);
  const buyerName = String(form.get("buyer_name") ?? "").trim();
  const buyerPhone = normalizePhone(String(form.get("buyer_phone") ?? ""));
  const note = String(form.get("note") ?? "").trim().slice(0, 300) || null;
  const payment = String(form.get("payment_method") ?? "") as PaymentMethod;
  const fulfillment = (String(form.get("fulfillment") ?? "pickup") as Fulfillment) || "pickup";

  if (!buyerName) return { error: "Please add your name." };
  if (buyerPhone.length < 10) return { error: "Please add a phone number the cook can reach you on." };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) return { error: "Pick a quantity between 1 and 50." };

  // Prices and options always come from the database, never from the form.
  const admin = createServiceClient();
  const { data: dish } = await admin.from("dishes").select("*").eq("id", dishId).single<Dish>();
  if (!dish || !dish.available) return { error: "Sorry, this dish isn't available right now." };
  const { data: cook } = await admin.from("profiles").select("*").eq("id", dish.cook_id).single<Profile>();
  if (!cook?.is_cook) return { error: "Sorry, this cook isn't taking orders right now." };

  const cardReady = stripeEnabled && cook.accepts_card && cook.stripe_charges_enabled && cook.stripe_account_id;
  const allowed: Record<PaymentMethod, boolean> = {
    cash: cook.accepts_cash,
    etransfer: cook.accepts_etransfer,
    card: Boolean(cardReady),
  };
  if (!allowed[payment]) return { error: "Please choose a payment method this cook accepts." };
  if (fulfillment === "delivery" ? !cook.offers_delivery : !cook.offers_pickup) {
    return { error: "Please choose pickup or delivery." };
  }

  const deliveryFee = fulfillment === "delivery" ? cook.delivery_fee_cents : 0;
  const total = dish.price_cents * quantity + deliveryFee;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      cook_id: cook.id,
      dish_id: dish.id,
      buyer_id: user?.id ?? null,
      dish_name: dish.name,
      unit_price_cents: dish.price_cents,
      quantity,
      delivery_fee_cents: deliveryFee,
      total_cents: total,
      buyer_name: buyerName.slice(0, 80),
      buyer_phone: buyerPhone,
      note,
      fulfillment,
      payment_method: payment,
    })
    .select("id")
    .single();
  if (error || !order) return { error: "Something went wrong placing your order. Please try again." };

  if (payment === "card") {
    const lineItems = [
      {
        quantity,
        price_data: { currency: "cad", unit_amount: dish.price_cents, product_data: { name: dish.name } },
      },
    ];
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
      metadata: { order_id: order.id },
      success_url: `${siteUrl()}/order/${order.id}?paid=1`,
      cancel_url: `${siteUrl()}/dish/${dish.id}`,
    });
    await admin.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
    redirect(session.url!);
  }

  redirect(`/order/${order.id}`);
}
