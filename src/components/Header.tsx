import Link from "next/link";
import { FloatingHeader } from "@/components/FloatingHeader";
import { getCurrentProfile } from "@/lib/auth";
import { APP_NAME } from "@/lib/brand";

export async function Header() {
  const profile = await getCurrentProfile();

  return (
    <FloatingHeader>
      <Link href="/" className="group flex items-center gap-2" aria-label={`${APP_NAME} home`}>
        <LogoMark />
        <span className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-brand-dark">
          {APP_NAME}
        </span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        {!profile ? (
          <Link href="/login?next=/cook" className="btn-primary px-4 py-2">
            Start for free
          </Link>
        ) : profile.is_cook ? (
          <Link href="/cook" className="btn-secondary px-4 py-2">
            My kitchen
          </Link>
        ) : (
          <Link href="/cook/onboarding" className="btn-secondary px-4 py-2">
            Sell your food
          </Link>
        )}
        {profile ? (
          <Link href="/orders" className="btn-ghost">
            Orders
          </Link>
        ) : (
          <Link href="/login" className="btn-ghost hover:not-active:transform-none">
            Log in
          </Link>
        )}
      </nav>
    </FloatingHeader>
  );
}

/** The logo: a steaming pot in a rounded green square. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`flex items-center justify-center rounded-xl bg-brand text-white ${className}`} aria-hidden>
      <svg
        viewBox="0 0 24 24"
        className="h-[62%] w-[62%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 3.5c-.8 1 .8 2-.1 3M12.5 3.5c-.8 1 .8 2-.1 3" />
        <path d="M4 10h16M5 10v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-6M2.5 12H5M19 12h2.5" />
      </svg>
    </span>
  );
}
