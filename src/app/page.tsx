import Link from "next/link";
import { Doodles, IconBadge, type IconName, WaveEdge, WaveOverlay } from "@/components/Decor";
import { HowItWorks } from "@/components/HowItWorks";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { ScrollFade } from "@/components/ScrollFade";
import { UseCases } from "@/components/UseCases";
import { getCurrentProfile } from "@/lib/auth";
import { stripeEnabled } from "@/lib/stripe";

const BIRYANI = "/dishes/chicken-biryani.webp";

const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

// A cook's day, told in three photos.
const day = [
  {
    time: "Morning",
    title: "Cook what you love",
    body: "Your recipes, your portions, your kitchen.",
    photo: "a cook stirring a pot",
    src: "/photos/stirring-pot.webp",
  },
  {
    time: "Afternoon",
    title: "Orders roll in",
    body: "Neighbours order from your link. You confirm in a tap.",
    photo: "packing food into containers",
    src: "/photos/packed-meals.webp",
  },
  {
    time: "Evening",
    title: "Hand it over",
    body: "Pickup at your door or a quick delivery down the street.",
    photo: "handing a bag of food at a door",
    src: "/photos/doorstep-handoff.webp",
  },
];

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
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Hero: a photo spans the whole section, with the words over a dark fade on the left. */}
      <section className="relative mx-[calc(50%-50vw)] flex min-h-[calc(100svh-3.5rem)] flex-col">
        <div className="relative flex flex-1 items-center overflow-hidden pb-24 pt-12">
          <PhotoSlot
            src="/photos/hero-stew-and-rice.webp"
            label="a homemade stew with rice and salads"
            tone="dark"
            priority
            sizes="100vw"
            className="absolute inset-0 scale-105 animate-[settle_1600ms_cubic-bezier(0.2,0.7,0.3,1)_both]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
          {/* Phones: the words cover most of the photo, so darken it evenly too. */}
          <div className="absolute inset-0 bg-ink/35 md:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/40 to-transparent" />
          <ScrollFade className="relative mx-auto grid w-full max-w-5xl items-center gap-12 px-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="text-white">
              <p className="w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
                Homemade · Local · Fresh
              </p>
              <h1 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">
                Bring your food
                <br />
                to{" "}
                <span className="relative inline-block whitespace-nowrap text-sage">
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
              <p className="mt-5 max-w-md text-lg text-white/85">
                Create your online shop in minutes, share one link, and start taking orders. Free to start.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={start.href} className="btn-primary px-6">
                  {start.label}
                </Link>
                <a
                  href="#how-it-works"
                  className="btn border border-white/40 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20 [--edge:rgb(0_0_0/0.25)]"
                >
                  How it works
                </a>
              </div>
            </div>

            {/* The kitchen's menu card, floating over the photo. */}
            <div className="relative mx-auto hidden w-full max-w-xs md:block" aria-hidden>
              <span className="absolute -top-4 left-6 z-10 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold shadow-[0_10px_24px_rgb(43_43_43/0.2)] animate-[pop_500ms_ease-out_900ms_both]">
                🔔 New order · 2 dishes
              </span>
              <div className="rounded-3xl bg-surface/95 p-5 shadow-[0_24px_50px_rgb(0_0_0/0.3)] backdrop-blur animate-[reveal-in_700ms_cubic-bezier(0.2,0.7,0.3,1)_400ms_both]">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-display text-lg text-white">
                    F
                  </span>
                  <span>
                    <span className="block font-display text-lg leading-tight">Fatema’s Kitchen</span>
                    <span className="block text-xs text-muted">Pickup · Delivery</span>
                  </span>
                </div>
                <ul className="mt-3 divide-y divide-line text-sm">
                  {[
                    ["Chicken biryani", "$14"],
                    ["Vegetable samosas (6)", "$8"],
                    ["Mango kulfi", "$5"],
                  ].map(([name, price]) => (
                    <li key={name} className="flex justify-between py-2">
                      <span>{name}</span>
                      <span className="font-semibold text-orange-text">{price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollFade>
        </div>
        <a
          href="#about"
          aria-label="Scroll down"
          className="absolute bottom-16 left-1/2 hidden h-10 w-10 -translate-x-1/2 animate-bounce items-center justify-center rounded-full bg-surface text-brand-dark shadow-md sm:flex"
        >
          ↓
        </a>
        {/* The photo's bottom edge curves into the page. */}
        <WaveOverlay className="absolute inset-x-0 -bottom-px h-12 text-cream sm:h-20" />
      </section>

      {/* 2. About: a big photo on the left, the story on the right. */}
      <Reveal id="about" className="grid scroll-mt-24 items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="relative">
          <PhotoSlot
            src="/photos/cook-at-stove.webp"
            label="a home cook at her stove"
            className="reveal relative aspect-[4/5] rounded-[2.5rem] shadow-[0_24px_50px_rgb(43_43_43/0.12)]"
          />
          <PhotoSlot
            src={BIRYANI}
            label="chicken biryani"
            className="reveal absolute -bottom-8 -right-4 h-40 w-40 rounded-3xl border-4 border-cream shadow-[0_18px_40px_rgb(43_43_43/0.18)] sm:-right-8 sm:h-48 sm:w-48"
          />
        </div>
        <div>
          <h2 className="reveal font-display text-3xl leading-snug sm:text-4xl" style={order(1)}>
            We believe the best food in town is often cooked in someone’s home kitchen
          </h2>
          <div className="reveal mt-6 space-y-4 text-muted" style={order(2)}>
            <p>
              Home cooks make the dishes people line up for, but selling them means juggling DMs, screenshots of prices
              and notes on scraps of paper.
            </p>
            <p>
              HomeCook gives every home kitchen a simple online menu. Share one link, take orders for pickup or
              delivery, and get paid the way that works for you.
            </p>
          </div>
          <Link href={start.href} className="btn-primary reveal mt-8 pl-6 pr-2" style={order(3)}>
            {start.label}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </Reveal>

      {/* 3. How it works (unchanged): the steps drive the phone. */}
      <Reveal id="how-it-works" className="scroll-mt-20">
        <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand">How it works</p>
        <h2 className="reveal mt-2 font-display text-3xl sm:text-4xl" style={order(1)}>
          From your kitchen to their table in three steps
        </h2>
        <HowItWorks />
      </Reveal>

      {/* 4. A cook's day: three tall photos running edge to edge, captions on the photos. */}
      <section>
        <Reveal>
          <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand">A day with HomeCook</p>
          <h2 className="reveal mt-2 font-display text-3xl sm:text-4xl" style={order(1)}>
            Cooked at home, enjoyed down the street
          </h2>
        </Reveal>
        <Reveal className="mx-[calc(50%-50vw)] mt-8 grid gap-2 px-2 sm:grid-cols-3">
          {day.map((d, i) => (
            <figure
              key={d.time}
              className="reveal group relative h-[26rem] overflow-hidden rounded-[2rem] sm:h-[32rem]"
              style={order(i + 2)}
            >
              <PhotoSlot
                src={d.src}
                label={d.photo}
                tone="dark"
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-sage">{d.time}</span>
                <span className="mt-1 block font-display text-2xl">{d.title}</span>
                <span className="mt-1 block text-sm text-white/80">{d.body}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      {/* 5. Why HomeCook (unchanged). */}
      <Reveal>
        <p className="reveal text-xs font-semibold uppercase tracking-wider text-brand">Why HomeCook</p>
        <h2 className="reveal mt-2 font-display text-3xl sm:text-4xl" style={order(1)}>
          Less time in your DMs, more time cooking
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <div key={r.title} className="reveal card p-5" style={order(i + 2)}>
              <IconBadge icon={r.icon} className="border-brand/30 text-brand" />
              <h3 className="mt-4 font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted">{r.body}</p>
            </div>
          ))}
        </div>

        {/* Before and after, side by side. */}
        <div
          className="reveal mt-6 grid overflow-hidden rounded-3xl border border-line sm:grid-cols-2"
          style={order(6)}
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

      {/* 6. Use HomeCook to… (unchanged): full-bleed teal band; the section pins while its cards scroll. */}
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

      {/* 7. Get started: a full-width photo band with the words on top. */}
      <Reveal className="mx-[calc(50%-50vw)] px-2">
        <section className="reveal relative flex min-h-[28rem] items-center overflow-hidden rounded-[2.5rem]">
          <PhotoSlot
            src="/photos/table-of-dishes.webp"
            label="a table full of homemade dishes"
            tone="dark"
            sizes="100vw"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-ink/55" />
          <div className="relative mx-auto max-w-2xl px-6 py-16 text-center text-white">
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Your kitchen, your menu, <span className="text-sage">your prices.</span>
            </h2>
            <p className="mt-4 text-lg text-white/85">
              Open your kitchen today and share it with the people who already love your food.
            </p>
            <Link href={start.href} className="btn-primary mx-auto mt-8 pl-6 pr-2">
              {start.label}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
