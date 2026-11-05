import Image from "next/image";
import Link from "next/link";
import { Doodles, IconBadge, type IconName, WaveEdge } from "@/components/Decor";
import { HeroDoodles } from "@/components/HeroDoodles";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Reveal } from "@/components/Reveal";
import { ScrollFade } from "@/components/ScrollFade";
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
    <div className="space-y-16">
      {/* Full-bleed and full-height: fills the first screen below the header, edge to edge. */}
      <section className="relative mx-[calc(50%-50vw)] flex min-h-[calc(100svh-3.5rem)] flex-col">
        <div className="relative flex flex-1 items-center overflow-hidden bg-brand-soft pb-6 pt-10 sm:pt-14">
          <HeroDoodles />
          <ScrollFade className="relative mx-auto grid w-full max-w-5xl items-center gap-8 px-4 md:grid-cols-[1.1fr_0.9fr]">
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
                <span className="font-medium text-brand-dark">New order · 2 dishes</span>
                <span className="font-semibold">$22</span>
              </div>
            </div>
          </ScrollFade>
        </div>
        <WaveEdge className="-mt-px h-12 text-brand-soft sm:h-20" line="var(--color-brand)" />
      </section>

      <Reveal id="how-it-works" className="scroll-mt-20">
        <h2 className="reveal font-display text-2xl font-semibold sm:text-3xl">Start selling in three steps</h2>
        <div className="mt-6 grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <ol className="grid gap-4">
            {steps.map((step, i) => (
              <li key={step.title} className="card listing reveal p-5" style={{ "--i": i + 1 } as React.CSSProperties}>
                <div className="flex items-center gap-3">
                  <Image src={step.icon} alt="" width={28} height={28} className="h-7 w-7" />
                  <span className="text-sm font-medium text-brand">Step {i + 1}</span>
                </div>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="reveal" style={{ "--i": steps.length + 1 } as React.CSSProperties}>
            <PhoneMockup />
          </div>
        </div>
      </Reveal>

      {/* Full-bleed sage band with wavy edges top and bottom. */}
      <section className="mx-[calc(50%-50vw)]">
        <WaveEdge className="h-12 -scale-y-100 text-sage-soft sm:h-20" />
        <div className="relative -my-px overflow-hidden bg-sage-soft py-10">
          <Doodles className="text-sage/10" />
          <Reveal className="relative mx-auto w-full max-w-5xl px-4">
            <h2 className="reveal font-display text-2xl font-semibold sm:text-3xl">Everything your kitchen needs</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="reveal flex gap-4 rounded-3xl bg-surface/70 p-5"
                  style={{ "--i": i + 1 } as React.CSSProperties}
                >
                  <IconBadge icon={f.icon} className="border-sage/40 bg-surface text-brand-dark" />
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <WaveEdge className="h-12 text-sage-soft sm:h-20" />
      </section>

      <Reveal>
        <section className="reveal relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-[2.5rem] bg-brand-soft p-6 sm:flex-row sm:items-center sm:p-10">
          <Doodles className="text-brand/10" />
          <div className="relative">
            <p className="font-display text-2xl font-semibold">Your kitchen, your menu, your prices.</p>
            <p className="mt-1 text-muted">Open your kitchen today and share it with the people who already love your food.</p>
          </div>
          <Link href={start.href} className="btn-primary relative shrink-0 px-6">
            {start.label}
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
