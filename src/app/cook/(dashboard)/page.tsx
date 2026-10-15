import type { Metadata } from "next";
import Link from "next/link";
import { requireCook } from "@/lib/auth";
import { kitchenName } from "@/lib/cook";
import { money } from "@/lib/format";
import { salesWindowStart, summarize } from "@/lib/sales";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "My kitchen" };

export default async function CookHome() {
  const cook = await requireCook();
  const supabase = await createClient();

  const [{ count: activeCount }, { count: dishCount }, { data: sales }] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("cook_id", cook.id)
      .in("status", ["pending", "confirmed"])
      .or("payment_method.neq.card,paid.eq.true"),
    supabase.from("dishes").select("id", { count: "exact", head: true }).eq("cook_id", cook.id),
    supabase
      .from("orders")
      .select("quantity, total_cents, completed_at, dish_name")
      .eq("cook_id", cook.id)
      .eq("status", "completed")
      .gte("completed_at", salesWindowStart()),
  ]);
  const rows = (sales ?? []) as Pick<Order, "quantity" | "total_cents" | "completed_at" | "dish_name">[];
  const today = summarize(rows, "today");
  const week = summarize(rows, "week");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="font-display text-2xl font-semibold">{kitchenName(cook)}</h1>
      </div>

      <Link href="/cook/orders" className="card flex items-center justify-between bg-brand p-5 text-white">
        <div>
          <p className="text-sm text-white/80">Active orders</p>
          <p className="text-3xl font-semibold">{activeCount ?? 0}</p>
        </div>
        <span className="font-medium">View →</span>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/cook/sales?period=today" className="card p-4">
          <p className="text-xs font-medium text-muted">Today</p>
          <p className="mt-1 text-xl font-semibold">{money(today.revenueCents)}</p>
          <p className="text-xs text-muted">{today.meals} meals sold</p>
        </Link>
        <Link href="/cook/sales?period=week" className="card p-4">
          <p className="text-xs font-medium text-muted">This week</p>
          <p className="mt-1 text-xl font-semibold">{money(week.revenueCents)}</p>
          <p className="text-xs text-muted">{week.meals} meals sold</p>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/cook/menu/new" className="btn-primary py-4">
          + Add a dish
        </Link>
        <Link href="/cook/share" className="btn-secondary py-4">
          Share my menu
        </Link>
      </div>

      {dishCount === 0 && (
        <p className="card bg-brand-soft p-4 text-sm">
          Your menu is empty. <strong>Add your first dish</strong> so buyers can find you.
        </p>
      )}

      <Link href={`/c/${cook.slug}`} className="block text-center text-sm font-medium text-muted underline underline-offset-4">
        See my storefront as buyers see it
      </Link>
    </div>
  );
}
