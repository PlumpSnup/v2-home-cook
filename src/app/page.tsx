import Link from "next/link";
import { Doodles, WaveEdge } from "@/components/Decor";
import { HeroDoodles } from "@/components/HeroDoodles";
import {
  BrowserMockup,
  CheckoutTile,
  HandoffTile,
  InstagramBadge,
  PhonePlaceholder,
  StoreTile,
  WhatsAppBadge,
} from "@/components/HomeMockups";
import { Reveal } from "@/components/Reveal";
import { ScrollFade } from "@/components/ScrollFade";
import { APP_NAME } from "@/lib/brand";
import { getCurrentProfile } from "@/lib/auth";

const features = [
  { tile: CheckoutTile, title: "Orders arrive complete: what, how many and how they’ll pay", tag: "Ordering" },
  { tile: HandoffTile, title: "Pickup, delivery or both — you decide", tag: "Your rules" },
  { tile: StoreTile, title: "Your menu online before the kettle boils", tag: "Your storefront" },
];

const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function Home() {
  const profile = await getCurrentProfile();
  const start = profile?.is_cook
    ? { href: "/cook", label: "Go to my kitchen" }
    : { href: profile ? "/cook/onboarding" : "/login?next=/cook", label: "Open your kitchen" };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Hero: an inset pink card that fills the first screen. */}
      <section className="mx-[calc(50%-50vw)] px-2 pt-2 sm:px-3 sm:pt-3">
        <div className="relative flex min-h-[calc(100svh-3.5rem-1rem)] flex-col overflow-hidden rounded-[2rem] bg-brand-soft sm:min-h-[calc(100svh-3.5rem-1.5rem)] sm:rounded-[2.5rem]">
          <HeroDoodles />
          <ScrollFade className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-5 pt-6 sm:px-10 sm:pb-6 sm:pt-8">
            <div className="my-auto flex flex-col items-center py-10 text-center">
              <p className="rounded-full border border-brand/25 bg-surface/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand backdrop-blur">
                Homemade · Local · Fresh
              </p>
              <h1 className="mt-6 max-w-4xl font-display text-[2.6rem] font-semibold leading-[1.05] sm:text-7xl">
                Bring your food to <span className="text-brand">more tables.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted">
                A menu page for your home kitchen. Share one link with neighbours, friends and family, and let the
                orders come to you.
              </p>
              <Link
                href={start.href}
                className="btn-primary mt-8 w-full max-w-sm justify-between py-3.5 pl-7 pr-2.5 text-base"
              >
                {start.label}
                <Arrow />
              </Link>
              <p className="mt-3 text-sm text-muted">Free to start · Ready in about a minute</p>
            </div>

            <div className="flex justify-between border-t border-brand/20 pt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <span>[ Home cooked ]</span>
              <span>[ Order on WhatsApp ]</span>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* 2. What the app looks like. */}
      <section id="how-it-works" className="scroll-mt-20 space-y-16">
        <Reveal>
          <Label className="reveal">See it in action</Label>
          <h2
            className="reveal mt-3 max-w-2xl font-display text-3xl font-semibold leading-snug sm:text-4xl"
            style={order(1)}
          >
            Everything a home kitchen needs to take orders, nothing it doesn’t
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {features.map(({ tile: Tile, title, tag }, i) => (
              <div key={tag} className="reveal" style={order(i + 2)}>
                <div className="aspect-square overflow-hidden rounded-[2rem]">
                  <Tile />
                </div>
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">[ {tag} ]</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug">{title}</h3>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-brand-soft px-4 py-10 sm:px-12 sm:py-14">
            <Doodles className="text-brand/10" />
            <p className="relative mb-6 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              [ Your storefront ]
            </p>
            <div className="relative">
              <BrowserMockup />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. Why: split statement, then the before/after phones on a sage band. */}
      <section>
        <Reveal className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-0 md:divide-x md:divide-line">
          <div className="relative overflow-hidden md:pr-10">
            <Label className="reveal">Why {APP_NAME}</Label>
            <p
              className="pointer-events-none mt-4 select-none font-display text-8xl font-semibold leading-none text-brand-soft lg:text-9xl"
              aria-hidden
            >
              Calm
            </p>
          </div>
          <div className="md:pl-12">
            <p className="reveal font-display text-3xl font-semibold leading-snug sm:text-4xl" style={order(1)}>
              Orders in your DMs
              <InstagramBadge />, your chats
              <WhatsAppBadge /> and your missed calls 📞, and you still have to cook.
            </p>
            <p className="reveal mt-6 text-lg text-muted" style={order(2)}>
              {APP_NAME} keeps every order in one place: what was ordered, by whom, for pickup or delivery, and whether
              it’s paid. You just cook.
            </p>
          </div>
        </Reveal>

        <div className="mx-[calc(50%-50vw)] mt-16">
          <WaveEdge className="h-12 -scale-y-100 text-sage-soft sm:h-20" />
          <div className="relative -my-px overflow-hidden bg-sage-soft py-12">
            <Doodles className="text-sage/10" />
            <Reveal className="relative mx-auto grid max-w-5xl items-center gap-10 px-4 md:grid-cols-[1fr_auto_1fr]">
              <div className="reveal text-center">
                <PhonePlaceholder tone="messy" />
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">[ Before ]</p>
                <p className="mt-1 font-display text-xl font-semibold">Messages everywhere</p>
              </div>
              <span
                className="reveal mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xl shadow-sm"
                style={order(1)}
                aria-hidden
              >
                <span className="rotate-90 md:rotate-0">→</span>
              </span>
              <div className="reveal text-center" style={order(2)}>
                <PhonePlaceholder tone="tidy" />
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-sage">[ After ]</p>
                <p className="mt-1 font-display text-xl font-semibold">Every order in {APP_NAME}</p>
              </div>
            </Reveal>
          </div>
          <WaveEdge className="h-12 text-sage-soft sm:h-20" />
        </div>
      </section>

      {/* 4. Get started. */}
      <Reveal>
        <section className="reveal relative overflow-hidden rounded-[2.5rem] bg-brand-soft px-6 py-14 text-center sm:px-10 sm:py-20">
          <Doodles className="text-brand/10" />
          <div className="relative mx-auto max-w-2xl">
            <Label>Get started</Label>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Your kitchen, your menu, <span className="text-brand">your prices.</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Open your kitchen today and share it with the people who already love your food.
            </p>
            <Link
              href={start.href}
              className="btn-primary mx-auto mt-8 w-full max-w-sm justify-between py-3.5 pl-7 pr-2.5 text-base"
            >
              {start.label}
              <Arrow />
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

/** A small "// Label" above a section heading. */
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-medium uppercase tracking-[0.18em] text-muted ${className}`}>
      {"// "}
      {children}
    </p>
  );
}

/** The arrow in a little round box at the end of a primary button. */
function Arrow() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20" aria-hidden>
      →
    </span>
  );
}
