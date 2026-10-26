import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { stripeEnabled } from "@/lib/stripe";

// Steps sit at alternating angles on wider screens, like MealBee.
const STEP_TILTS = ["sm:[--tilt:-1.5deg]", "", "sm:[--tilt:1.5deg]"];

const steps = [
  {
    emoji: "📝",
    title: "Set up your kitchen",
    body: "Sign in with Gmail, name your kitchen and choose pickup, delivery or both. Takes about a minute.",
  },
  {
    emoji: "📸",
    title: "Add your dishes",
    body: "Snap a photo, set a price and you’re listed. Switch a dish off when it sells out.",
  },
  {
    emoji: "📲",
    title: "Share your link",
    body: "One menu link for WhatsApp, Instagram and your neighbours. Print the QR code for your door.",
  },
];

export default async function Home() {
  const profile = await getCurrentProfile();
  const start = profile?.is_cook
    ? { href: "/cook", label: "Go to my kitchen" }
    : { href: profile ? "/cook/onboarding" : "/login?next=/cook", label: "Open your kitchen" };

  const features = [
    { title: "Your own storefront", body: "A menu page with your cover photo and dishes grouped by category." },
    { title: "Orders in one place", body: "See who ordered what, for pickup or delivery, and message buyers on WhatsApp." },
    {
      title: stripeEnabled ? "Get paid your way" : "Cash or e-transfer",
      body: stripeEnabled
        ? "Take cards with payouts straight to your bank, or accept cash and e-transfer."
        : "Buyers pay you directly when they pick up or you deliver.",
    },
    { title: "Track your sales", body: "See what you’ve earned today, this week and this month." },
  ];

  return (
    <div className="space-y-16 pt-8 sm:pt-14">
      <section className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="chip border-brand/20 bg-brand-soft text-brand">For home cooks</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Turn your home cooking
            <br />
            into <span className="text-brand">orders.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Put your dishes online, share one link and take orders from neighbours, friends and family. Free to start.
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

        <div className="card tilt-card relative mx-auto w-full max-w-sm overflow-hidden p-5 sm:[--tilt:2deg]" aria-hidden>
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
      </section>

      <section id="how-it-works" className="scroll-mt-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Start selling in three steps</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className={`card tilt-card p-5 ${STEP_TILTS[i % STEP_TILTS.length]}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  {step.emoji}
                </span>
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-xs text-sage">
                ✓
              </span>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-0.5 text-sm text-muted">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card flex flex-col items-start justify-between gap-4 bg-brand-soft p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="font-display text-2xl font-semibold">Your kitchen, your menu, your prices.</p>
          <p className="mt-1 text-muted">Open your kitchen today and share it with the people who already love your food.</p>
        </div>
        <Link href={start.href} className="btn-primary shrink-0 px-6">
          {start.label}
        </Link>
      </section>
    </div>
  );
}
