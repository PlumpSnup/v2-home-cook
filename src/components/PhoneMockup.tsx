"use client";

import { useEffect, useRef, useState } from "react";

/*
 * A looping walkthrough on a phone: the cook opens her kitchen, adds a dish (drags in a photo,
 * types a name and description, taps Add), sees it on her menu, then order notifications arrive.
 * Everything is driven by one clock, `t` = milliseconds into the loop. Decorative only.
 */

const LOOP = 13000;
const T = {
  tapKitchen: 1100,
  dashboard: 1400,
  tapAdd: 2500,
  form: 2800,
  dragStart: 3200,
  dragEnd: 4300,
  nameStart: 4500,
  nameEnd: 5300,
  descStart: 5450,
  descEnd: 6700,
  tapSave: 7100,
  menu: 7400,
  newDish: 7800,
  notifications: [8900, 9900],
};

const NAME = "Chicken biryani";
const DESCRIPTION = "Slow-cooked basmati rice with saffron and fried onions.";

const NOTIFICATIONS = [
  { title: "New order 🎉", body: "Priya: 2× Chicken biryani · Pickup" },
  { title: "New order 🎉", body: "Sam: 1× Chicken biryani, 1× Mango kulfi · Delivery" },
];

const MENU = [
  { emoji: "🥟", name: "Vegetable samosas (6)", price: "$8" },
  { emoji: "🍮", name: "Mango kulfi", price: "$5" },
];

function progress(t: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (t - start) / (end - start)));
}

/** Ease in and out, so movements start and stop gently. */
function ease(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
}

function typed(text: string, t: number, start: number, end: number) {
  return text.slice(0, Math.round(progress(t, start, end) * text.length));
}

/** The loop clock. Runs only while the phone is on screen; frozen on the menu for reduced motion. */
function useLoopClock() {
  const ref = useRef<HTMLDivElement>(null);
  // Start a little before zero so the first screen is still there once the phone has faded in.
  const [t, setT] = useState(-2000);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(T.notifications[0] + 1000);
      return;
    }
    // Advance on every animation frame (smooth typing and dragging), only while on screen.
    let frame = 0;
    let last = 0;
    const step = (now: number) => {
      if (last) setT((v) => (v + Math.min(now - last, 100)) % LOOP);
      last = now;
      frame = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame);
        last = 0;
        if (entry.isIntersecting) frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, t };
}

export function PhoneMockup({ className = "" }: { className?: string }) {
  const { ref, t } = useLoopClock();
  const screen = t < T.dashboard ? "home" : t < T.form ? "dashboard" : t < T.menu ? "form" : "menu";
  const drag = ease(progress(t, T.dragStart, T.dragEnd));

  return (
    <div ref={ref} className={`relative mx-auto w-64 ${className}`} aria-hidden>
      <div className="relative h-[34rem] overflow-hidden rounded-[2.75rem] border-[10px] border-ink bg-cream shadow-[0_24px_50px_rgb(43_43_43/0.18)]">
        <div className="absolute left-1/2 top-2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        <p className="absolute left-5 top-2 z-30 text-[10px] font-semibold">9:41</p>

        <Screen show={screen === "home"}>
          <p className="text-xs text-muted">Good morning</p>
          <p className="font-display text-xl font-semibold">Hi Amma 👋</p>
          <div className="mt-4 rounded-2xl bg-sage-soft p-3 text-xs">
            <p className="font-semibold text-sage">● Your kitchen is open</p>
            <p className="mt-1 text-muted">Buyers can order from your menu.</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-2xl border border-line bg-surface p-3">
              <p className="text-muted">Today</p>
              <p className="text-lg font-semibold">$54</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-3">
              <p className="text-muted">Orders</p>
              <p className="text-lg font-semibold">3</p>
            </div>
          </div>
          <Button pressed={near(t, T.tapKitchen)} className="mt-5">
            My kitchen
          </Button>
        </Screen>

        <Screen show={screen === "dashboard"}>
          <p className="font-display text-xl font-semibold">My kitchen</p>
          <p className="text-xs text-muted">Amma’s Kitchen</p>
          <div className="mt-4 space-y-2 text-xs">
            {[
              ["📋", "Orders", "3 new"],
              ["🍽️", "Menu", "2 dishes"],
              ["📈", "Sales", "$54 today"],
            ].map(([icon, label, value]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                <span className="text-lg">{icon}</span>
                <span className="flex-1 font-semibold">{label}</span>
                <span className="text-muted">{value}</span>
              </div>
            ))}
          </div>
          <Button pressed={near(t, T.tapAdd)} className="mt-5">
            + Add a dish
          </Button>
        </Screen>

        <Screen show={screen === "form"}>
          <p className="font-display text-xl font-semibold">New dish</p>
          <div
            className={`mt-3 flex h-28 items-center justify-center rounded-2xl border-2 border-dashed text-xs transition-colors duration-300 ${
              t >= T.dragEnd ? "border-transparent bg-brand-soft" : t >= T.dragStart ? "border-brand bg-brand-soft/60 text-brand" : "border-line text-muted"
            }`}
          >
            {t >= T.dragEnd ? <span className="animate-[pop_300ms_ease-out] text-5xl">🍛</span> : "Drag a photo here"}
          </div>
          <Field label="Name" value={typed(NAME, t, T.nameStart, T.nameEnd)} typing={t > T.nameStart && t < T.nameEnd} />
          <Field
            label="Description"
            value={typed(DESCRIPTION, t, T.descStart, T.descEnd)}
            typing={t > T.descStart && t < T.descEnd}
            tall
          />
          <Field label="Price" value={t >= T.nameEnd ? "$14.00" : ""} />
          <Button pressed={near(t, T.tapSave)} className="mt-4">
            Add to menu
          </Button>

          {/* The photo being dragged in from the bottom corner. */}
          <div
            className="absolute flex h-20 w-24 items-center justify-center rounded-xl bg-brand-soft text-4xl shadow-[0_12px_24px_rgb(43_43_43/0.25)]"
            style={{
              left: 150 - 86 * drag,
              top: 400 - 322 * drag,
              rotate: `${8 - 11 * drag}deg`,
              scale: 1 + 0.08 * Math.sin(drag * Math.PI),
              opacity: progress(t, T.dragStart - 300, T.dragStart) * (1 - progress(t, T.dragEnd - 150, T.dragEnd)),
            }}
          >
            🍛
            <span className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full border-2 border-white bg-ink/30" />
          </div>
        </Screen>

        <Screen show={screen === "menu"}>
          <div className="-mx-4 -mt-10 h-20 bg-brand-soft" />
          <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-cream bg-brand-soft text-xl">
            👩🏽‍🍳
          </span>
          <p className="mt-1 font-display text-base font-semibold">Amma’s Kitchen</p>
          <p className="text-[11px] text-muted">Pickup · Delivery</p>
          <ul className="mt-3 text-xs">
            <li
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${t >= T.newDish ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <DishRow emoji="🍛" name={NAME} price="$14" isNew />
              </div>
            </li>
            {MENU.map((d) => (
              <li key={d.name}>
                <DishRow {...d} />
              </li>
            ))}
          </ul>
        </Screen>

        {/* Notifications dropping in over the menu. */}
        <div className="absolute inset-x-2 top-9 z-20 space-y-1.5">
          {NOTIFICATIONS.map((n, i) => {
            const shown = screen === "menu" && t >= T.notifications[i];
            return (
              <div
                key={i}
                className={`flex gap-2 rounded-2xl bg-surface/90 p-2.5 text-[11px] shadow-[0_8px_20px_rgb(43_43_43/0.15)] backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  shown ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand font-display text-xs font-bold text-white">
                  H
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between text-[10px] text-muted">
                    <span>HomeCook</span>
                    <span>now</span>
                  </span>
                  <span className="block font-semibold text-ink">{n.title}</span>
                  <span className="block truncate text-ink/80">{n.body}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function near(t: number, at: number) {
  return t >= at - 200 && t < at + 300;
}

function Screen({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      // The old screen fades out quickly, then the new one slides in, so they don't jumble together.
      className={`absolute inset-0 px-4 pt-10 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
        show ? "translate-x-0 opacity-100 delay-150 duration-500" : "pointer-events-none -translate-x-3 opacity-0 duration-150"
      }`}
    >
      {children}
    </div>
  );
}

/** A primary button that shows a finger tap when `pressed`. */
function Button({ pressed, className = "", children }: { pressed: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`relative rounded-full bg-brand py-2.5 text-center text-xs font-semibold text-white transition-all duration-150 ${
        pressed ? "translate-y-0.5 bg-brand-dark shadow-none" : "shadow-[0_3px_0_var(--color-brand-darker)]"
      } ${className}`}
    >
      {children}
      <span
        className={`absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink/30 transition-all duration-200 ${
          pressed ? "scale-100 opacity-100" : "scale-150 opacity-0"
        }`}
      />
    </div>
  );
}

function Field({ label, value, typing, tall }: { label: string; value: string; typing?: boolean; tall?: boolean }) {
  return (
    <div className="mt-2.5">
      <p className="text-[10px] font-medium text-muted">{label}</p>
      <div
        className={`mt-0.5 rounded-xl border bg-surface px-2.5 py-1.5 text-[11px] leading-snug ${tall ? "h-12" : "h-7"} ${
          typing ? "border-brand" : "border-line"
        }`}
      >
        {value}
        {typing && <span className="ml-px inline-block h-3 w-px translate-y-0.5 bg-ink" />}
      </div>
    </div>
  );
}

function DishRow({ emoji, name, price, isNew }: { emoji: string; name: string; price: string; isNew?: boolean }) {
  return (
    <div className={`mb-2 flex items-center gap-2 rounded-2xl border bg-surface p-2 ${isNew ? "border-brand" : "border-line"}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-lg">{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{name}</span>
        <span className="text-brand">{price}</span>
      </span>
      {isNew && <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-semibold text-sage">New</span>}
    </div>
  );
}
