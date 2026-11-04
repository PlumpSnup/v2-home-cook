"use client";

import { type ComponentProps, useEffect, useRef } from "react";

/**
 * Fades its content out and lets it drift up as the page scrolls down, fully gone after about
 * two-thirds of a screen. Meant for the first thing on the page. Stays put for people who reduce motion.
 */
export function ScrollFade(props: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.66)));
      el.style.opacity = String(1 - progress);
      el.style.transform = progress ? `translateY(${-progress * 40}px)` : "";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} {...props} />;
}
