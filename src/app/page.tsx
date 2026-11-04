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
    <div className="space-y-20">
      {/* Inset hero card: nearly full-bleed with a small margin, filling the first screen. */}
      <section className="mx-[calc(50%-50vw)] px-2 pt-2 sm:px-3 sm:pt-3">
        <div className="relative flex min-h-[calc(100svh-3.5rem-1rem)] flex-col overflow-hidden rounded-[2rem] bg-brand-soft sm:min-h-[calc(100svh-3.5rem-1.5rem)] sm:rounded-[2.5rem]">
          <HeroDoodles />
          <ScrollFade className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-5 pt-6 sm:px-10 sm:pb-6 sm:pt-8">
            <p className="w-fit rounded-full border border-brand/25 bg-surface/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand backdrop-blur">
              Homemade · Local · Fresh
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.05] sm:mt-8 sm:text-7xl">
              Bring your food
              <br />
              to <span className="text-brand">more tables</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted">
              Create your online shop in minutes, share one link, and start taking orders. Free to start.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={start.href} className="btn-primary pl-6 pr-2">
                {start.label}
                <Arrow />
              </Link>
              <a href="#how-it-works" className="btn-secondary px-6">
                How it works
              </a>
            </div>

            <div className="mt-auto grid gap-6 pt-10 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3" aria-hidden>
                  {["👩🏽‍🍳", "🧑🏻‍🍳", "👨🏾‍🍳"].map((cook) => (
                    <span
                      key={cook}
                      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand-soft bg-surface text-xl"
                    >
                      {cook}
                    </span>
                  ))}
                </div>
                <p className="max-w-[15rem] text-sm text-muted">Home cooks are opening kitchens in their neighbourhoods.</p>
              </div>

              <div className="hidden w-72 rounded-3xl border border-white/70 bg-surface/55 p-4 shadow-[0_12px_30px_rgb(43_43_43/0.08)] backdrop-blur-md sm:block">
                <p className="font-medium leading-snug">Your whole menu, one link to share</p>
                <div className="mt-3 flex h-24 items-center justify-center gap-3 rounded-2xl bg-brand/10 text-4xl" aria-hidden>
                  <span>🍛</span>
                  <span>🥟</span>
                  <span>🍮</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted">Send it on WhatsApp, Instagram or print the QR code.</p>
                  <Link
                    href={start.href}
                    aria-label={start.label}
                    className="pressable flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-white"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between border-t border-brand/20 pt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              <span>[ Home cooked ]</span>
              <span>[ Order on WhatsApp ]</span>
            </div>
          </ScrollFade>
        </div>
      </section>

      <Reveal className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-0 md:divide-x md:divide-line">
        <div className="relative overflow-hidden md:pr-10">
          <p className="reveal text-xs font-medium uppercase tracking-[0.18em] text-muted">{"// About HomeCook"}</p>
          <p
            className="pointer-events-none mt-4 select-none font-display text-8xl font-semibold leading-none text-brand-soft lg:text-9xl"
            aria-hidden
          >
            Fresh
          </p>
          <div
            className="reveal relative mt-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] bg-brand-soft"
            style={{ "--i": 1 } as React.CSSProperties}
            aria-hidden
          >
            <Doodles className="text-brand/15" />
            <span className="relative text-8xl">🍲</span>
            <span className="absolute bottom-4 left-4 rounded-full bg-surface/80 px-3 py-1 text-xs font-medium backdrop-blur">
              Cooked at home, shared nearby
            </span>
          </div>
        </div>
        <div className="md:pl-12">
          <h2
            className="reveal font-display text-3xl font-semibold leading-snug sm:text-4xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Helping home cooks share their food with neighbours, friends and family
          </h2>
          <div className="reveal mt-6 space-y-4 text-muted" style={{ "--i": 2 } as React.CSSProperties}>
            <p>
              Some of the best food in town is cooked in someone’s home kitchen. HomeCook gives home cooks a simple
              online menu, so the people around them can find their dishes and order in a tap.
            </p>
            <p>
              No app to download and nothing complicated to set up. Share one link, take orders for pickup or
              delivery, and get paid the way that works for you.
            </p>
          </div>
          <Link
            href={start.href}
            className="btn-primary reveal mt-8 pl-6 pr-2"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {start.label}
            <Arrow />
          </Link>
        </div>
      </Reveal>

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
          <div className="reveal md:mr-24" style={{ "--i": steps.length + 1 } as React.CSSProperties}>
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
                  <IconBadge icon={f.icon} className="border-sage/40 bg-surface text-sage" />
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

/** The arrow in a little round box at the end of a primary button. */
function Arrow() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20" aria-hidden>
      →
    </span>
  );
}
