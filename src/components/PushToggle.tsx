"use client";

import { useEffect, useState, useTransition } from "react";
import { removePushSubscription, savePushSubscription, sendTestPush } from "@/app/actions/push";

type State = "loading" | "unsupported" | "denied" | "off" | "on";

/** The browser wants the public key as raw bytes, not base64url. */
function keyBytes(base64url: string) {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(base64url.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function supported() {
  return (
    typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  );
}

async function currentSubscription() {
  const registration = await navigator.serviceWorker.getRegistration("/");
  return (await registration?.pushManager.getSubscription()) ?? null;
}

/**
 * Turns order alerts (web push notifications) on or off for this browser.
 * "card" is the full control for settings pages; "banner" is a small nudge that only shows while alerts are off.
 */
export function PushToggle({
  publicKey,
  variant = "card",
  title = "Order alerts",
  description = "Get a notification on this phone or computer when a new order comes in.",
  test = true,
}: {
  publicKey: string;
  variant?: "card" | "banner";
  title?: string;
  description?: string;
  test?: boolean;
}) {
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState<string>();
  const [tested, setTested] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!supported()) return setState("unsupported");
    if (Notification.permission === "denied") return setState("denied");
    currentSubscription()
      .then((sub) => setState(sub ? "on" : "off"))
      .catch(() => setState("off"));
  }, []);

  function turnOn() {
    setError(undefined);
    start(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return setState(permission === "denied" ? "denied" : "off");
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        await navigator.serviceWorker.ready;
        const sub =
          (await registration.pushManager.getSubscription()) ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: keyBytes(publicKey),
          }));
        const result = await savePushSubscription(sub.toJSON());
        if (result.error) return setError(result.error);
        setState("on");
      } catch {
        setError("Couldn’t turn on alerts in this browser. Please try again.");
      }
    });
  }

  function turnOff() {
    start(async () => {
      const sub = await currentSubscription().catch(() => null);
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await sub.unsubscribe().catch(() => undefined);
      }
      setState("off");
      setTested(false);
    });
  }

  if (variant === "banner") {
    if (state !== "off") return null;
    return (
      <div className="card flex flex-col gap-3 border-brand/30 bg-brand-soft p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">🔔 {title}</p>
          <p className="text-sm text-muted">{description}</p>
          {error && <p className="mt-1 text-sm text-danger">{error}</p>}
        </div>
        <button type="button" onClick={turnOn} disabled={pending} className="btn-primary shrink-0 px-5">
          {pending ? "Turning on…" : "Turn on alerts"}
        </button>
      </div>
    );
  }

  return (
    <section className="card space-y-3 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">🔔 {title}</h2>
        {state === "on" && (
          <span className="rounded-full bg-sage-soft px-2.5 py-1 text-xs font-semibold text-brand-dark">On</span>
        )}
      </div>
      <p className="text-sm text-muted">{description}</p>

      {state === "unsupported" && (
        <p className="rounded-xl bg-press p-3 text-sm">
          This browser can’t show alerts. Try Chrome or Edge on your Android phone or computer.
        </p>
      )}
      {state === "denied" && (
        <p className="rounded-xl bg-press p-3 text-sm">
          Notifications are blocked for this site. Tap the lock or settings icon next to the web address, allow
          notifications, then reload this page.
        </p>
      )}
      {state === "off" && (
        <button type="button" onClick={turnOn} disabled={pending} className="btn-primary w-full sm:w-auto sm:px-6">
          {pending ? "Turning on…" : "Turn on alerts on this device"}
        </button>
      )}
      {state === "on" && (
        <div className="flex flex-wrap gap-2">
          {test && (
            <button
              type="button"
              onClick={() =>
                start(async () => {
                  await sendTestPush();
                  setTested(true);
                })
              }
              disabled={pending}
              className="btn-secondary px-5"
            >
              {tested ? "Test sent ✓" : "Send a test alert"}
            </button>
          )}
          <button type="button" onClick={turnOff} disabled={pending} className="btn-ghost text-sm">
            Turn off on this device
          </button>
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      {state !== "unsupported" && (
        <p className="text-xs text-muted">Turn it on on each phone or computer you want alerts on.</p>
      )}
    </section>
  );
}
