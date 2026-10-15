"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizePhone, parseMoney, slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Category, OrderStatus } from "@/lib/types";

export type FormState = { error?: string; ok?: boolean };

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/cook");
  return { supabase, user };
}

// Profile -----------------------------------------------------------------

export async function saveCookProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase, user } = await currentUser();
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

  const { data: existing } = await supabase.from("profiles").select("slug").eq("id", user.id).single();
  const slug = existing?.slug ?? (await uniqueSlug(supabase, kitchenName));

  const { error } = await supabase
    .from("profiles")
    .update({
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
    })
    .eq("id", user.id);
  if (error) return { error: "Couldn’t save. Please try again." };

  revalidatePath("/", "layout");
  if (isOnboarding) redirect(acceptsCard ? "/cook/settings?welcome=1" : "/cook/menu/new?welcome=1");
  return { ok: true };
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, name: string) {
  const base = slugify(name) || "kitchen";
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const { data } = await supabase.from("profiles").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`;
}

// Dishes ------------------------------------------------------------------

const CATEGORY_VALUES: Category[] = ["main", "appetizer", "soup", "dessert"];

export async function saveDish(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase, user } = await currentUser();
  const id = String(form.get("id") ?? "") || null;
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const description = String(form.get("description") ?? "").trim().slice(0, 300) || null;
  const category = String(form.get("category") ?? "") as Category;
  const price = parseMoney(String(form.get("price") ?? ""));
  const photoUrl = String(form.get("photo_url") ?? "") || null;

  if (!name) return { error: "What’s the dish called?" };
  if (!CATEGORY_VALUES.includes(category)) return { error: "Pick a category." };
  if (!price) return { error: "Add a price, like 15 or 12.50." };
  const storagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dish-photos/${user.id}/`;
  if (photoUrl && !photoUrl.startsWith(storagePrefix)) return { error: "Please upload the photo again." };

  const values = { name, description, category, price_cents: price, photo_url: photoUrl };
  const { error } = id
    ? await supabase.from("dishes").update(values).eq("id", id).eq("cook_id", user.id)
    : await supabase.from("dishes").insert({ ...values, cook_id: user.id });
  if (error) return { error: "Couldn’t save the dish. Please try again." };

  revalidatePath("/", "layout");
  redirect(id ? "/cook/menu" : "/cook/menu?added=1");
}

export async function setDishAvailable(id: string, available: boolean) {
  const { supabase, user } = await currentUser();
  await supabase.from("dishes").update({ available }).eq("id", id).eq("cook_id", user.id);
  revalidatePath("/", "layout");
}

export async function deleteDish(id: string) {
  const { supabase, user } = await currentUser();
  await supabase.from("dishes").delete().eq("id", id).eq("cook_id", user.id);
  revalidatePath("/", "layout");
  redirect("/cook/menu");
}

// Orders ------------------------------------------------------------------

export async function updateOrder(id: string, change: { status?: OrderStatus; paid?: boolean }) {
  const { supabase, user } = await currentUser();
  const values: Record<string, unknown> = {};
  if (change.status) {
    values.status = change.status;
    values.completed_at = change.status === "completed" ? new Date().toISOString() : null;
    // Completing an order means the cook has been paid.
    if (change.status === "completed") values.paid = true;
  }
  if (change.paid !== undefined) values.paid = change.paid;
  await supabase.from("orders").update(values).eq("id", id).eq("cook_id", user.id);
  revalidatePath("/cook", "layout");
}
