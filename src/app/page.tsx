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
  { tile: CheckoutTile, title: "A checkout that turns visits into orders", tag: "Simple checkout" },
  { tile: HandoffTile, title: "Reach more neighbours with pickup and delivery", tag: "Pickup & delivery" },
  { tile: StoreTile, title: "Set up and start selling in minutes", tag: "Easy storefront" },
];

export default async function Home() {
  const profile = await getCurrentProfile();
  const start = profile?.is_cook
    ? { href: "/cook", label: "Go to my kitchen" }
    : { href: profile ? "/cook/onboarding" : "/login?next=/cook", label: "Get started" };

  return (
    <div className="space-y-28 pb-8 sm:space-y-36">
      <section className="mx-auto max-w-3xl pt-20 text-center sm:pt-28">
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          The easiest way to sell your home cooking online.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/80 sm:text-xl">
          Join the home cooks, bakers and caterers who share one link and take orders from their neighbourhood with{" "}
          {APP_NAME}.
        </p>
        <Link href={start.href} className="btn-primary mx-auto mt-10 w-full max-w-md rounded-2xl py-4 text-lg">
          {start.label}
        </Link>
        <p className="mt-4 text-sm text-muted">Free to start. No app to download.</p>
      </section>

      <Reveal className="grid gap-10 md:grid-cols-3 md:gap-8">
        {features.map(({ tile: Tile, title, tag }, i) => (
          <div key={tag} className="reveal" style={{ "--i": i } as React.CSSProperties}>
            <div className="aspect-square overflow-hidden rounded-2xl">
              <Tile />
            </div>
            <h2 className="mt-6 text-2xl font-medium leading-snug tracking-tight">{title}</h2>
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
          <p className="reveal text-3xl font-medium leading-tight tracking-tight text-ink/85 sm:text-5xl">
            Managing orders on Instagram
            <InstagramBadge />, WhatsApp
            <WhatsAppBadge />, the phone 💬 — plus payments and pickup times — is a lot for one cook.
          </p>
          <p
            className="reveal mt-8 text-3xl font-medium tracking-tight text-ink/85 sm:text-5xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Make things easier with {APP_NAME}.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-20 grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
          <div className="reveal" style={{ "--i": 0 } as React.CSSProperties}>
            <PhonePlaceholder tone="chaos" />
            <p className="mt-5 text-center text-xl font-medium">Absolute chaos</p>
          </div>
          <p className="reveal text-center text-xl font-semibold" style={{ "--i": 1 } as React.CSSProperties}>
            vs.
          </p>
          <div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
            <PhonePlaceholder tone="calm" />
            <p className="mt-5 text-center text-xl font-medium text-white">
              Powered by <span className="font-display font-semibold">{APP_NAME}</span>
            </p>
          </div>
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="reveal text-4xl font-semibold tracking-tight sm:text-5xl">Your kitchen, your menu, your prices.</h2>
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
