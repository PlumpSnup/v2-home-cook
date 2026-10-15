import { acceptedPayments, fulfillmentOptions } from "@/lib/cook";
import { money, PAYMENT_LABELS } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function CookBadges({ cook }: { cook: Profile }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {fulfillmentOptions(cook).map((f) => (
        <span key={f} className="chip border-sage/30 bg-sage-soft text-sage capitalize">
          {f}
          {f === "delivery" && cook.delivery_fee_cents > 0 ? ` ${money(cook.delivery_fee_cents)}` : ""}
        </span>
      ))}
      {acceptedPayments(cook).map((p) => (
        <span key={p} className="chip">
          {PAYMENT_LABELS[p]}
        </span>
      ))}
    </div>
  );
}
