"use client";

import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { slugify } from "@/lib/format";

const EXAMPLE = "Fatema’s Kitchen";

/**
 * Type a kitchen name and watch the menu link, its QR code and a mini storefront update live.
 * Nothing is saved; the button takes people to sign up for real.
 */
export function TryIt({ host, startHref, startLabel }: { host: string; startHref: string; startLabel: string }) {
  const [name, setName] = useState("");
  const kitchen = name.trim() || EXAMPLE;
  const path = `/c/${slugify(kitchen) || "your-kitchen"}`;

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
      <div>
        <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand">Try it</p>
        <h2 className="reveal mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl" style={{ "--i": 1 } as React.CSSProperties}>
          See your menu link before you sign up
        </h2>
        <p className="reveal mt-3 text-muted" style={{ "--i": 2 } as React.CSSProperties}>
          Type your kitchen’s name. This is the link you’d share with neighbours, friends and family.
        </p>
        <div className="reveal mt-6" style={{ "--i": 3 } as React.CSSProperties}>
          <label htmlFor="try-kitchen-name" className="label">
            Kitchen name
          </label>
          <input
            id="try-kitchen-name"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder={EXAMPLE}
            autoComplete="off"
            className="input"
          />
          <p className="mt-3 truncate rounded-xl bg-sage-soft px-4 py-3 text-sm">
            <span className="text-muted">{host}</span>
            <span className="font-semibold text-brand-dark">{path}</span>
          </p>
          <Link href={startHref} className="btn-primary mt-5 pl-6 pr-2">
            {startLabel}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>

      {/* The live preview: a mini storefront with the QR code that would point to it. */}
      <div className="reveal relative mx-auto w-full max-w-sm" style={{ "--i": 2 } as React.CSSProperties} aria-hidden>
        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_24px_50px_rgb(43_43_43/0.1)]">
          <div className="relative h-36">
            <Image src="/dishes/chicken-biryani.webp" alt="" fill sizes="384px" className="object-cover" />
          </div>
          <div className="px-5 pb-5">
            <span className="relative -mt-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-surface bg-brand font-display text-xl font-semibold text-white">
              {kitchen.charAt(0).toUpperCase()}
            </span>
            <p className="mt-2 truncate font-display text-xl font-semibold">{kitchen}</p>
            <p className="text-sm text-muted">Pickup · Delivery</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-3 rounded-2xl border border-line p-2.5">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                  <Image src="/dishes/chicken-biryani.webp" alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="flex-1 font-semibold">Chicken biryani</span>
                <span className="font-semibold text-brand">$14</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line p-2.5 text-muted">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-press text-lg">+</span>
                Your next dish
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-3 rounded-2xl bg-surface p-2.5 shadow-[0_12px_30px_rgb(43_43_43/0.15)] sm:-right-8">
          <QRCodeSVG value={`https://${host}${path}`} size={84} fgColor="#2b2b2b" bgColor="transparent" />
          <p className="mt-1 text-center text-[10px] font-medium text-muted">Scan to order</p>
        </div>
      </div>
    </div>
  );
}
