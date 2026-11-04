import Link from "next/link";
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
import { APP_NAME } from "@/lib/brand";
import { getCurrentProfile } from "@/lib/auth";

const features = [
  { tile: CheckoutTile, title: "Orders arrive complete: what, how many and how they’ll pay", tag: "Ordering" },
  { tile: HandoffTile, title: "Pickup, delivery or both — you decide", tag: "Your rules" },
  { tile: StoreTile, title: "Your menu online before the kettle boils", tag: "Your storefront" },
];

export default async function Home() {
  const profile = await getCurrentProfile();
  const start = profile?.is_cook
    ? { href: "/cook", label: "Go to my kitchen" }
    : { href: profile ? "/cook/onboarding" : "/login?next=/cook", label: "Open your kitchen" };

  return (
    <div className="space-y-28 pb-8 sm:space-y-36">
      <section className="mx-auto max-w-3xl pt-20 text-center sm:pt-28">
        <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">
          Bring your food to <span className="text-brand">more tables.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/80 sm:text-xl">
          A menu page for your home kitchen. Share one link with neighbours, friends and family, and let the orders
          come to you.
        </p>
        <Link href={start.href} className="btn-primary mx-auto mt-10 w-full max-w-md rounded-2xl py-4 text-lg">
          {start.label}
        </Link>
        <p className="mt-4 text-sm text-muted">Free to start · Ready in about a minute</p>
      </section>

      <Reveal className="grid gap-10 md:grid-cols-3 md:gap-8">
        {features.map(({ tile: Tile, title, tag }, i) => (
          <div key={tag} className="reveal" style={{ "--i": i } as React.CSSProperties}>
            <div className="aspect-square overflow-hidden rounded-2xl">
              <Tile />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold leading-snug">{title}</h2>
            <p className="mt-3 inline-block rounded-full border border-ink px-4 py-1.5 text-sm font-medium uppercase">
              {tag}
            </p>
          </div>
        ))}
      </Reveal>

      <Reveal>
        <div className="reveal">
          <BrowserMockup />
        </div>
      </Reveal>

      {/* Fades from the page colour into the brand colour behind the comparison. */}
      <section className="mx-[calc(50%-50vw)] bg-gradient-to-b from-cream via-brand-soft to-brand px-4 pb-24 pt-8">
        <Reveal className="mx-auto max-w-4xl">
          <p className="reveal font-display text-3xl font-semibold leading-tight text-ink/85 sm:text-5xl">
            Orders in your DMs
            <InstagramBadge />, your chats
            <WhatsAppBadge /> and your missed calls 📞, and you still have to cook.
          </p>
          <p
            className="reveal mt-8 font-display text-3xl font-semibold text-brand-darker sm:text-5xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {APP_NAME} keeps every order in one place.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-20 grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
          <div className="reveal" style={{ "--i": 0 } as React.CSSProperties}>
            <PhonePlaceholder tone="messy" />
            <p className="mt-5 text-center text-xl font-medium">Before: messages everywhere</p>
          </div>
          <p className="reveal text-center text-xl font-semibold" style={{ "--i": 1 } as React.CSSProperties}>
            →
          </p>
          <div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
            <PhonePlaceholder tone="tidy" />
            <p className="mt-5 text-center text-xl font-medium text-white">
              After: every order in <span className="font-display font-semibold">{APP_NAME}</span>
            </p>
          </div>
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="reveal font-display text-4xl font-semibold sm:text-5xl">Your kitchen, your menu, your prices.</h2>
        <p className="reveal mt-4 text-lg text-muted" style={{ "--i": 1 } as React.CSSProperties}>
          Open your kitchen today and share it with the people who already love your food.
        </p>
        <Link
          href={start.href}
          className="btn-primary reveal mx-auto mt-8 w-full max-w-md rounded-2xl py-4 text-lg"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {start.label}
        </Link>
      </Reveal>
    </div>
  );
}
