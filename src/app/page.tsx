import Image from "next/image";
import Link from "next/link";
import { BunIllustration, Doodles, IconBadge, type IconName, WaveEdge } from "@/components/Decor";
import { getCurrentProfile } from "@/lib/auth";
import { stripeEnabled } from "@/lib/stripe";

const steps = [
  {
    icon: "/steps/menu.png",
    title: "Set up your kitchen",
    body: "Sign in with Gmail, name your kitchen and choose pickup, delivery or both. Takes about a minute.",
  },
  {
    icon: "/steps/camera.png",
    title: "Add your dishes",
    body: "Snap a photo, set a price and you’re listed. Switch a dish off when it sells out.",
  },
  {
    icon: "/steps/share.png",
    title: "Share your link",
    body: "One menu link for WhatsApp, Instagram and your neighbours. Print the QR code for your door.",
  },
];

const promises: { icon: IconName; label: string }[] = [
  { icon: "wheat", label: "Homemade" },
  { icon: "leaf", label: "Cooked fresh" },
  { icon: "heart", label: "Made with love" },
];

export default async function Home() {
  const profile = await getCurrentProfile();
  const start = profile?.is_cook
    ? { href: "/cook", label: "Go to my kitchen" }
    : { href: profile ? "/cook/onboarding" : "/login?next=/cook", label: "Open your kitchen" };

  const features: { icon: IconName; title: string; body: string }[] = [
    { icon: "shop", title: "Your own storefront", body: "A menu page with your cover photo and dishes grouped by category." },
    {
      icon: "bag",
      title: "Orders in one place",
      body: "See who ordered what, for pickup or delivery, and message buyers on WhatsApp.",
    },
    {
      icon: "cash",
      title: stripeEnabled ? "Get paid your way" : "Cash or e-transfer",
      body: stripeEnabled
        ? "Take cards with payouts straight to your bank, or accept cash and e-transfer."
        : "Buyers pay you directly when they pick up or you deliver.",
    },
    { icon: "chart", title: "Track your sales", body: "See what you’ve earned today, this week and this month." },
  ];

  return (
    <div className="space-y-16 sm:pt-8">
      <section className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-[2.5rem] sm:border sm:border-line sm:bg-surface">
        <div className="relative bg-brand-soft px-5 pb-6 pt-10 sm:px-10 sm:pt-14">
          <Doodles className="text-brand/10" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Bring Your Food
                <br />
                to <span className="text-brand">More Tables</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted">
                Create your online shop in minutes, share one link, and start taking orders. Free to start.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={start.href} className="btn-primary px-6">
                  {start.label}
                </Link>
                <a href="#how-it-works" className="btn-secondary px-6">
                  How it works
                </a>
              </div>
            </div>

            <div className="card listing relative mx-auto w-full max-w-sm overflow-hidden p-5" aria-hidden>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-2xl">👩🏽‍🍳</span>
                <div>
                  <p className="font-display text-lg font-semibold">Amma’s Kitchen</p>
                  <p className="text-xs text-muted">Pickup · Delivery</p>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-line text-sm">
                {[
                  ["🍛", "Chicken biryani", "$14"],
                  ["🥟", "Vegetable samosas (6)", "$8"],
                  ["🍮", "Mango kulfi", "$5"],
                ].map(([emoji, name, price]) => (
                  <li key={name} className="flex items-center gap-3 py-3">
                    <span className="text-xl">{emoji}</span>
                    <span className="flex-1 font-medium">{name}</span>
                    <span className="font-semibold text-brand">{price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-sage-soft px-3 py-2 text-sm">
                <span className="font-medium text-sage">New order · 2 dishes</span>
                <span className="font-semibold">$22</span>
              </div>
            </div>
          </div>
        </div>
        <WaveEdge className="-mt-px text-brand-soft" line="var(--color-brand)" />
        <ul className="grid grid-cols-3 gap-2 px-5 pb-6 pt-2 text-xs sm:flex sm:gap-x-5 sm:text-sm font-medium text-muted sm:px-10 sm:pb-8">
          {promises.map((p) => (
            <li key={p.label} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2">
              <IconBadge icon={p.icon} className="h-10 w-10 border-muted/40 text-muted" />
              {p.label}
            </li>
          ))}
        </ul>
      </section>

      <section id="how-it-works" className="scroll-mt-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Start selling in three steps</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="card listing p-5">
              <div className="flex items-center gap-3">
                <Image src={step.icon} alt="" width={28} height={28} className="h-7 w-7" />
                <span className="text-sm font-medium text-brand">Step {i + 1}</span>
              </div>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Everything your kitchen needs</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <IconBadge icon={f.icon} className="border-brand/30 text-brand" />
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-0.5 text-sm text-muted">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-[2.5rem] bg-brand-soft p-6 sm:flex-row sm:items-center sm:p-10">
        <Doodles className="text-brand/10" />
        <BunIllustration className="pointer-events-none absolute bottom-3 right-6 hidden w-36 text-brand/25 md:block" />
        <div className="relative">
          <p className="font-display text-2xl font-semibold">Your kitchen, your menu, your prices.</p>
          <p className="mt-1 text-muted">Open your kitchen today and share it with the people who already love your food.</p>
        </div>
        <Link href={start.href} className="btn-primary relative shrink-0 px-6 md:mr-40">
          {start.label}
        </Link>
      </section>
    </div>
  );
}
