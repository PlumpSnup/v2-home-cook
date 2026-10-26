"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartKitchen = { id: string; slug: string; name: string };
export type CartItem = { dishId: string; name: string; priceCents: number; quantity: number };
export type Cart = { kitchen: CartKitchen; items: CartItem[] };

type CartContextValue = {
  cart: Cart | null;
  ready: boolean;
  count: number;
  subtotalCents: number;
  quantityOf: (dishId: string) => number;
  add: (kitchen: CartKitchen, dish: Omit<CartItem, "quantity">) => void;
  setQuantity: (dishId: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "homecook-cart";
const MAX_PER_DISH = 50;
const CartContext = createContext<CartContextValue | null>(null);

function load(): Cart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const cart = raw ? (JSON.parse(raw) as Cart) : null;
    return cart?.kitchen?.id && Array.isArray(cart.items) && cart.items.length > 0 ? cart : null;
  } catch {
    return null;
  }
}

function save(cart: Cart | null) {
  try {
    if (cart && cart.items.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private browsing or storage full: the cart still works for this visit.
  }
}

/** One cart per buyer, holding dishes from a single kitchen. Saved in the browser. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(load());
    setReady(true);
    // Keep tabs in sync.
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && setCart(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((next: Cart | null) => {
    const cleaned = next && next.items.length > 0 ? next : null;
    setCart(cleaned);
    save(cleaned);
  }, []);

  const add = useCallback<CartContextValue["add"]>(
    (kitchen, dish) => {
      const current = load() ?? cart;
      if (current && current.kitchen.id !== kitchen.id) {
        const ok = window.confirm(
          `Your cart has dishes from ${current.kitchen.name}. Start a new cart with ${kitchen.name} instead?`,
        );
        if (!ok) return;
        update({ kitchen, items: [{ ...dish, quantity: 1 }] });
        return;
      }
      const items = current?.items ?? [];
      const existing = items.find((i) => i.dishId === dish.dishId);
      update({
        kitchen,
        items: existing
          ? items.map((i) => (i.dishId === dish.dishId ? { ...i, quantity: Math.min(MAX_PER_DISH, i.quantity + 1) } : i))
          : [...items, { ...dish, quantity: 1 }],
      });
    },
    [cart, update],
  );

  const setQuantity = useCallback<CartContextValue["setQuantity"]>(
    (dishId, quantity) => {
      if (!cart) return;
      const q = Math.max(0, Math.min(MAX_PER_DISH, quantity));
      update({
        ...cart,
        items: q === 0 ? cart.items.filter((i) => i.dishId !== dishId) : cart.items.map((i) => (i.dishId === dishId ? { ...i, quantity: q } : i)),
      });
    },
    [cart, update],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      ready,
      count: cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0,
      subtotalCents: cart?.items.reduce((n, i) => n + i.quantity * i.priceCents, 0) ?? 0,
      quantityOf: (dishId) => cart?.items.find((i) => i.dishId === dishId)?.quantity ?? 0,
      add,
      setQuantity,
      clear: () => update(null),
    }),
    [cart, ready, add, setQuantity, update],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
