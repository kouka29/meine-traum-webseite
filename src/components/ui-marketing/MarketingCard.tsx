import { cn } from "@/lib/utils";

type Variant = "default" | "feature" | "pain" | "elevated";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  as?: keyof JSX.IntrinsicElements;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-background border border-border shadow-marketing hover:shadow-marketing-hover hover:-translate-y-0.5",
  feature: "bg-background border border-border shadow-card hover:shadow-elevated hover:-translate-y-1",
  pain: "bg-background shadow-marketing hover:shadow-marketing-hover hover:-translate-y-0.5",
  elevated: "bg-background shadow-elevated",
};

const MarketingCard = ({ variant = "default", className, children, as: As = "div", ...rest }: Props) => {
  const Tag = As as keyof JSX.IntrinsicElements;
  return (
    // @ts-expect-error - polymorphic intrinsic
    <Tag
      className={cn(
        "rounded-card p-6 md:p-7 flex flex-col gap-3 transition-all duration-300",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default MarketingCard;