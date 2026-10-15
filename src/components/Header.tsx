import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { APP_NAME } from "@/lib/brand";

export async function Header() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl font-semibold text-brand">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {profile?.is_cook ? (
            <Link href="/cook" className="btn-secondary px-4 py-2">
              My kitchen
            </Link>
          ) : (
            <Link href={profile ? "/cook/onboarding" : "/login?next=/cook"} className="btn-secondary px-4 py-2">
              Sell your food
            </Link>
          )}
          {profile ? (
            <Link href="/orders" className="px-2 py-2 font-medium text-muted hover:text-ink">
              Orders
            </Link>
          ) : (
            <Link href="/login" className="px-2 py-2 font-medium text-muted hover:text-ink">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
