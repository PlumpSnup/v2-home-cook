import type { Metadata } from "next";
import Link from "next/link";
import { requireCook } from "@/lib/auth";
import { money } from "@/lib/format";
import { getRecentSales } from "@/lib/queries";
import { dailyRevenue, salesWindowStart, summarize, TIMEZONE, type Period } from "@/lib/sales";

export const metadata: Metadata = { title: "Sales" };

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const cook = await requireCook();
  const { period: raw } = await searchParams;
  const period: Period = PERIODS.some((p) => p.value === raw) ? (raw as Period) : "week";

  const orders = await getRecentSales(cook.id, salesWindowStart());

  const stats = summarize(orders, period);
  const days = dailyRevenue(orders, 14);
  const peak = Math.max(1, ...days.map((d) => d.cents));
  const dayLabel = (key: string) =>
    new Intl.DateTimeFormat("en-CA", { weekday: "narrow", timeZone: "UTC" }).format(new Date(`${key}T12:00:00Z`));

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold">Sales</h1>

      <div className="flex gap-1 rounded-full border border-line bg-surface p-1">
        {PERIODS.map((p) => (
          <Link
            key={p.value}
            href={`/cook/sales?period=${p.value}`}
            aria-current={p.value === period ? "page" : undefined}
            className={`pressable flex-1 rounded-full py-2 text-center text-sm font-medium ${
              p.value === period ? "bg-ink text-white" : "text-muted hover:bg-press hover:text-ink"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Money made" value={money(stats.revenueCents)} wide />
        <Stat label="Meals sold" value={String(stats.meals)} />
        <Stat label="Orders" value={String(stats.orders)} />
      </div>

      <section className="card p-4">
        <h2 className="text-sm font-semibold">Last 14 days</h2>
        <div className="mt-4 flex h-32 items-end gap-1.5" role="img" aria-label="Daily revenue for the last 14 days">
          {days.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full max-w-6 rounded-t bg-brand"
                style={{ height: `${(d.cents / peak) * 100}%`, minHeight: d.cents ? 4 : 2, opacity: d.cents ? 1 : 0.15 }}
                title={`${d.day}: ${money(d.cents)} · ${d.meals} meals`}
              />
              <span className="text-[10px] text-muted">{dayLabel(d.day)}</span>
            </div>
          ))}
        </div>
      </section>

      {stats.topDishes.length > 0 && (
        <section className="card p-4">
          <h2 className="text-sm font-semibold">Best sellers</h2>
          <ul className="mt-2 divide-y divide-line">
            {stats.topDishes.map(([name, qty]) => (
              <li key={name} className="flex justify-between py-2 text-sm">
                <span className="truncate">{name}</span>
                <span className="font-semibold">{qty} sold</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-center text-xs text-muted">
        Counts orders you’ve marked as completed. Times in {TIMEZONE.replace("_", " ")}.
      </p>
    </div>
  );
}

function Stat({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`card p-4 ${wide ? "col-span-2" : ""}`}>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={`mt-1 font-semibold ${wide ? "text-3xl text-brand" : "text-2xl"}`}>{value}</p>
    </div>
  );
}
