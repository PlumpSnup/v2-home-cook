import Link from "next/link";
import { LogoMark } from "@/components/Header";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

const COLUMNS = [
  {
    title: "For cooks",
    links: [
      ["How it works", "/#how-it-works"],
      ["Try it", "/#try-it"],
      ["Open your kitchen", "/login?next=/cook"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-line">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-xl font-semibold">{APP_NAME}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">{APP_TAGLINE}.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-brand-dark">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto w-full max-w-5xl px-4 pb-8 text-xs text-muted">
        © {new Date().getFullYear()} {APP_NAME}. Made for home cooks.
      </p>
    </footer>
  );
}
