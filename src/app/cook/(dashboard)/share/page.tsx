import type { Metadata } from "next";
import { QrDownload } from "@/components/QrDownload";
import { CopyLink, ShareButton } from "@/components/ShareButton";
import { requireCook } from "@/lib/auth";
import { kitchenName } from "@/lib/cook";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = { title: "Share your menu" };

export default async function SharePage() {
  const cook = await requireCook();
  const url = `${siteUrl()}/c/${cook.slug}`;
  const name = kitchenName(cook);
  const message = `🍲 ${name} is now taking orders! See my menu and order here: ${url}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Share your menu</h1>
        <p className="mt-1 text-muted">One link for everything you cook. Post it anywhere.</p>
      </div>

      <CopyLink url={url} />

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          WhatsApp
        </a>
        <ShareButton url={url} title={`${name} — order home-cooked food`} className="btn-secondary" />
      </div>

      <section className="card space-y-3 p-4">
        <h2 className="font-semibold">Instagram</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>
            <strong className="text-ink">Bio:</strong> Edit profile → Links → paste your link.
          </li>
          <li>
            <strong className="text-ink">Story:</strong> add a Link sticker with your link, or post the QR code below.
          </li>
        </ol>
      </section>

      <section className="card flex flex-col items-center gap-3 p-6">
        <h2 className="font-semibold">Your QR code</h2>
        <p className="text-center text-sm text-muted">Print it for your door or fridge, or post it to your story.</p>
        <QrDownload url={url} fileName={`${cook.slug}-menu-qr.png`} />
      </section>

      <section className="card space-y-2 p-4">
        <h2 className="font-semibold">Ready-made message</h2>
        <p className="rounded-xl bg-cream p-3 text-sm">{message}</p>
      </section>
    </div>
  );
}
