import Link from "next/link";
import { CATEGORIES } from "@/lib/format";

export function CategoryTabs({ active, q, basePath = "/" }: { active?: string; q?: string; basePath?: string }) {
  const href = (category?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const s = params.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const tabs = [{ value: undefined, label: "All" }, ...CATEGORIES];

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {tabs.map((t) => {
        const isActive = (active ?? undefined) === t.value;
        return (
          <Link
            key={t.label}
            href={href(t.value)}
            scroll={false}
            className={`pressable shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              isActive ? "bg-ink text-white" : "border border-line bg-surface text-ink hover:border-muted hover:bg-press"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
