"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

/** Empties the cart once the page loads (used after an order is placed). */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
