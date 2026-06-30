import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, Check, Target, Zap, TrendingUp, MousePointer } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const benefits = [
  { icon: Target, title: "Ein Ziel. Maximale Wirkung.", desc: "Jede Landingpage hat ein klares Conversion-Ziel – ob Anfrage, Buchung oder Download." },
  { icon: MousePointer, title: "Verkaufspsychologischer Aufbau", desc: "Bewährte Strukturen, die Besucher Schritt für Schritt zum Handeln führen." },
  { icon: Zap, title: "Schnelle Ladezeiten", desc: "Unter 2 Sekunden – damit kein potenzieller Kunde abspringt." },
  { icon: TrendingUp, title: "A/B-Testing-fähig", desc: "Wir optimieren deine Landingpage kontinuierlich für maximale Conversion-Raten." },
];

const faqs = [
  { q: "Was ist eine Landingpage und wofür brauche ich sie?", a: "Eine Landingpage ist eine eigenständige Seite mit einem einzigen Conversion-Ziel – z. B. Anfrage, Terminbuchung oder Lead-Generierung. Du ist perfekt für Werbekampagnen, da sie Besucher gezielt zum Handeln führt." },
  { q: "Was kostet eine Landingpage erstellen lassen?", a: "Eine professionelle Landingpage kostet ab 800 €. Der Preis variiert je nach Umfang, Integration und Komplexität. Wir erstellen dir ein individuelles Angebot." },
  { q: "Wie schnell kann eine Landingpage erstellt werden?", a: "Eine Landingpage kann in 1–2 Wochen erstellt werden. Für eilige Projekte bieten wir auch Express-Umsetzungen an." },
];

const LandingpageErstellen = () => (
  <main id="main-content" className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Landingpage erstellen lassen</span>
            <h1 className="mb-5 text-balance">
              Landingpage erstellen lassen –{" "}
              <span className="gradient-text">maximale Conversions garantiert</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Eine professionelle Landingpage verwandelt Besucher in Kunden. Wir erstellen conversion-optimierte
              Landingpages mit verkaufspsychologischem Aufbau – perfekt für Google Ads, Social Media und Lead-Generierung.
            </p>
            <Button variant="gradient" size="lg" className="mt-10 animate-cta-pulse" asChild>
              <Link to="/kontakt">Landingpage anfragen <ArrowRight size={20} aria-hidden={true} focusable={false} /></Link>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-12 text-balance">Warum eine professionelle Landingpage den Unterschied macht</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {benefits.map((b, i) => (
            <AnimatedSection key={b.title} delay={i * 0.1}>
              <div className="flex gap-5 p-7 rounded-2xl border border-border hover:border-primary/20 transition-all bg-background hover:shadow-card">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
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

        <AnimatedSection>
          <div className="bg-card rounded-2xl p-10 border border-border mb-20">
            <h2 className="mb-5 text-balance">Was in unserer Landingpage enthalten ist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Verkaufspsychologischer Seitenaufbau",
                "Responsive Design (Mobile First)",
                "Kontaktformular oder Buchungsfunktion",
                "SEO-optimierte Texte und Meta-Daten",
                "Schnelle Ladezeit (unter 2 Sekunden)",
                "Google Analytics & Conversion Tracking",
                "A/B-Testing-Vorbereitung",
                "DSGVO-konforme Umsetzung",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check size={17} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen zur Landingpage-Erstellung</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-card transition-all">
                  <AccordionTrigger className="text-left font-heading font-semibold text-base hover:no-underline py-5">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <FreePreviewCTA />
    <CTABanner />
  </main>
);

export default LandingpageErstellen;
