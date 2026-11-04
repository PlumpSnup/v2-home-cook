import { Doodles } from "@/components/Decor";

const DISHES = [
  { emoji: "🍛", name: "Chicken biryani", price: "$14" },
  { emoji: "🥟", name: "Vegetable samosas (6)", price: "$8" },
  { emoji: "🍮", name: "Mango kulfi", price: "$5" },
];

/** A phone showing a sample storefront, with a WhatsApp order popping out beside it. Decorative. */
export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-64 ${className}`} aria-hidden>
      <div className="overflow-hidden rounded-[2.75rem] border-[10px] border-ink bg-cream shadow-[0_24px_50px_rgb(43_43_43/0.18)]">
        <div className="relative h-24 overflow-hidden bg-brand-soft">
          <Doodles className="text-brand/15" />
          <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        </div>
        <div className="px-4 pb-5">
          <span className="relative -mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-cream bg-brand-soft text-xl">
            👩🏽‍🍳
          </span>
          <p className="mt-1 font-display text-base font-semibold">Amma’s Kitchen</p>
          <p className="text-[11px] text-muted">Pickup · Delivery</p>
          <ul className="mt-3 space-y-2">
            {DISHES.map((d) => (
              <li key={d.name} className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 text-xs">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-lg">
                  {d.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{d.name}</span>
                  <span className="text-brand">{d.price}</span>
                </span>
                <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold text-white">Add</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-full bg-brand py-2 text-center text-xs font-semibold text-white">
            Checkout · $22
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-10 w-48 rounded-2xl rounded-tr-sm bg-[#dcf8c6] p-3 text-xs shadow-[0_12px_28px_rgb(43_43_43/0.16)] sm:-right-24 sm:top-1/2">
        <p className="font-semibold text-whatsapp-darker">New order 🎉</p>
        <p className="mt-1 text-ink/80">Hi Amma! 2× Chicken biryani for pickup at 6pm, please.</p>
        <p className="mt-1 text-right text-[10px] text-muted">5:42 PM ✓✓</p>
      </div>
    </div>
  );
}
