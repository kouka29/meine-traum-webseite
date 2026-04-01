import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { TrendingUp, Palette, Zap, Smartphone, ArrowRight } from "lucide-react";

const benefits = [
  { icon: TrendingUp, title: "Mehr Kundenanfragen", desc: "Websites, die nicht nur gut aussehen – sondern aktiv neue Anfragen generieren. Messbar, nachweisbar, planbar." },
  { icon: Palette, title: "Professioneller Auftritt", desc: "Schaffen Sie sofort Vertrauen bei jedem Besucher – mit einem modernen Design, das Kompetenz ausstrahlt." },
  { icon: Zap, title: "Blitzschnelle Ladezeiten", desc: "Jede Sekunde Ladezeit kostet Sie Kunden. Unsere Websites laden unter 3 Sekunden – garantiert." },
  { icon: Smartphone, title: "Perfekt auf jedem Gerät", desc: "Über 60% Ihrer Besucher kommen vom Handy. Bei uns sieht Ihre Website überall perfekt aus." },
];

const IndexBenefits = () => (
  <section className="section-padding gradient-subtle-bg">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-12 md:mb-20">
          <h2 className="mb-5 text-balance">
            Warum Unternehmen sich für unsere Webdesign Agentur entscheiden
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Wir liefern keine digitalen Visitenkarten – sondern Verkaufsinstrumente, die sich bezahlt machen.
          </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((b, i) => (
          <AnimatedSection key={b.title} delay={i * 0.1}>
            <div className="flex gap-5 p-7 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300 bg-background hover:shadow-card">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                <b.icon size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1.5">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
          <Link to="/kontakt">
            Kostenlose Vorschau anfordern <ArrowRight size={18} />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default IndexBenefits;
