import type { Metadata } from "next";
import Link from "next/link";
import { CookOrderCard } from "@/components/CookOrderCard";
import { requireCook } from "@/lib/auth";
import { kitchenName } from "@/lib/cook";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

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

  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("cook_id", cook.id)
    .in("status", [...filter.statuses])
    // Card orders only count once the buyer has actually paid.
    .or("payment_method.neq.card,paid.eq.true")
    .order("created_at", { ascending: false })
    .limit(100);
  const orders = (data ?? []) as Order[];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Orders</h1>
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/cook/orders?show=${f.value}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              f.value === filter.value ? "bg-ink text-white" : "border border-line bg-surface"
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
