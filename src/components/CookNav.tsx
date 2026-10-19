"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/cook", label: "Home" },
  { href: "/cook/orders", label: "Orders" },
  { href: "/cook/menu", label: "Menu" },
  { href: "/cook/sales", label: "Sales" },
  { href: "/cook/share", label: "Share" },
  { href: "/cook/settings", label: "Settings" },
];

export function CookNav() {
  const path = usePathname();
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 [scrollbar-width:none]">
      {TABS.map((t) => {
        const active = t.href === "/cook" ? path === "/cook" : path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`pressable shrink-0 rounded-t-lg border-b-2 px-3 py-2.5 text-sm font-medium ${
              active ? "border-brand text-ink" : "border-transparent text-muted hover:bg-press hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
