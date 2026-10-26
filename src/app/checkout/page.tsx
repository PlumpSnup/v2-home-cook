import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getCurrentProfile } from "@/lib/auth";
import { acceptedPayments, fulfillmentOptions, kitchenName } from "@/lib/cook";
import { getCookBySlug, getCookDishes } from "@/lib/queries";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

type Props = { searchParams: Promise<{ k?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const { k } = await searchParams;
  const cook = k ? await getCookBySlug(k) : null;
  if (!cook?.slug) notFound();

  const [dishes, viewer] = await Promise.all([getCookDishes(cook.id), getCurrentProfile()]);
  const name = kitchenName(cook);
  const menu = Object.fromEntries(
    dishes.map((d) => [d.id, { name: d.name, priceCents: d.price_cents, available: d.available }]),
  );

  return (
    <div className="mx-auto max-w-xl space-y-5 pt-6">
      <div>
        <p className="text-sm text-muted">Your order from</p>
        <h1 className="font-display text-2xl font-semibold">{name}</h1>
      </div>
      <CheckoutForm
        kitchen={{ id: cook.id, slug: cook.slug, name }}
        menu={menu}
        payments={acceptedPayments(cook)}
        fulfillments={fulfillmentOptions(cook)}
        deliveryFeeCents={cook.delivery_fee_cents}
        defaultName={viewer?.full_name ?? undefined}
      />
    </div>
  );
}
