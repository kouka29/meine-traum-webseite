import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  count?: number;
  size?: number;
  className?: string;
}

/** Unified rating stars. Replaces "⭐⭐⭐⭐⭐" text strings across marketing pages. */
const Stars = ({ count = 5, size = 16, className }: Props) => (
 <div className={cn("inline-flex items-center gap-0.5 text-amber-500", className)} aria-label={`${count} von 5 Sternen`}>
    {Array.from({ length: count }).map((_, i) => (
 <Star key={i} size={size} fill="currentColor" stroke="none" aria-hidden focusable={false} />
    ))}
  </div>
);

export default Stars;