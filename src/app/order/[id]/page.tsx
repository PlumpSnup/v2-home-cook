import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { APP_NAME } from "@/lib/brand";
import { kitchenName } from "@/lib/cook";
import { money, PAYMENT_LABELS, whatsappLink } from "@/lib/format";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { db } from "@/lib/db";
import { ClearCart } from "@/components/cart/ClearCart";
import { getOrder, getOrderItems, getProfile } from "@/lib/queries";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ paid?: string; new?: string }> };

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { paid: returnedFromStripe, new: justPlaced } = await searchParams;

  // The order id is an unguessable UUID shared only with the buyer, so it acts as the access key.
  const order = await getOrder(id);
  if (!order) notFound();
  if (order.payment_method === "card" && !order.paid) order.paid = await syncCardPayment(order);
  const [cook, items] = await Promise.all([getProfile(order.cook_id), getOrderItems(order.id)]);
  if (!cook) notFound();

  const name = kitchenName(cook);
  const ref = order.id.slice(0, 6).toUpperCase();
  const awaitingCard = order.payment_method === "card" && !order.paid;
  if (awaitingCard && !returnedFromStripe) notFound();

  const message = [
    `Hi ${name}! I just ordered on ${APP_NAME} 🙌`,
    `Order #${ref}:`,
    ...items.map((i) => `• ${i.quantity} × ${i.dish_name}`),
    `Total: ${money(order.total_cents)} (${PAYMENT_LABELS[order.payment_method]}${order.paid ? ", paid" : ""})`,
    `${order.fulfillment === "delivery" ? "Delivery" : "Pickup"}`,
    order.note ? `Note: ${order.note}` : null,
    `— ${order.buyer_name}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="mx-auto max-w-3xl space-y-5 pt-8">
      {/* The order went through, so empty the cart it came from. */}
      {justPlaced && <ClearCart />}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft text-2xl text-sage">
          ✓
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold">
          {awaitingCard ? "Confirming your payment…" : "Order placed!"}
        </h1>
        <p className="mt-1 text-muted">
          Order #{ref} with {name}
        </p>
      </div>

      <section className="card divide-y divide-line">
        {items.map((i) => (
          <Row key={i.id} label={`${i.quantity} × ${i.dish_name}`} value={money(i.unit_price_cents * i.quantity)} />
        ))}
        {order.delivery_fee_cents > 0 && <Row label="Delivery" value={money(order.delivery_fee_cents)} />}
        <Row label="Total" value={money(order.total_cents)} strong />
        <Row label="Payment" value={`${PAYMENT_LABELS[order.payment_method]}${order.paid ? " · Paid" : ""}`} />
        <Row label="Getting it" value={order.fulfillment === "delivery" ? "Delivery" : "Pickup"} />
      </section>

      {order.payment_method === "etransfer" && !order.paid && (
        <section className="card space-y-1 bg-brand-soft/60 p-4 text-sm">
          <p className="font-semibold">How to pay</p>
          <p>
            Send <strong>{money(order.total_cents)}</strong> by Interac e-Transfer to{" "}
            <strong className="break-all">{cook.etransfer_email ?? "the cook (ask on WhatsApp)"}</strong>
          </p>
          <p className="text-muted">Add “Order #{ref}” in the message.</p>
        </section>
      )}
      {order.payment_method === "cash" && (
        <p className="card bg-brand-soft/60 p-4 text-sm">
          Pay <strong>{money(order.total_cents)}</strong> in cash when you get your food.
        </p>
      )}

      {cook.whatsapp ? (
        <div className="space-y-2">
          <a href={whatsappLink(cook.whatsapp, message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full py-4 text-base">
            Send order on WhatsApp
          </a>
          <p className="text-center text-xs text-muted">
            The cook will confirm your order and {order.fulfillment === "delivery" ? "delivery" : "pickup"} time on WhatsApp.
          </p>
        </div>
      ) : (
        <p className="text-center text-sm text-muted">The cook will contact you at {order.buyer_phone}.</p>
      )}

      <div className="text-center">
        <Link href={`/c/${cook.slug}`} className="text-sm font-medium text-brand">
          Back to {name}’s menu
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 px-4 py-3 text-sm ${strong ? "font-semibold" : ""}`}>
      <span className={strong ? "" : "text-muted"}>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

/** Checks Stripe directly so the buyer sees "paid" even if the webhook hasn't arrived yet. */
async function syncCardPayment(order: Order) {
  if (!stripeEnabled || !order.stripe_session_id) return false;
  const session = await stripe().checkout.sessions.retrieve(order.stripe_session_id);
  if (session.payment_status !== "paid") return false;
  const sql = await db();
  await sql`update orders set paid = true where id = ${order.id}`;
  return true;
}
