import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Dish, DishWithCook } from "@/lib/types";

export function DishPhoto({ dish, className = "" }: { dish: Pick<Dish, "photo_url" | "name">; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-brand-soft ${className}`}>
      {dish.photo_url ? (
        <Image src={dish.photo_url} alt={dish.name} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover transition duration-300 group-hover:scale-105" />
      ) : (
        <div className="flex h-full items-center justify-center text-4xl" aria-hidden>
          🍲
        </div>
      )}
    </div>
  );
}

export function DishCard({ dish, showCook = true }: { dish: Dish | DishWithCook; showCook?: boolean }) {
  const cook = "cook" in dish ? dish.cook : null;
  return (
    <Link href={`/dish/${dish.id}`} className="card listing group block overflow-hidden">
      <DishPhoto dish={dish} className="aspect-square" />
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{dish.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-brand">{money(dish.price_cents)}</span>
        </div>
        {showCook && cook?.kitchen_name && (
          <p className="mt-1 truncate text-xs text-muted">
            {cook.kitchen_name}
            {cook.area ? ` · ${cook.area}` : ""}
          </p>
        )}
        {!dish.available && <p className="mt-1 text-xs font-medium text-muted">Not available today</p>}
      </div>
    </Link>
  );
}

export function DishGrid({ dishes, showCook }: { dishes: (Dish | DishWithCook)[]; showCook?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {dishes.map((d) => (
        <DishCard key={d.id} dish={d} showCook={showCook} />
      ))}
    </div>
  );
}
