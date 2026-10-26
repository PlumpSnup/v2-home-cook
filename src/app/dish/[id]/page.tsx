import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { CookBadges } from "@/components/CookBadges";
import { DishPhoto } from "@/components/DishCard";
import { AddToCart } from "@/components/cart/AddToCart";
import { kitchenName } from "@/lib/cook";
import { categoryLabel, money, whatsappLink } from "@/lib/format";
import { getDish, getProfile } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const dish = await getDish(id);
  if (!dish) return null;
  const cook = await getProfile(dish.cook_id);
  if (!cook?.is_cook) return null;
  return { dish, cook };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).id);
  if (!data) return {};
  const { dish, cook } = data;
  return {
    title: `${dish.name} by ${kitchenName(cook)}`,
    description: dish.description ?? undefined,
    openGraph: { images: dish.photo_url ? [dish.photo_url] : undefined },
  };
}

export default async function DishPage({ params }: Props) {
  const data = await load((await params).id);
  if (!data) notFound();
  const { dish, cook } = data;
  const name = kitchenName(cook);

  return (
    <div className="-mx-4 sm:mx-auto sm:max-w-3xl sm:pt-5">
      <DishPhoto dish={dish} className="aspect-[4/3] sm:rounded-2xl" />

      <div className="space-y-6 px-4 pt-5 sm:px-0">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{categoryLabel(dish.category)}</p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-semibold leading-tight">{dish.name}</h1>
            <span className="text-xl font-semibold text-brand">{money(dish.price_cents)}</span>
          </div>
          {dish.description && <p className="mt-2 text-muted">{dish.description}</p>}
        </div>

        <Link href={`/c/${cook.slug}`} className="card listing flex items-center gap-3 p-3">
          <Avatar src={cook.avatar_url} name={name} size={44} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{name}</p>
            <p className="truncate text-sm text-muted">{cook.area ?? "See full menu"}</p>
          </div>
          <span className="text-sm font-medium text-brand">Menu →</span>
        </Link>

        <CookBadges cook={cook} />

        {dish.available && cook.slug ? (
          <AddToCart kitchen={{ id: cook.id, slug: cook.slug, name }} dish={{ id: dish.id, name: dish.name, priceCents: dish.price_cents }} size="lg" />
        ) : (
          <p className="card p-4 text-center text-muted">This dish isn’t available right now.</p>
        )}

        {cook.whatsapp && (
          <a
            href={whatsappLink(cook.whatsapp, `Hi ${name}! I have a question about your ${dish.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm font-medium text-muted underline underline-offset-4"
          >
            Questions? Message {name} on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
