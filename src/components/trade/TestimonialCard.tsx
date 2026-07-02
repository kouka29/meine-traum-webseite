import { User } from "lucide-react";
import Stars from "@/components/ui-marketing/Stars";

interface Props {
  stars?: number;
  badge?: string;
  badgeColor?: string;
  quote: string;
  name: string;
  business: string;
}

const TestimonialCard = ({ stars = 5, badge, badgeColor, quote, name, business }: Props) => (
 <div className="rounded-card bg-background p-7 shadow-marketing flex flex-col gap-4 border border-border">
    <Stars count={stars} />
    {badge && (
      <span
        className="inline-block self-start text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
        style={{ background: badgeColor ?? "hsl(var(--brand))" }}
      >
        {badge}
      </span>
    )}
    <p className="text-base italic text-foreground/80 leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-3 mt-2">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <User size={20} aria-hidden={true} focusable={false} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{business}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
