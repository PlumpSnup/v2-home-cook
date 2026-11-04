import Image from "next/image";

const DOODLES = [
  { src: "/doodles/cake.png", width: 153, height: 120 },
  { src: "/doodles/cupcake.png", width: 138, height: 143 },
  { src: "/doodles/dumpling.png", width: 164, height: 121 },
  { src: "/doodles/noodles.png", width: 240, height: 168 },
  { src: "/doodles/pot.png", width: 240, height: 209 },
];

const COLS = 6;
const ROWS = 3;

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Food doodles scattered across the hero in new spots on every visit. Each one lands somewhere
 * random inside its own cell of a 6 × 3 grid, so they spread out instead of piling up.
 */
export function HeroDoodles() {
  // fill every cell, using each drawing about the same number of times
  const picks = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => DOODLES[i % DOODLES.length]));
  return (
    <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
      {picks.map((d, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const left = ((col + 0.1 + Math.random() * 0.8) / COLS) * 100;
        const top = ((row + 0.1 + Math.random() * 0.8) / ROWS) * 100;
        // bigger drawings (the bowl, the pot) stay a little bigger than the small ones
        const size = ((0.75 + Math.random() * 0.5) * d.width) / 180;
        const turn = Math.round(Math.random() * 50 - 25);
        return (
          <Image
            key={i}
            src={d.src}
            alt=""
            width={d.width}
            height={d.height}
            className="absolute h-auto -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `calc(${size.toFixed(2)} * clamp(32px, 5vw, 76px))`,
              rotate: `${turn}deg`,
            }}
          />
        );
      })}
    </div>
  );
}
