import { Link } from "react-router-dom";
import { Check } from "lucide-react";

interface Props {
  name: string;
  price: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  ctaLink: string;
  ctaLabel?: string;
}

const PricingTeaserCard = ({ name, price, description, features, highlighted, ctaLink, ctaLabel = "Jetzt anfragen" }: Props) => (
  <div
    className="relative rounded-2xl border bg-card p-6 flex flex-col gap-5 shadow-card"
    style={highlighted ? { borderColor: "#5B5FEF", borderWidth: 2 } : undefined}
  >
    {highlighted && (
      <span
        className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full text-white"
        style={{ background: "#F59E0B" }}
      >
        BELIEBTESTE WAHL
      </span>
    )}
    <div>
      <h3 className="text-lg font-bold text-foreground">{name}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    <div className="text-3xl font-bold text-foreground">{price}</div>
    <ul className="space-y-2 text-sm">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <Check size={16} className="mt-0.5 shrink-0" style={{ color: "#10B981" }} />
          <span className="text-foreground/80">{f}</span>
        </li>
      ))}
    </ul>
    <Link
      to={ctaLink}
      className="mt-auto block w-full text-center rounded-xl py-3 text-sm font-semibold text-white transition hover:brightness-110"
      style={{ background: "#5B5FEF" }}
    >
      {ctaLabel}
    </Link>
  </div>
);

export default PricingTeaserCard;
