import Image from "next/image";

export function Avatar({ src, name, size = 48 }: { src: string | null; name: string; size?: number }) {
  return src ? (
    <Image src={src} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-display font-semibold text-brand"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
