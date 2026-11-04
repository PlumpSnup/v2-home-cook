import Image from "next/image";

const DOODLES = [
  { src: "/doodles/cake.png", width: 153, height: 120 },
  { src: "/doodles/cupcake.png", width: 138, height: 143 },
  { src: "/doodles/dumpling.png", width: 164, height: 121 },
  { src: "/doodles/noodles.png", width: 240, height: 168 },
  { src: "/doodles/pot.png", width: 240, height: 209 },
];

const COLS = 5;
const ROWS = 2;

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
 * random inside its own cell of a 5 × 2 grid, so they spread out instead of piling up.
 */
export function HeroDoodles() {
  const picks = shuffle([...DOODLES, ...DOODLES]);
  return (
    <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
      {picks.map((d, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const left = ((col + 0.15 + Math.random() * 0.7) / COLS) * 100;
        const top = ((row + 0.15 + Math.random() * 0.7) / ROWS) * 100;
        // bigger drawings (the bowl, the pot) stay a little bigger than the small ones
        const size = ((0.75 + Math.random() * 0.5) * d.width) / 180;
        const turn = Math.round(Math.random() * 40 - 20);
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
              width: `calc(${size.toFixed(2)} * clamp(56px, 10vw, 140px))`,
              rotate: `${turn}deg`,
            }}
          />
        );
      })}
    </div>
  );
}
