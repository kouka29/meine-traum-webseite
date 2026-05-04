import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { ArrowRight, CheckCircle, Star, Lock, FileText, Target } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Pkg = {
  name: string;
  price: string;
  subPrice?: string;
  desc?: string;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
  cta: string;
};

const rentPackages: Pkg[] = [
  {
    name: "Starter",
    price: "49 €/Monat",
    desc: "Mindestlaufzeit: 24 Monate, danach monatlich kündbar",
    features: [
      "One-Pager (1 Seite)",
      "Mobil-optimiert",
      "Kontaktformular",
      "SSL-Zertifikat",
      "Fertig in 7 Werktagen",
    ],
    cta: "Kostenlose Demo anfordern",
  },
  {
    name: "Pro",
    price: "99 €/Monat",
    desc: "Mindestlaufzeit: 12 Monate, danach monatlich kündbar",
    features: [
      "2–5 Seiten",
      "SEO-Grundlagen (Google findet dich)",
      "Google Business Einrichtung",
      "1x Änderung pro Monat",
      "30 Tage Support nach Launch",
    ],
    popular: true,
    cta: "Kostenlose Demo anfordern",
  },
  {
    name: "Premium",
    price: "159 €/Monat",
    desc: "Mindestlaufzeit: 12 Monate, danach monatlich kündbar",
    features: [
      "Bis zu 10 Seiten",
      "SEO-Grundlagen + Seitenstruktur",
      "Conversion-optimiertes Design",
      "2x Änderungen pro Monat",
      "Priority Support (Antwort in 24h)",
    ],
    cta: "Kostenlose Demo anfordern",
  },
  {
    name: "Enterprise",
    price: "Auf Anfrage",
    desc: "Für Betriebe mit besonderen Anforderungen",
    features: [
      "Onlineshop möglich",
      "Unbegrenzte Seiten",
      "SEO-Strategie",
      "Google Ads Setup",
      "Persönlicher Ansprechpartner",
    ],
    enterprise: true,
    cta: "Jetzt anfragen",
  },
];

const buyPackages: Pkg[] = [
  {
    name: "Starter",
    price: "990 € einmalig",
    subPrice: "≈ 41 €/Monat über 2 Jahre",
    features: [
      "One-Pager (1 Seite)",
      "Mobil-optimiert, SSL, Kontaktformular",
      "Fertig in 7 Werktagen",
    ],
    cta: "Kostenlose Demo anfordern",
  },
  {
    name: "Pro",
    price: "1.900 € einmalig",
    subPrice: "≈ 158 €/Monat im ersten Jahr",
    features: [
      "2–5 Seiten",
      "SEO-Grundlagen",
      "Google Business Einrichtung",
      "30 Tage Support",
    ],
    popular: true,
    cta: "Kostenlose Demo anfordern",
  },
  {
    name: "Premium",
    price: "3.500 € einmalig",
    subPrice: "≈ 291 €/Monat im ersten Jahr",
    features: [
      "Bis zu 10 Seiten",
      "SEO-Grundlagen + Seitenstruktur",
      "Conversion-optimiertes Design",
      "60 Tage Priority Support",
    ],
    cta: "Kostenlose Demo anfordern",
  },
  {
    name: "Enterprise",
    price: "Auf Anfrage",
    features: [
      "Onlineshop",
      "Unbegrenzte Seiten",
      "SEO-Strategie + Google Ads",
      "Individuelle Umsetzung",
    ],
    enterprise: true,
    cta: "Jetzt anfragen",
  },
];

const faqs = [
  { q: "Was kostet eine Website erstellen lassen?", a: "Unsere Webdesign-Preise starten ab 49 €/Monat (Miete) oder 990 € einmalig. Der genaue Preis richtet sich nach Umfang, Funktionalität und individuellen Anforderungen. Wir erstellen dir ein transparentes Angebot nach dem Erstgespräch." },
  { q: "Gibt es versteckte Kosten?", a: "Nein! Wir arbeiten mit transparenten Festpreisen. Was im Angebot steht, gilt – ohne Überraschungen." },
  { q: "Welches Paket passt zu mir?", a: "Starter eignet sich für einfache Unternehmensseiten. Pro ist ideal, wenn du aktiv Kunden über Google gewinnen möchtest. Premium ist perfekt für conversion-optimierte Websites mit mehr Inhalten." },
  { q: "Kann ich später upgraden?", a: "Ja! Du kannst jederzeit Funktionen hinzufügen oder ein Upgrade auf ein größeres Paket vornehmen." },
  { q: "Sind laufende Kosten enthalten?", a: "Bei Miete sind Hosting, Wartung und SSL inklusive. Beim Einmalkauf können Hosting und Domain auf Wunsch von uns eingerichtet werden." },
];

const PackageCard = ({ pkg, i }: { pkg: Pkg; i: number }) => (
  <AnimatedSection delay={i * 0.08}>
    <div
      className={`relative rounded-2xl p-8 h-full flex flex-col border bg-background ${
        pkg.popular
          ? "border-primary shadow-elevated"
          : pkg.enterprise
            ? "border-foreground/40 bg-gradient-to-br from-card to-background"
            : "border-border"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1 whitespace-nowrap">
          <Star size={12} /> Beliebteste Wahl
        </span>
      )}
      <h3 className="font-heading text-xl font-bold mb-1">{pkg.name}</h3>
      <p className="font-heading text-3xl font-bold gradient-text mb-2">{pkg.price}</p>
      {pkg.subPrice && (
        <p className="text-xs text-muted-foreground italic mb-3">{pkg.subPrice}</p>
      )}
      {pkg.desc && (
        <p className="text-sm text-muted-foreground mb-5">{pkg.desc}</p>
      )}
      <div className="space-y-3 flex-1 mb-8 mt-2">
        {pkg.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </div>
      <Button
        variant={pkg.popular ? "gradient" : pkg.enterprise ? "outline" : "outline-primary"}
        size="lg"
        className="w-full"
        asChild
      >
        <Link to="/kontakt#formular">
          {pkg.cta} <ArrowRight size={16} />
        </Link>
      </Button>
    </div>
  </AnimatedSection>
);

const WebdesignPreise = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign Preise</span>
            <h1 className="mb-5 text-balance">
              Was kostet deine{" "}
              <span className="gradient-text">neue Website?</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Mieten oder kaufen – du entscheidest. Keine versteckten Kosten.
            </p>
          </div>
        </AnimatedSection>

        <Tabs defaultValue="miete" className="mb-12">
          <TabsList className="mx-auto flex w-full max-w-sm mb-8">
            <TabsTrigger value="miete" className="flex-1">Mieten</TabsTrigger>
            <TabsTrigger value="kauf" className="flex-1">Einmalkauf</TabsTrigger>
          </TabsList>

          <TabsContent value="miete">
            <div className="mb-8 rounded-xl border px-5 py-3 text-center text-sm font-medium bg-primary/10 text-primary border-primary/20">
              ✓ Meistgewählt – kein großes Investment, sofort loslegen
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentPackages.map((pkg, i) => <PackageCard key={pkg.name} pkg={pkg} i={i} />)}
            </div>
          </TabsContent>

          <TabsContent value="kauf">
            <div className="mb-8 rounded-xl border px-5 py-3 text-center text-sm font-medium bg-muted text-muted-foreground border-border">
              💡 Einmalkauf = günstiger ab Monat 20. Die Website gehört dir.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buyPackages.map((pkg, i) => <PackageCard key={pkg.name} pkg={pkg} i={i} />)}
            </div>
          </TabsContent>
        </Tabs>

        <AnimatedSection>
          <div className="bg-card rounded-2xl p-8 md:p-10 border border-border text-center max-w-3xl mx-auto mb-10">
            <h3 className="font-heading text-xl font-bold mb-4">Mieten oder kaufen – was passt zu dir?</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Miete = sofort starten, kein großes Investment, maximale Flexibilität.<br />
              Einmalkauf = einmal zahlen, Website gehört dir, langfristig günstiger.<br />
              Nicht sicher? Ich berate dich kurz und kostenlos.
            </p>
            <Button variant="gradient" size="lg" asChild>
              <Link to="/kontakt#formular">Kostenlos beraten lassen <ArrowRight size={18} /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-20">
            {[
              { Icon: Lock, label: "Keine versteckten Kosten" },
              { Icon: FileText, label: "Kein Kleingedrucktes" },
              { Icon: Target, label: "Erst Demo – dann Entscheidung" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 p-4 rounded-xl border border-border bg-background">
                <Icon className="text-primary" size={22} />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
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
