import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { CookBadges } from "@/components/CookBadges";
import { MenuItem } from "@/components/DishCard";
import { ShareButton } from "@/components/ShareButton";
import { coverPhoto, kitchenName } from "@/lib/cook";
import { CATEGORIES, siteUrl, whatsappLink } from "@/lib/format";
import { getCookBySlug, getCookDishes } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const cook = await getCookBySlug(slug);
  if (!cook) return null;
  return { cook, dishes: await getCookDishes(cook.id) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return {};
  const name = kitchenName(data.cook);
  const photo = coverPhoto(data.cook, data.dishes);
  return {
    title: `${name} — menu`,
    description: data.cook.bio ?? `Order home-cooked food from ${name}.`,
    openGraph: { title: `${name} — order home-cooked food`, images: photo ? [photo] : undefined },
  };
}

export default async function Storefront({ params }: Props) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { cook, dishes } = data;
  const name = kitchenName(cook);
  const url = `${siteUrl()}/c/${slug}`;
  const cover = coverPhoto(cook, dishes);
  const cartKitchen = { id: cook.id, slug, name };

  const sections = CATEGORIES.map((c) => ({ ...c, dishes: dishes.filter((d) => d.category === c.value) })).filter(
    (s) => s.dishes.length > 0,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section>
        <div className="relative -mx-4 aspect-[3/1] overflow-hidden bg-brand-soft sm:mx-0 sm:mt-5 sm:rounded-2xl">
          {cover ? (
            <Image src={cover} alt="" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl" aria-hidden>
              🍲
            </div>
          )}
        </div>
        <div className="relative space-y-4 px-1">
          <div>
            <div className="-mt-10 inline-block rounded-full border-4 border-cream bg-cream">
              <Avatar src={cook.avatar_url} name={name} size={80} />
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold leading-tight">{name}</h1>
            {cook.area && <p className="text-muted">{cook.area}</p>}
          </div>
          {cook.cuisines.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cook.cuisines.map((c) => (
                <Link key={c} href={`/?cuisine=${encodeURIComponent(c)}`} className="chip pressable hover:bg-press hover:text-ink">
                  {c}
                </Link>
              ))}
            </div>
          )}
          {cook.bio && <p className="text-ink/80">{cook.bio}</p>}
          <CookBadges cook={cook} />
          <div className="flex gap-2">
            {cook.whatsapp && (
              <a
                href={whatsappLink(cook.whatsapp, `Hi ${name}! I found your menu on ${url}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1"
              >
                WhatsApp
              </a>
            )}
            <ShareButton url={url} title={`${name} — home-cooked food`} className="btn-secondary flex-1" />
          </div>
        </div>
      </section>

      {sections.length > 1 && (
        <nav className="sticky top-14 z-10 -mx-4 flex gap-2 overflow-x-auto bg-cream/95 px-4 py-2 backdrop-blur [scrollbar-width:none]">
          {sections.map((s) => (
            <a
              key={s.value}
              href={`#${s.value}`}
              className="pressable shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium hover:border-muted hover:bg-press"
            >
              {s.label}
            </a>
          ))}
        </nav>
      )}

      {sections.length === 0 && <p className="card p-6 text-center text-muted">No dishes on the menu yet.</p>}

      {sections.map((s) => (
        <section key={s.value} id={s.value} className="scroll-mt-32">
          <h2 className="mb-3 font-display text-lg font-semibold">{s.label}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {s.dishes.map((d) => (
              <MenuItem key={d.id} dish={d} kitchen={cartKitchen} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
