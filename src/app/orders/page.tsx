import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { getCurrentProfile } from "@/lib/auth";
import { money } from "@/lib/format";
import { db } from "@/lib/db";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "My orders" };

const STATUS: Record<Order["status"], string> = {
  pending: "Waiting for cook",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function MyOrdersPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/orders");

  const sql = await db();
  const orders = await sql<(Order & { kitchen_name: string | null })[]>`
    select o.*, p.kitchen_name from orders o
    join profiles p on p.id = o.cook_id
    where o.buyer_id = ${profile.id}
    order by o.created_at desc
    limit 50`;

  return (
    <div className="space-y-4 pt-6">
      <h1 className="font-display text-2xl font-semibold">My orders</h1>
      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-medium">No orders yet</p>
          <Link href="/" className="btn-primary mt-4">
            Find something tasty
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/order/${o.id}${o.payment_method === "card" && !o.paid ? "?paid=1" : ""}`} className="card flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {o.quantity} × {o.dish_name}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {o.kitchen_name} · {new Date(o.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold">{money(o.total_cents)}</p>
                  <p className="text-xs text-muted">{STATUS[o.status]}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!profile.is_cook && <SignOutButton />}
    </div>
  );
}
