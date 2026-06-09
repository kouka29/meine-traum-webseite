import TradeBreadcrumbs from "@/components/TradeBreadcrumbs";
import HandwerkerLeadForm from "@/components/trade/HandwerkerLeadForm";

interface Props {
  title: string;
  subtitle?: string;
  branche?: string;
}

const TradePlaceholder = ({ title, subtitle, branche }: Props) => (
  <main id="main-content" className="pt-[120px] sm:pt-[136px] pb-24 min-h-screen">
    <TradeBreadcrumbs />
    <div className="container-narrow px-4 mt-8 grid lg:grid-cols-[1fr_420px] gap-12 items-start">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{title}</h1>
        {subtitle && <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>}
        <p className="mt-6 text-sm text-muted-foreground">
          Diese Seite wird in Kürze mit detaillierten Inhalten gefüllt. In der Zwischenzeit kannst Du rechts direkt eine kostenlose Vorschau anfordern.
        </p>
      </div>
      <div>
        <HandwerkerLeadForm branche={branche} />
      </div>
    </div>
  </main>
);

export default TradePlaceholder;
