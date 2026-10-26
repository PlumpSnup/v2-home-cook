/** Search box. `keep` carries the other filters (city, cuisine) through a new search. */
export function SearchBar({ defaultValue = "", keep = {} }: { defaultValue?: string; keep?: Record<string, string | undefined> }) {
  return (
    <form action="/" role="search" className="relative min-w-0 flex-1">
      {Object.entries(keep).map(([k, v]) => (v !== undefined ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search dishes…"
        className="input rounded-full pl-12"
        aria-label="Search dishes or kitchens"
      />
    </form>
  );
}
