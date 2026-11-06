import Link from "next/link";
import { ClayBowl, ClayChili, ClayLemon, ClayPea, ClayTomato } from "@/components/Clay";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl pt-12 text-center sm:pt-16">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">This page went off the menu</h1>

      {/* A floating bowl with ingredients drifting around it. */}
      <div className="relative mx-auto my-6 h-72 w-full max-w-md">
        <ClayBowl className="absolute left-1/2 top-1/2 h-40 w-52 -translate-x-1/2 -translate-y-1/2" />
        <ClayTomato className="absolute right-4 top-0 h-24 w-24" delay={1} />
        <ClayLemon className="absolute bottom-4 left-2 h-14 w-20" delay={2} />
        <ClayPea className="absolute left-10 top-6 h-12 w-12" delay={0.5} />
        <ClayPea className="absolute bottom-0 right-16 h-9 w-9" delay={2.6} />
        <ClayChili className="absolute right-0 bottom-14 h-12 w-20" delay={3.2} />
      </div>

      <p className="text-muted">We couldn’t find that page. It may have moved, or the link is out of date.</p>
      <Link href="/" className="btn-primary mt-6 px-6">
        Back to home
      </Link>
    </div>
  );
}
