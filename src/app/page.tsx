import Link from "next/link";
import { Suspense } from "react";
import { CityFilter, CuisineChips } from "@/components/KitchenFilters";
import { KitchenCard } from "@/components/KitchenCard";
import { SearchBar } from "@/components/SearchBar";
import { getKitchenFilters, searchKitchens } from "@/lib/queries";

type Props = { searchParams: Promise<{ q?: string; city?: string; cuisine?: string }> };

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const filters = await getKitchenFilters();
  const city = params.city && filters.cities.includes(params.city) ? params.city : undefined;
  const cuisine = params.cuisine && filters.cuisines.includes(params.cuisine) ? params.cuisine : undefined;
  const kitchens = await searchKitchens({ q, city, cuisine });
  const isFiltering = Boolean(q || city || cuisine);

  return (
    <div className="space-y-5 pt-5">
      {!q && (
        <section className="pt-2">
          <h1 className="font-display text-3xl font-semibold leading-tight">
            Food that tastes
            <br />
            like <span className="text-brand">home.</span>
          </h1>
          <p className="mt-2 text-muted">Order straight from home cooks near you.</p>
        </section>
      )}

      <div className="sticky top-14 z-10 -mx-4 space-y-3 bg-cream/95 px-4 py-2 backdrop-blur">
        <div className="flex gap-2">
          <SearchBar defaultValue={q} keep={{ city: params.city, cuisine }} />
          <Suspense>
            <CityFilter cities={filters.cities} />
          </Suspense>
        </div>
        <Suspense>
          <CuisineChips cuisines={filters.cuisines} />
        </Suspense>
      </div>

      {isFiltering && (
        <p className="text-sm text-muted">
          {kitchens.length} {kitchens.length === 1 ? "kitchen" : "kitchens"}
          {q ? ` with “${q}”` : ""}
          {cuisine ? ` · ${cuisine}` : ""}
          {city ? ` in ${city}` : ""}
        </p>
      )}

      {kitchens.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kitchens.map((k) => (
            <KitchenCard key={k.id} kitchen={k} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-3xl" aria-hidden>
            🥘
          </p>
          <p className="mt-2 font-medium">{isFiltering ? "No kitchens found" : "No kitchens open yet"}</p>
          <p className="mt-1 text-sm text-muted">
            {isFiltering ? "Try another dish, cuisine or city." : "Cooks are getting their kitchens ready."}
          </p>
          {isFiltering && (
            <Link href="/?city=" className="btn-secondary mt-4">
              See all kitchens
            </Link>
          )}
        </div>
      )}

      <section className="card mt-8 flex items-center justify-between gap-4 bg-brand-soft p-5">
        <div>
          <p className="font-display text-lg font-semibold">Cook at home?</p>
          <p className="text-sm text-muted">Open your kitchen in minutes and share your menu.</p>
        </div>
        <Link href="/login?next=/cook" className="btn-primary shrink-0">
          Start selling
        </Link>
      </section>
    </div>
  );
}
