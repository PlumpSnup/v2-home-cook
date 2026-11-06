"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/*
 * A looping walkthrough on a phone: the cook opens her kitchen, adds a dish (drags in a photo,
 * types a name and description, taps Add), sees it on her menu, then an order notification arrives;
 * she taps it, sees the order and confirms it.
 * Everything is driven by one clock, `t` = milliseconds into the loop. Decorative only.
 */

// Holds on the confirmed order for 3 s before starting again.
const LOOP = 11550;
const T = {
  tapKitchen: 750,
  dashboard: 950,
  tapAdd: 1650,
  form: 1850,
  dragStart: 2100,
  dragEnd: 2850,
  nameStart: 3000,
  nameEnd: 3550,
  descStart: 3650,
  descEnd: 4450,
  tapSave: 4750,
  menu: 4950,
  newDish: 5250,
  notification: 5950,
  tapNotification: 6900,
  order: 7100,
  tapConfirm: 8400,
  confirmed: 8550,
};

const NAME = "Chicken biryani";
const DESCRIPTION = "Slow-cooked basmati rice with saffron and fried onions.";


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

/** The loop clock. Runs only while the phone is on screen; frozen on the order for reduced motion. */
function useLoopClock(at?: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (at !== undefined || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(at ?? T.confirmed + 500);
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [at]);

  return { ref, t };
}

/** `at` freezes the walkthrough at that moment (ms), for previews. */
export function PhoneMockup({ className = "", at }: { className?: string; at?: number }) {
  const { ref, t } = useLoopClock(at);
  const screen =
    t < T.dashboard ? "home" : t < T.form ? "dashboard" : t < T.menu ? "form" : t < T.order ? "menu" : "order";
  const confirmed = t >= T.confirmed;
  const drag = ease(progress(t, T.dragStart, T.dragEnd));

  return (
    <div ref={ref} className={`relative mx-auto w-64 ${className}`} aria-hidden>
      <div className="relative h-[34rem] overflow-hidden rounded-[2.75rem] border-[10px] border-ink bg-cream shadow-[0_24px_50px_rgb(43_43_43/0.18)]">
        <div className="absolute left-1/2 top-2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        <p className="absolute left-5 top-2 z-30 text-[10px] font-semibold">9:41</p>

        <Screen show={screen === "home"}>
          <p className="text-xs text-muted">Good morning</p>
          <p className="font-display text-xl font-semibold">Hi Fatema 👋</p>
          <div className="mt-4 rounded-2xl bg-sage-soft p-3 text-xs">
            <p className="font-semibold text-brand-dark">● Your kitchen is open</p>
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
          <p className="text-xs text-muted">Fatema’s Kitchen</p>
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
            className={`mt-3 flex h-28 items-center overflow-hidden justify-center rounded-2xl border-2 border-dashed text-xs transition-colors duration-300 ${
              t >= T.dragEnd ? "border-transparent bg-brand-soft" : t >= T.dragStart ? "border-brand bg-brand-soft/60 text-brand" : "border-line text-muted"
            }`}
          >
            {t >= T.dragEnd ? <DishPhoto className="h-full w-full animate-[pop_300ms_ease-out] rounded-2xl" /> : "Drag a photo here"}
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
            className="absolute flex h-20 w-24 items-center justify-center rounded-xl bg-brand-soft shadow-[0_12px_24px_rgb(43_43_43/0.25)]"
            style={{
              left: 150 - 86 * drag,
              top: 400 - 322 * drag,
              rotate: `${8 - 11 * drag}deg`,
              scale: 1 + 0.08 * Math.sin(drag * Math.PI),
              opacity: progress(t, T.dragStart - 300, T.dragStart) * (1 - progress(t, T.dragEnd - 150, T.dragEnd)),
            }}
          >
            <DishPhoto className="h-full w-full rounded-xl" />
            <span className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full border-2 border-white bg-ink/30" />
          </div>
        </Screen>

        <Screen show={screen === "menu"}>
          <div className="-mx-4 -mt-10 h-20 bg-brand-soft" />
          <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-cream bg-brand-soft text-xl">
            👩🏽‍🍳
          </span>
          <p className="mt-1 font-display text-base font-semibold">Fatema’s Kitchen</p>
          <p className="text-[11px] text-muted">Pickup · Delivery</p>
          <ul className="mt-3 text-xs">
            <li
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${t >= T.newDish ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <DishRow photo name={NAME} price="$14" isNew />
              </div>
            </li>
            {MENU.map((d) => (
              <li key={d.name}>
                <DishRow {...d} />
              </li>
            ))}
          </ul>
        </Screen>

        <Screen show={screen === "order"}>
          <p className="text-[11px] text-muted">← Orders</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-xl font-semibold">Sarah S.</p>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors duration-300 ${
                confirmed ? "bg-sage-soft text-sage" : "bg-brand-soft text-brand-dark"
              }`}
            >
              {confirmed ? "Confirmed" : "New"}
            </span>
          </div>
          <p className="text-[11px] text-muted">Order #A7K2 · just now</p>
          <div className="mt-4 rounded-2xl border border-line bg-surface p-3 text-xs">
            <div className="flex items-center gap-2">
              <DishPhoto className="h-9 w-9 shrink-0 rounded-xl" />
              <span className="flex-1 font-semibold">2× {NAME}</span>
              <span className="font-semibold">$28</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">🚶 Pickup</span>
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">Cash</span>
            </div>
            <p className="mt-3 rounded-xl bg-press p-2 text-[11px] text-ink/80">“Extra raita please!”</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div
              className={`rounded-full bg-whatsapp py-2.5 text-center text-xs font-semibold text-white shadow-[0_3px_0_var(--color-whatsapp-darker)] ${
                confirmed ? "col-span-2" : ""
              }`}
            >
              WhatsApp
            </div>
            {!confirmed && <Button pressed={near(t, T.tapConfirm)}>Confirm</Button>}
          </div>
        </Screen>

        {/* The order notification dropping in over the menu; tapping it opens the order. */}
        <div
          className={`absolute inset-x-2 top-9 z-20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            screen === "menu" && t >= T.notification ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          }`}
        >
          <div
            className={`relative flex gap-2 rounded-2xl bg-surface/90 p-2.5 text-[11px] shadow-[0_8px_20px_rgb(43_43_43/0.15)] backdrop-blur transition-transform duration-150 ${
              near(t, T.tapNotification) ? "scale-[0.97]" : ""
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
              <span className="block font-semibold text-ink">New order 🎉</span>
              <span className="block truncate text-ink/80">Sarah: 2× {NAME} · Pickup</span>
            </span>
            <Tap pressed={near(t, T.tapNotification)} />
          </div>
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
      <Tap pressed={pressed} />
    </div>
  );
}

/** The fingertip circle shown while something is being tapped. */
function Tap({ pressed }: { pressed: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink/30 transition-all duration-200 ${
        pressed ? "scale-100 opacity-100" : "scale-150 opacity-0"
      }`}
    />
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

/** The chicken biryani photo, cropped to fill whatever box it's given. */
function DishPhoto({ className = "" }: { className?: string }) {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image src="/dishes/chicken-biryani.webp" alt="" fill sizes="(min-width: 768px) 260px, 70vw" quality={85} className="object-cover" />
    </span>
  );
}

type DishRowProps = { emoji?: string; photo?: boolean; name: string; price: string; isNew?: boolean };

function DishRow({ emoji, photo, name, price, isNew }: DishRowProps) {
  return (
    <div className={`mb-2 flex items-center gap-2 rounded-2xl border bg-surface p-2 ${isNew ? "border-brand" : "border-line"}`}>
      {photo ? (
        <DishPhoto className="h-9 w-9 shrink-0 rounded-xl" />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-lg">{emoji}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{name}</span>
        <span className="text-brand">{price}</span>
      </span>
      {isNew && <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-semibold text-brand-dark">New</span>}
    </div>
  );
}
