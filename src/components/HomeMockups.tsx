/*
 * Decorative product mockups for the home page, drawn with HTML instead of screenshots so they
 * stay sharp and pick up the theme colours. Everything here is aria-hidden.
 */

const MENU = {
  "Small plates": [
    { emoji: "🥟", name: "Vegetable samosas", price: "$8.00", body: "Six crisp pastries with spiced potato and peas, mint chutney." },
  ],
  Mains: [
    { emoji: "🍛", name: "Chicken biryani", price: "$14.00", body: "Slow-cooked basmati rice with saffron, fried onions and raita." },
    { emoji: "🍲", name: "Dal makhani", price: "$11.00", body: "Black lentils simmered overnight with butter and cream." },
  ],
};

/** A browser window showing a kitchen's storefront: profile on the left, menu on the right. */
export function BrowserMockup() {
  return (
    <div className="relative" aria-hidden>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_rgb(43_43_43/0.12)]">
        <div className="flex items-center gap-3 border-b border-line bg-cream px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto w-full max-w-sm truncate rounded-lg bg-press px-3 py-1 text-center text-xs text-muted">
            🔒 v2-home-cook.vercel.app/c/ammas-kitchen
          </div>
        </div>

        <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex h-28 items-center justify-center gap-3 rounded-2xl bg-brand-soft text-4xl sm:h-32">
              <span>🍛</span>
              <span>🥟</span>
              <span>🍮</span>
            </div>
            <span className="-mt-8 ml-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-surface bg-brand-soft text-3xl">
              👩🏽‍🍳
            </span>
            <p className="mt-2 text-xl font-semibold tracking-tight">Amma’s Kitchen</p>
            <p className="text-sm text-muted">By Amma Rao</p>
            <p className="mt-3 text-sm text-muted">
              Home-style South Indian cooking, made fresh every weekend in small batches.
            </p>
            <div className="mt-4 rounded-2xl border border-line p-3 text-sm">
              <p className="text-muted">📍 Brampton, Ontario</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span>🚗 Delivery</span>
                <span>🚶 Pickup</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg text-muted">Menu</p>
              <span className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">🛒 2 items · $22.00</span>
            </div>
            <div className="mt-4 flex gap-2 text-sm">
              <span className="rounded-lg bg-ink px-3 py-1.5 font-medium text-white">Small plates</span>
              <span className="rounded-lg bg-press px-3 py-1.5">Mains</span>
              <span className="rounded-lg bg-press px-3 py-1.5">Desserts</span>
            </div>
            {Object.entries(MENU).map(([section, dishes]) => (
              <div key={section} className="mt-5">
                <p className="text-xl font-medium tracking-tight">{section}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {dishes.map((d) => (
                    <div key={d.name} className="flex gap-3 rounded-xl border border-line p-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-snug">{d.name}</p>
                        <p className="text-sm">{d.price}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">{d.body}</p>
                      </div>
                      <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-3xl">
                        {d.emoji}
                        <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-sm">
                          +
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* A dish card lifted off the page, like it's being looked at. */}
      <div className="absolute -right-4 top-28 hidden w-80 gap-3 rounded-xl border border-line bg-surface p-4 shadow-[0_20px_40px_rgb(43_43_43/0.14)] lg:flex xl:-right-10">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Mango kulfi</p>
          <p className="text-sm">$5.00</p>
          <p className="mt-1 text-xs text-muted">Creamy frozen dessert with Alphonso mango and pistachio.</p>
        </div>
        <span className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-4xl">
          🍮
          <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-sm">
            +
          </span>
        </span>
      </div>
    </div>
  );
}

/** Tile art for the three feature cards. */
export function CheckoutTile() {
  return (
    <div className="relative flex h-full items-end justify-center overflow-hidden bg-brand px-8 pt-10" aria-hidden>
      <div className="w-56 rounded-t-[2rem] border-x-[8px] border-t-[8px] border-ink bg-surface px-4 pb-4 pt-3 text-[11px]">
        <div className="mx-auto h-4 w-16 rounded-full bg-ink" />
        <p className="mt-3 font-semibold">Amma’s Kitchen</p>
        <p className="mt-3 text-sm font-semibold">Checkout</p>
        <div className="mt-2 space-y-1.5 rounded-xl border border-line p-2">
          <p className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-[3px] border-brand" /> Cash on pickup
          </p>
          <p className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-muted" /> E-transfer
          </p>
        </div>
        <div className="mt-2 rounded-xl border border-line p-2">
          <p className="text-muted">How do you want it?</p>
          <div className="mt-1.5 flex gap-1">
            <span className="rounded bg-ink px-1.5 py-0.5 text-white">Pickup</span>
            <span className="rounded border border-line px-1.5 py-0.5">Delivery</span>
          </div>
        </div>
      </div>
      <div className="absolute right-6 top-6 rounded-xl bg-ink px-4 py-3 text-white shadow-lg">
        <p className="text-xs">🛒 3 items</p>
        <p className="text-2xl font-semibold">$27.00</p>
      </div>
    </div>
  );
}

export function HandoffTile() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-sage-soft" aria-hidden>
      <span className="text-[7rem] leading-none">🛍️</span>
      <span className="absolute bottom-6 left-6 rounded-full bg-surface px-3 py-1.5 text-xs font-medium shadow">
        🚗 Out for delivery
      </span>
      <span className="absolute right-6 top-6 rounded-full bg-surface px-3 py-1.5 text-xs font-medium shadow">
        🚶 Ready for pickup
      </span>
    </div>
  );
}

export function StoreTile() {
  return (
    <div className="relative h-full overflow-hidden bg-brand-soft" aria-hidden>
      <div className="absolute right-0 top-12 w-[70%] rounded-l-xl bg-surface p-4 text-[11px] shadow-lg">
        <p className="text-muted">← Back to menu</p>
        <div className="mt-2 flex h-24 items-center justify-center rounded-lg bg-press text-5xl">🍛</div>
        <div className="mt-2 flex justify-between font-medium">
          <span>Chicken biryani</span>
          <span>$14.00</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span>− 1 +</span>
          <span className="rounded bg-ink px-3 py-1 text-white">Add to cart</span>
        </div>
      </div>
      <div className="absolute bottom-10 left-6 w-[45%] rounded-xl border-2 border-dashed border-ink/60 bg-surface p-2 shadow-lg">
        <div className="flex h-20 items-center justify-center rounded-lg bg-press text-4xl">🥟</div>
        <span className="mt-2 inline-block rounded-full bg-ink px-2 py-0.5 text-[10px] text-white">Add photo +</span>
      </div>
    </div>
  );
}

/**
 * A phone with placeholder message rows. "messy" rows come from different apps and sit unevenly;
 * "tidy" rows are all HomeCook orders. The before/after animation will go inside later.
 */
export function PhonePlaceholder({ tone }: { tone: "messy" | "tidy" }) {
  const dots = tone === "messy" ? ["bg-[#d62976]", "bg-whatsapp", "bg-muted", "bg-whatsapp"] : Array(4).fill("bg-brand");
  return (
    <div
      className="mx-auto w-60 overflow-hidden rounded-[2.75rem] border-[10px] border-ink bg-cream shadow-[0_24px_50px_rgb(43_43_43/0.25)]"
      aria-hidden
    >
      <div className="mx-auto mt-2 h-5 w-20 rounded-full bg-ink" />
      <div className="h-96 space-y-2.5 px-3 pt-6">
        {dots.map((dot, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 rounded-2xl bg-surface p-2.5 shadow-sm ${
              tone === "messy" ? ["rotate-[-2deg]", "ml-3 rotate-[1.5deg]", "-ml-1", "ml-2 rotate-[-1deg]"][i] : ""
            }`}
          >
            <span className={`h-8 w-8 shrink-0 rounded-full ${dot}`} />
            <span className="flex-1 space-y-1.5">
              <span className="block h-2 w-1/2 rounded-full bg-ink/25" />
              <span className="block h-2 w-4/5 rounded-full bg-ink/10" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Small app badges used inline in the big statement. */
export function InstagramBadge() {
  return (
    <span
      className="mx-1 inline-flex h-[0.9em] w-[0.9em] translate-y-[0.08em] items-center justify-center rounded-[0.22em] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] align-baseline"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none" stroke="white" strokeWidth="2.4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    </span>
  );
}

export function WhatsAppBadge() {
  return (
    <span
      className="mx-1 inline-flex h-[0.9em] w-[0.9em] translate-y-[0.08em] items-center justify-center rounded-[0.22em] bg-whatsapp align-baseline"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[62%] w-[62%]" fill="none" stroke="white" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
      </svg>
    </span>
  );
}
