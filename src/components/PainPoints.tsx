import AnimatedSection from "./AnimatedSection";
import { AlertTriangle, TrendingDown, EyeOff, XCircle } from "lucide-react";

const painPoints = [
  {
    icon: TrendingDown,
    problem: "Sie bekommen keine Anfragen über Ihre Website?",
    detail: "Jeden Tag verlieren Sie potenzielle Kunden an Ihre Konkurrenz – weil Ihre Website nicht überzeugt.",
  },
  {
    icon: EyeOff,
    problem: "Ihre Website sieht veraltet aus?",
    detail: "Ein unprofessioneller Auftritt kostet Vertrauen – und damit bares Geld.",
  },
  {
    icon: AlertTriangle,
    problem: "Ihre Konkurrenz wirkt online deutlich professioneller?",
    detail: "Kunden vergleichen – und entscheiden sich für den, der online am besten auftritt.",
  },
  {
    icon: XCircle,
    problem: "Ihre Website konvertiert nicht?",
    detail: "Besucher kommen – aber niemand ruft an, schreibt oder kauft. Das muss nicht so bleiben.",
  },
];

const PainPoints = () => (
  <section className="section-padding bg-foreground">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-background mb-4">
            Kommt Ihnen das bekannt vor?
          </h2>
          <p className="text-background/60 max-w-xl mx-auto">
            Die meisten Unternehmen verschenken täglich Umsatz – weil ihre Website nicht als Verkaufsinstrument funktioniert.
          </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {painPoints.map((p, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="p-6 rounded-xl border border-background/10 hover:border-destructive/40 transition-colors bg-background/5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                  <p.icon size={20} className="text-destructive" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-background mb-1">{p.problem}</h3>
                  <p className="text-sm text-background/60">{p.detail}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default PainPoints;
