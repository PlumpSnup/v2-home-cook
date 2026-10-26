"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const CITY_KEY = "homecook-city";

function hrefWith(params: URLSearchParams, key: string, value?: string) {
  const next = new URLSearchParams(params);
  if (value) next.set(key, value);
  else next.delete(key);
  const s = next.toString();
  return s ? `/?${s}` : "/";
}

/** City dropdown. Remembers the buyer's choice in their browser. */
export function CityFilter({ cities }: { cities: string[] }) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const city = params.get("city") ?? "";

  // Bring back the city the buyer picked last time.
  useEffect(() => {
    if (params.has("city")) return;
    try {
      const saved = localStorage.getItem(CITY_KEY);
      if (saved && cities.includes(saved)) router.replace(hrefWith(params, "city", saved), { scroll: false });
    } catch {}
  }, [cities, params, router]);

  if (path !== "/" || cities.length === 0) return null;

  return (
    <div className="relative shrink-0">
      <label htmlFor="city-filter" className="sr-only">
        City
      </label>
      <select
        id="city-filter"
        value={city}
        onChange={(e) => {
          const value = e.target.value;
          try {
            if (value) localStorage.setItem(CITY_KEY, value);
            else localStorage.removeItem(CITY_KEY);
          } catch {}
          // Keep the "?city=" key present even for "All cities" so the saved city isn't re-applied.
          const next = new URLSearchParams(params);
          next.set("city", value);
          router.push(`/?${next.toString()}`, { scroll: false });
        }}
        className="input h-full cursor-pointer appearance-none rounded-full py-3 pl-4 pr-9 text-sm font-medium transition hover:border-muted"
      >
        <option value="">All cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Cuisine chips under the search bar. */
export function CuisineChips({ cuisines }: { cuisines: string[] }) {
  const params = useSearchParams();
  const active = params.get("cuisine") ?? undefined;
  if (cuisines.length === 0) return null;

  const chips = [{ value: undefined, label: "All" }, ...cuisines.map((c) => ({ value: c, label: c }))];
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {chips.map((c) => {
        const isActive = active === c.value;
        return (
          <Link
            key={c.label}
            href={hrefWith(params, "cuisine", c.value)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`raised shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              isActive ? "bg-ink text-white" : "border border-line bg-surface text-ink hover:border-muted hover:bg-press"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}
