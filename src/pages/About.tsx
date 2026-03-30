import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { Target, Award, Rocket, Heart, ArrowRight, CheckCircle, Users } from "lucide-react";

const values = [
  { icon: Target, title: "Ergebnisorientiert", desc: "Jede Designentscheidung dient einem Ziel: mehr Kunden für Ihr Unternehmen." },
  { icon: Award, title: "Höchste Qualität", desc: "Wir liefern nur Ergebnisse, die wir selbst nutzen würden." },
  { icon: Rocket, title: "Schnell & Effizient", desc: "Von der ersten Idee zur fertigen Website – ohne unnötige Wartezeiten." },
  { icon: Heart, title: "Partnerschaftlich", desc: "Wir arbeiten mit Ihnen, nicht nur für Sie. Ihr Erfolg ist unser Erfolg." },
];

const reasons = [
  "Über 150 zufriedene Kunden im DACH-Raum",
  "Durchschnittlich 3x mehr Anfragen nach Relaunch",
  "98% Weiterempfehlungsrate",
  "Kostenlose Website-Vorschau vor Auftragserteilung",
  "Keine versteckten Kosten – transparente Preise",
  "Persönlicher Ansprechpartner für jedes Projekt",
];

const About = () => (
  <main className="pt-16">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              Über uns
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Wir machen aus Websites{" "}
              <span className="gradient-text">Verkaufsinstrumente</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Meine Traum Webseite ist keine gewöhnliche Webdesign-Agentur. 
              Wir bauen Websites, die aktiv Kunden gewinnen – für Selbstständige, Handwerker, Coaches und KMUs.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-4">
                Warum wir anders sind
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Die meisten Agenturen liefern eine schöne Website – und das war's. 
                Wir gehen weiter: Jede Website, die wir erstellen, ist ein strategisches Verkaufsinstrument, 
                das messbar zu Ihrem Geschäftserfolg beiträgt.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Wir kombinieren verkaufspsychologisches Design mit modernster Technologie – 
                damit Ihre Website nicht nur Besucher anzieht, sondern sie in zahlende Kunden verwandelt.
              </p>
              <div className="space-y-3">
                {reasons.map((r) => (
                  <div key={r} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-primary shrink-0" />
                    <span className="text-sm">{r}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="gradient" asChild>
                  <Link to="/kontakt">
                    Kostenlose Vorschau anfordern <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="aspect-square rounded-2xl gradient-hero-bg flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <Users size={64} className="mx-auto mb-4 opacity-50" />
                <span className="font-heading text-4xl font-bold block">150+</span>
                <span className="text-primary-foreground/70 text-sm">Zufriedene Kunden</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="font-heading text-2xl font-bold text-center mb-12">
            Wofür wir stehen
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.1}>
              <div className="text-center p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <CTABanner />
  </main>
);

export default About;
