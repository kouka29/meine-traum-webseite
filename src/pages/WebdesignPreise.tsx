import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const rentPackages = [
  {
    name: "Starter",
    price: "79 €/Monat",
    desc: "Perfekt für den Start – professionell online in wenigen Tagen.",
    features: [
      "1–5 Seiten",
      "Mobiloptimiertes Design",
      "Kontaktformular",
      "SSL-Zertifikat",
      "Mindestlaufzeit 12 Monate, danach monatlich kündbar",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "129 €/Monat",
    desc: "Für Betriebe die regelmäßig neue Kunden über Google wollen.",
    features: [
      "Bis zu 10 Seiten",
      "SEO-Grundlagen",
      "Google Business Einrichtung",
      "1x monatliche Anpassung",
      "Mindestlaufzeit 12 Monate, danach monatlich kündbar",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "199 €/Monat",
    desc: "Für Betriebe die dauerhaft mehr Aufträge und volle Kontrolle wollen.",
    features: [
      "Alles aus Pro",
      "Google Ads Betreuung",
      "Monatlicher Performance-Report",
      "Priority Support",
      "Mindestlaufzeit 12 Monate, danach monatlich kündbar",
    ],
    popular: false,
  },
];

const buyPackages = [
  {
    name: "Starter",
    price: "990 €",
    desc: "Perfekt für den Start – professionell online in wenigen Tagen.",
    features: [
      "1–5 Seiten",
      "Fertig in 5 Werktagen",
      "Mobiloptimiert, SSL, Kontaktformular",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "1.900 €",
    desc: "Für Betriebe die regelmäßig neue Kunden über Google wollen.",
    features: [
      "Bis zu 10 Seiten",
      "SEO-Grundlagen",
      "Google Business Einrichtung",
      "30 Tage Support nach Fertigstellung",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "3.500 €",
    desc: "Für Betriebe die dauerhaft mehr Aufträge und volle Kontrolle wollen.",
    features: [
      "Individuelles Design",
      "Unbegrenzte Seiten",
      "SEO + Google Ads Setup",
      "90 Tage Priority Support",
    ],
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

        <Tabs defaultValue="miete" className="mb-12">
          <TabsList className="mx-auto flex w-full max-w-sm mb-10">
            <TabsTrigger value="miete" className="flex-1">Miete</TabsTrigger>
            <TabsTrigger value="kauf" className="flex-1">Einmalkauf</TabsTrigger>
          </TabsList>

          {[
            { value: "miete", data: rentPackages },
            { value: "kauf", data: buyPackages },
          ].map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tab.data.map((pkg, i) => (
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
                          <div key={f} className="flex items-start gap-2.5">
                            <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
                            <span className="text-sm">{f}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant={pkg.popular ? "gradient" : "outline-primary"} size="lg" className="w-full" asChild>
                        <Link to="/kontakt">
                          Kostenlose Demo anfordern <ArrowRight size={16} />
                        </Link>
                      </Button>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <AnimatedSection>
          <div className="bg-card rounded-2xl p-8 border border-border text-center max-w-2xl mx-auto mb-20">
            <h3 className="font-heading text-lg font-bold mb-3">Miete oder kaufen?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Miete = maximale Flexibilität.<br />
              Einmalkauf = günstiger ab Jahr 2.<br />
              Wir helfen dir gerne bei der Entscheidung.
            </p>
          </div>
        </AnimatedSection>

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
