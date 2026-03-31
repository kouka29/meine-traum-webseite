import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const packages = [
  {
    name: "Starter",
    price: "ab 1.500 €",
    desc: "Perfekt für Selbstständige und kleine Unternehmen, die eine professionelle Online-Präsenz benötigen.",
    features: ["Bis zu 5 Seiten", "Responsive Design", "Kontaktformular", "SEO-Grundlagen", "SSL-Zertifikat", "1 Korrekturschleife"],
    popular: false,
  },
  {
    name: "Professional",
    price: "ab 3.000 €",
    desc: "Die beste Wahl für KMUs, die über ihre Website aktiv Kunden gewinnen möchten.",
    features: ["Bis zu 10 Seiten", "Conversion-optimiertes Design", "Kontaktformular & CTA-Elemente", "SEO-Optimierung", "CMS-Integration", "Analytics & Tracking", "3 Korrekturschleifen", "30 Tage Support"],
    popular: true,
  },
  {
    name: "Premium",
    price: "ab 5.000 €",
    desc: "Für Unternehmen, die eine maßgeschneiderte Lösung mit maximaler Wirkung benötigen.",
    features: ["Unbegrenzte Seiten", "Verkaufspsychologischer Aufbau", "Individuelle Funktionen", "Erweiterte SEO-Strategie", "A/B Testing", "Buchungssystem / Shop", "Laufende Optimierung", "Persönlicher Ansprechpartner", "60 Tage Priority Support"],
    popular: false,
  },
];

const faqs = [
  { q: "Was kostet eine Website erstellen lassen?", a: "Unsere Webdesign-Preise starten ab 1.500 € für eine professionelle Website. Der genaue Preis richtet sich nach Umfang, Funktionalität und individuellen Anforderungen. Wir erstellen Ihnen ein transparentes Angebot nach dem Erstgespräch." },
  { q: "Gibt es versteckte Kosten?", a: "Nein! Wir arbeiten mit transparenten Festpreisen. Was im Angebot steht, gilt – ohne Überraschungen." },
  { q: "Welches Paket passt zu mir?", a: "Das Starter-Paket eignet sich für einfache Unternehmensseiten. Professional ist ideal, wenn Sie aktiv Kunden über Ihre Website gewinnen möchten. Premium ist perfekt für komplexe Projekte mit individuellen Anforderungen." },
  { q: "Kann ich später upgraden?", a: "Ja! Sie können jederzeit Funktionen hinzufügen oder ein Upgrade auf ein größeres Paket vornehmen." },
  { q: "Sind laufende Kosten enthalten?", a: "Hosting und Domain sind nicht im Webdesign-Preis enthalten, können aber auf Wunsch von uns eingerichtet werden. Es gibt keine versteckten Abo-Kosten bei uns." },
];

const WebdesignPreise = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign Preise</span>
            <h1 className="mb-5 text-balance">
              Webdesign Preise –{" "}
              <span className="gradient-text">transparent und fair</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Was kostet eine professionelle Website? Unsere Webdesign-Preise sind transparent, fair und ohne versteckte Kosten.
              Finden Sie das passende Paket für Ihr Unternehmen.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {packages.map((pkg, i) => (
            <AnimatedSection key={pkg.name} delay={i * 0.1}>
              <div className={`rounded-2xl p-8 h-full flex flex-col border ${pkg.popular ? "border-primary shadow-elevated relative" : "border-border"} bg-background`}>
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1">
                    <Star size={12} /> Beliebteste Wahl
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold mb-1">{pkg.name}</h3>
                <p className="font-heading text-3xl font-bold gradient-text mb-3">{pkg.price}</p>
                <p className="text-sm text-muted-foreground mb-6">{pkg.desc}</p>
                <div className="space-y-3 flex-1 mb-8">
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle size={15} className="text-primary shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <Button variant={pkg.popular ? "gradient" : "outline-primary"} size="lg" className="w-full" asChild>
                  <Link to="/kontakt">
                    Angebot anfordern <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="bg-card rounded-2xl p-10 border border-border text-center mb-20">
            <h2 className="mb-4 text-balance">Nicht sicher, welches Paket passt?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Kein Problem! Fordern Sie eine kostenlose und unverbindliche Beratung an.
              Wir empfehlen Ihnen das passende Paket basierend auf Ihren Zielen und Anforderungen.
            </p>
            <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
              <Link to="/kontakt">Kostenlose Beratung anfordern <ArrowRight size={18} /></Link>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen zu Webdesign Preisen</h2>
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

    <CTABanner />
  </main>
);

export default WebdesignPreise;
