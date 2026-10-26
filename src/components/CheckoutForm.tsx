"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { placeOrder } from "@/app/actions/orders";
import { useCart, type CartKitchen } from "@/components/cart/CartProvider";
import { money, PAYMENT_LABELS } from "@/lib/format";
import type { Fulfillment, PaymentMethod } from "@/lib/types";

type MenuInfo = Record<string, { name: string; priceCents: number; available: boolean }>;

type Props = {
  kitchen: CartKitchen;
  menu: MenuInfo;
  payments: PaymentMethod[];
  fulfillments: Fulfillment[];
  deliveryFeeCents: number;
  defaultName?: string;
};

const PAYMENT_HINTS: Record<PaymentMethod, string> = {
  cash: "Pay the cook in person",
  etransfer: "Interac e-Transfer to the cook",
  card: "Credit or debit card, paid now",
};

export function CheckoutForm({ kitchen, menu, payments, fulfillments, deliveryFeeCents, defaultName }: Props) {
  const [state, action, pending] = useActionState(placeOrder, {});
  const { cart, ready, setQuantity } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>(fulfillments[0] ?? "pickup");
  const [payment, setPayment] = useState<PaymentMethod | undefined>(payments[0]);

  if (!ready) return <div className="card h-40 animate-pulse" />;

  if (!cart || cart.kitchen.id !== kitchen.id) {
    return (
      <div className="card p-8 text-center">
        <p className="font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted">Add dishes from {kitchen.name}’s menu to order.</p>
        <Link href={`/c/${kitchen.slug}`} className="btn-primary mt-4">
          See the menu
        </Link>
      </div>
    );
  }

  // Always show today's prices and availability, not what was saved in the cart.
  const lines = cart.items.map((i) => {
    const current = menu[i.dishId];
    return { ...i, name: current?.name ?? i.name, priceCents: current?.priceCents ?? i.priceCents, available: Boolean(current?.available) };
  });
  const unavailable = lines.filter((l) => !l.available);
  const subtotal = lines.reduce((n, l) => n + (l.available ? l.priceCents * l.quantity : 0), 0);
  const deliveryFee = fulfillment === "delivery" ? deliveryFeeCents : 0;
  const total = subtotal + deliveryFee;

  if (payments.length === 0) {
    return <p className="card p-4 text-sm text-muted">This cook hasn’t set up payments yet. Check back soon.</p>;
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="cook_id" value={kitchen.id} />
      <input type="hidden" name="cart" value={JSON.stringify(lines.map((l) => ({ dishId: l.dishId, quantity: l.quantity })))} />

      <section className="card divide-y divide-line">
        {lines.map((l) => (
          <div key={l.dishId} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className={`truncate font-medium ${l.available ? "" : "text-muted line-through"}`}>{l.name}</p>
              <p className="text-sm text-muted">{l.available ? money(l.priceCents * l.quantity) : "No longer available"}</p>
            </div>
            {l.available ? (
              <div className="flex items-center gap-2">
                <button type="button" className="btn-secondary h-9 w-9 p-0 text-lg" onClick={() => setQuantity(l.dishId, l.quantity - 1)} aria-label={`One less ${l.name}`}>
                  −
                </button>
                <span className="w-5 text-center font-semibold">{l.quantity}</span>
                <button type="button" className="btn-secondary h-9 w-9 p-0 text-lg" onClick={() => setQuantity(l.dishId, l.quantity + 1)} aria-label={`One more ${l.name}`}>
                  +
                </button>
              </div>
            ) : (
              <button type="button" className="btn-ghost text-sm" onClick={() => setQuantity(l.dishId, 0)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="space-y-1 px-4 py-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between text-muted">
              <span>Delivery</span>
              <span>{money(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </section>
      <Link href={`/c/${kitchen.slug}`} className="btn-ghost -mt-2 inline-flex text-sm text-brand">
        + Add more from {kitchen.name}
      </Link>

      {fulfillments.length > 1 ? (
        <fieldset>
          <legend className="label">Pickup or delivery</legend>
          <div className="grid grid-cols-2 gap-2">
            {fulfillments.map((f) => (
              <Choice key={f} name="fulfillment" value={f} checked={fulfillment === f} onChange={() => setFulfillment(f)}>
                <span className="font-medium capitalize">{f}</span>
                {f === "delivery" && deliveryFeeCents > 0 && (
                  <span className="text-xs text-muted">+{money(deliveryFeeCents)}</span>
                )}
              </Choice>
            ))}
          </div>
        </fieldset>
      ) : (
        <input type="hidden" name="fulfillment" value={fulfillment} />
      )}

      <fieldset>
        <legend className="label">How will you pay?</legend>
        <div className="space-y-2">
          {payments.map((p) => (
            <Choice key={p} name="payment_method" value={p} checked={payment === p} onChange={() => setPayment(p)}>
              <span className="font-medium">{PAYMENT_LABELS[p]}</span>
              <span className="text-xs text-muted">{PAYMENT_HINTS[p]}</span>
            </Choice>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <div>
          <label htmlFor="buyer_name" className="label">
            Your name
          </label>
          <input id="buyer_name" name="buyer_name" className="input" defaultValue={defaultName} required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="buyer_phone" className="label">
            Phone (WhatsApp)
          </label>
          <input
            id="buyer_phone"
            name="buyer_phone"
            className="input"
            type="tel"
            inputMode="tel"
            placeholder="416 555 1234"
            required
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="note" className="label">
            Note for the cook <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            className="input min-h-20"
            maxLength={300}
            placeholder="Allergies, spice level, pickup time…"
          />
        </div>
      </div>

      {unavailable.length > 0 && (
        <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">Remove dishes that are no longer available to continue.</p>
      )}
      {state.error && <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">{state.error}</p>}

      <button type="submit" className="btn-primary w-full py-4 text-base" disabled={pending || !payment || unavailable.length > 0}>
        {pending ? "Placing order…" : `${payment === "card" ? "Pay" : "Place order"} · ${money(total)}`}
      </button>
    </form>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`raised flex cursor-pointer flex-col rounded-xl border px-4 py-3 ${
        checked ? "border-brand bg-brand-soft/50" : "border-line bg-surface hover:border-brand/30 hover:bg-brand-soft/30"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}
