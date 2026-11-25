"use client";

import { useOptimistic, useTransition } from "react";
import { setEmailAlerts } from "@/app/actions/cook";

/** "Email me new orders" switch in kitchen settings. */
export function EmailAlertsToggle({ on, email }: { on: boolean; email: string }) {
  const [checked, setChecked] = useOptimistic(on);
  const [, start] = useTransition();

  return (
    <section className="card flex items-start justify-between gap-4 p-5">
      <div>
        <h2 className="font-semibold">✉️ Email me new orders</h2>
        <p className="mt-1 text-sm text-muted">
          Each new order is emailed to <strong className="break-all text-ink">{email}</strong>.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Email me new orders"
        onClick={() =>
          start(async () => {
            setChecked(!checked);
            await setEmailAlerts(!checked);
          })
        }
        className={`mt-1 flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors ${checked ? "bg-brand" : "bg-line"}`}
      >
        <span
          className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`}
        />
      </button>
    </section>
  );
}
