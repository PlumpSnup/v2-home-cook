import type { Metadata } from "next";
import Link from "next/link";
import { DishPhoto } from "@/components/DishCard";
import { AvailabilitySwitch } from "@/components/AvailabilitySwitch";
import { requireCook } from "@/lib/auth";
import { categoryLabel, money } from "@/lib/format";
import { getCookDishes } from "@/lib/queries";

export const metadata: Metadata = { title: "My menu" };

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  const cook = await requireCook();
  const { added } = await searchParams;
  const dishes = await getCookDishes(cook.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">My menu</h1>
        <Link href="/cook/menu/new" className="btn-primary px-4 py-2">
          + Add dish
        </Link>
      </div>

      {added && (
        <div className="card flex items-center justify-between gap-3 bg-sage-soft p-4 text-sm">
          <span>Dish added! Share your menu so people can order.</span>
          <Link href="/cook/share" className="shrink-0 font-semibold text-sage">
            Share →
          </Link>
        </div>
      )}

      {dishes.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-medium">Your menu is empty</p>
          <p className="mt-1 text-sm text-muted">Add your first dish. A photo, a name and a price is all you need.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {dishes.map((d) => (
            <li key={d.id} className="card listing flex items-center gap-3 p-2 pr-4">
              <Link href={`/cook/menu/${d.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl">
                <DishPhoto dish={d} className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <p className={`truncate font-semibold ${d.available ? "" : "text-muted"}`}>{d.name}</p>
                  <p className="text-sm text-muted">
                    {money(d.price_cents)} · {categoryLabel(d.category)}
                  </p>
                </div>
              </Link>
              <AvailabilitySwitch id={d.id} available={d.available} />
            </li>
          ))}
        </ul>
      )}
      {dishes.length > 0 && <p className="text-center text-xs text-muted">Switch a dish off when you’re not cooking it.</p>}
    </div>
  );
}
