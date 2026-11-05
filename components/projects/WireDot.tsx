import type { WireDot as WireDotColor } from '@/content/projects';

const COLORS: Record<WireDotColor, string> = {
  red: 'bg-[#d24a3c]',
  black: 'bg-[#2b2b2b]',
  white: 'bg-white',
  blue: 'bg-[#2f6fd6]',
  green: 'bg-[#2f9e57]',
  yellow: 'bg-[#e6b800]',
  orange: 'bg-[#f08a24]',
  cyan: 'bg-[#1fb5c4]',
  purple: 'bg-[#8e44c9]',
};

/** Little wire swatch, like the cable colors on the slides. */
export function WireDot({ color }: { color: WireDotColor }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2.5 w-7 shrink-0 rounded-full border border-slate-400 ${COLORS[color]}`}
    />
  );
}
