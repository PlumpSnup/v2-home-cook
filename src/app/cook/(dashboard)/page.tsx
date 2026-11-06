import type { Metadata } from "next";
import Link from "next/link";
import { ScrollToTop } from "@/components/ScrollToTop";
import { requireCook } from "@/lib/auth";
import { kitchenName } from "@/lib/cook";
import { money } from "@/lib/format";
import { db } from "@/lib/db";
import { getRecentSales } from "@/lib/queries";
import { salesWindowStart, summarize } from "@/lib/sales";

export const metadata: Metadata = { title: "My kitchen" };

export default async function CookHome({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const cook = await requireCook();
  const { welcome } = await searchParams;
  const sql = await db();

  const [[{ activeCount, dishCount }], rows] = await Promise.all([
    sql<{ activeCount: number; dishCount: number }[]>`
      select
        (select count(*)::int from orders where cook_id = ${cook.id} and status in ('pending', 'confirmed')
           and (payment_method <> 'card' or paid)) as "activeCount",
        (select count(*)::int from dishes where cook_id = ${cook.id}) as "dishCount"`,
    getRecentSales(cook.id, salesWindowStart()),
  ]);
  const today = summarize(rows, "today");
  const week = summarize(rows, "week");

  return (
    <div className="space-y-5">
      {/* Just finished setting up: start at the top of the kitchen, with a nudge to add a dish. */}
      {welcome && <ScrollToTop />}
      <div>
        <p className="text-sm text-muted">{welcome ? "Welcome" : "Welcome back"}</p>
        <h1 className="font-display text-2xl font-semibold">{kitchenName(cook)}</h1>
      </div>

      {welcome && (
        <div className="card flex flex-col gap-3 border-brand/30 bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Your kitchen is open 🎉</p>
            <p className="text-sm text-muted">Add your first dish so buyers have something to order.</p>
          </div>
          <Link href="/cook/menu/new" className="btn-primary shrink-0 px-5">
            + Add your first dish
          </Link>
        </div>
      )}

      <Link href="/cook/orders" className="card listing flex items-center justify-between border-brand bg-brand p-5 text-white [--edge:var(--color-brand-darker)] hover:bg-brand-dark">
        <div>
          <p className="text-sm text-white/80">Active orders</p>
          <p className="text-3xl font-semibold">{activeCount ?? 0}</p>
        </div>
        <span className="font-medium">View →</span>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/cook/sales?period=today" className="card listing p-4">
          <p className="text-xs font-medium text-muted">Today</p>
          <p className="mt-1 text-xl font-semibold">{money(today.revenueCents)}</p>
          <p className="text-xs text-muted">{today.meals} meals sold</p>
        </Link>
        <Link href="/cook/sales?period=week" className="card listing p-4">
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

      {dishCount === 0 && !welcome && (
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
