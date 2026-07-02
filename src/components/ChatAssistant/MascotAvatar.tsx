import { cn } from "@/lib/utils";

type Props = { className?: string; size?: number };

/**
 * Kleines freundliches KI-Maskottchen ("Mia") als Inline-SVG.
 * Nutzt Brand-Farben über currentColor/Tailwind-Klassen.
 */
export const MascotAvatar = ({ className, size = 40 }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-primary", className)}
    role="img"
    aria-label="Mia — KI-Assistent"
  >
    <defs>
      <linearGradient id="mia-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <rect x="4" y="8" width="40" height="34" rx="12" fill="url(#mia-bg)" />
    <circle cx="24" cy="6" r="2.5" fill="currentColor" />
    <rect x="23" y="4" width="2" height="6" fill="currentColor" />
    <circle cx="17" cy="24" r="4" fill="white" />
    <circle cx="31" cy="24" r="4" fill="white" />
    <circle cx="17" cy="24" r="1.8" fill="#111" />
    <circle cx="31" cy="24" r="1.8" fill="#111" />
    <path
      d="M18 32 Q24 36 30 32"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default MascotAvatar;