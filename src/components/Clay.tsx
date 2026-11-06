import { useId } from "react";

/*
 * Soft "clay" 3D food: glossy shapes lit from the top left, drawn as SVG gradients so they stay
 * sharp at any size. Each piece floats gently (see the `float` keyframes); decorative only.
 */

type Props = { className?: string; delay?: number };

function Float({ className = "", delay = 0, children }: Props & { children: React.ReactNode }) {
  return (
    <div
      className={`pointer-events-none animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_18px_18px_rgb(43_43_43/0.18)] motion-reduce:animate-none ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/** A soft white glint, for the glossy look. */
function Glint({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="white" opacity="0.55" transform={`rotate(-30 ${cx} ${cy})`} />;
}

export function ClayTomato(props: Props) {
  const id = useId();
  return (
    <Float {...props}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <radialGradient id={`${id}b`} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ff9c8a" />
            <stop offset="0.45" stopColor="#ec5a45" />
            <stop offset="1" stopColor="#b8301f" />
          </radialGradient>
          <radialGradient id={`${id}l`} cx="40%" cy="30%" r="80%">
            <stop offset="0" stopColor="#b9de7c" />
            <stop offset="1" stopColor="#4e7d35" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="57" rx="40" ry="36" fill={`url(#${id}b)`} />
        <Glint cx={34} cy={42} rx={9} ry={5} />
        <path d="M50 24 42 16l7 3 1-9 4 8 8-4-4 8 9 1-9 4z" fill={`url(#${id}l)`} />
        <path d="M50 22c0-5 2-9 6-12" stroke="#4e7d35" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    </Float>
  );
}

export function ClayLemon(props: Props) {
  const id = useId();
  return (
    <Float {...props}>
      <svg viewBox="0 0 100 80" className="h-full w-full">
        <defs>
          <radialGradient id={id} cx="38%" cy="30%" r="75%">
            <stop offset="0" stopColor="#fff6b8" />
            <stop offset="0.5" stopColor="#f6d443" />
            <stop offset="1" stopColor="#d39d17" />
          </radialGradient>
        </defs>
        <path d="M6 40c4-4 6-6 10-8 10-22 58-22 68 0 4 2 6 4 10 8-4 4-6 6-10 8-10 22-58 22-68 0-4-2-6-4-10-8z" fill={`url(#${id})`} />
        <Glint cx={36} cy={28} rx={10} ry={5} />
      </svg>
    </Float>
  );
}

export function ClayPea(props: Props) {
  const id = useId();
  return (
    <Float {...props}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <radialGradient id={id} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#dff2b0" />
            <stop offset="0.5" stopColor="#a7c957" />
            <stop offset="1" stopColor="#5e8a3c" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill={`url(#${id})`} />
        <Glint cx={34} cy={32} rx={11} ry={6} />
      </svg>
    </Float>
  );
}

export function ClayChili(props: Props) {
  const id = useId();
  return (
    <Float {...props}>
      <svg viewBox="0 0 120 70" className="h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff8f7c" />
            <stop offset="0.5" stopColor="#e2452f" />
            <stop offset="1" stopColor="#a8281a" />
          </linearGradient>
        </defs>
        <path d="M92 22C70 14 30 18 8 52c26-6 58-6 82-14 8-3 8-13 2-16z" fill={`url(#${id})`} />
        <path d="M40 28c14-5 30-6 44-4" stroke="white" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M92 22c6-2 10-6 12-14M92 22c4 0 8 2 12 6" stroke="#6a994e" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
    </Float>
  );
}

/** A cream bowl of rice with a green rim and a little steam. */
export function ClayBowl(props: Props) {
  const id = useId();
  return (
    <Float {...props}>
      <svg viewBox="0 0 140 110" className="h-full w-full">
        <defs>
          <radialGradient id={`${id}r`} cx="40%" cy="30%" r="80%">
            <stop offset="0" stopColor="#fffdf6" />
            <stop offset="1" stopColor="#f0d79a" />
          </radialGradient>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fbf63" />
            <stop offset="1" stopColor="#4e7d35" />
          </linearGradient>
        </defs>
        <path d="M58 26c-6-6 6-10 0-18M78 26c-6-6 6-10 0-18" stroke="#f2e8cf" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
        <ellipse cx="70" cy="56" rx="50" ry="20" fill={`url(#${id}r)`} />
        <circle cx="56" cy="50" r="5" fill="#ec5a45" />
        <circle cx="82" cy="52" r="4" fill="#a7c957" />
        <circle cx="70" cy="44" r="3.5" fill="#a7c957" />
        <path d="M14 60h112c-2 26-24 42-56 42S16 86 14 60z" fill={`url(#${id}b)`} />
        <path d="M30 70c8 14 22 20 40 20" stroke="white" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    </Float>
  );
}
