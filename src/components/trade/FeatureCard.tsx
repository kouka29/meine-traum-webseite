import MarketingCard from "@/components/ui-marketing/MarketingCard";
import EmojiIcon from "@/lib/emojiToIcon";

interface Props {
  emoji: string;
  title: string;
  description: string;
}

const FeatureCard = ({ emoji, title, description }: Props) => (
  <MarketingCard variant="feature">
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mb-1">
      <EmojiIcon emoji={emoji} size={24} />
    </div>
    <h3 className="text-base font-bold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </MarketingCard>
);

export default FeatureCard;
