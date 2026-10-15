import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { CookBadges } from "@/components/CookBadges";
import { DishGrid } from "@/components/DishCard";
import { ShareButton } from "@/components/ShareButton";
import { kitchenName } from "@/lib/cook";
import { CATEGORIES, siteUrl, whatsappLink } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Dish, Profile } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const supabase = await createClient();
  const { data: cook } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_cook", true)
    .maybeSingle<Profile>();
  if (!cook) return null;
  const { data: dishes } = await supabase
    .from("dishes")
    .select("*")
    .eq("cook_id", cook.id)
    .order("available", { ascending: false })
    .order("created_at", { ascending: false });
  return { cook, dishes: (dishes ?? []) as Dish[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return {};
  const name = kitchenName(data.cook);
  const photo = data.dishes.find((d) => d.photo_url)?.photo_url;
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

  const sections = CATEGORIES.map((c) => ({ ...c, dishes: dishes.filter((d) => d.category === c.value) })).filter(
    (s) => s.dishes.length > 0,
  );

  return (
    <div className="space-y-6 pt-6">
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar src={cook.avatar_url} name={name} size={72} />
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold leading-tight">{name}</h1>
            {cook.area && <p className="text-muted">{cook.area}</p>}
          </div>
        </div>
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
      </section>

      {sections.length === 0 && <p className="card p-6 text-center text-muted">No dishes on the menu yet.</p>}

      {sections.map((s) => (
        <section key={s.value}>
          <h2 className="mb-3 font-display text-lg font-semibold">{s.label}</h2>
          <DishGrid dishes={s.dishes} showCook={false} />
        </section>
      ))}
    </div>
  );
}
