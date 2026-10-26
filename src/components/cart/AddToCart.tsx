"use client";

import { useCart, type CartKitchen } from "./CartProvider";

type Props = {
  kitchen: CartKitchen;
  dish: { id: string; name: string; priceCents: number };
  size?: "sm" | "lg";
};

/** "Add" button that turns into a − 2 + stepper once the dish is in the cart. */
export function AddToCart({ kitchen, dish, size = "sm" }: Props) {
  const { add, setQuantity, quantityOf, ready } = useCart();
  const quantity = ready ? quantityOf(dish.id) : 0;
  const large = size === "lg";

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => add(kitchen, { dishId: dish.id, name: dish.name, priceCents: dish.priceCents })}
        className={`btn-primary ${large ? "w-full py-4 text-base" : "px-4 py-2"}`}
        aria-label={`Add ${dish.name} to cart`}
      >
        {large ? "Add to cart" : "+ Add"}
      </button>
    );
  }

  const step = large ? "h-12 w-12 text-xl" : "h-9 w-9 text-lg";
  return (
    <div className={`flex items-center ${large ? "w-full justify-between" : "gap-2"}`} role="group" aria-label={`${dish.name} in cart`}>
      <button type="button" className={`btn-secondary p-0 ${step}`} onClick={() => setQuantity(dish.id, quantity - 1)} aria-label="Remove one">
        −
      </button>
      <span className={`text-center font-semibold ${large ? "text-lg" : "w-5"}`}>
        {large ? `${quantity} in cart` : quantity}
      </span>
      <button type="button" className={`btn-primary p-0 ${step}`} onClick={() => setQuantity(dish.id, quantity + 1)} aria-label="Add one more">
        +
      </button>
    </div>
  );
}
