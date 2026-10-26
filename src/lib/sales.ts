import type { Order, OrderItem } from "./types";

export const TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE ?? "America/Toronto";

/** Calendar day ("YYYY-MM-DD") of a moment in the marketplace's time zone. */
export function dayKey(date: Date | string, tz = TIMEZONE) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(date),
  );
}

function shiftDay(key: string, days: number) {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type Period = "today" | "week" | "month";

export function periodStart(period: Period, now = new Date()) {
  const today = dayKey(now);
  if (period === "today") return today;
  if (period === "month") return `${today.slice(0, 8)}01`;
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay(); // 0 = Sunday
  return shiftDay(today, -((weekday + 6) % 7)); // weeks start on Monday
}

export type Sale = Pick<Order, "quantity" | "total_cents" | "completed_at"> & {
  items: Pick<OrderItem, "dish_name" | "quantity">[];
};

export function summarize(orders: Sale[], period: Period, now = new Date()) {
  const start = periodStart(period, now);
  const inPeriod = orders.filter((o) => o.completed_at && dayKey(o.completed_at) >= start);
  const byDish = new Map<string, number>();
  for (const o of inPeriod) {
    for (const item of o.items) byDish.set(item.dish_name, (byDish.get(item.dish_name) ?? 0) + item.quantity);
  }

  return {
    orders: inPeriod.length,
    meals: inPeriod.reduce((n, o) => n + o.quantity, 0),
    revenueCents: inPeriod.reduce((n, o) => n + o.total_cents, 0),
    topDishes: [...byDish.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
  };
}

/** Revenue per day for the last `days` days, oldest first. */
export function dailyRevenue(orders: Sale[], days: number, now = new Date()) {
  const today = dayKey(now);
  const buckets = Array.from({ length: days }, (_, i) => ({ day: shiftDay(today, i - days + 1), cents: 0, meals: 0 }));
  const index = new Map(buckets.map((b, i) => [b.day, i]));
  for (const o of orders) {
    if (!o.completed_at) continue;
    const i = index.get(dayKey(o.completed_at));
    if (i === undefined) continue;
    buckets[i].cents += o.total_cents;
    buckets[i].meals += o.quantity;
  }
  return buckets;
}

/** Earliest moment we need to load to cover this month and the 30-day chart. */
export function salesWindowStart(now = new Date()) {
  return new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString();
}
