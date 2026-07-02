import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { Target, Award, Rocket, Heart, ArrowRight, Check, Users } from "lucide-react";

const values = [
  { icon: Target, title: "Ergebnisorientiert", desc: "Jede Designentscheidung dient einem Ziel: mehr Kunden für Dein Unternehmen." },
  { icon: Award, title: "Höchste Qualität", desc: "Wir liefern nur Ergebnisse, die wir selbst nutzen würden." },
  { icon: Rocket, title: "Schnell & Effizient", desc: "Von der ersten Idee zur fertigen Website – ohne unnötige Wartezeiten." },
  { icon: Heart, title: "Partnerschaftlich", desc: "Wir arbeiten mit Dir, nicht nur für Du. Dein Erfolg ist unser Erfolg." },
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
  <main id="main-content" className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mb-20">
            <span className="badge-label bg-primary/10 text-primary mb-5">
              Über unsere Webdesign Agentur
            </span>
            <h1 className="mb-5 text-balance">
              Deine Webdesign Agentur, die Websites zu{" "}
              <span className="gradient-text">Verkaufsinstrumenten</span> macht
            </h1>
            <p className="text-muted-foreground text-lg">
              Meine Traum Webseite ist keine gewöhnliche Webdesign-Agentur.
              Wir erstellen moderne Websites für Unternehmen, die aktiv Kunden gewinnen – für Selbstständige, Handwerker, Coaches und KMUs.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-2xl md:text-3xl mb-5">
                Warum unsere Webdesign Agentur anders ist
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Die meisten Agenturen liefern eine schöne Website – und das war's.
                Wir gehen weiter: Jede Website, die wir erstellen, ist ein strategisches Verkaufsinstrument,
                das messbar zu Deinem Geschäftserfolg beiträgt.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Wir kombinieren verkaufspsychologisches Design mit modernster Technologie –
                damit Deine Website nicht nur Besucher anzieht, sondern sie in zahlende Kunden verwandelt.
              </p>
              <div className="space-y-3.5">
                {reasons.map((r) => (
                  <div key={r} className="flex items-center gap-3">
                    <Check size={17} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                    <span className="text-sm">{r}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button variant="gradient" asChild>
                  <Link to="/kontakt">
                    Kostenlose Vorschau anfordern <ArrowRight size={20} aria-hidden={true} focusable={false} />
                  </Link>
                </Button>
                <Button variant="outline-primary" asChild>
                  <Link to="/kostenloser-website-check">Kostenlosen Website-Check starten</Link>
                </Button>
              </div>
            </div>
            <div className="aspect-square rounded-2xl gradient-hero-bg flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <Users size={24} className="mx-auto mb-4 opacity-40" aria-hidden={true} focusable={false} />
                <span className="font-heading text-5xl font-bold block tracking-tight">150+</span>
                <span className="text-primary-foreground/60 text-sm mt-1 block">Zufriedene Kunden</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-16 text-balance">
            Wofür wir als Webdesign Agentur stehen
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.1}>
              <div className="text-center p-8 rounded-2xl border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
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
