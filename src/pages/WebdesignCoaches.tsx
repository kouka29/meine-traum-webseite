import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, Check, Lightbulb, Search, Users, Smartphone, TrendingUp, Target } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const painPoints = [
  "Deine Website vermittelt nicht die Expertise und Persönlichkeit, die Deine Klienten erwarten",
  "Du gewinnst Klienten nur über Empfehlungen – Deine Website bringt keine neuen Anfragen",
  "Besucher verstehen nicht sofort, wie Du ihnen helfen können, und springen ab",
  "Du hast kein System für automatisierte Terminbuchung oder Lead-Generierung",
];

const features = [
  { icon: Lightbulb, title: "Persönliches Branding", desc: "Deine Website wird zur Bühne für Deine Expertise – mit einem Design, das Deine Persönlichkeit und Methodik widerspiegelt." },
  { icon: Search, title: "SEO für Coaches", desc: 'Gefunden werden bei "Coach für Dein Thema in Deiner Stadt", "Berater für Dein Thema" und ähnlichen Suchanfragen.' },
  { icon: Target, title: "Klare Positionierung", desc: "Deine Zielgruppe erkennt sofort, ob Du der richtige Coach oder Berater sind – durch gezielte Ansprache." },
  { icon: Users, title: "Vertrauensaufbau", desc: "Testimonials, Erfolgsgeschichten und Zertifizierungen werden professionell präsentiert." },
  { icon: Smartphone, title: "Mobilfreundlich", desc: "Deine Website sieht auf jedem Gerät professionell aus – wichtig, da viele Klienten unterwegs recherchieren." },
  { icon: TrendingUp, title: "Mehr Klienten gewinnen", desc: "Conversion-optimierter Aufbau mit klaren CTAs – von der Erstberatung bis zur Buchung." },
];

const faqs = [
  { q: "Warum brauche ich als Coach eine professionelle Website?", a: "Deine Website ist Dein digitales Aushängeschild. Potenzielle Klienten prüfen Deine Online-Präsenz, bevor sie Kontakt aufnehmen. Eine professionelle Website schafft Vertrauen und positioniert Du als Experte." },
  { q: "Was kostet eine Coach-Website?", a: "Unsere Websites für Coaches und Berater starten ab 990 €. Inkl. persönlichem Branding, SEO und Conversion-Optimierung. Kostenlose Vorschau in 48 h." },
  { q: "Kann ich Testimonials und Erfolgsgeschichten selbst einpflegen?", a: "Ja, wir richten Deine Website so ein, dass Du Inhalte wie Testimonials, Blog-Beiträge und Angebote einfach selbst aktualisieren können." },
  { q: "Bietet ihr auch Landingpages für einzelne Angebote an?", a: "Ja! Für Webinare, Online-Kurse oder spezielle Programme erstellen wir gezielte Landingpages, die Teilnehmer und Klienten gewinnen." },
];

const WebdesignCoaches = () => (
  <main id="main-content" className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign für Coaches & Berater</span>
            <h1 className="mb-5 text-balance">
              Webdesign für Coaches & Berater –{" "}
              <span className="gradient-text">Die Website, die Klienten überzeugt</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Als Coach oder Berater bist Du Experte auf Deinem Gebiet. Deine Website sollte das widerspiegeln –
              professionell, vertrauenswürdig und mit einer klaren Botschaft, die Klienten gewinnt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Website-Vorschau für Coaches <ArrowRight size={20} aria-hidden={true} focusable={false} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Website-Check für Coaches</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-center mb-10 text-balance">Kennst Du diese Herausforderungen?</h2>
            <div className="space-y-4">
              {painPoints.map((p) => (
                <div key={p} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-background">
                  <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                  </span>
                  <p className="text-sm">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-16 text-balance">So positionieren wir Du online als Experte</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.08}>
              <div className="p-7 rounded-2xl border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 bg-background h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl p-12 md:p-16 text-primary-foreground mb-20">
            <h2 className="text-primary-foreground mb-5 text-balance text-center">Ergebnisse für Coaches & Berater</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {[
                { value: "+250%", label: "Mehr Anfragen" },
                { value: "48 h", label: "Bis zur Vorschau" },
                { value: "24/7", label: "Automatische Terminbuchung" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="font-heading text-4xl font-bold text-primary-foreground">{s.value}</span>
                  <p className="text-sm text-primary-foreground/70 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20">
            <h2 className="text-center mb-5 text-balance">Leistungen für Coaches & Berater</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
              {[
                { label: "Website erstellen lassen", to: "/website-erstellen-lassen" },
                { label: "Landingpage für Angebote", to: "/landingpage-erstellen-lassen" },
                { label: "Conversion-Optimierung", to: "/conversion-optimierung" },
                { label: "Website Relaunch", to: "/website-relaunch" },
                { label: "Kostenloser Website-Check", to: "/kostenloser-website-check" },
                { label: "Webdesign Preise", to: "/webdesign-preise" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-card transition-all">
                  <Check size={17} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                  <span className="text-sm font-medium">{l.label}</span>
                  <ArrowRight size={16} className="text-muted-foreground ml-auto" aria-hidden={true} focusable={false} />
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen: Webdesign für Coaches</h2>
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

export default WebdesignCoaches;
