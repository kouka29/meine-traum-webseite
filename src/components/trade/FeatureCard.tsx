import MarketingCard from "@/components/ui-marketing/MarketingCard";

interface Props {
  emoji: string;
  title: string;
  description: string;
}

const FeatureCard = ({ emoji, title, description }: Props) => (
  <MarketingCard variant="feature">
    <div className="text-3xl" aria-hidden>{emoji}</div>
    <h3 className="text-base font-bold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </MarketingCard>
);

export default FeatureCard;
