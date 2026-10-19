import { SUPPORT_EMAIL } from "@/lib/brand";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl space-y-4 pt-8 text-[15px] leading-relaxed [&_h2]:pt-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <p className="text-sm text-muted">Last updated {updated}</p>
      {children}
      <h2>Contact</h2>
      <p>
        {SUPPORT_EMAIL ? (
          <>
            Questions? Email us at{" "}
            <a className="text-brand underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            .
          </>
        ) : (
          "Questions? Contact the HomeCook team through the support email shown on the Google sign-in screen."
        )}
      </p>
    </article>
  );
}
