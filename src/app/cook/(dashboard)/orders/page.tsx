import type { Metadata } from "next";
import Link from "next/link";
import { CookOrderCard } from "@/components/CookOrderCard";
import { requireCook } from "@/lib/auth";
import { kitchenName } from "@/lib/cook";
import { db } from "@/lib/db";
import type { OrderWithItems } from "@/lib/types";

export const metadata: Metadata = { title: "Orders" };

const FILTERS = [
  { value: "active", label: "Active", statuses: ["pending", "confirmed"] },
  { value: "done", label: "Completed", statuses: ["completed"] },
  { value: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
] as const;

export default async function CookOrdersPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const cook = await requireCook();
  const { show } = await searchParams;
  const filter = FILTERS.find((f) => f.value === show) ?? FILTERS[0];

  const sql = await db();
  const orders = await sql<OrderWithItems[]>`
    select o.*, coalesce((select json_agg(i order by i.dish_name) from order_items i where i.order_id = o.id), '[]') as items
    from orders o
    where cook_id = ${cook.id}
      and status in ${sql([...filter.statuses])}
      -- card orders only count once the buyer has actually paid
      and (payment_method <> 'card' or paid)
    order by created_at desc
    limit 100`;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Orders</h1>
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/cook/orders?show=${f.value}`}
            className={`pressable rounded-full px-4 py-2 text-sm font-medium ${
              f.value === filter.value ? "bg-ink text-white" : "border border-line bg-surface hover:border-muted hover:bg-press"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-medium">No {filter.label.toLowerCase()} orders</p>
          {filter.value === "active" && (
            <p className="mt-1 text-sm text-muted">
              New orders show up here and on WhatsApp.{" "}
              <Link href="/cook/share" className="font-medium text-brand">
                Share your menu
              </Link>{" "}
              to get more.
            </p>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <CookOrderCard key={o.id} order={o} kitchen={kitchenName(cook)} />
          ))}
        </ul>
      )}
    </div>
  );
}
