"use server";

import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendPush } from "@/lib/push";

type Subscription = { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };

/** Saves this browser so the signed-in person gets order alerts on it. */
export async function savePushSubscription(sub: Subscription) {
  const userId = await currentUserId();
  if (!userId) return { error: "Please sign in first." };
  const endpoint = String(sub?.endpoint ?? "");
  const p256dh = String(sub?.keys?.p256dh ?? "");
  const auth = String(sub?.keys?.auth ?? "");
  if (!endpoint.startsWith("https://") || endpoint.length > 1000 || !p256dh || !auth) {
    return { error: "This browser didn't give a valid subscription." };
  }
  const sql = await db();
  await sql`
    insert into push_subscriptions (profile_id, endpoint, p256dh, auth)
    values (${userId}, ${endpoint}, ${p256dh.slice(0, 200)}, ${auth.slice(0, 100)})
    on conflict (endpoint) do update set profile_id = excluded.profile_id, p256dh = excluded.p256dh, auth = excluded.auth`;
  return { ok: true };
}

/** Stops order alerts on this browser. */
export async function removePushSubscription(endpoint: string) {
  const userId = await currentUserId();
  if (!userId) return;
  const sql = await db();
  await sql`delete from push_subscriptions where endpoint = ${String(endpoint)} and profile_id = ${userId}`;
}

/** Sends a test alert to the signed-in person's browsers. */
export async function sendTestPush() {
  const userId = await currentUserId();
  if (!userId) return;
  await sendPush(userId, {
    title: "Order alerts are on 🔔",
    body: "This is how you'll hear about new orders.",
    url: "/cook/orders",
    tag: "test",
  });
}
