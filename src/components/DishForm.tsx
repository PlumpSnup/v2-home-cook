"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { saveDish, uploadPhoto } from "@/app/actions/cook";
import { CATEGORIES } from "@/lib/format";
import { resizeImage } from "@/lib/image";
import type { Dish } from "@/lib/types";

export function DishForm({ dish }: { dish?: Dish }) {
  const [state, action, pending] = useActionState(saveDish, {});
  const [photoUrl, setPhotoUrl] = useState(dish?.photo_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("photo", await resizeImage(file), "photo.jpg");
      const result = await uploadPhoto(form);
      if (!result.url) throw new Error(result.error);
      setPhotoUrl(result.url);
    } catch {
      setUploadError("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-5">
      {dish && <input type="hidden" name="id" value={dish.id} />}
      <input type="hidden" name="photo_url" value={photoUrl} />

      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className="pressable relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-surface hover:border-brand/40 hover:bg-brand-soft/30 active:scale-[0.99]"
      >
        {photoUrl ? (
          <Image src={photoUrl} alt="" fill sizes="600px" className="object-cover" />
        ) : (
          <span className="text-center text-muted">
            <span className="block text-3xl" aria-hidden>
              📷
            </span>
            <span className="mt-1 block font-medium text-ink">Add a photo</span>
            <span className="text-sm">Take one or pick from your gallery</span>
          </span>
        )}
        {uploading && <span className="absolute inset-0 flex items-center justify-center bg-surface/80 font-medium">Uploading…</span>}
        {photoUrl && !uploading && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-white">Change</span>
        )}
      </button>
      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
      {uploadError && <p className="text-sm text-brand-dark">{uploadError}</p>}

      <label className="block">
        <span className="label">Dish name</span>
        <input name="name" className="input" required maxLength={80} placeholder="Chicken biryani" defaultValue={dish?.name} />
      </label>

      <label className="block">
        <span className="label">Price (per plate)</span>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
          <input
            name="price"
            inputMode="decimal"
            className="input pl-8"
            required
            placeholder="15"
            defaultValue={dish ? (dish.price_cents / 100).toFixed(2) : ""}
          />
        </div>
      </label>

      <fieldset>
        <legend className="label">Category</legend>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.value}
              className="raised block cursor-pointer rounded-xl border border-line bg-surface px-4 py-3 text-center text-sm font-medium hover:border-brand/30 hover:bg-brand-soft/30 has-checked:border-brand has-checked:bg-brand-soft/60"
            >
              <input
                type="radio"
                name="category"
                value={c.value}
                defaultChecked={(dish?.category ?? "main") === c.value}
                className="sr-only"
              />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="label">
          Description <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          name="description"
          className="input min-h-20"
          maxLength={300}
          placeholder="Basmati rice, slow-cooked chicken, raita on the side. Serves 1."
          defaultValue={dish?.description ?? ""}
        />
      </label>

      {state.error && <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">{state.error}</p>}

      <button type="submit" className="btn-primary w-full py-4 text-base" disabled={pending || uploading}>
        {pending ? "Saving…" : dish ? "Save changes" : "Add to menu"}
      </button>
    </form>
  );
}
