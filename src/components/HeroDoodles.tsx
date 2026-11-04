import Image from "next/image";

const DOODLES = {
  cake: { src: "/doodles/cake.png", width: 153, height: 120 },
  cupcake: { src: "/doodles/cupcake.png", width: 138, height: 143 },
  dumpling: { src: "/doodles/dumpling.png", width: 164, height: 121 },
  noodles: { src: "/doodles/noodles.png", width: 240, height: 168 },
  pot: { src: "/doodles/pot.png", width: 240, height: 209 },
};

/**
 * Where each drawing sits: its centre as a percentage of the hero's width (x) and height (y),
 * its width as a percentage of the screen width (w), and its tilt in degrees.
 */
const LAYOUT: { doodle: keyof typeof DOODLES; x: number; y: number; w: number; turn: number }[] = [
  // top row
  { doodle: "dumpling", x: 28.3, y: 13.5, w: 4.1, turn: -10 },
  { doodle: "cupcake", x: 47, y: 9, w: 3.4, turn: 0 },
  { doodle: "noodles", x: 57.9, y: 13.5, w: 7.8, turn: 0 },
  { doodle: "cake", x: 72, y: 8.5, w: 4.5, turn: -10 },
  { doodle: "pot", x: 96.9, y: 11.8, w: 6.3, turn: 0 },
  // middle
  { doodle: "pot", x: 6, y: 26.4, w: 4.6, turn: 20 },
  { doodle: "cake", x: 37.8, y: 39.2, w: 3.3, turn: -10 },
  { doodle: "noodles", x: 88.9, y: 36.8, w: 5.2, turn: 0 },
  { doodle: "cake", x: 8.8, y: 51.7, w: 4.8, turn: -10 },
  { doodle: "noodles", x: 26.4, y: 56.9, w: 5.2, turn: 0 },
  { doodle: "pot", x: 71.6, y: 76.1, w: 5.2, turn: 0 },
  // bottom row
  { doodle: "dumpling", x: 24.6, y: 81.9, w: 4.1, turn: -25 },
  { doodle: "cupcake", x: 48, y: 85.4, w: 3.1, turn: 0 },
  { doodle: "noodles", x: 55.2, y: 91, w: 6.3, turn: 0 },
  { doodle: "pot", x: 8.8, y: 91, w: 7.4, turn: 0 },
  { doodle: "cake", x: 93.6, y: 84.4, w: 3.9, turn: -10 },
];

/** Food drawings scattered across the hero, always in the same places. */
export function HeroDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
      {LAYOUT.map(({ doodle, x, y, w, turn }, i) => {
        const d = DOODLES[doodle];
        return (
          <Image
            key={i}
            src={d.src}
            alt=""
            width={d.width}
            height={d.height}
            className="absolute h-auto -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%`, width: `max(28px, ${w}vw)`, rotate: `${turn}deg` }}
          />
        );
      })}
    </div>
  );
}
