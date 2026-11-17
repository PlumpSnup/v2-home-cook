import "server-only";
import { createECDH, hkdfSync } from "crypto";
import webpush from "web-push";
import { db } from "./db";
import { siteUrl } from "./format";

/*
 * Web push notifications (order alerts). Each browser that turns alerts on is saved in
 * push_subscriptions; sendPush delivers a notification to every saved browser of one person.
 *
 * Sending needs a "VAPID" key pair. Rather than another secret to manage, it is derived from
 * AUTH_SECRET, so it is stable across deploys. VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY override it.
 * Changing AUTH_SECRET changes the keys, and people would need to turn alerts on again.
 */

let keys: { publicKey: string; privateKey: string } | null = null;

function vapidKeys() {
  if (keys) return keys;
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    keys = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
    return keys;
  }
  const secret = (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
  const privateKey = Buffer.from(hkdfSync("sha256", secret, "homecook-vapid", "web-push v1", 32));
  const ecdh = createECDH("prime256v1");
  ecdh.setPrivateKey(privateKey);
  keys = { publicKey: ecdh.getPublicKey().toString("base64url"), privateKey: privateKey.toString("base64url") };
  return keys;
}

/** The public half of the key pair; browsers need it to subscribe. */
export function vapidPublicKey() {
  return vapidKeys().publicKey;
}

export type PushMessage = { title: string; body: string; url: string; tag?: string };

/** Sends a notification to every browser this person turned alerts on in. Never throws. */
export async function sendPush(profileId: string | null | undefined, message: PushMessage) {
  if (!profileId) return;
  try {
    const sql = await db();
    const subs = await sql<{ endpoint: string; p256dh: string; auth: string }[]>`
      select endpoint, p256dh, auth from push_subscriptions where profile_id = ${profileId}`;
    if (subs.length === 0) return;

    const { publicKey, privateKey } = vapidKeys();
    const site = siteUrl();
    const subject = site.startsWith("https://") ? site : "mailto:alerts@example.com";
    const payload = JSON.stringify(message);

    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, {
            vapidDetails: { subject, publicKey, privateKey },
            TTL: 60 * 60 * 24,
            urgency: "high",
          });
        } catch (error) {
          // 404/410: the browser unsubscribed or the subscription expired, so forget it.
          const status = (error as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410)
            await sql`delete from push_subscriptions where endpoint = ${s.endpoint}`;
        }
      }),
    );
  } catch {
    // Alerts are a nice extra; never let them break placing or updating an order.
  }
}

type OrderSummary = { id: string; cook_id: string; buyer_name: string; dish_name: string; fulfillment: string };

/** "New order" alert to the cook. */
export async function notifyCookOfOrder(order: OrderSummary) {
  await sendPush(order.cook_id, {
    title: "New order 🎉",
    body: `${order.buyer_name.split(" ")[0]}: ${order.dish_name} · ${order.fulfillment === "delivery" ? "Delivery" : "Pickup"}`,
    url: "/cook/orders",
    tag: `order-${order.id}`,
  });
}

const STATUS_ALERTS: Record<string, (kitchen: string) => string> = {
  confirmed: (kitchen) => `${kitchen} confirmed your order 👍`,
  completed: (kitchen) => `Your order from ${kitchen} is complete. Enjoy! 🍽️`,
  cancelled: (kitchen) => `${kitchen} cancelled your order`,
};

/** Tells the buyer (if signed in, with alerts on) that the cook changed their order's status. */
export async function notifyBuyerOfStatus(
  order: { id: string; buyer_id: string | null; dish_name: string },
  status: string,
  kitchen: string,
) {
  const title = STATUS_ALERTS[status]?.(kitchen);
  if (!title || !order.buyer_id) return;
  await sendPush(order.buyer_id, { title, body: order.dish_name, url: `/order/${order.id}`, tag: `order-${order.id}` });
}
