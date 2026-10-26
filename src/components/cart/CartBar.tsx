"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { money } from "@/lib/format";
import { useCart } from "./CartProvider";

const HIDDEN_ON = ["/checkout", "/cook", "/order/", "/login"];

/** Sticky bar at the bottom of the screen while the cart has something in it. */
export function CartBar() {
  const { cart, count, subtotalCents } = useCart();
  const path = usePathname();
  if (!cart || count === 0 || HIDDEN_ON.some((p) => path.startsWith(p))) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <Link
        href={`/checkout?k=${cart.kitchen.slug}`}
        className="btn-primary mx-auto w-full max-w-md justify-between rounded-2xl px-5 py-4 text-base shadow-lg"
      >
        <span className="flex items-center gap-2">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-2 text-sm">{count}</span>
          <span className="truncate">{cart.kitchen.name}</span>
        </span>
        <span>Checkout · {money(subtotalCents)}</span>
      </Link>
    </div>
  );
}
