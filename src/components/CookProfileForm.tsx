"use client";

import { useActionState, useState } from "react";
import { saveCookProfile } from "@/app/actions/cook";
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
        <Field label="Neighbourhood or city" hint="Optional — helps nearby buyers find you">
          <input name="area" className="input" maxLength={60} placeholder="Scarborough, Toronto" defaultValue={profile.area ?? ""} />
        </Field>
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
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3">
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
