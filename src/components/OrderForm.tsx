"use client";

import { useActionState, useState } from "react";
import { placeOrder } from "@/app/actions/orders";
import { money, PAYMENT_LABELS } from "@/lib/format";
import type { Fulfillment, PaymentMethod } from "@/lib/types";

type Props = {
  dishId: string;
  priceCents: number;
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

export function OrderForm({ dishId, priceCents, payments, fulfillments, deliveryFeeCents, defaultName }: Props) {
  const [state, action, pending] = useActionState(placeOrder, {});
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState<Fulfillment>(fulfillments[0] ?? "pickup");
  const [payment, setPayment] = useState<PaymentMethod | undefined>(payments[0]);

  const total = priceCents * quantity + (fulfillment === "delivery" ? deliveryFeeCents : 0);

  if (payments.length === 0) {
    return <p className="card p-4 text-sm text-muted">This cook hasn’t set up payments yet. Check back soon.</p>;
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="dish_id" value={dishId} />
      <input type="hidden" name="quantity" value={quantity} />

      <div className="flex items-center justify-between">
        <span className="font-medium">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-secondary h-10 w-10 p-0 text-lg"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-6 text-center text-lg font-semibold">{quantity}</span>
          <button
            type="button"
            className="btn-secondary h-10 w-10 p-0 text-lg"
            onClick={() => setQuantity((q) => Math.min(50, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

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

      {state.error && <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">{state.error}</p>}

      <button type="submit" className="btn-primary w-full py-4 text-base" disabled={pending || !payment}>
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
      className={`flex cursor-pointer flex-col rounded-xl border px-4 py-3 transition ${
        checked ? "border-brand bg-brand-soft/50" : "border-line bg-surface"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}
