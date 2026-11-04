"use client";

import { type ComponentProps, useEffect, useRef, useState } from "react";

/**
 * Fades its `.reveal` children in one after another when it scrolls into view. Give each child
 * its place in the order with `--i`. Sections already on screen animate right after the page
 * loads. Without JavaScript the <noscript> rule in the root layout keeps everything visible.
 */
export function Reveal(props: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"hidden" | "shown">("hidden");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} data-reveal={state} {...props} />;
}
