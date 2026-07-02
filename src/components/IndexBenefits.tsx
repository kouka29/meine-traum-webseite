import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { BarChart3, Users, LayoutDashboard, BadgeCheck, ArrowRight } from "lucide-react";

const benefits = [
  { icon: BarChart3, title: "Mehr qualifizierte Anfragen", desc: "Keine Zufallstreffer. Deine Website filtert die richtigen Interessenten heraus – und führt sie gezielt zur Kontaktaufnahme. Unsere Kunden berichten von 2–5x mehr Anfragen nach dem Relaunch." },
  { icon: Users, title: "Höhere Abschlussquote", desc: "Wer über deine Website anfrägt, ist bereits überzeugt. Die Gespräche starten auf einem anderen Level – weil deine Seite die Vorarbeit leistet." },
  { icon: LayoutDashboard, title: "Klar strukturierte Seiten", desc: "Besucher verstehen in unter 5 Sekunden, was du anbietest und warum sie bei dir richtig sind. Keine Verwirrung, kein Absprung." },
  { icon: BadgeCheck, title: "Vertrauen ab der ersten Sekunde", desc: "Dein Auftritt zeigt sofort: Hier arbeiten Könner. Kundenstimmen, klare Ergebnisse und ein sauberer Aufbau schaffen Glaubwürdigkeit, bevor das erste Gespräch stattfindet." },
];

const IndexBenefits = () => (
 <section className="section-padding gradient-subtle-bg">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-12 md:mb-20">
          <h2 className="mb-5 text-balance">
 Das Ergebnis: Mehr Anfragen, planbar und messbar
 </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
 Keine vagen Versprechen. Wir zeigen, was sich konkret ändert, wenn deine Website endlich als Vertriebskanal funktioniert.
 </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((b, i) => (
 <AnimatedSection key={b.title} delay={i * 0.1}>
            <div className="flex gap-5 p-7 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300 bg-background hover:shadow-card">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                <b.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1.5">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <div className="text-center mt-12 px-4">
        <Button variant="gradient" size="lg" className="animate-cta-pulse text-xs sm:text-base px-4 sm:px-8 h-auto min-h-12 py-3 w-full sm:w-auto whitespace-normal text-center leading-tight" asChild>
          <Link to="/kontakt">
 Kostenlose Strategie-Vorschau anfordern <ArrowRight size={20} aria-hidden={true} focusable={false} />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default IndexBenefits;
