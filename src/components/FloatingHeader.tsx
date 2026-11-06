"use client";

import { useEffect, useState } from "react";

/**
 * The top bar. Once the page is scrolled it lifts off into a narrower, rounded, floating bar. Its height
 * never changes, so nothing on the page jumps when it does.
 */
export function FloatingHeader({ children }: { children: React.ReactNode }) {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const update = () => setFloating(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 h-14 transition-colors duration-300 ${
        floating ? "border-b border-transparent px-2 sm:px-4" : "border-b border-line bg-cream/90 backdrop-blur"
      }`}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between transition-all duration-300 ${
          floating
            ? "mt-1.5 h-12 max-w-3xl rounded-full border border-line bg-surface/85 pl-3 pr-1.5 shadow-[0_12px_30px_rgb(43_43_43/0.12)] backdrop-blur"
            : "h-14 max-w-5xl px-4"
        }`}
      >
        {children}
      </div>
    </header>
  );
}
