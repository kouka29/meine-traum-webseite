import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, Check, RefreshCw, TrendingUp, Zap, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const signs = [
  "Deine Website sieht veraltet aus und schreckt Kunden ab",
  "Du bekommst kaum Anfragen über deine aktuelle Website",
  "Deine Website lädt langsam (über 3 Sekunden)",
  "Deine Website ist nicht mobilfreundlich",
  "Deine Konkurrenz wirkt online deutlich professioneller",
  "Du kannst Inhalte nicht selbst aktualisieren",
];

const faqs = [
  { q: "Was kostet ein Website Relaunch?", a: "Ein professioneller Website Relaunch startet ab 990 €. Der Preis hängt vom Umfang der bestehenden Seite und den gewünschten Funktionen ab. Wir erstellen dir ein individuelles Angebot." },
  { q: "Verliere ich mein Google-Ranking beim Relaunch?", a: "Nein! Wir setzen saubere Weiterleitungen (301-Redirects) und optimieren deine neue Website von Anfang an für Suchmaschinen. In der Regel verbessern sich die Rankings nach einem professionellen Relaunch sogar." },
  { q: "Wie lange dauert ein Website Relaunch?", a: "Ein typischer Relaunch dauert 3–5 Wochen, abhängig vom Umfang. Du erhältst vorab eine kostenlose Vorschau innerhalb von 48 Stunden." },
];

const WebsiteRelaunch = () => (
 <main id="main-content" className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Website Relaunch</span>
            <h1 className="mb-5 text-balance">
              Website Relaunch –{" "}
              <span className="gradient-text">Deine veraltete Website wird zum Kundenmagnet</span>
            </h1>
            <p className="text-muted-foreground text-lg">
 Deine Website bringt keine Anfragen mehr? Ein professioneller Website Relaunch verwandelt deine veraltete
 Online-Präsenz in ein modernes Verkaufsinstrument – mit mehr Anfragen, besserem Design und schnelleren Ladezeiten.
 </p>
            <Button variant="gradient" size="lg" className="mt-10 animate-cta-pulse" asChild>
              <Link to="/kostenloser-website-check">Kostenlosen Website-Check starten <ArrowRight size={20} aria-hidden={true} focusable={false} /></Link>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-5 text-balance">Wann ist ein Website Relaunch notwendig?</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg mb-12">
 Erkennst du eines dieser Anzeichen? Dann wird es Zeit für einen professionellen Relaunch.
 </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-20">
            {signs.map((s) => (
 <div key={s} className="flex items-center gap-3">
                <RefreshCw size={17} className="text-destructive shrink-0" aria-hidden={true} focusable={false} />
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl p-12 md:p-16 text-primary-foreground mb-20">
            <h2 className="text-primary-foreground text-center mb-10 text-balance">Unsere Relaunch-Ergebnisse sprechen für sich</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { value: "3x", label: "Mehr Anfragen im Durchschnitt" },
                { value: "<3s", label: "Ladezeit nach Relaunch" },
                { value: "150+", label: "Erfolgreiche Relaunches" },
              ].map((s) => (
 <div key={s.label}>
                  <span className="font-heading text-5xl font-bold text-primary-foreground">{s.value}</span>
                  <p className="text-sm text-primary-foreground/70 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-5 text-balance">Was bei unserem Website Relaunch inklusive ist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-20">
            {[
              "Analyse deiner bestehenden Website",
              "Conversion-optimiertes Redesign",
              "SEO-Optimierung & 301-Weiterleitungen",
              "Mobile-First Responsive Design",
              "Schnelle Ladezeiten (unter 3 Sek.)",
              "Content-Überarbeitung",
              "Analytics & Tracking Setup",
              "Einweisung & Support nach Launch",
            ].map((item) => (
 <div key={item} className="flex items-center gap-3">
                <Check size={17} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen zum Website Relaunch</h2>
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
  </main>
);

export default WebsiteRelaunch;
