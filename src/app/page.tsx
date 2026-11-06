import Image from "next/image";
import Link from "next/link";
import { ClayChili, ClayLemon, ClayPea, ClayTomato } from "@/components/Clay";
import { Doodles, IconBadge, type IconName, WaveEdge } from "@/components/Decor";
import { HeroDoodles } from "@/components/HeroDoodles";
import { HowItWorks } from "@/components/HowItWorks";
import { Reveal } from "@/components/Reveal";
import { ScrollFade } from "@/components/ScrollFade";
import { TryIt } from "@/components/TryIt";
import { getCurrentProfile } from "@/lib/auth";
import { siteUrl } from "@/lib/format";
import { stripeEnabled } from "@/lib/stripe";

export default async function Home() {
  const profile = await getCurrentProfile();
  const start = profile?.is_cook
    ? { href: "/cook", label: "Go to my kitchen" }
    : {
        href: profile ? "/cook/onboarding" : "/login?next=/cook",
        label: "Open your kitchen",
      };

  const features: { icon: IconName; title: string; body: string }[] = [
    {
      icon: "shop",
      title: "Your own storefront",
      body: "A menu page with your cover photo and dishes grouped by category.",
    },
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
    {
      icon: "chart",
      title: "Track your sales",
      body: "See what you’ve earned today, this week and this month.",
    },
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

            <div className="relative mx-auto w-full max-w-sm">
              {/* 3D clay food floating around the menu card. */}
              <ClayTomato className="absolute -right-1 -top-10 z-10 h-16 w-16 sm:-right-12 sm:h-24 sm:w-24" />
              <ClayLemon className="absolute -bottom-8 -left-1 z-10 h-12 w-16 sm:-left-14 sm:h-14 sm:w-20" delay={1.5} />
              <ClayPea className="absolute -left-10 top-6 hidden h-10 w-10 md:block" delay={0.8} />
              <ClayPea className="absolute -bottom-6 right-10 z-10 h-7 w-7" delay={2.2} />
              <ClayChili className="absolute -right-24 bottom-20 hidden h-12 w-20 md:block" delay={3} />
              <div className="card listing relative overflow-hidden" aria-hidden>
                <div className="relative h-32">
                  <Image
                    src="/dishes/chicken-biryani.webp"
                    alt=""
                    fill
                    priority
                    sizes="384px"
                    className="object-cover"
                  />
                </div>
                <div className="px-5 pb-5">
                  <span className="relative -mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface bg-brand font-display text-lg font-semibold text-white">
                    F
                  </span>
                  <p className="mt-1 font-display text-lg font-semibold">Fatema’s Kitchen</p>
                  <p className="text-xs text-muted">Pickup · Delivery</p>
                  <ul className="mt-3 divide-y divide-line text-sm">
                    {[
                      ["Chicken biryani", "$14"],
                      ["Vegetable samosas (6)", "$8"],
                      ["Mango kulfi", "$5"],
                    ].map(([name, price]) => (
                      <li key={name} className="flex items-center gap-3 py-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
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
              </div>
            </div>
          </ScrollFade>
        </div>
        <WaveEdge className="-mt-px h-12 text-brand-soft sm:h-20" line="var(--color-brand)" />
      </section>

      <Reveal id="how-it-works" className="scroll-mt-20">
        <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand">How it works</p>
        <h2
          className="reveal mt-2 font-display text-3xl font-semibold sm:text-4xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          From your kitchen to their table in three steps
        </h2>
        <HowItWorks />
      </Reveal>

      <Reveal id="try-it" className="scroll-mt-20">
        <TryIt host={siteUrl().replace(/^https?:\/\//, "")} startHref={start.href} startLabel={start.label} />
      </Reveal>

      {/* Full-bleed sage band with wavy edges top and bottom. */}
      <section className="mx-[calc(50%-50vw)]">
        <WaveEdge className="h-12 -scale-y-100 text-sage-soft sm:h-20" />
        <div className="relative -my-px overflow-hidden bg-sage-soft py-10">
          <Doodles className="text-sage/10" />
          <Reveal className="relative mx-auto w-full max-w-5xl px-4">
            <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand-dark">What you get</p>
            <h2
              className="reveal mt-2 font-display text-3xl font-semibold sm:text-4xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Simple tools, built for home kitchens
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="reveal flex gap-4 rounded-3xl bg-surface/70 p-5"
                  style={{ "--i": i + 2 } as React.CSSProperties}
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
            <p className="mt-1 text-muted">
              Open your kitchen today and share it with the people who already love your food.
            </p>
          </div>
          <Link href={start.href} className="btn-primary relative shrink-0 px-6">
            {start.label}
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
