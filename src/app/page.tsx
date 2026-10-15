import Link from "next/link";
import { CategoryTabs } from "@/components/CategoryTabs";
import { DishGrid } from "@/components/DishCard";
import { SearchBar } from "@/components/SearchBar";
import { CATEGORIES, categoryLabel } from "@/lib/format";
import { searchDishes } from "@/lib/queries";
import type { Category } from "@/lib/types";

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function Home({ searchParams }: Props) {
  const { q, category: rawCategory } = await searchParams;
  const category = CATEGORIES.some((c) => c.value === rawCategory) ? (rawCategory as Category) : undefined;
  const dishes = await searchDishes({ q, category });
  const isFiltering = Boolean(q || category);

  return (
    <div className="space-y-5 pt-5">
      {!isFiltering && (
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
        <SearchBar defaultValue={q} category={category} />
        <CategoryTabs active={category} q={q} />
      </div>

      {isFiltering && (
        <p className="text-sm text-muted">
          {dishes.length} {dishes.length === 1 ? "dish" : "dishes"}
          {q ? ` for “${q}”` : ""}
          {category ? ` in ${categoryLabel(category)}` : ""}
        </p>
      )}

      {dishes.length > 0 ? (
        <DishGrid dishes={dishes} />
      ) : (
        <div className="card p-8 text-center">
          <p className="text-3xl" aria-hidden>
            🥘
          </p>
          <p className="mt-2 font-medium">No dishes found</p>
          <p className="mt-1 text-sm text-muted">
            {isFiltering ? "Try another search or category." : "Cooks are getting their kitchens ready."}
          </p>
          {isFiltering && (
            <Link href="/" className="btn-secondary mt-4">
              See all dishes
            </Link>
          )}
        </div>
      )}

      <section className="card mt-8 flex items-center justify-between gap-4 bg-brand-soft p-5">
        <div>
          <p className="font-display text-lg font-semibold">Cook at home?</p>
          <p className="text-sm text-muted">List your dishes in minutes and share your menu.</p>
        </div>
        <Link href="/login?next=/cook" className="btn-primary shrink-0">
          Start selling
        </Link>
      </section>
    </div>
  );
}
