import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import { AddToCart } from "@/components/cart/AddToCart";
import type { CartKitchen } from "@/components/cart/CartProvider";
import type { Dish } from "@/lib/types";

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

/** A dish row on a kitchen's menu: photo, name, price and an Add button. */
export function MenuItem({ dish, kitchen }: { dish: Dish; kitchen: CartKitchen }) {
  return (
    <article
      className={`card listing group flex gap-3 p-3 ${
        dish.available ? "" : "opacity-60"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <Link href={`/dish/${dish.id}`} className="block rounded-lg">
          <h3 className="font-semibold leading-snug">{dish.name}</h3>
          {dish.description && <p className="mt-0.5 line-clamp-2 text-sm text-muted">{dish.description}</p>}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-semibold text-brand">{money(dish.price_cents)}</span>
          {dish.available ? (
            <div data-nested>
              <AddToCart kitchen={kitchen} dish={{ id: dish.id, name: dish.name, priceCents: dish.price_cents }} />
            </div>
          ) : (
            <span className="text-xs font-medium text-muted">Not available today</span>
          )}
        </div>
      </div>
      <Link href={`/dish/${dish.id}`} className="shrink-0" tabIndex={-1} aria-hidden>
        <DishPhoto dish={dish} className="h-24 w-24 rounded-xl sm:h-28 sm:w-28" />
      </Link>
    </article>
  );
}
