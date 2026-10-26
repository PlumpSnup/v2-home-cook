import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { kitchenName } from "@/lib/cook";
import { money } from "@/lib/format";
import type { KitchenCard as Kitchen } from "@/lib/types";

export function KitchenCard({ kitchen }: { kitchen: Kitchen }) {
  const name = kitchenName(kitchen);
  const href = `/c/${kitchen.slug}`;
  const details = [kitchen.area, kitchen.cuisines.slice(0, 2).join(" · ")].filter(Boolean).join(" · ");

  return (
    <article className="card listing group relative overflow-hidden">
      <div className="relative aspect-[16/9] bg-brand-soft">
        {kitchen.cover ? (
          <Image
            src={kitchen.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl" aria-hidden>
            🍲
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {kitchen.offers_pickup && <span className="chip border-0 bg-surface/95 text-ink">Pickup</span>}
          {kitchen.offers_delivery && <span className="chip border-0 bg-surface/95 text-ink">Delivery</span>}
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center gap-3">
          <Avatar src={kitchen.avatar_url} name={name} size={40} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg font-semibold leading-tight">
              {/* The whole card is clickable through this link. */}
              <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                {name}
              </Link>
            </h3>
            {details && <p className="truncate text-sm text-muted">{details}</p>}
          </div>
        </div>

        {kitchen.matches && kitchen.matches.length > 0 ? (
          <ul className="relative z-10 space-y-1 rounded-xl bg-cream p-2 text-sm">
            {kitchen.matches.map((d) => (
              <li key={d.id}>
                <Link href={`/dish/${d.id}`} data-nested className="pressable flex justify-between gap-2 rounded-lg px-2 py-1 hover:bg-brand-soft/60">
                  <span className="truncate font-medium">{d.name}</span>
                  <span className="shrink-0 text-muted">{money(d.price_cents)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="truncate text-sm text-muted">
            <span className="font-medium text-ink">Popular:</span> {kitchen.popular.map((d) => d.name).join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
