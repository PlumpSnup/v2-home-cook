"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { saveCookProfile, uploadPhoto } from "@/app/actions/cook";
import { CITIES } from "@/lib/cities";
import { CUISINES } from "@/lib/cuisines";
import { resizeImage } from "@/lib/image";
import type { Profile } from "@/lib/types";

type Props = { profile: Profile; onboarding?: boolean; stripeAvailable: boolean };

export function CookProfileForm({ profile, onboarding, stripeAvailable }: Props) {
  const [state, action, pending] = useActionState(saveCookProfile, {});
  const [etransfer, setEtransfer] = useState(profile.accepts_etransfer);
  const [delivery, setDelivery] = useState(profile.offers_delivery);

  return (
    <form action={action} className="space-y-6">
      {onboarding && <input type="hidden" name="onboarding" value="1" />}

      <section className="space-y-4">
        <Field label="Kitchen name" hint="This is what buyers see, e.g. “Auntie Rosa’s Kitchen”">
          <input
            name="kitchen_name"
            className="input"
            required
            maxLength={60}
            defaultValue={profile.kitchen_name ?? (profile.full_name ? `${profile.full_name.split(" ")[0]}’s Kitchen` : "")}
          />
        </Field>
        <Field label="WhatsApp number" hint="Orders are sent to this number">
          <input name="whatsapp" type="tel" inputMode="tel" className="input" required placeholder="416 555 1234" defaultValue={profile.whatsapp ?? ""} />
        </Field>
        <CityField defaultValue={profile.area ?? ""} />
        <CuisineField defaultValue={profile.cuisines ?? []} />
        {!onboarding && <CoverField defaultValue={profile.cover_url} />}
        <Field label="About your cooking" hint="Optional">
          <textarea
            name="bio"
            className="input min-h-20"
            maxLength={300}
            placeholder="Homestyle Filipino food, cooked fresh every weekend."
            defaultValue={profile.bio ?? ""}
          />
        </Field>
      </section>

      <fieldset className="space-y-2">
        <legend className="label">How do you want to get paid?</legend>
        <Toggle name="accepts_cash" label="Cash" defaultChecked={profile.accepts_cash} />
        <Toggle
          name="accepts_etransfer"
          label="Interac e-Transfer"
          defaultChecked={profile.accepts_etransfer}
          onChange={setEtransfer}
        />
        {etransfer && (
          <input
            name="etransfer_email"
            type="email"
            className="input"
            placeholder="Email for e-Transfers"
            defaultValue={profile.etransfer_email ?? ""}
            required
          />
        )}
        {stripeAvailable && (
          <Toggle
            name="accepts_card"
            label="Credit / debit card"
            hint="Through Stripe — you’ll link your bank next"
            defaultChecked={profile.accepts_card}
          />
        )}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="label">How do buyers get their food?</legend>
        <Toggle name="offers_pickup" label="Pickup from my place" defaultChecked={profile.offers_pickup} />
        <Toggle name="offers_delivery" label="I deliver" defaultChecked={profile.offers_delivery} onChange={setDelivery} />
        {delivery && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Delivery fee $</span>
            <input
              name="delivery_fee"
              inputMode="decimal"
              className="input w-28"
              placeholder="0"
              defaultValue={profile.delivery_fee_cents ? (profile.delivery_fee_cents / 100).toFixed(2) : ""}
            />
          </div>
        )}
      </fieldset>

      {state.error && <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">{state.error}</p>}
      {state.ok && <p className="rounded-xl bg-sage-soft px-4 py-3 text-sm text-sage">Saved.</p>}

      <button type="submit" className="btn-primary w-full py-4 text-base" disabled={pending}>
        {pending ? "Saving…" : onboarding ? "Open my kitchen" : "Save"}
      </button>
    </form>
  );
}

const OTHER = "__other";

/** City dropdown, with an "Other" option for cities not on the list. */
function CityField({ defaultValue }: { defaultValue: string }) {
  const known = !defaultValue || CITIES.includes(defaultValue);
  const [choice, setChoice] = useState(known ? defaultValue : OTHER);
  const [other, setOther] = useState(known ? "" : defaultValue);
  const value = choice === OTHER ? other.trim() : choice;

  return (
    <div>
      <label htmlFor="city" className="label">
        City
      </label>
      <input type="hidden" name="area" value={value} />
      <div className="relative">
        <select
          id="city"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          className={`input cursor-pointer appearance-none pr-10 transition hover:border-muted ${choice ? "" : "text-muted"}`}
        >
          <option value="">Choose your city</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value={OTHER}>Other…</option>
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {choice === OTHER && (
        <input
          aria-label="Your city"
          className="input mt-2"
          maxLength={60}
          placeholder="Type your city"
          value={other}
          onChange={(e) => setOther(e.target.value)}
          required
        />
      )}
      <span className="mt-1 block text-xs text-muted">Optional — helps nearby buyers find you</span>
    </div>
  );
}

/** Cuisine chips (up to 5), with a box for one that isn't listed. */
function CuisineField({ defaultValue }: { defaultValue: string[] }) {
  const [selected, setSelected] = useState(defaultValue.filter((c) => CUISINES.includes(c)));
  const [other, setOther] = useState(defaultValue.find((c) => !CUISINES.includes(c)) ?? "");
  const full = selected.length + (other.trim() ? 1 : 0) >= 5;

  return (
    <fieldset>
      <legend className="label">What do you cook?</legend>
      <div className="flex flex-wrap gap-2">
        {CUISINES.map((c) => {
          const on = selected.includes(c);
          return (
            <label
              key={c}
              className={`raised cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium ${
                on ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-surface hover:border-muted hover:bg-press"
              } ${!on && full ? "pointer-events-none opacity-40" : ""}`}
            >
              <input
                type="checkbox"
                name="cuisines"
                value={c}
                checked={on}
                onChange={(e) => setSelected((s) => (e.target.checked ? [...s, c] : s.filter((x) => x !== c)))}
                className="sr-only"
              />
              {c}
            </label>
          );
        })}
      </div>
      <input
        name="cuisine_other"
        className="input mt-2"
        maxLength={30}
        placeholder="Something else? Type it here"
        value={other}
        onChange={(e) => setOther(e.target.value)}
      />
      <span className="mt-1 block text-xs text-muted">Pick up to 5. Buyers can filter kitchens by cuisine.</span>
    </fieldset>
  );
}

/** Optional cover photo for the storefront; without one, the best dish photo is used. */
function CoverField({ defaultValue }: { defaultValue: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("photo", await resizeImage(file, 1600), "cover.jpg");
      const result = await uploadPhoto(form);
      if (!result.url) throw new Error(result.error);
      setUrl(result.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="label">Cover photo</span>
      <input type="hidden" name="cover_url" value={url} />
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="pressable relative flex aspect-[3/1] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-surface hover:border-brand/40 hover:bg-brand-soft/30 active:scale-[0.99]"
      >
        {url ? (
          <Image src={url} alt="" fill sizes="600px" className="object-cover" />
        ) : (
          <span className="text-sm text-muted">Using your best dish photo · tap to upload your own</span>
        )}
        {uploading && <span className="absolute inset-0 flex items-center justify-center bg-surface/80 font-medium">Uploading…</span>}
      </button>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {url && (
        <button type="button" className="btn-ghost mt-1 text-sm" onClick={() => setUrl("")}>
          Use my best dish photo instead
        </button>
      )}
      {error && <p className="mt-1 text-sm text-brand-dark">{error}</p>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="raised flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 hover:border-brand/30 hover:bg-brand-soft/30">
      <span>
        <span className="block font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-brand"
      />
    </label>
  );
}
