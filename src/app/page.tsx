import Image from "next/image";
import Link from "next/link";
import { Doodles, IconBadge, type IconName, WaveEdge } from "@/components/Decor";
import { HeroDoodles } from "@/components/HeroDoodles";
import { HowItWorks } from "@/components/HowItWorks";
import { Reveal } from "@/components/Reveal";
import { ScrollFade } from "@/components/ScrollFade";
import { TryIt } from "@/components/TryIt";
import { UseCases } from "@/components/UseCases";
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

  const reasons: { icon: IconName; title: string; body: string }[] = [
    {
      icon: "phone",
      title: "Buyers don’t need an app",
      body: "They tap your link and order in their browser. No downloads, no passwords.",
    },
    {
      icon: "chat",
      title: "Works with WhatsApp",
      body: "Keep chatting with buyers the way you already do. Every order has a message button.",
    },
    {
      icon: "sliders",
      title: "You stay in charge",
      body: "Your prices, your hours, pickup or delivery. Switch a dish off the moment it sells out.",
    },
    {
      icon: "check",
      title: stripeEnabled ? "Free to start" : "Free to start, paid your way",
      body: stripeEnabled
        ? "Open your kitchen in about a minute and take cards, cash or e-transfer."
        : "Open your kitchen in about a minute. Buyers pay you directly with cash or e-transfer.",
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
                Bring your food
                <br />
                to{" "}
                <span className="relative inline-block whitespace-nowrap text-orange-text">
                  more tables
                  {/* A red, hand-drawn underline that draws itself in when the page loads. */}
                  <svg
                    viewBox="0 0 240 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-3 w-full"
                    aria-hidden
                  >
                    <path
                      d="M3 9C45 3 95 2 140 5s70 6 97-1"
                      pathLength={1}
                      fill="none"
                      stroke="#e0483e"
                      strokeWidth="4"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="animate-[draw_900ms_cubic-bezier(0.65,0,0.35,1)_500ms_both] [stroke-dasharray:1_2]"
                    />
                  </svg>
                </span>
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
                        <span className="font-semibold text-orange-text">{price}</span>
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

      <Reveal>
        <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand">Why HomeCook</p>
        <h2
          className="reveal mt-2 font-display text-3xl font-semibold sm:text-4xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Less time in your DMs, more time cooking
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <div key={r.title} className="reveal card p-5" style={{ "--i": i + 2 } as React.CSSProperties}>
              <IconBadge icon={r.icon} className="border-brand/30 text-brand" />
              <h3 className="mt-4 font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted">{r.body}</p>
            </div>
          ))}
        </div>

        {/* Before and after, side by side. */}
        <div
          className="reveal mt-6 grid overflow-hidden rounded-3xl border border-line sm:grid-cols-2"
          style={{ "--i": 6 } as React.CSSProperties}
        >
          <div className="bg-press/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Without HomeCook</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {[
                "Orders scattered across DMs and texts",
                "Typing out your prices in every chat",
                "Tallying who owes what on paper",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden>✕</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-brand-soft p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-dark">With HomeCook</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "One menu link with photos and prices",
                "Every order in one list, ready to confirm",
                "Sales added up for you",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-brand" aria-hidden>
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* Full-bleed teal band with wavy edges top and bottom. */}
      <section className="mx-[calc(50%-50vw)]">
        <WaveEdge className="h-12 -scale-y-100 text-brand-soft sm:h-20" />
        {/* overflow-clip (not hidden) so the pinned "Use HomeCook to…" can stick while scrolling. */}
        <div className="relative -my-px overflow-clip bg-brand-soft py-10">
          <Doodles className="text-brand/10" />
          <Reveal className="relative mx-auto w-full max-w-5xl px-4">
            <UseCases />
          </Reveal>
        </div>
        <WaveEdge className="h-12 text-brand-soft sm:h-20" />
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
