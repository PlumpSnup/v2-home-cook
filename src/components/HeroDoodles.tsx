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

/**
 * Picks a drawing for every grid cell so that no two cells side by side, above and below, or
 * diagonal hold the same one. Filling row by row, a cell only has four filled neighbours and
 * there are five drawings, so there is always a choice left. Among the allowed ones it takes a
 * least-used drawing, picked at random, so each shows up about equally often.
 */
function arrange() {
  const grid: number[] = [];
  const used = DOODLES.map(() => 0);
  for (let i = 0; i < COLS * ROWS; i++) {
    const col = i % COLS;
    const neighbours = new Set<number>();
    if (col > 0) neighbours.add(grid[i - 1]);
    if (i >= COLS) {
      neighbours.add(grid[i - COLS]);
      if (col > 0) neighbours.add(grid[i - COLS - 1]);
      if (col < COLS - 1) neighbours.add(grid[i - COLS + 1]);
    }
    const allowed = DOODLES.map((_, k) => k).filter((k) => !neighbours.has(k));
    const fewest = Math.min(...allowed.map((k) => used[k]));
    const options = allowed.filter((k) => used[k] === fewest);
    const pick = options[Math.floor(Math.random() * options.length)];
    grid.push(pick);
    used[pick]++;
  }
  return grid.map((k) => DOODLES[k]);
}

/**
 * Food doodles scattered across the hero in new spots on every visit. Each one lands somewhere
 * random inside its own cell of a 6 × 3 grid, so they spread out instead of piling up.
 */
export function HeroDoodles() {
  const picks = arrange();
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
