"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/** A dish's photos: swipe (or tap the thumbnails) to move between them. */
export function DishGallery({ photos, name, className = "" }: { photos: string[]; name: string; className?: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  function show(i: number) {
    const el = strip.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={strip}
        onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className={`flex snap-x snap-mandatory overflow-x-auto bg-brand-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {photos.map((url, i) => (
          <div key={url} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={url}
              alt={i === 0 ? name : `${name}, photo ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 px-4 sm:px-0">
        {photos.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => show(i)}
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === current}
            className={`relative h-14 w-14 overflow-hidden rounded-lg border-2 transition ${
              i === current ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={url} alt="" fill sizes="56px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
