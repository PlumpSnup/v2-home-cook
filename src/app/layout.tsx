import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { missingEnv } from "@/lib/env";
import { siteUrl } from "@/lib/format";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${APP_NAME} — ${APP_TAGLINE}`, template: `%s · ${APP_NAME}` },
  description: APP_TAGLINE,
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const missing = missingEnv();
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        {missing.length > 0 ? (
          <SetupNeeded missing={missing} />
        ) : (
          <>
            <Header />
            <main className="mx-auto w-full max-w-3xl px-4 pb-16">{children}</main>
          </>
        )}
      </body>
    </html>
  );
}

function SetupNeeded({ missing }: { missing: string[] }) {
  return (
    <main className="mx-auto max-w-md px-4 pt-20">
      <h1 className="font-display text-2xl font-semibold">Almost there — setup needed</h1>
      <p className="mt-2 text-muted">
        {APP_NAME} can’t connect to its database yet. Add these environment variables (on Vercel: Settings → Environment
        Variables), then redeploy:
      </p>
      <ul className="card mt-4 divide-y divide-line font-mono text-sm">
        {missing.map((name) => (
          <li key={name} className="px-4 py-3">
            {name}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">Find the values in Supabase → Project Settings → API.</p>
    </main>
  );
}
