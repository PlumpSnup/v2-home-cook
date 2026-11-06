"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { saveDish, uploadPhoto } from "@/app/actions/cook";
import { CATEGORIES, MAX_DISH_PHOTOS } from "@/lib/format";
import { resizeImage } from "@/lib/image";
import type { Dish } from "@/lib/types";

export function DishForm({ dish }: { dish?: Dish }) {
  const [state, action, pending] = useActionState(saveDish, {});
  const [photos, setPhotos] = useState<string[]>(dish?.photo_urls?.length ? dish.photo_urls : dish?.photo_url ? [dish.photo_url] : []);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const room = MAX_DISH_PHOTOS - photos.length - uploading;

  async function onPhotos(files: File[]) {
    if (!files.length) return;
    const picked = files.slice(0, Math.max(0, room));
    setUploadError(files.length > picked.length ? `A dish can have up to ${MAX_DISH_PHOTOS} photos.` : "");
    setUploading((n) => n + picked.length);
    await Promise.all(
      picked.map(async (file) => {
        try {
          const form = new FormData();
          form.append("photo", await resizeImage(file), "photo.jpg");
          const result = await uploadPhoto(form);
          if (!result.url) throw new Error(result.error);
          setPhotos((list) => [...list, result.url!].slice(0, MAX_DISH_PHOTOS));
        } catch {
          setUploadError("A photo didn’t upload. Please try again.");
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
  }

  function remove(url: string) {
    setPhotos((list) => list.filter((u) => u !== url));
    setUploadError("");
  }
  const makeCover = (url: string) => setPhotos((list) => [url, ...list.filter((u) => u !== url)]);

  return (
    <form action={action} className="space-y-5">
      {dish && <input type="hidden" name="id" value={dish.id} />}
      {photos.map((url) => (
        <input key={url} type="hidden" name="photo_urls" value={url} />
      ))}

      <div>
        <div className="flex items-baseline justify-between">
          <span className="label">Photos</span>
          <span className="text-xs text-muted">
            {photos.length} of {MAX_DISH_PHOTOS}
          </span>
        </div>
        {photos.length === 0 && uploading === 0 ? (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="pressable flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface hover:border-brand/40 hover:bg-brand-soft/30 active:scale-[0.99]"
          >
            <span className="text-center text-muted">
              <span className="block text-3xl" aria-hidden>
                📷
              </span>
              <span className="mt-1 block font-medium text-ink">Add photos</span>
              <span className="text-sm">Up to {MAX_DISH_PHOTOS}. Take them or pick from your gallery</span>
            </span>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {photos.map((url, i) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-line bg-surface">
                <Image src={url} alt="" fill sizes="160px" className="object-cover" />
                {i === 0 ? (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] font-medium text-white">Cover</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeCover(url)}
                    className="absolute left-1.5 top-1.5 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-medium text-ink hover:bg-surface"
                  >
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  aria-label="Remove photo"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-sm leading-none text-white hover:bg-ink"
                >
                  ×
                </button>
              </div>
            ))}
            {Array.from({ length: uploading }, (_, i) => (
              <div key={`up-${i}`} className="flex aspect-square items-center justify-center rounded-xl border border-line bg-surface text-xs font-medium text-muted">
                Uploading…
              </div>
            ))}
            {room > 0 && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="pressable flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-surface text-muted hover:border-brand/40 hover:bg-brand-soft/30"
              >
                <span className="text-2xl leading-none" aria-hidden>
                  +
                </span>
                <span className="mt-1 text-xs font-medium">Add photo</span>
              </button>
            )}
          </div>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            onPhotos(Array.from(e.target.files ?? []));
            e.target.value = ""; // so picking the same photo again still triggers a change
          }}
        />
        {uploadError && <p className="mt-2 text-sm text-brand-dark">{uploadError}</p>}
      </div>

      <label className="block">
        <span className="label">Dish name</span>
        <input name="name" className="input" required maxLength={80} placeholder="Chicken biryani" defaultValue={dish?.name} />
      </label>

      <label className="block">
        <span className="label">Price</span>
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

      <button type="submit" className="btn-primary w-full py-4 text-base" disabled={pending || uploading > 0}>
        {pending ? "Saving…" : dish ? "Save changes" : "Add to menu"}
      </button>
    </form>
  );
}
