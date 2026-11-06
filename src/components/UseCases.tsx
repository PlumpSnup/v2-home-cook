"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { IconBadge, type IconName } from "@/components/Decor";

const CASES: { id: string; icon: IconName; title: string; body: string }[] = [
  {
    id: "menu",
    icon: "sliders",
    title: "Organize your menu",
    body: "Group dishes, set prices and switch a dish off when it sells out.",
  },
  {
    id: "orders",
    icon: "bag",
    title: "Take orders",
    body: "Every order in one list: who, what, pickup or delivery, and a note.",
  },
  {
    id: "share",
    icon: "share",
    title: "Share your kitchen",
    body: "One link and a QR code for WhatsApp, Instagram and your front door.",
  },
  {
    id: "sales",
    icon: "chart",
    title: "Track your sales",
    body: "See what sold, what you earned this week and your best dishes.",
  },
];
const LAST = CASES.length - 1;

/**
 * "Use HomeCook to…". On wider screens the section pins in place while you scroll and the preview
 * cards slide through one by one, with the matching use lit up on the left; stopping between two
 * cards glides to the nearer one. On phones it's a
 * simple tap-to-switch. Each preview plays a little motion when it comes into view.
 */
export function UseCases() {
  const outer = useRef<HTMLDivElement>(null);
  // Position through the cards: 0 = first card, LAST = last card. Fractional while scrolling.
  const [pos, setPos] = useState(0);
  const [pinned, setPinned] = useState(false);
  const active = Math.round(pos);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = outer.current;
      if (!el || !wide.matches) return;
      const travel = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel));
      setPos(p * LAST);
    };
    // When scrolling stops between two cards, glide to the nearer one.
    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    const snap = () => {
      const el = outer.current;
      if (!el || !wide.matches) return;
      const travel = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = -top / travel;
      if (p <= 0 || p >= 1) return;
      const nearest = Math.round(p * LAST);
      if (Math.abs(p * LAST - nearest) < 0.02) return;
      window.scrollTo({ top: top + window.scrollY + (nearest / LAST) * travel, behavior: "smooth" });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 150);
    };
    const onWidth = () => {
      setPinned(wide.matches);
      update();
    };
    onWidth();
    window.addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", onWidth);
    return () => {
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", onWidth);
      cancelAnimationFrame(frame);
      clearTimeout(snapTimer);
    };
  }, []);

  function choose(i: number) {
    const el = outer.current;
    if (!pinned || !el) return setPos(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / LAST) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  }

  return (
    <div ref={outer} className="relative md:h-[300vh]">
      <div className="md:sticky md:top-14 md:flex md:h-[calc(100svh-3.5rem)] md:flex-col md:justify-center">
        <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand-dark">What it’s for</p>
        <h2
          className="reveal mt-2 font-display text-3xl font-semibold sm:text-4xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Use HomeCook to…
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
          <div role="tablist" aria-label="What you can use HomeCook for" className="grid gap-2">
            {CASES.map((c, i) => {
              const on = i === active;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`use-${c.id}`}
                  onClick={() => choose(i)}
                  className={`reveal flex gap-4 rounded-3xl p-4 text-left transition-all duration-300 ${
                    on
                      ? "bg-surface shadow-[0_10px_30px_rgb(43_43_43/0.08)]"
                      : "opacity-70 hover:bg-surface/60 hover:opacity-100"
                  }`}
                  style={{ "--i": i + 2 } as React.CSSProperties}
                >
                  <IconBadge
                    icon={c.icon}
                    className={`transition-colors duration-300 ${
                      on ? "border-brand bg-brand text-white" : "border-brand/30 bg-surface text-brand-dark"
                    }`}
                  />
                  <span>
                    <span className="block font-semibold">{c.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{c.body}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* The preview cards, stacked on a track that slides as you scroll (or tap). */}
          <div
            className="reveal relative h-[27rem] overflow-hidden rounded-3xl sm:h-[24rem]"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {CASES.map((c, i) => {
              const offset = i - pos;
              const away = Math.min(1, Math.abs(offset));
              return (
                <div
                  key={c.id}
                  id={`use-${c.id}`}
                  role="tabpanel"
                  aria-hidden={i !== active}
                  className={`absolute inset-0 rounded-3xl border border-line bg-surface p-5 shadow-[0_24px_50px_rgb(43_43_43/0.08)] sm:p-6 ${
                    pinned ? "" : "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  }`}
                  style={{
                    transform: `translateY(${offset * 104}%) scale(${1 - away * 0.06})`,
                    opacity: 1 - away * 0.7,
                  }}
                >
                  {c.id === "menu" && <MenuPreview on={i === active} />}
                  {c.id === "orders" && <OrdersPreview on={i === active} />}
                  {c.id === "share" && <SharePreview on={i === active} />}
                  {c.id === "sales" && <SalesPreview on={i === active} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** True a moment after `on` turns true, and false again as soon as it turns off, to replay a motion. */
function useAfter(on: boolean, ms: number) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!on) {
      setDone(false);
      return;
    }
    const timer = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(timer);
  }, [on, ms]);
  return done;
}

/** Plays an entrance (fade and rise) each time `on` turns true, staggered by `i`. */
function enter(on: boolean, i = 0) {
  return {
    className: on ? "animate-[reveal-in_500ms_cubic-bezier(0.2,0.7,0.3,1)_backwards]" : "",
    style: { animationDelay: `${i * 120}ms` },
  };
}

function PanelTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="font-display text-lg font-semibold">{children}</p>
      {aside}
    </div>
  );
}

function MenuPreview({ on }: { on: boolean }) {
  // The haleem sells out a moment after the card arrives: its switch flips off.
  const soldOut = useAfter(on, 1100);
  const dishes = [
    ["Chicken biryani", "$14", false],
    ["Vegetable samosas (6)", "$8", false],
    ["Lamb haleem", "$16", true],
    ["Mango kulfi", "$5", false],
  ] as const;
  return (
    <>
      <PanelTitle aside={<span className="text-xs text-muted">4 dishes</span>}>Your menu</PanelTitle>
      <div className="mb-4 flex gap-2 text-xs">
        {["Mains", "Snacks", "Desserts"].map((cat, i) => (
          <span key={cat} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-ink text-white" : "bg-press"}`}>
            {cat}
          </span>
        ))}
      </div>
      <ul className="divide-y divide-line text-sm">
        {dishes.map(([name, price, sellsOut], i) => {
          const off = sellsOut && soldOut;
          const e = enter(on, i);
          return (
            <li key={name} className={`flex items-center gap-3 py-3 ${e.className}`} style={e.style}>
              <span
                className={`flex-1 font-medium transition-colors duration-300 ${off ? "text-muted line-through" : ""}`}
              >
                {name}
              </span>
              <span className="text-muted">{off ? "Sold out" : price}</span>
              <span
                className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors duration-300 ${off ? "bg-line" : "bg-sage"}`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${off ? "" : "translate-x-4"}`}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function OrdersPreview({ on }: { on: boolean }) {
  const orders = [
    ["Sarah S.", "2× Chicken biryani · Pickup", "New", "bg-brand-soft text-brand-dark"],
    ["Omar K.", "2× Vegetable samosas · Delivery", "Confirmed", "bg-sage-soft text-brand-dark"],
    ["Lina M.", "1× Mango kulfi · Pickup", "Completed", "bg-line text-muted"],
  ];
  return (
    <>
      <PanelTitle
        aside={
          <span
            className={`rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white ${on ? "animate-[pop_400ms_ease-out_600ms_backwards]" : ""}`}
          >
            1 new
          </span>
        }
      >
        Today’s orders
      </PanelTitle>
      <ul className="space-y-2.5 text-sm">
        {orders.map(([who, what, status, style], i) => {
          const e = enter(on, i);
          return (
            <li
              key={who}
              className={`flex items-center gap-3 rounded-2xl border border-line p-3 ${e.className}`}
              style={e.style}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft font-semibold text-brand-dark">
                {who[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{who}</span>
                <span className="block truncate text-xs text-muted">{what}</span>
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{status}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function SharePreview({ on }: { on: boolean }) {
  const copied = useAfter(on, 1200);
  return (
    <>
      <PanelTitle>Share your kitchen</PanelTitle>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className={`rounded-2xl border border-line p-3 ${on ? "animate-[pop_400ms_ease-out]" : ""}`}>
          <QRCodeSVG
            value="https://v2-home-cook.vercel.app/c/fatema-s-kitchen"
            size={120}
            fgColor="#2b2b2b"
            bgColor="transparent"
          />
        </div>
        <div className="w-full min-w-0 flex-1 space-y-3 text-sm">
          <p
            className={`truncate rounded-xl bg-sage-soft px-3 py-2.5 font-medium text-brand-dark ${enter(on, 1).className}`}
            style={enter(on, 1).style}
          >
            …/c/fatema-s-kitchen
          </p>
          <div
            className={`grid grid-cols-2 gap-2 text-xs font-semibold ${enter(on, 2).className}`}
            style={enter(on, 2).style}
          >
            <span
              className={`rounded-full border py-2 text-center transition-colors duration-300 ${
                copied ? "border-brand bg-brand text-white" : "border-line"
              }`}
            >
              {copied ? "Link copied ✓" : "Copy link"}
            </span>
            <span className="rounded-full bg-whatsapp py-2 text-center text-white">WhatsApp</span>
          </div>
          <p className="text-xs text-muted">Print the QR code for your door or market stall.</p>
        </div>
      </div>
    </>
  );
}

function SalesPreview({ on }: { on: boolean }) {
  const total = useCountUp(on, 412, 900);
  const days = [
    ["M", 40],
    ["T", 55],
    ["W", 35],
    ["T", 70],
    ["F", 90],
    ["S", 100],
    ["S", 65],
  ] as const;
  return (
    <>
      <PanelTitle aside={<span className="text-xs text-muted">This week</span>}>Your sales</PanelTitle>
      <p className="text-3xl font-semibold tabular-nums">${total}</p>
      <p className="text-xs text-muted">31 orders · best day Saturday</p>
      <div className="mt-5 flex h-32 items-end gap-2">
        {days.map(([d, h], i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span
              className={`w-full origin-bottom rounded-t-lg ${h === 100 ? "bg-sage" : "bg-sage-soft"} ${
                on ? "animate-[grow_600ms_cubic-bezier(0.2,0.7,0.3,1)_backwards]" : ""
              }`}
              style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
            />
            <span className="text-[11px] text-muted">{d}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-press px-3 py-2 text-xs">
        <span className="font-semibold">Top dish:</span> Chicken biryani · 18 sold
      </p>
    </>
  );
}

/** Counts from 0 up to `to` over `ms` each time `on` turns true. */
function useCountUp(on: boolean, to: number, ms: number) {
  const [value, setValue] = useState(to);
  useEffect(() => {
    if (!on) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setValue(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [on, to, ms]);
  return value;
}
