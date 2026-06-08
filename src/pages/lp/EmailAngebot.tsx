import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Quote,
  Handshake,
  Award,
  ThumbsUp,
  Lock,
  FileText,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PricingLeadPopup from "@/components/PricingLeadPopup";
import CheckoutFunnel, { type FunnelPaket, type FunnelAddon } from "@/components/angebot/CheckoutFunnel";
import PaymentTrustStrip from "@/components/PaymentTrustStrip";

type Pkg = {
  name: string;
  price: string;
  priceId: string;
  badge: string;
  includesHint?: string;
  features: string[];
  hidden: string[];
  subPrice?: string;
  desc?: string;
  enterprise?: boolean;
  compare?: string;
  popular?: boolean;
  cta: string;
};

const rentPackages: Pkg[] = [
  {
    name: "Starter",
    price: "59 €/Monat",
    priceId: "starter_rent_monthly",
    badge: "Starter Miete – 59 €/Monat netto",
    features: [
      "1 Seite: Leistungen, Über dich, Kontakt & Anfrageformular",
      "Individuelle Texte & Inhalte – du lieferst die Infos, wir schreiben",
      "Perfekt auf jedem Smartphone & Tablet",
      "Hosting, Domain & SSL inklusive – keine Extra-Kosten",
    ],
    hidden: [
      "Professionelles Design – kein Baukastensystem",
      "Upgrade auf Pro jederzeit – ohne neue Mindestlaufzeit",
    ],
    cta: "Jetzt Website sichern",
  },
  {
    name: "Pro",
    price: "99 €/Monat",
    priceId: "pro_rent_monthly",
    badge: "Pro Miete – 99 €/Monat netto",
    includesHint: "✓ Alles aus Starter inklusive – plus:",
    features: [
      "Bis zu 5 Seiten – Leistungen, Referenzen, Über uns, Kontakt",
      "Google Maps & Google Business vollständig eingerichtet",
      "Bei Google gefunden werden – wenn Kunden in deiner Stadt suchen",
      "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
    ],
    hidden: [
      "Kontaktformular auf jeder Seite",
      "Optimierte Ladezeiten durch Bildkomprimierung",
    ],
    popular: true,
    cta: "Jetzt starten – Website sichern",
  },
  {
    name: "Premium",
    price: "159 €/Monat",
    priceId: "premium_rent_monthly",
    badge: "Premium Miete – 159 €/Monat netto",
    includesHint: "✓ Alles aus Pro inklusive – plus:",
    features: [
      "Bis zu 10 Seiten – deine komplette Online-Präsenz",
      "Google-Optimierung beim Launch – damit dich Kunden in deiner Stadt finden",
      "Smarte Extras möglich – Terminbuchung, Rechner oder Anfrage-Tool",
      "Feinschliff nach Launch inklusive – damit alles genau passt",
    ],
    hidden: [
      "Angebotsanfrage-Formular – Kunden liefern dir alle Projektinfos direkt",
      "Bis zu 3 zusätzliche Landingpage inklusive – ideal für Aktionen oder Werbekampagnen",
      "Persönlicher Ansprechpartner",
    ],
    cta: "Premium sichern – Jetzt starten",
  },
];

const enterprisePkg = {
  name: "Enterprise",
  subtitle: "Für Betriebe mit besonderen Anforderungen",
  price: "Auf Anfrage – meist unter 300 €/Monat",
  badge: "Enterprise – Auf Anfrage",
  features: [
    "Onlineshop möglich",
    "Unbegrenzte Seiten",
    "SEO-Strategie",
    "Google Ads Setup",
    "Persönlicher Ansprechpartner",
    "Laufende Änderungen & Pflege inklusive",
    "Wartung & Updates inklusive",
  ],
  cta: "Beratung anfragen",
};

const buyCompare: Record<string, string> = {
  Starter: "Miete Starter: 59 € × 24 = 1.416 € — hier sparst du 426 € (alle Preise netto)",
  Pro: "Miete Pro: 99 € × 24 = 2.376 € — hier sparst du 386 € (alle Preise netto)",
  Premium: "Miete Premium: 159 € × 24 = 3.816 € — hier sparst du 226 € (alle Preise netto)",
};

const buyPackages: Pkg[] = rentPackages.map((p) => {
  const buyPrices: Record<string, string> = {
    Starter: "990 € einmalig",
    Pro: "1.990 € einmalig",
    Premium: "3.590 € einmalig",
  };
  const buyBadges: Record<string, string> = {
    Starter: "Starter Kauf – 990 € einmalig",
    Pro: "Pro Kauf – 1.990 € einmalig",
    Premium: "Premium Kauf – 3.590 € einmalig",
  };
  return {
    ...p,
    price: buyPrices[p.name],
    badge: buyBadges[p.name],
    priceId: `${p.name.toLowerCase()}_buy_onetime`,
    compare: buyCompare[p.name],
    cta: p.name === "Pro" ? "Jetzt kaufen – Website sichern" : p.name === "Premium" ? "Premium kaufen – Jetzt starten" : "Jetzt Website kaufen",
  };
});

const PAKET_NUMS: Record<string, { preis: number; miete: number; growth: number; growthItems: string[] }> = {
  Starter: {
    preis: 990, miete: 59, growth: 29,
    growthItems: ["1 Änderung pro Monat", "Updates & Wartung", "Support per WhatsApp"],
  },
  Pro: {
    preis: 1990, miete: 99, growth: 49,
    growthItems: ["Bis zu 3 Änderungen pro Monat", "Updates & Wartung", "Priority Support per WhatsApp"],
  },
  Premium: {
    preis: 3590, miete: 159, growth: 79,
    growthItems: ["Bis zu 5 Änderungen pro Monat", "Updates & Wartung", "Priority Support per WhatsApp", "Monatlicher Performance-Check"],
  },
};

const funnelPakete: FunnelPaket[] = Object.entries(PAKET_NUMS).map(([name, v]) => {
  const growthAddon: FunnelAddon = {
    id: `${name.toLowerCase()}_growth`,
    name: "Wachstumspaket",
    description: v.growthItems.join(" · ") + " — monatlich kündbar",
    emoji: "🚀",
    price_cents: v.growth * 100,
    price_type: "monthly",
    recommended: true,
    social_proof: "Beliebt bei aktiven Betrieben",
  };
  return {
    id: name.toLowerCase(),
    name,
    preis: v.preis,
    miete_monatlich: v.miete,
    addons: [growthAddon],
  };
});

const testimonials = [
  {
    id: "t1",
    name: "Markus L.",
    role: "Inhaber, Elektro Lenz GmbH",
    text: "Früher kamen Aufträge nur über Empfehlungen. Jetzt generiert unsere Website täglich neue Anfragen aus der Region.",
  },
  {
    id: "t2",
    name: "Thomas B.",
    role: "Inhaber, Malerbetrieb Brandt",
    text: "In der ersten Woche nach dem Launch hatten wir 4 neue Anfragen. Die Website macht das, was ich mir erhofft hatte.",
  },
  {
    id: "t3",
    name: "Andreas K.",
    role: "Geschäftsführer, Sanitär Krause",
    text: "Kunden finden uns jetzt sofort bei Google wenn sie nach Sanitär in unserer Stadt suchen. Das war vorher undenkbar.",
  },
  {
    id: "t4",
    name: "Kevin R.",
    role: "Inhaber, Dachdeckerei Richter",
    text: "Ich bin Dachdecker, kein IT-Typ. Trotzdem hat alles in 7 Tagen funktioniert — ohne dass ich einen Finger rühren musste.",
  },
  {
    id: "t5",
    name: "Jürgen M.",
    role: "Meister, Elektro Müller",
    text: "59€ im Monat und ich brauche keine Werbung mehr zu schalten. Die Website holt mir die Kunden selbst.",
  },
];

const faqs = [
  {
    q: "Mieten oder kaufen – was passt zu mir?",
    a: "Miete = sofort starten, kein großes Investment, maximale Flexibilität. Hosting, Wartung und Support sind inklusive – du kümmerst dich um nichts. Einmalkauf = einmal zahlen, die Website gehört dir, nach ca. 2 Jahren günstiger als die Miete. Nicht sicher? Wir beraten dich kostenlos.",
  },
  {
    q: "Wie lange dauert es bis meine Website fertig ist?",
    a: "Beim Starter-Paket ist deine Website in 7 Tagen live. Beim Pro-Paket ca. 2 Wochen. Beim Premium-Paket besprechen wir Timing individuell nach deinen Wünschen.",
  },
  {
    q: "Was passiert nach den 12 Monaten?",
    a: "Nach dem 12-monatigen Startzeitraum läuft dein Vertrag monatlich weiter – du kannst jederzeit kündigen. Keine automatische Verlängerung auf ein weiteres Jahr.",
  },
  {
    q: "Muss ich selbst Texte und Inhalte liefern?",
    a: "Nein – du lieferst uns deine Infos (was du anbietest, wo du tätig bist, Fotos wenn vorhanden) und wir schreiben die Texte für dich. Professionell, auf dein Unternehmen zugeschnitten.",
  },
  {
    q: "Was ist wenn ich mit der Website nicht zufrieden bin?",
    a: "Wir zeigen dir vor dem Launch eine Vorschau – erst wenn du zufrieden bist, gehen wir live. Beim Premium-Paket sind zusätzlich Korrekturen nach Launch inklusive.",
  },
  {
    q: "Kann ich mein Paket später wechseln?",
    a: "Ja – du kannst jederzeit auf ein höheres Paket upgraden, ohne neue Mindestlaufzeit. Ein Downgrade ist nach Ende des Startzeitraums möglich.",
  },
  {
    q: "Ist die Website auch auf dem Handy nutzbar?",
    a: "Ja – alle Websites sind vollständig für Smartphones und Tablets optimiert. Deine Kunden können dich von überall problemlos erreichen.",
  },
];

const initialsFor = (name: string) =>
  name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("");

const TrustStrip = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full my-8">
    {[
      { Icon: Handshake, num: "150+", label: "Betriebe vertrauen uns" },
      { Icon: Award, num: "6 Jahre", label: "Erfahrung im Webdesign für Selbstständige" },
      { Icon: ThumbsUp, num: "98%", label: "Weiterempfehlungsrate" },
      { Icon: Clock, num: "48h", label: "Erstes Konzept steht" },
    ].map(({ Icon, num, label }) => (
      <div
        key={num}
        className="flex items-center gap-3 sm:gap-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 sm:px-4 sm:py-5"
      >
        <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Icon size={22} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-2xl sm:text-[1.75rem] font-bold text-[#5B3DC8] leading-none mb-1 whitespace-nowrap">{num}</p>
          <p className="text-xs text-muted-foreground leading-snug">{label}</p>
        </div>
      </div>
    ))}
  </div>
);

const TestimonialCarousel = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisible(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pageCount = Math.max(1, testimonials.length - visible + 1);

  useEffect(() => {
    setIdx((i) => Math.min(i, Math.max(0, testimonials.length - visible)));
  }, [visible]);

  useEffect(() => {
    if (pageCount <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pageCount), 6000);
    return () => clearInterval(t);
  }, [pageCount]);

  return (
    <div className="max-w-6xl mx-auto my-16 px-4">
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${idx * (100 / visible)}%)`,
            transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="shrink-0 px-2.5" style={{ flex: `0 0 ${100 / visible}%` }}>
              <div className="relative overflow-hidden rounded-3xl bg-background border border-border shadow-[0_20px_50px_rgba(91,61,200,0.08)] flex flex-col h-full">
                <div className="p-7 md:p-8 flex-1 flex flex-col relative">
                  <Quote size={80} className="absolute top-5 right-5 text-primary/[0.06] pointer-events-none" fill="currentColor" strokeWidth={0} />
                  <div className="flex gap-1 mb-5 relative z-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400" fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <blockquote className="font-heading text-base md:text-lg leading-snug text-foreground font-semibold mb-6 tracking-tight flex-1 relative z-10">
                    „{t.text}"
                  </blockquote>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm ring-4 ring-primary/10 shrink-0">
                      {initialsFor(t.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground tracking-wider uppercase mt-0.5 truncate">{t.role}</p>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-[hsl(250,56%,65%)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Seite ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HiddenFeaturesAccordion = ({ items }: { items: string[] }) => {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/5 rounded-xl px-4 py-2.5 transition-colors"
      >
        <span>Alle Leistungen anzeigen</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <ul className="space-y-1.5">
              {items.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground/85">
                  <CheckCircle size={13} className="text-primary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailAngebot = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupBadge, setPopupBadge] = useState("Kostenlose Beratung");
  const [checkoutPkg, setCheckoutPkg] = useState<{ name: string } | null>(null);
  const [mode, setMode] = useState<"miete" | "kauf">("miete");

  const openPopup = (badge: string) => {
    setPopupBadge(badge);
    setPopupOpen(true);
  };

  const currentFunnelPaket = checkoutPkg
    ? funnelPakete.find((p) => p.name === checkoutPkg.name) ?? funnelPakete[0]
    : null;

  return (
    <main className="min-h-screen bg-background">
      {/* Minimal-Header */}
      <header className="border-b border-border/50">
        <div className="container-narrow px-4 py-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(250,56%,65%)] flex items-center justify-center">
            <Sparkles size={16} className="text-primary-foreground" />
          </div>
          <span className="font-heading font-semibold text-sm text-foreground">Meine Traum Webseite</span>
        </div>
      </header>

      <section className="section-padding pt-12">
        <div className="container-narrow px-4">
          {/* BLOCK 1: Hero */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h1 className="mb-5 text-balance leading-[1.15] pb-2">
              Deine neue <span className="gradient-text inline-block pb-1">Website</span> —<br />
              in 7 Tagen live.
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Professionell online. Steuerlich absetzbar.<br />
              Ohne Technik-Stress.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm font-medium text-foreground/85">
              <div className="flex items-center justify-center gap-2">
                <Clock size={18} className="text-primary" />
                <span>In 7 Tagen live</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                <span>Steuerlich voll absetzbar</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <span>Kein Technik-Wissen nötig</span>
              </div>
            </div>
          </div>

          {/* BLOCK 2: Preisanker */}
          <p className="text-center text-base md:text-lg italic text-muted-foreground mb-10 max-w-2xl mx-auto">
            Ein verlorener Auftrag kostet dich im Schnitt 800 €.<br />
            Deine neue Website kostet dich ab 59 €/Monat.
          </p>

      {/* TrustStrip */}
      <TrustStrip />

          {/* BLOCK 3: Pricing */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as "miete" | "kauf")} className="mb-8">
            <TabsList className="mx-auto flex w-full max-w-sm mb-6">
              <TabsTrigger value="miete" className="flex-1">Monatlich flexibel</TabsTrigger>
              <TabsTrigger value="kauf" className="flex-1">Einmalig kaufen</TabsTrigger>
            </TabsList>

            <p className="text-xs text-muted-foreground text-center italic mb-6 max-w-2xl mx-auto">
              Alle Preise verstehen sich netto zzgl. der gesetzlichen Mehrwertsteuer.<br />
              Für Gewerbetreibende voll absetzbar.
            </p>

            {(["miete", "kauf"] as const).map((m) => {
              const list = m === "miete" ? rentPackages : buyPackages;
              return (
                <TabsContent key={m} value={m}>
                  <div className="mb-8 rounded-xl border px-5 py-3 text-center text-sm font-medium" style={m === "miete"
                    ? { background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.2)" }
                    : { background: "#F0FFF4", color: "#166534", borderColor: "rgba(22,101,52,0.2)" }}>
                    {m === "miete"
                      ? "✓ Meistgewählt – kein großes Investment, sofort loslegen"
                      : "💡 Einmal zahlen. Für immer dein. Nach ca. 2 Jahren günstiger als die Miete."}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-4">
                    {list.map((pkg) => (
                      <div
                        key={pkg.name}
                        className={`relative rounded-2xl p-10 h-full flex flex-col border bg-background ${
                          pkg.popular
                            ? "border-[5px] border-primary shadow-[0_32px_70px_-12px_hsl(var(--primary)/0.5)] lg:scale-[1.05] lg:z-10"
                            : "border-4 border-primary"
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1 whitespace-nowrap">
                            <Star size={12} /> Beliebteste Wahl
                          </span>
                        )}
                        <h3 className="font-heading text-xl font-bold mb-1">{pkg.name}</h3>
                        <p className="font-heading text-3xl font-bold gradient-text mb-6">{pkg.price}</p>
                        {pkg.compare && (
                          <p className="text-xs text-muted-foreground mb-5">{pkg.compare}</p>
                        )}
                        {pkg.includesHint && (
                          <p className="text-xs text-primary mt-2 mb-3">{pkg.includesHint}</p>
                        )}
                        <div className="space-y-3 flex-1 mb-6">
                          {pkg.features.map((f) => (
                            <div key={f} className="flex items-start gap-2.5">
                              <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
                              <span className="text-sm">{f}</span>
                            </div>
                          ))}
                        </div>
                        <HiddenFeaturesAccordion items={pkg.hidden} />
                        <div className="space-y-2 mt-6">
                          <Button
                            variant="gradient"
                            size="lg"
                            className="w-full"
                            onClick={() => setCheckoutPkg({ name: pkg.name })}
                          >
                            {pkg.cta} <ArrowRight size={16} />
                          </Button>
                          <button
                            type="button"
                            onClick={() => openPopup(pkg.badge)}
                            className="w-full text-sm font-semibold text-primary hover:underline pt-1"
                          >
                            Kostenlos beraten lassen →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Enterprise Block */}
                  <div className="mt-8 rounded-2xl p-8 md:p-10 border border-foreground/40 bg-gradient-to-br from-card to-background flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold mb-1">{enterprisePkg.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{enterprisePkg.subtitle}</p>
                      <p className="font-heading text-2xl font-bold gradient-text mb-1">{enterprisePkg.price}</p>
                      <p className="text-xs text-muted-foreground mb-5">zzgl. 19 % MwSt.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {enterprisePkg.features.map((f) => (
                          <div key={f} className="flex items-start gap-2.5">
                            <CheckCircle size={15} className="text-primary shrink-0 mt-1" />
                            <span className="text-sm">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:w-auto">
                      <Button variant="outline" size="lg" onClick={() => openPopup(enterprisePkg.badge)}>
                        {enterprisePkg.cta} <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <p className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>🛡️</span>
            <span>Website in 7 Tagen live — oder wir arbeiten kostenlos weiter bis sie steht.</span>
          </p>
          <div className="mt-4 flex justify-center">
            <PaymentTrustStrip kind={mode === "miete" ? "rent" : "deposit"} />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            * 12 Monate Startzeitraum – danach monatlich kündbar. Alle Preise netto zzgl. 19% MwSt.
          </p>

          {/* BLOCK 4: Testimonials Carousel */}
          <TestimonialCarousel />

          {/* BLOCK 5: FAQ */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-center mb-8 text-balance">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-card transition-all"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-base hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-20">
            {[
              { Icon: Lock, label: "Keine versteckten Kosten", sub: "Was Du siehst ist was Du zahlst" },
              { Icon: FileText, label: "Kein Kleingedrucktes", sub: "Einfache, klare Verträge" },
              { Icon: Target, label: "Erst Demo – dann Entscheidung", sub: "Kostenlose Vorschau in 48 Stunden" },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3 px-2">
                <Icon className="text-primary w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.8} />
                <span className="text-base sm:text-[17px] font-bold leading-snug text-foreground">{label}</span>
                <span className="text-xs sm:text-sm text-muted-foreground leading-[1.5]">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 6: Finaler CTA */}
      <section className="bg-primary/10 py-[60px]">
        <div className="container-narrow px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-5">
            Mehr Aufträge. Weniger Aufwand.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-7 leading-relaxed max-w-2xl mx-auto">
            Kostenlose Design-Demo in 48 Stunden. Kein Risiko. Keine Verpflichtung.<br />
            Gefällt sie dir nicht — Du zahlst nichts.
          </p>
          <Button variant="gradient" size="lg" onClick={() => openPopup("Kostenlose Beratung")}>
            Kostenlose Demo anfordern — in 48h fertig <ArrowRight size={18} />
          </Button>
          <p className="text-sm text-muted-foreground mt-5">
            Fragen? Einfach anrufen:{" "}
            <a href="tel:+4961313076498" className="underline hover:text-foreground font-semibold">
              06131 30 764 98
            </a>
          </p>
          <p className="text-base md:text-lg font-bold text-primary mt-6">
            ⭐⭐⭐⭐⭐ Bereits 150+ Handwerksbetriebe aus der Region vertrauen uns
          </p>
        </div>
      </section>

      {/* BLOCK 7: Minimal-Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 Meine Traum Webseite · QK Marketing ·{" "}
          <Link to="/impressum" className="underline hover:text-foreground">Impressum</Link>{" "}·{" "}
          <Link to="/datenschutz" className="underline hover:text-foreground">Datenschutz</Link>
        </p>
      </footer>

      <PricingLeadPopup open={popupOpen} badge={popupBadge} onClose={() => setPopupOpen(false)} />
      {currentFunnelPaket && checkoutPkg && (
        <CheckoutFunnel
          open={checkoutPkg !== null}
          onClose={() => setCheckoutPkg(null)}
          paket={currentFunnelPaket}
          pakete={funnelPakete}
          addons={[]}
          paymentConfig={{
            kauf: { enabled: true, mode: "deposit", deposit_percent: 50 },
            miete: { enabled: true, monthly_cents: (currentFunnelPaket.miete_monatlich || 0) * 100, min_months: 12 },
          }}
          defaultPaymentMode={mode}
        />
      )}
    </main>
  );
};

export default EmailAngebot;