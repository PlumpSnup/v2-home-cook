import Image from "next/image";
import { Doodles } from "@/components/Decor";

/**
 * A photo on the home page. With `src` it shows the photo, cropped to fill the box. Without one
 * it shows a soft placeholder that says which photo belongs there, until a real one is added.
 * Give the box its size and corner radius through `className`. Use `tone="dark"` where white text
 * sits on top of the photo, so the placeholder keeps that text readable too.
 */
export function PhotoSlot({
  src,
  label,
  className = "",
  sizes = "(min-width: 768px) 400px, 90vw",
  priority,
  tone = "light",
}: {
  src?: string;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  // Positioned so the photo can fill it; callers may place it absolutely instead.
  const position = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative";
  return (
    <div className={`${position} overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={label} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          className={`absolute inset-0 flex flex-col gap-2 p-4 ${
            dark
              ? "bg-gradient-to-br from-brand-darker to-ink text-white/70"
              : "items-center justify-center bg-gradient-to-br from-brand-soft to-sage-soft text-center text-brand-dark/70"
          }`}
        >
          <Doodles className={dark ? "text-white/5" : "text-brand/10"} />
          <svg
            viewBox="0 0 24 24"
            className="relative h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          </svg>
          <span className="relative max-w-[12rem] text-xs font-medium">Photo: {label}</span>
        </div>
      )}
    </div>
  );
}
