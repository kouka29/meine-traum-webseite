import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, CheckCircle, Lightbulb, Search, Users, Smartphone, TrendingUp, Target } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const painPoints = [
  "Ihre Website vermittelt nicht die Expertise und Persönlichkeit, die Ihre Klienten erwarten",
  "Sie gewinnen Klienten nur über Empfehlungen – Ihre Website bringt keine neuen Anfragen",
  "Besucher verstehen nicht sofort, wie Sie ihnen helfen können, und springen ab",
  "Sie haben kein System für automatisierte Terminbuchung oder Lead-Generierung",
];

const features = [
  { icon: Lightbulb, title: "Persönliches Branding", desc: "Ihre Website wird zur Bühne für Ihre Expertise – mit einem Design, das Ihre Persönlichkeit und Methodik widerspiegelt." },
  { icon: Search, title: "SEO für Coaches", desc: 'Gefunden werden bei "Coach [Thema] [Stadt]", "Berater für [Thema]" und ähnlichen Suchanfragen.' },
  { icon: Target, title: "Klare Positionierung", desc: "Ihre Zielgruppe erkennt sofort, ob Sie der richtige Coach oder Berater sind – durch gezielte Ansprache." },
  { icon: Users, title: "Vertrauensaufbau", desc: "Testimonials, Erfolgsgeschichten und Zertifizierungen werden professionell präsentiert." },
  { icon: Smartphone, title: "Mobilfreundlich", desc: "Ihre Website sieht auf jedem Gerät professionell aus – wichtig, da viele Klienten unterwegs recherchieren." },
  { icon: TrendingUp, title: "Mehr Klienten gewinnen", desc: "Conversion-optimierter Aufbau mit klaren CTAs – von der Erstberatung bis zur Buchung." },
];

const faqs = [
  { q: "Warum brauche ich als Coach eine professionelle Website?", a: "Ihre Website ist Ihr digitales Aushängeschild. Potenzielle Klienten prüfen Ihre Online-Präsenz, bevor sie Kontakt aufnehmen. Eine professionelle Website schafft Vertrauen und positioniert Sie als Experte." },
  { q: "Was kostet eine Coach-Website?", a: "Unsere Websites für Coaches und Berater starten ab 1.500 €. Inkl. persönlichem Branding, SEO und Conversion-Optimierung. Kostenlose Vorschau in 48h." },
  { q: "Kann ich Testimonials und Erfolgsgeschichten selbst einpflegen?", a: "Ja, wir richten Ihre Website so ein, dass Sie Inhalte wie Testimonials, Blog-Beiträge und Angebote einfach selbst aktualisieren können." },
  { q: "Bietet ihr auch Landingpages für einzelne Angebote an?", a: "Ja! Für Webinare, Online-Kurse oder spezielle Programme erstellen wir gezielte Landingpages, die Teilnehmer und Klienten gewinnen." },
];

const WebdesignCoaches = () => (
  <main className="pt-20">
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
              Als Coach oder Berater sind Sie Experte auf Ihrem Gebiet. Ihre Website sollte das widerspiegeln –
              professionell, vertrauenswürdig und mit einer klaren Botschaft, die Klienten gewinnt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Website-Vorschau für Coaches <ArrowRight size={18} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Website-Check für Coaches</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-center mb-10 text-balance">Kennen Sie diese Herausforderungen?</h2>
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
          <h2 className="text-center mb-16 text-balance">So positionieren wir Sie online als Experte</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.08}>
              <div className="p-7 rounded-2xl border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 bg-background h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="gradient-hero-bg rounded-3xl p-12 md:p-16 text-primary-foreground mb-20">
            <h2 className="text-primary-foreground mb-5 text-balance text-center">Ergebnisse für Coaches & Berater</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {[
                { value: "+250%", label: "Mehr Anfragen" },
                { value: "48h", label: "Bis zur Vorschau" },
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
                  <CheckCircle size={17} className="text-primary shrink-0" />
                  <span className="text-sm font-medium">{l.label}</span>
                  <ArrowRight size={14} className="text-muted-foreground ml-auto" />
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
