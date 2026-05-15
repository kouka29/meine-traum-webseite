import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, CheckCircle, Star, Lock, FileText, Target, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingLeadPopup from "@/components/PricingLeadPopup";
import StripeCheckoutDialog from "@/components/StripeCheckoutDialog";
import PaymentTrustStrip from "@/components/PaymentTrustStrip";

type Pkg = {
  name: string;
  price: string;
  subPrice?: string;
  desc?: string;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
  cta: string;
  upgradeHint?: string;
  growth?: { price: string; items: string[] };
  badge?: string;
  priceId?: string;
};

const rentPackages: Pkg[] = [
  {
    name: "Starter",
    price: "59 €/Monat",
    badge: "Starter Miete – 59 €/Monat netto",
    desc: "Mindestlaufzeit: 12 Monate, danach monatlich kündbar",
    priceId: "starter_rent_monthly",
    features: [
      "Ideal für Betriebe die schnell professionell online wollen",
      "One-Pager (1 Seite)",
      "Mobil-optimiert",
      "Kontaktformular",
      "SSL-Zertifikat & Hosting inklusive",
      "Online in 7 Tagen",
    ],
    cta: "Jetzt starten",
    upgradeHint: "↑ Upgrade auf Pro jederzeit – ohne neue Mindestlaufzeit",
    growth: {
      price: "+29 €/Monat zubuchbar",
      items: [
        "1 Änderung pro Monat inklusive",
        "Updates & Wartung",
        "Support per WhatsApp",
      ],
    },
  },
  {
    name: "Pro",
    price: "99 €/Monat",
    badge: "Pro Miete – 99 €/Monat netto",
    desc: "Mindestlaufzeit: 12 Monate, danach monatlich kündbar",
    priceId: "pro_rent_monthly",
    features: [
      "2–5 Seiten",
      "SEO-Grundlagen (Google findet Sie)",
      "Google Business Einrichtung",
      "Mobil-optimiert & SSL",
      "Hosting & Domain inklusive",
      "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
    ],
    popular: true,
    cta: "Jetzt starten",
    growth: {
      price: "+49 €/Monat zubuchbar",
      items: [
        "Bis zu 3 Änderungen pro Monat inklusive",
        "Updates & Wartung",
        "Priority Support per WhatsApp",
      ],
    },
  },
  {
    name: "Premium",
    price: "159 €/Monat",
    badge: "Premium Miete – 159 €/Monat netto",
    desc: "Mindestlaufzeit: 12 Monate, danach monatlich kündbar",
    priceId: "premium_rent_monthly",
    features: [
      "Bis zu 10 Seiten",
      "SEO-Grundlagen + Seitenstruktur",
      "Design das mehr Anfragen bringt",
      "Google Business Einrichtung",
      "Hosting & Domain inklusive",
      "Individuelle Umsetzung – Timing nach Absprache",
    ],
    cta: "Jetzt starten",
    growth: {
      price: "+79 €/Monat zubuchbar",
      items: [
        "Bis zu 5 Änderungen pro Monat inklusive",
        "Updates & Wartung",
        "Priority Support per WhatsApp",
        "Monatlicher Performance-Check",
      ],
    },
  },
  {
    name: "Enterprise",
    price: "Auf Anfrage",
    subPrice: "meist unter 300 €/Monat",
    badge: "Enterprise – Auf Anfrage",
    desc: "Für Betriebe mit besonderen Anforderungen",
    features: [
      "Onlineshop möglich",
      "Unbegrenzte Seiten",
      "SEO-Strategie",
      "Google Ads Setup",
      "Persönlicher Ansprechpartner",
      "3 Änderungen/Monat inklusive",
      "Wartung & Updates inklusive",
    ],
    enterprise: true,
    cta: "Beratung anfragen",
  },
];

type BuyPkg = {
  name: string;
  price: string;
  highlights?: string[];
  compare?: string;
  features: string[];
  footnote?: string;
  comparison?: string;
  popular?: boolean;
  cta: string;
  growth?: { price: string; items: string[] };
  badge?: string;
  priceId?: string;
};

const buyPackages: BuyPkg[] = [
  {
    name: "Starter",
    price: "990 € einmalig",
    badge: "Starter Kauf – 990 € netto",
    compare: "Miete Starter: 59 € × 24 = 1.416 € — hier sparen Sie 426 € (alle Preise netto)",
    features: [
      "Ideal für Betriebe die schnell professionell online wollen",
      "One-Pager (1 Seite)",
      "Mobil-optimiert",
      "Kontaktformular",
      "SSL-Zertifikat",
      "Online in 7 Tagen",
      "Website gehört Ihnen – kein Vertrag",
    ],
    growth: {
      price: "+29 €/Monat zubuchbar",
      items: [
        "1 Änderung pro Monat inklusive",
        "Updates & Wartung",
        "Support per WhatsApp",
      ],
    },
    comparison: "Inkl. Wachstumspaket Jahr 1: ca. 1.338 € (= 111 €/Monat)",
    cta: "Jetzt kaufen & starten",
    priceId: "starter_purchase_deposit",
  },
  {
    name: "Pro",
    price: "1.990 € einmalig",
    badge: "Pro Kauf – 1.990 € netto",
    compare: "Miete Pro: 99 € × 24 = 2.376 € — hier sparen Sie 386 € (alle Preise netto)",
    features: [
      "2–5 Seiten",
      "SEO-Grundlagen (Google findet Sie)",
      "Google Business Einrichtung",
      "30 Tage Support nach Start",
      "Mobil-optimiert & SSL",
      "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
      "Website gehört Ihnen – kein Vertrag",
    ],
    growth: {
      price: "+49 €/Monat zubuchbar",
      items: [
        "Bis zu 3 Änderungen pro Monat inklusive",
        "Updates & Wartung",
        "Priority Support per WhatsApp",
      ],
    },
    comparison: "Inkl. Wachstumspaket Jahr 1: ca. 2.578 € netto (= 215 €/Monat)",
    popular: true,
    cta: "Jetzt kaufen & starten",
    priceId: "pro_purchase_deposit",
  },
  {
    name: "Premium",
    price: "3.590 € einmalig",
    badge: "Premium Kauf – 3.590 € netto",
    compare: "Miete Premium: 159 € × 24 = 3.816 € — hier sparen Sie 226 € (alle Preise netto)",
    features: [
      "Bis zu 10 Seiten",
      "SEO-Grundlagen + Seitenstruktur",
      "Design das mehr Anfragen bringt",
      "60 Tage Priority Support",
      "Mobil-optimiert & SSL",
      "Individuelle Umsetzung – Timing nach Absprache",
      "Website gehört Ihnen – kein Vertrag",
    ],
    growth: {
      price: "+79 €/Monat zubuchbar",
      items: [
        "Bis zu 5 Änderungen pro Monat inklusive",
        "Updates & Wartung",
        "Priority Support per WhatsApp",
        "Monatlicher Performance-Check",
      ],
    },
    comparison: "Inkl. Wachstumspaket Jahr 1: ca. 4.538 € netto (= 378 €/Monat)",
    cta: "Jetzt kaufen & starten",
    priceId: "premium_purchase_deposit",
  },
];

const buyEnterprise = {
  name: "Enterprise",
  subtitle: "Für Betriebe mit besonderen Anforderungen",
  price: "Auf Anfrage – meist unter 300 €/Monat",
  features: [
    "Onlineshop möglich",
    "Unbegrenzte Seiten",
    "SEO-Strategie + Google Ads",
    "Persönlicher Ansprechpartner",
    "Wartung & Support inklusive",
    "Individuelle Umsetzung",
  ],
  cta: "Beratung anfragen",
  badge: "Enterprise – Auf Anfrage",
};

const faqs = [
  {
    q: "Lohnt sich eine Website überhaupt für meinen Betrieb?",
    a: "Ja – und zwar schneller als Sie denken. Ein einziger neuer Auftrag über Ihre Website deckt oft die kompletten Jahreskosten. Handwerker die wir betreuen berichten von durchschnittlich 6–12 neuen Anfragen pro Monat allein über ihre neue Website.",
  },
  {
    q: "Was passiert wenn mir die Vorschau nicht gefällt?",
    a: "Gar nichts. Sie zahlen keinen Cent. Kein Kleingedrucktes, kein Druck, keine Verpflichtung. Ich zeige Ihnen die Vorschau – gefällt sie Ihnen nicht, war es das. Kein unangenehmes Gespräch danach.",
  },
  {
    q: "Muss ich selbst viel Zeit investieren oder mich um Technik kümmern?",
    a: "Nein. Sie füllen einmal ein 2-Minuten-Formular aus und lehnen sich zurück. Ich kümmere mich um alles: Design, Texte, Technik, Einrichtung. Sie bekommen Ihre fertige Website – ohne einen einzigen technischen Handgriff.",
  },
  {
    q: "Was passiert nach den 12 Monaten Mindestlaufzeit?",
    a: "Nach den 12 Monaten läuft Ihr Vertrag automatisch monatlich weiter – das ist der Normalfall.\nSie können aber jederzeit kündigen, mit einer Frist von nur 30 Tagen.\nKein Preisanstieg, kein neuer Vertrag, keine versteckten Änderungen.\nEinfach kurz Bescheid geben – fertig.",
  },
  {
    q: "Wie lange dauert es bis ich erste Anfragen bekomme?",
    a: "Die meisten unserer Kunden sehen erste Ergebnisse innerhalb von 2–6 Wochen nach Launch. Wie schnell es geht hängt von Ihrer Region und Ihrem Gewerk ab. Wer zusätzlich Google Business einrichtet (ab Pro-Paket inklusive) sieht oft noch schneller Ergebnisse.",
  },
];

const PackageCard = ({
  pkg,
  i,
  onOpen,
  onCheckout,
}: {
  pkg: Pkg;
  i: number;
  onOpen: (badge: string) => void;
  onCheckout?: (pkg: Pkg) => void;
}) => (
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
      {pkg.price.toLowerCase().includes("anfrage") ? (
        <>
          <p className="text-sm text-muted-foreground mb-1">
            {pkg.subPrice ? `${pkg.price} – ${pkg.subPrice}` : pkg.price}
          </p>
          <p className="text-xs text-muted-foreground mb-3">zzgl. 19 % MwSt.</p>
        </>
      ) : (
        <>
          <p className="font-heading text-3xl font-bold gradient-text mb-1">{pkg.price}</p>
          <p className="text-xs text-muted-foreground mb-3">zzgl. 19 % MwSt.</p>
          {pkg.subPrice && (
            <p className="text-xs text-muted-foreground italic mb-3">{pkg.subPrice}</p>
          )}
        </>
      )}
      {pkg.desc && (
        <p className="text-sm text-muted-foreground mb-5 whitespace-pre-line">{pkg.desc}</p>
      )}
      <div className="space-y-3 flex-1 mb-8 mt-2">
        {pkg.features.map((f) => {
          if (f.startsWith("__hint__")) {
            return (
              <p key={f} className="text-xs text-muted-foreground pl-[22px] -mt-2">
                {f.replace("__hint__", "")}
              </p>
            );
          }
          return (
            <div key={f} className="flex items-start gap-2.5">
              <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
              <span className="text-sm">{f}</span>
            </div>
          );
        })}
      </div>
      {pkg.upgradeHint && (
        <p className="text-xs text-muted-foreground mb-4 -mt-4">{pkg.upgradeHint}</p>
      )}
      {pkg.growth && (
        <div className="mb-5 rounded-xl bg-muted/50 border border-border/60 p-4">
          <p className="text-xs font-semibold text-foreground/80 mb-2">
            🚀 Wachstumspaket: {pkg.growth.price}
          </p>
          <ul className="space-y-1 mb-2">
            {pkg.growth.items.map((g) => (
              <li key={g} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle size={12} className="text-muted-foreground shrink-0 mt-0.5" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground">Monatlich kündbar.</p>
        </div>
      )}
      <div className="space-y-2">
        <Button
          variant={pkg.popular ? "gradient" : pkg.enterprise ? "outline" : "outline-primary"}
          size="lg"
          className="w-full"
          onClick={() =>
            pkg.priceId && onCheckout
              ? onCheckout(pkg)
              : onOpen(pkg.badge ?? pkg.name)
          }
          data-pricing-cta="true"
        >
          {pkg.cta} <ArrowRight size={16} />
        </Button>
        {pkg.priceId && onCheckout && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => onOpen(pkg.badge ?? pkg.name)}
          >
            Lieber erst beraten lassen
          </Button>
        )}
      </div>
      {pkg.priceId && <PaymentTrustStrip />}
    </div>
  </AnimatedSection>
);

const BuyCard = ({
  pkg,
  i,
  onOpen,
  onCheckout,
}: {
  pkg: BuyPkg;
  i: number;
  onOpen: (badge: string) => void;
  onCheckout: (pkg: BuyPkg) => void;
}) => (
  <AnimatedSection delay={i * 0.08}>
    <div
      className={`relative rounded-2xl p-8 h-full flex flex-col border bg-background ${
        pkg.popular ? "border-primary shadow-elevated" : "border-border"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1 whitespace-nowrap">
          <Star size={12} /> Beliebteste Wahl
        </span>
      )}
      <h3 className="font-heading text-xl font-bold mb-1">{pkg.name}</h3>
      <p className="font-heading text-3xl font-bold gradient-text mb-1">{pkg.price}</p>
      <p className="text-xs text-muted-foreground mb-3">zzgl. 19 % MwSt.</p>
      {pkg.highlights && (
        <div className="space-y-1 mb-3">
          {pkg.highlights.map((h) => (
            <p key={h} className="text-sm font-medium text-[hsl(142,71%,29%)]">{h}</p>
          ))}
        </div>
      )}
      {pkg.compare && (
        <p className="text-xs text-muted-foreground mb-5">{pkg.compare}</p>
      )}
      <div className="space-y-3 flex-1 mb-4 mt-2">
        {pkg.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </div>
      {pkg.growth && (
        <div className="mb-3 rounded-xl bg-muted/50 border border-border/60 p-4">
          <p className="text-xs font-semibold text-foreground/80 mb-2">
            🚀 Wachstumspaket: {pkg.growth.price}
          </p>
          <ul className="space-y-1 mb-2">
            {pkg.growth.items.map((g) => (
              <li key={g} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle size={12} className="text-muted-foreground shrink-0 mt-0.5" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground">Monatlich kündbar.</p>
        </div>
      )}
      {pkg.comparison && (
        <>
          <div className="border-t border-border my-3" />
          <p className="text-sm text-foreground/80 mb-5 whitespace-pre-line">{pkg.comparison}</p>
        </>
      )}
      <div className="space-y-2">
        <Button
          variant={pkg.popular ? "gradient" : "outline-primary"}
          size="lg"
          className="w-full"
          onClick={() => (pkg.priceId ? onCheckout(pkg) : onOpen(pkg.badge ?? pkg.name))}
          data-pricing-cta="true"
        >
          {pkg.cta} <ArrowRight size={16} />
        </Button>
        {pkg.priceId && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => onOpen(pkg.badge ?? pkg.name)}
          >
            Lieber erst beraten lassen
          </Button>
        )}
      </div>
      {pkg.priceId && <PaymentTrustStrip />}
    </div>
  </AnimatedSection>
);

const WebdesignPreise = () => {
  const [showFloating, setShowFloating] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupBadge, setPopupBadge] = useState("Kostenlose Beratung");
  const [checkoutPkg, setCheckoutPkg] = useState<BuyPkg | null>(null);
  const openPopup = (badge: string) => {
    setPopupBadge(badge);
    setPopupOpen(true);
  };
  const openCheckout = (pkg: BuyPkg) => setCheckoutPkg(pkg);

  useEffect(() => {
    const ctaButtons = Array.from(
      document.querySelectorAll<HTMLElement>('[data-pricing-cta="true"]')
    );
    if (ctaButtons.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setShowFloating(visible.size === 0);
      },
      { threshold: 0.1 }
    );
    ctaButtons.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);

  return (
  <main className="pt-20">
    {/* Dezenter Demo-Banner ganz oben */}
    <div
      className="w-full border-b text-center px-4 py-2.5 text-sm"
      style={{ backgroundColor: "#F0F9FF", borderColor: "#BAE6FD" }}
    >
      <span className="text-foreground/80">
        🎁 Noch keine Demo gesehen? Starte kostenlos —{" "}
      </span>
      <button
        type="button"
        onClick={() => openPopup("Kostenlose Demo")}
        className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
      >
        Kostenlose Demo anfordern <ArrowRight size={14} />
      </button>
    </div>

    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign Preise</span>
            <h1 className="mb-5 text-balance">
              Was kostet Ihre{" "}
              <span className="gradient-text">neue Website?</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Mieten oder kaufen – Sie entscheiden. Keine versteckten Kosten.
            </p>
          </div>
        </AnimatedSection>

        <Tabs defaultValue="miete" className="mb-12">
          <TabsList className="mx-auto flex w-full max-w-sm mb-8">
            <TabsTrigger value="miete" className="flex-1">Mieten</TabsTrigger>
            <TabsTrigger value="kauf" className="flex-1">Einmalkauf</TabsTrigger>
          </TabsList>

          <p className="text-xs text-muted-foreground text-center italic -mt-4 mb-6 max-w-2xl mx-auto">
            Alle Preise verstehen sich netto zzgl. der gesetzlichen Mehrwertsteuer.<br />
            Für Gewerbetreibende voll absetzbar.
          </p>

          <TabsContent value="miete">
            <div className="mb-8 rounded-xl border px-5 py-3 text-center text-sm font-medium bg-primary/10 text-primary border-primary/20">
              ✓ Meistgewählt – kein großes Investment, sofort loslegen
            </div>
            <p className="text-center text-base md:text-lg italic text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ein verlorener Auftrag kostet Sie im Schnitt 800 €.<br />
              Ihre neue Website kostet Sie ab 59 €/Monat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentPackages.filter(p => !p.enterprise).map((pkg, i) => <PackageCard key={pkg.name} pkg={pkg} i={i} onOpen={openPopup} />)}
            </div>
            <div className="flex justify-center my-8">
              <Button variant="outline" size="lg" onClick={() => openPopup("Kostenlose Beratung")} data-pricing-cta="true" className="h-auto min-h-12 max-w-full whitespace-normal text-center py-3 px-6 bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <span className="flex items-center justify-center gap-2 leading-snug">
                  <span>Nicht sicher welches Paket passt? Kostenlos beraten lassen</span>
                  <ArrowRight size={16} className="shrink-0" />
                </span>
              </Button>
            </div>
            {rentPackages.filter(p => p.enterprise).map((pkg) => (
              <AnimatedSection key={pkg.name} delay={0.1}>
                <div className="rounded-2xl p-8 md:p-10 border border-foreground/40 bg-gradient-to-br from-card to-background flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">Auf Anfrage – meist unter 300 €/Monat</p>
                    <p className="text-xs text-muted-foreground mb-3">zzgl. 19 % MwSt.</p>
                    {pkg.desc && (
                      <p className="text-sm text-muted-foreground mb-5 whitespace-pre-line">{pkg.desc}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pkg.features.map((f) => (
                        <div key={f} className="flex items-start gap-2.5">
                          <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-auto">
                    <Button variant="gradient" size="lg" onClick={() => openPopup(pkg.badge ?? "Enterprise – Auf Anfrage")} data-pricing-cta="true">
                      {pkg.cta} <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </TabsContent>

          <TabsContent value="kauf">
            <div className="mb-8 rounded-xl border px-5 py-3 text-center text-sm font-medium bg-[#F0FFF4] text-[#166534] border-[#166534]/20">
              💡 Einmal zahlen. Für immer Ihr. Langfristig günstiger als Miete.
            </div>
            <p className="text-center text-base md:text-lg italic text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sie haben Miete gesehen – und überlegst ob Kauf mehr Sinn macht?<br />
              Hier ist die Antwort: Wer länger als 20 Monate plant, fährt mit Einmalkauf günstiger.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyPackages.map((pkg, i) => (
                <BuyCard
                  key={pkg.name}
                  pkg={pkg}
                  i={i}
                  onOpen={openPopup}
                  onCheckout={openCheckout}
                />
              ))}
            </div>
            <div className="flex justify-center my-8">
              <Button variant="outline" size="lg" onClick={() => openPopup("Kostenlose Beratung")} data-pricing-cta="true" className="h-auto min-h-12 max-w-full whitespace-normal text-center py-3 px-6 bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <span className="flex items-center justify-center gap-2 leading-snug">
                  <span>Nicht sicher welches Paket passt? Kostenlos beraten lassen</span>
                  <ArrowRight size={16} className="shrink-0" />
                </span>
              </Button>
            </div>
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl p-8 md:p-10 border border-foreground/40 bg-gradient-to-br from-card to-background flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-bold mb-1">{buyEnterprise.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{buyEnterprise.subtitle}</p>
                  <p className="font-heading text-2xl font-bold gradient-text mb-1">{buyEnterprise.price}</p>
                  <p className="text-xs text-muted-foreground mb-5">zzgl. MwSt.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {buyEnterprise.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:w-auto">
                  <Button variant="outline" size="lg" onClick={() => openPopup(buyEnterprise.badge)} data-pricing-cta="true">
                    {buyEnterprise.cta} <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </TabsContent>
        </Tabs>

        <AnimatedSection>
          <div className="bg-card rounded-2xl p-8 md:p-10 border border-border text-center max-w-3xl mx-auto mb-10">
            <h3 className="font-heading text-xl font-bold mb-4">Mieten oder kaufen – was passt zu Ihnen?</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Miete = sofort starten, kein großes Investment, maximale Flexibilität.<br />
              Einmalkauf = einmal zahlen, Website gehört Ihnen, langfristig günstiger.<br />
              Nicht sicher? Ich berate Sie kurz und kostenlos.
            </p>
            <Button variant="outline" size="lg" onClick={() => openPopup("Kostenlose Beratung")} data-pricing-cta="true" className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary">
              Kostenlos beraten lassen <ArrowRight size={18} />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto mb-20">
            {[
              { Icon: Lock, label: "Keine versteckten Kosten" },
              { Icon: FileText, label: "Kein Kleingedrucktes" },
              { Icon: Target, label: "Erst Demo – dann Entscheidung" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3 px-2">
                <Icon className="text-primary w-8 h-8 sm:w-6 sm:h-6" />
                <span className="text-[13px] sm:text-sm font-medium leading-[1.5]">{label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h2 className="mb-3 text-balance">Das fragen Handwerker am häufigsten</h2>
            <p className="text-muted-foreground">Keine Fachbegriffe. Keine Ausreden. Nur ehrliche Antworten.</p>
          </div>
          <div className="max-w-3xl mx-auto mb-12">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-card transition-all">
                  <AccordionTrigger className="text-left font-heading font-semibold text-base hover:no-underline py-5">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 whitespace-pre-line">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </AnimatedSection>
      </div>
    </section>

    <section className="bg-primary/10 py-[60px]">
      <div className="container-narrow px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-5">
          Bereit für Ihre neue Website?
        </h2>
        <p className="text-muted-foreground text-base md:text-lg mb-7 leading-relaxed max-w-2xl mx-auto">
          Kostenlose Design-Demo in 48 Stunden.<br />
          Kein Risiko. Keine Verpflichtung.<br />
          Gefällt sie Ihnen nicht – Sie zahlen nichts.
        </p>
        <Button variant="gradient" size="lg" onClick={() => openPopup("Kostenlose Beratung")} data-pricing-cta="true">
          Jetzt kostenlose Demo sichern <ArrowRight size={18} />
        </Button>
        <p className="text-sm text-muted-foreground mt-5">
          Fragen? Einfach anrufen: <a href="tel:+4915123456789" className="underline hover:text-foreground">+49 151 23456789</a>
        </p>
        <p className="text-sm text-muted-foreground mt-5">
          Bereits 12 Handwerksbetriebe vertrauen uns
        </p>
      </div>
    </section>

    <button
      type="button"
      onClick={() => openPopup("Kostenlose Beratung")}
      aria-hidden={!showFloating}
      className={`md:hidden fixed bottom-5 left-4 right-4 z-50 bg-primary text-primary-foreground font-bold text-center py-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-opacity duration-200 ${
        showFloating ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      Kostenlose Demo sichern →
    </button>

    <PricingLeadPopup open={popupOpen} badge={popupBadge} onClose={() => setPopupOpen(false)} />
    <StripeCheckoutDialog
      open={checkoutPkg !== null}
      onClose={() => setCheckoutPkg(null)}
      priceId={checkoutPkg?.priceId ?? null}
      packageName={checkoutPkg?.name ?? ""}
    />
  </main>
  );
};

export default WebdesignPreise;
