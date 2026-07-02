import { cn } from "@/lib/utils";

type Bg = "dark" | "light" | "white";

interface Props {
  bg?: Bg;
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Looser top/bottom padding for hero-like sections */
  spacious?: boolean;
}

const bgClass: Record<Bg, string> = {
  dark: "bg-surface-dark text-white",
  light: "bg-surface-light text-foreground",
  white: "bg-background text-foreground",
};

/** Unified marketing section. Single source of vertical rhythm + bg variants. */
const Section = ({ bg = "white", id, className, children, spacious }: Props) => (
 <section
    id={id}
    className={cn(
      spacious ? "py-24 md:py-32" : "py-20 md:py-28",
      bgClass[bg],
      className,
    )}
  >
    <div className="container-narrow px-4">{children}</div>
  </section>
);

export default Section;