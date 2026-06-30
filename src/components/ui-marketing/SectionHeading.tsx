import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  tone?: "default" | "onDark";
  className?: string;
}

const SectionHeading = ({ eyebrow, title, subtitle, align = "center", tone = "default", className }: Props) => {
  const onDark = tone === "onDark";
  return (
    <div className={cn("mb-12 md:mb-16 max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && (
        <span
          className={cn(
            "inline-block text-[11px] font-bold uppercase tracking-wider mb-3",
            onDark ? "text-brand" : "text-primary",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance leading-[1.12] font-bold",
          onDark ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed",
            onDark ? "text-on-dark-muted" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;