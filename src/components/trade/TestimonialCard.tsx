import { Star, User } from "lucide-react";

interface Props {
  stars?: number;
  badge?: string;
  badgeColor?: string;
  quote: string;
  name: string;
  business: string;
}

const TestimonialCard = ({ stars = 5, badge, badgeColor = "#5B5FEF", quote, name, business }: Props) => (
  <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-gray-50 p-6 shadow-card flex flex-col gap-4">
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: stars }).map((_, i) => (
        <Star key={i} size={16} fill="currentColor" stroke="none" aria-hidden={true} focusable={false} />
      ))}
    </div>
    {badge && (
      <span
        className="inline-block self-start text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
        style={{ background: badgeColor }}
      >
        {badge}
      </span>
    )}
    <p className="text-sm italic text-foreground/80 leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-3 mt-2">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <User size={18} aria-hidden={true} focusable={false} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{business}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
