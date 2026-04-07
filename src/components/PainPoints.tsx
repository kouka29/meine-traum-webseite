import AnimatedSection from "./AnimatedSection";
import { AlertTriangle, TrendingDown, EyeOff, XCircle } from "lucide-react";

const painPoints = [
  {
    icon: TrendingDown,
    problem: "Schickes Design – null Anfragen?",
    detail: "Ihre Website sieht gut aus, aber es meldet sich niemand. Das liegt nicht am Markt – sondern an fehlender Verkaufsstruktur.",
  },
  {
    icon: EyeOff,
    problem: "Besucher scrollen – und gehen wieder?",
    detail: "Ohne klare Nutzerführung wissen Besucher nicht, was sie tun sollen. Sie verlassen die Seite – und rufen bei Ihrem Wettbewerber an.",
  },
  {
    icon: AlertTriangle,
    problem: "Die falschen Leute fühlen sich angesprochen?",
    detail: "Wenn Ihre Texte alle ansprechen, überzeugen sie niemanden. Ihre Zielgruppe muss sich sofort wiedererkennen.",
  },
  {
    icon: XCircle,
    problem: "Kein klarer nächster Schritt?",
    detail: "Ohne eine eindeutige Handlungsaufforderung verlieren Sie jeden zweiten Interessenten – obwohl er bereit wäre, Kontakt aufzunehmen.",
  },
];

const PainPoints = () => (
  <section className="section-padding bg-foreground">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="text-background mb-5 text-balance">
            Warum die meisten Webseiten keine Kunden bringen
          </h2>
          <p className="text-background/50 max-w-xl mx-auto text-lg">
            Es liegt selten am Traffic. Es liegt fast immer an diesen vier Fehlern – und jeder einzelne kostet Sie bares Geld.
          </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {painPoints.map((p, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="p-7 rounded-2xl border border-background/8 hover:border-destructive/30 transition-all duration-300 bg-background/[0.04] backdrop-blur-sm h-full">
              <div className="flex gap-5 items-start">
                <div className="w-11 h-11 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
                  <p.icon size={20} className="text-destructive" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-background mb-1.5">{p.problem}</h3>
                  <p className="text-sm text-background/50 leading-relaxed">{p.detail}</p>
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
