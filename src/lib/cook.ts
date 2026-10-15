import { stripeEnabled } from "./stripe";
import type { Fulfillment, PaymentMethod, Profile } from "./types";

export function acceptedPayments(cook: Profile): PaymentMethod[] {
  const list: PaymentMethod[] = [];
  if (cook.accepts_card && cook.stripe_charges_enabled && stripeEnabled) list.push("card");
  if (cook.accepts_etransfer) list.push("etransfer");
  if (cook.accepts_cash) list.push("cash");
  return list;
}

export function fulfillmentOptions(cook: Profile): Fulfillment[] {
  const list: Fulfillment[] = [];
  if (cook.offers_pickup) list.push("pickup");
  if (cook.offers_delivery) list.push("delivery");
  return list;
}

export function kitchenName(cook: Pick<Profile, "kitchen_name" | "full_name">) {
  return cook.kitchen_name || cook.full_name || "Home kitchen";
}
