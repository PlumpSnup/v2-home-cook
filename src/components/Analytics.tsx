"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

/*
 * SimpleCook's custom analytics events (PostHog). Page views, location and device are recorded
 * automatically; these add the steps that matter: kitchen link opened → added to cart → checkout →
 * order placed, plus logins.
 */

type Props = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, properties?: Props) {
  if (posthog.__loaded) posthog.capture(event, properties);
}

/** Records `event` once when the page shows. With `onceKey`, never twice for that key on this device. */
export function TrackView({ event, properties, onceKey }: { event: string; properties?: Props; onceKey?: string }) {
  useEffect(() => {
    if (onceKey) {
      try {
        const key = `simplecook-tracked:${onceKey}`;
        if (localStorage.getItem(key)) return;
        localStorage.setItem(key, "1");
      } catch {
        // Private browsing without storage: record it anyway.
      }
    }
    track(event, properties);
    // Record once per page view, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, onceKey]);
  return null;
}

/**
 * Ties this browser's activity to the signed-in account (by database id, never email) and
 * records a "logged_in" event the first time it sees the account here.
 */
export function IdentifyUser({ id, isCook }: { id: string | null; isCook: boolean }) {
  useEffect(() => {
    if (!id || !posthog.__loaded) return;
    if (posthog.get_distinct_id() !== id) {
      posthog.identify(id, { is_cook: isCook });
      posthog.capture("logged_in", { is_cook: isCook });
    } else {
      posthog.setPersonProperties({ is_cook: isCook });
    }
  }, [id, isCook]);
  return null;
}
