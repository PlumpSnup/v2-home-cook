import { useId } from "react";

/*
 * Hand-drawn decorations: wavy edges with a looping line, faint food doodles and round
 * outline icon badges. Everything draws in currentColor so it picks up the theme colours.
 */

// One wavy edge, left to right. The fill and the looping line share it; the line ties a loop at 620,70.
const EDGE = "C80,60 170,55 280,82 C400,112 520,100 620,70";
const EDGE_REST = "C760,28 900,30 1000,55 C1080,75 1150,60 1200,40";
const EDGE_REVERSED = "C1150,60 1080,75 1000,55 C900,30 760,28 620,70 C520,100 400,112 280,82 C170,55 80,60 0,90";

/**
 * Wavy bottom edge for a coloured panel. Place it straight after the panel and give it the
 * panel's colour as text colour; `line` sets the colour of the looping line along the edge.
 */
export function WaveEdge({ className = "", line }: { className?: string; line?: string }) {
  return (
    <svg viewBox="0 0 1200 130" className={`block h-auto w-full ${className}`} aria-hidden>
      <path d={`M0,0 H1200 V40 ${EDGE_REVERSED} Z`} fill="currentColor" />
      {line && (
        <path
          d={`M0,90 ${EDGE} C700,-20 540,-20 620,70 ${EDGE_REST}`}
          fill="none"
          stroke={line}
          strokeWidth="4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

/** Wavy top edge that sits over the bottom of a photo; its text colour should match the page. */
export function WaveOverlay({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 130" preserveAspectRatio="none" className={`block w-full ${className}`} aria-hidden>
      <path d={`M0,90 ${EDGE} ${EDGE_REST} V130 H0 Z`} fill="currentColor" />
    </svg>
  );
}

const DOODLES = {
  muffin: (
    <>
      <path d="M10 26 14 44H34L38 26" />
      <path d="M7 26C3 17 13 10 18 14 20 6 30 6 31 13 37 9 46 18 41 26Z" />
      <circle cx="24" cy="6" r="2.5" />
    </>
  ),
  bun: (
    <>
      <path d="M7 34C7 17 41 17 41 34Z" />
      <path d="M20 22 28 30M28 22 20 30" />
      <path d="M2 40H46" />
    </>
  ),
  bowl: (
    <>
      <path d="M6 24H42C42 36 34 42 24 42S6 36 6 24Z" />
      <path d="M18 18C14 14 22 10 18 6M28 18C24 14 32 10 28 6" />
    </>
  ),
  leaf: <path d="M10 38C10 18 26 8 40 8 40 26 28 38 10 38ZM10 38 28 20" />,
};

/** Faint line-drawn food scattered behind a section. Give it a low-contrast text colour. */
export function Doodles({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      <defs>
        <pattern id={id} width="220" height="200" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <g transform="translate(14 20) rotate(-12 24 24) scale(1.2)">{DOODLES.muffin}</g>
            <g transform="translate(130 40) rotate(10 24 24)">{DOODLES.bun}</g>
            <g transform="translate(60 120) rotate(8 24 24)">{DOODLES.bowl}</g>
            <g transform="translate(160 130) rotate(-20 24 24) scale(0.8)">{DOODLES.leaf}</g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

const ICONS = {
  wheat: "M12 21V9M12 13C9 13 7 11 7 8 10 8 12 10 12 13ZM12 13C15 13 17 11 17 8 14 8 12 10 12 13ZM12 9C9 9 7 7 7 4 10 4 12 6 12 9ZM12 9C15 9 17 7 17 4 14 4 12 6 12 9Z",
  leaf: "M5 19C5 10 11 5 19 5 19 13 14 19 5 19ZM5 19 13 11",
  heart: "M12 20C6 15 3 12 3 8.5 3 6 5 4 7.5 4 9.5 4 11 5.5 12 7 13 5.5 14.5 4 16.5 4 19 4 21 6 21 8.5 21 12 18 15 12 20Z",
  shop: "M4 10V20H20V10M3 10 5 4H19L21 10ZM3 10C3 12 6 12 6 10 6 12 9.5 12 9.5 10 9.5 12 14.5 12 14.5 10 14.5 12 18 12 18 10 18 12 21 12 21 10M10 20V15H14V20",
  bag: "M5 8H19L18 20H6ZM9 8C9 3 15 3 15 8",
  cash: "M3 7H21V17H3ZM12 14.5A2.5 2.5 0 1 0 12 9.5 2.5 2.5 0 0 0 12 14.5ZM6 10V14M18 10V14",
  chart: "M4 20H20M7 16V11M12 16V6M17 16V9",
};
export type IconName = keyof typeof ICONS;

/** A round outline badge with a line icon, like a stamp. Set the icon and border colours through className. */
export function IconBadge({ icon, className = "" }: { icon: IconName; className?: string }) {
  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={ICONS[icon]} />
      </svg>
    </span>
  );
}

/** A thick-lined bun on a plate with steam rising, for empty corners. */
export function BunIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M70 34C62 26 76 18 68 8M100 30C92 22 106 14 98 4M130 34C122 26 136 18 128 8" strokeWidth="5" />
      <path d="M38 112C38 62 162 62 162 112Z" />
      <path d="M86 72 112 98M112 72 86 98" />
      <path d="M14 116H186C186 132 170 144 150 144H50C30 144 14 132 14 116Z" />
    </svg>
  );
}
