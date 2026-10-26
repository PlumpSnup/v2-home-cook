"use client";

import { useTransition } from "react";
import { updateOrder } from "@/app/actions/cook";
import { money, PAYMENT_LABELS, whatsappLink } from "@/lib/format";
import type { OrderStatus, OrderWithItems } from "@/lib/types";

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-brand-soft text-brand-dark",
  confirmed: "bg-sage-soft text-sage",
  completed: "bg-line text-muted",
  cancelled: "bg-line text-muted line-through",
};
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "New",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function CookOrderCard({ order, kitchen }: { order: OrderWithItems; kitchen: string }) {
  const [pending, start] = useTransition();
  const act = (change: Parameters<typeof updateOrder>[1]) => start(() => updateOrder(order.id, change));
  const ref = order.id.slice(0, 6).toUpperCase();
  const created = new Date(order.created_at).toLocaleString("en-CA", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });

  return (
    <li className={`card space-y-3 p-4 ${pending ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{order.buyer_name}</p>
          <p className="text-sm text-muted">
            #{ref} · {created}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <ul className="divide-y divide-line rounded-xl bg-cream text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between gap-3 px-3 py-2">
            <span>
              <strong>{i.quantity} ×</strong> {i.dish_name}
            </span>
            <span className="shrink-0 text-muted">{money(i.unit_price_cents * i.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="chip font-semibold text-ink">{money(order.total_cents)}</span>
        <span className="chip">{PAYMENT_LABELS[order.payment_method]}</span>
        <span className={`chip ${order.paid ? "border-sage/30 bg-sage-soft text-sage" : ""}`}>{order.paid ? "Paid" : "Not paid yet"}</span>
        <span className="chip capitalize">{order.fulfillment}</span>
      </div>
      {order.note && <p className="rounded-xl bg-cream px-3 py-2 text-sm">“{order.note}”</p>}

      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappLink(order.buyer_phone, `Hi ${order.buyer_name}! It’s ${kitchen} about your order #${ref} (${order.dish_name}).`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp px-4 py-2"
        >
          WhatsApp
        </a>
        {order.status === "pending" && (
          <button className="btn-primary px-4 py-2" disabled={pending} onClick={() => act({ status: "confirmed" })}>
            Confirm
          </button>
        )}
        {order.status === "confirmed" && (
          <button className="btn-primary px-4 py-2" disabled={pending} onClick={() => act({ status: "completed" })}>
            Mark completed
          </button>
        )}
        {!order.paid && order.status !== "cancelled" && (
          <button className="btn-secondary px-4 py-2" disabled={pending} onClick={() => act({ paid: true })}>
            Mark paid
          </button>
        )}
        {(order.status === "pending" || order.status === "confirmed") && (
          <button
            className="btn-ghost text-sm hover:text-brand-dark"
            disabled={pending}
            onClick={() => confirm("Cancel this order?") && act({ status: "cancelled" })}
          >
            Cancel
          </button>
        )}
      </div>
    </li>
  );
}
