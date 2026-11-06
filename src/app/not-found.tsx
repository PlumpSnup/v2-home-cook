import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-20 text-center">
      <p className="text-4xl" aria-hidden>
        🍽️
      </p>
      <h1 className="mt-3 font-display text-2xl font-semibold">Nothing on this plate</h1>
      <p className="mt-1 text-muted">This page doesn’t exist or was taken off the menu.</p>
      <Link href="/" className="btn-primary mt-6">
        Browse dishes
      </Link>
    </div>
  );
}
