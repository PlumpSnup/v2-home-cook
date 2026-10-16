"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizePhone, parseMoney, slugify } from "@/lib/format";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { isUuid } from "@/lib/queries";
import { isOwnPhoto, savePhoto } from "@/lib/storage";
import type { Category, OrderStatus } from "@/lib/types";

export type FormState = { error?: string; ok?: boolean };

async function currentUser() {
  const id = await currentUserId();
  if (!id) redirect("/login?next=/cook");
  return { sql: await db(), userId: id };
}

// Profile -----------------------------------------------------------------

export async function saveCookProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const { sql, userId } = await currentUser();
  const isOnboarding = form.get("onboarding") === "1";

  const kitchenName = String(form.get("kitchen_name") ?? "").trim().slice(0, 60);
  const area = String(form.get("area") ?? "").trim().slice(0, 60);
  const whatsapp = normalizePhone(String(form.get("whatsapp") ?? ""));
  const bio = String(form.get("bio") ?? "").trim().slice(0, 300) || null;
  const acceptsCash = form.get("accepts_cash") === "on";
  const acceptsEtransfer = form.get("accepts_etransfer") === "on";
  const acceptsCard = form.get("accepts_card") === "on";
  const etransferEmail = String(form.get("etransfer_email") ?? "").trim() || null;
  const offersPickup = form.get("offers_pickup") === "on";
  const offersDelivery = form.get("offers_delivery") === "on";
  const deliveryFeeInput = String(form.get("delivery_fee") ?? "").trim();
  const deliveryFee = deliveryFeeInput ? parseMoney(deliveryFeeInput) : 0;

  if (!kitchenName) return { error: "Give your kitchen a name." };
  if (whatsapp.length < 10) return { error: "Add your WhatsApp number so buyers can reach you." };
  if (!acceptsCash && !acceptsEtransfer && !acceptsCard) return { error: "Choose at least one way to get paid." };
  if (acceptsEtransfer && !etransferEmail?.includes("@")) return { error: "Add the email you receive e-Transfers on." };
  if (!offersPickup && !offersDelivery) return { error: "Choose pickup, delivery or both." };
  if (deliveryFee === null) return { error: "Delivery fee should be a number, like 5 or 4.50." };

  const [existing] = await sql<{ slug: string | null }[]>`select slug from profiles where id = ${userId}`;
  const slug = existing?.slug ?? (await uniqueSlug(sql, kitchenName));

  try {
    await sql`
      update profiles set ${sql({
        is_cook: true,
        slug,
        kitchen_name: kitchenName,
        area: area || null,
        whatsapp,
        bio,
        accepts_cash: acceptsCash,
        accepts_etransfer: acceptsEtransfer,
        accepts_card: acceptsCard,
        etransfer_email: etransferEmail,
        offers_pickup: offersPickup,
        offers_delivery: offersDelivery,
        delivery_fee_cents: offersDelivery ? deliveryFee : 0,
      })}
      where id = ${userId}`;
  } catch {
    return { error: "Couldn’t save. Please try again." };
  }

  revalidatePath("/", "layout");
  if (isOnboarding) redirect(acceptsCard ? "/cook/settings?welcome=1" : "/cook/menu/new?welcome=1");
  return { ok: true };
}

async function uniqueSlug(sql: Awaited<ReturnType<typeof db>>, name: string) {
  const base = slugify(name) || "kitchen";
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const [taken] = await sql`select 1 from profiles where slug = ${candidate}`;
    if (!taken) return candidate;
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`;
}

// Dishes ------------------------------------------------------------------

const CATEGORY_VALUES: Category[] = ["main", "appetizer", "soup", "dessert"];

export async function uploadDishPhoto(form: FormData): Promise<{ url?: string; error?: string }> {
  const { userId } = await currentUser();
  const file = form.get("photo");
  if (!(file instanceof Blob) || file.size === 0) return { error: "No photo received." };
  if (file.size > 1_500_000) return { error: "That photo is too large." };
  try {
    return { url: await savePhoto(userId, file) };
  } catch {
    return { error: "Photo upload failed. Please try again." };
  }
}

export async function saveDish(_prev: FormState, form: FormData): Promise<FormState> {
  const { sql, userId } = await currentUser();
  const id = String(form.get("id") ?? "") || null;
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const description = String(form.get("description") ?? "").trim().slice(0, 300) || null;
  const category = String(form.get("category") ?? "") as Category;
  const price = parseMoney(String(form.get("price") ?? ""));
  const photoUrl = String(form.get("photo_url") ?? "") || null;

  if (!name) return { error: "What’s the dish called?" };
  if (!CATEGORY_VALUES.includes(category)) return { error: "Pick a category." };
  if (!price) return { error: "Add a price, like 15 or 12.50." };
  if (photoUrl && !isOwnPhoto(photoUrl, userId)) return { error: "Please upload the photo again." };
  if (id && !isUuid(id)) return { error: "Couldn’t find that dish." };

  const [cook] = await sql`select 1 from profiles where id = ${userId} and is_cook`;
  if (!cook) redirect("/cook/onboarding");

  const values = { name, description, category, price_cents: price, photo_url: photoUrl };
  try {
    if (id) await sql`update dishes set ${sql(values)} where id = ${id} and cook_id = ${userId}`;
    else await sql`insert into dishes ${sql({ ...values, cook_id: userId })}`;
  } catch {
    return { error: "Couldn’t save the dish. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect(id ? "/cook/menu" : "/cook/menu?added=1");
}

export async function setDishAvailable(id: string, available: boolean) {
  const { sql, userId } = await currentUser();
  if (!isUuid(id)) return;
  await sql`update dishes set available = ${available === true} where id = ${id} and cook_id = ${userId}`;
  revalidatePath("/", "layout");
}

export async function deleteDish(id: string) {
  const { sql, userId } = await currentUser();
  if (isUuid(id)) await sql`delete from dishes where id = ${id} and cook_id = ${userId}`;
  revalidatePath("/", "layout");
  redirect("/cook/menu");
}

// Orders ------------------------------------------------------------------

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export async function updateOrder(id: string, change: { status?: OrderStatus; paid?: boolean }) {
  const { sql, userId } = await currentUser();
  if (!isUuid(id)) return;
  const values: Record<string, string | boolean | null> = {};
  if (change.status && ORDER_STATUSES.includes(change.status)) {
    values.status = change.status;
    values.completed_at = change.status === "completed" ? new Date().toISOString() : null;
    // Completing an order means the cook has been paid.
    if (change.status === "completed") values.paid = true;
  }
  if (typeof change.paid === "boolean") values.paid = change.paid;
  if (Object.keys(values).length === 0) return;
  await sql`update orders set ${sql(values)} where id = ${id} and cook_id = ${userId}`;
  revalidatePath("/cook", "layout");
}
