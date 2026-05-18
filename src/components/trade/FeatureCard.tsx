interface Props {
  emoji: string;
  title: string;
  description: string;
}

const FeatureCard = ({ emoji, title, description }: Props) => (
  <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3 shadow-card">
    <div className="text-3xl" aria-hidden>{emoji}</div>
    <h3 className="text-base font-bold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;
