"use client";

import { IconBadge, type IconName } from "@/components/Decor";
import { LOOP_LENGTH, PhoneMockup, STEP_STARTS, useLoopClock } from "@/components/PhoneMockup";

const STEPS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "shop",
    title: "Set up your kitchen",
    body: "Sign in with Gmail, name your kitchen and choose pickup, delivery or both. Takes about a minute.",
  },
  {
    icon: "camera",
    title: "Add your dishes",
    body: "Drop in a photo, write a line about it and set a price. Switch a dish off when it sells out.",
  },
  {
    icon: "share",
    title: "Share your link, take orders",
    body: "Send your menu on WhatsApp or Instagram. Orders arrive in the app and you confirm them in a tap.",
  },
];

/**
 * The three steps beside the phone walkthrough. They share one clock: the step the phone is
 * showing lights up with a progress bar, and clicking a step jumps the phone to that part.
 */
export function HowItWorks() {
  const clock = useLoopClock();
  const active = STEP_STARTS.findLastIndex((start) => clock.t >= start);
  const end = STEP_STARTS[active + 1] ?? LOOP_LENGTH;
  const progress = Math.min(1, (clock.t - STEP_STARTS[active]) / (end - STEP_STARTS[active]));

  return (
    <div className="mt-8 grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
      <ol className="grid gap-3">
        {STEPS.map((step, i) => {
          const on = i === active;
          return (
            <li key={step.title} className="reveal" style={{ "--i": i + 1 } as React.CSSProperties}>
              <button
                type="button"
                onClick={() => clock.seek(STEP_STARTS[i])}
                aria-current={on ? "step" : undefined}
                className={`relative flex w-full gap-4 overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 ${
                  on
                    ? "border-brand/40 bg-surface shadow-[0_10px_30px_rgb(43_43_43/0.08)]"
                    : "border-transparent bg-surface/50 hover:bg-surface"
                }`}
              >
                <IconBadge
                  icon={step.icon}
                  className={`transition-colors duration-300 ${on ? "border-brand bg-brand text-white" : "border-line text-muted"}`}
                />
                <span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${on ? "text-brand" : "text-muted"}`}>
                    Step {i + 1}
                  </span>
                  <span className="mt-1 block font-semibold">{step.title}</span>
                  <span className="mt-1 block text-sm text-muted">{step.body}</span>
                </span>
                {/* How far the phone is through this step. */}
                <span className="absolute inset-x-0 bottom-0 h-1 bg-line/60">
                  <span className="block h-full bg-brand" style={{ width: `${on ? progress * 100 : 0}%` }} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
        <PhoneMockup clock={clock} />
      </div>
    </div>
  );
}
