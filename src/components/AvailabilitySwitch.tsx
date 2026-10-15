"use client";

import { useOptimistic, useTransition } from "react";
import { setDishAvailable } from "@/app/actions/cook";

export function AvailabilitySwitch({ id, available }: { id: string; available: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(available);
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={optimistic ? "Available — tap to turn off" : "Off — tap to make available"}
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          await setDishAvailable(id, !optimistic);
        })
      }
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${optimistic ? "bg-sage" : "bg-line"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${optimistic ? "left-6" : "left-1"}`}
      />
    </button>
  );
}
