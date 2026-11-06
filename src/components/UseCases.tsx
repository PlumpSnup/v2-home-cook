"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
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

/** "Use HomeCook to…": pick a use and see a small preview of that part of the app. */
export function UseCases() {
  const [active, setActive] = useState(CASES[0].id);

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
      <div role="tablist" aria-label="What you can use HomeCook for" className="grid gap-2">
        {CASES.map((c, i) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`use-${c.id}`}
              onClick={() => setActive(c.id)}
              className={`reveal flex gap-4 rounded-3xl p-4 text-left transition-all duration-300 ${
                on ? "bg-surface shadow-[0_10px_30px_rgb(43_43_43/0.08)]" : "hover:bg-surface/60"
              }`}
              style={{ "--i": i + 2 } as React.CSSProperties}
            >
              <IconBadge
                icon={c.icon}
                className={`transition-colors duration-300 ${on ? "border-brand bg-brand text-white" : "border-sage/40 bg-surface text-brand-dark"}`}
              />
              <span>
                <span className="block font-semibold">{c.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{c.body}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="reveal relative min-h-80" style={{ "--i": 3 } as React.CSSProperties}>
        {CASES.map((c) => (
          <div
            key={c.id}
            id={`use-${c.id}`}
            role="tabpanel"
            hidden={c.id !== active}
            className="h-full animate-[pop_300ms_ease-out] rounded-3xl border border-line bg-surface p-5 shadow-[0_24px_50px_rgb(43_43_43/0.08)] sm:p-6"
          >
            {c.id === "menu" && <MenuPreview />}
            {c.id === "orders" && <OrdersPreview />}
            {c.id === "share" && <SharePreview />}
            {c.id === "sales" && <SalesPreview />}
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="font-display text-lg font-semibold">{children}</p>
      {aside}
    </div>
  );
}

function MenuPreview() {
  const dishes = [
    ["Chicken biryani", "$14", true],
    ["Vegetable samosas (6)", "$8", true],
    ["Lamb haleem", "$16", false],
    ["Mango kulfi", "$5", true],
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
        {dishes.map(([name, price, on]) => (
          <li key={name} className="flex items-center gap-3 py-3">
            <span className={`flex-1 font-medium ${on ? "" : "text-muted line-through"}`}>{name}</span>
            <span className="text-muted">{on ? price : "Sold out"}</span>
            <span className={`flex h-5 w-9 items-center rounded-full p-0.5 ${on ? "justify-end bg-brand" : "bg-line"}`}>
              <span className="h-4 w-4 rounded-full bg-white shadow" />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function OrdersPreview() {
  const orders = [
    ["Sarah S.", "2× Chicken biryani · Pickup", "New", "bg-brand-soft text-brand-dark"],
    ["Omar K.", "2× Vegetable samosas · Delivery", "Confirmed", "bg-sage-soft text-brand-dark"],
    ["Lina M.", "1× Mango kulfi · Pickup", "Completed", "bg-line text-muted"],
  ];
  return (
    <>
      <PanelTitle
        aside={<span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white">1 new</span>}
      >
        Today’s orders
      </PanelTitle>
      <ul className="space-y-2.5 text-sm">
        {orders.map(([who, what, status, style]) => (
          <li key={who} className="flex items-center gap-3 rounded-2xl border border-line p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft font-semibold text-brand-dark">
              {who[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{who}</span>
              <span className="block truncate text-xs text-muted">{what}</span>
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{status}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function SharePreview() {
  return (
    <>
      <PanelTitle>Share your kitchen</PanelTitle>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="rounded-2xl border border-line p-3">
          <QRCodeSVG
            value="https://v2-home-cook.vercel.app/c/fatema-s-kitchen"
            size={120}
            fgColor="#2b2b2b"
            bgColor="transparent"
          />
        </div>
        <div className="w-full min-w-0 flex-1 space-y-3 text-sm">
          <p className="truncate rounded-xl bg-sage-soft px-3 py-2.5 font-medium text-brand-dark">
            …/c/fatema-s-kitchen
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <span className="rounded-full border border-line py-2 text-center">Copy link</span>
            <span className="rounded-full bg-whatsapp py-2 text-center text-white">WhatsApp</span>
          </div>
          <p className="text-xs text-muted">Print the QR code for your door or market stall.</p>
        </div>
      </div>
    </>
  );
}

function SalesPreview() {
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
      <p className="text-3xl font-semibold">$412</p>
      <p className="text-xs text-muted">31 orders · best day Saturday</p>
      <div className="mt-5 flex h-32 items-end gap-2">
        {days.map(([d, h], i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span
              className={`w-full rounded-t-lg ${h === 100 ? "bg-brand" : "bg-sage-soft"}`}
              style={{ height: `${h}%` }}
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
