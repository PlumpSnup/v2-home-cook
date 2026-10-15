import type { Category, PaymentMethod } from "./types";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "main", label: "Main Meals" },
  { value: "appetizer", label: "Appetizers" },
  { value: "soup", label: "Soups" },
  { value: "dessert", label: "Desserts" },
];

export const categoryLabel = (c: Category) =>
  CATEGORIES.find((x) => x.value === c)?.label ?? c;

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  etransfer: "e-Transfer",
  card: "Card",
};

export function money(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

/** "12.50" → 1250. Returns null for anything that isn't a positive amount. */
export function parseMoney(input: string): number | null {
  const value = Number(input.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100);
}

/** Normalises a phone number to WhatsApp's digits-only format, assuming North America for 10 digits. */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  return digits.length === 10 ? `1${digits}` : digits;
}

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
