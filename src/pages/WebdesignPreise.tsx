import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Lock,
  FileText,
  Target,
  Phone,
  Handshake,
  Award,
  Clock,
  ChevronDown,
  Quote,
  ThumbsUp,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingLeadPopup from "@/components/PricingLeadPopup";
import CheckoutFunnel, { type FunnelPaket, type FunnelAddon } from "@/components/angebot/CheckoutFunnel";
import PaymentTrustStrip from "@/components/PaymentTrustStrip";
import { supabase } from "@/integrations/supabase/client";
import { usePricingName, PricingName } from "@/lib/pricingNames";

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

type DbTestimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  result: string;
};

const TestimonialBlock = () => {
  const items: DbTestimonial[] = [
    {
      id: "t1",
      name: "Markus L.",
      role: "Inhaber, Elektro Lenz GmbH",
      text: "Früher kamen Aufträge nur über Empfehlungen. Jetzt generiert unsere Website täglich neue Anfragen aus der Region.",
      result: "",
    },
    {
      id: "t2",
      name: "Thomas B.",
      role: "Inhaber, Malerbetrieb Brandt",
      text: "In der ersten Woche nach dem Launch hatten wir 4 neue Anfragen. Die Website macht das, was ich mir erhofft hatte.",
      result: "",
    },
    {
      id: "t3",
      name: "Andreas K.",
      role: "Geschäftsführer, Sanitär Krause",
      text: "Kunden finden uns jetzt sofort bei Google wenn sie nach Sanitär in unserer Stadt suchen. Das war vorher undenkbar.",
      result: "",
    },
    {
      id: "t4",
      name: "Kevin R.",
      role: "Inhaber, Dachdeckerei Richter",
      text: "Ich bin Dachdecker, kein IT-Typ. Trotzdem hat alles in 7 Tagen funktioniert — ohne dass ich einen Finger rühren musste.",
      result: "",
    },
    {
      id: "t5",
      name: "Jürgen M.",
      role: "Meister, Elektro Müller",
      text: "59€ im Monat und ich brauche keine Werbung mehr zu schalten. Die Website holt mir die Kunden selbst.",
      result: "",
    },
  ];
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

  const pageCount = Math.max(1, items.length - visible + 1);

  useEffect(() => {
    setIdx((i) => Math.min(i, Math.max(0, items.length - visible)));
  }, [visible, items.length]);

  useEffect(() => {
    if (pageCount <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pageCount), 6000);
    return () => clearInterval(t);
  }, [pageCount]);

  if (items.length === 0) return null;

  const initialsFor = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("");

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${idx * (100 / visible)}%)`,
            transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {items.map((t) => (
            <div
              key={t.id}
              className="shrink-0 px-2.5"
              style={{ flex: `0 0 ${100 / visible}%` }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-background border border-border shadow-[0_20px_50px_rgba(91,61,200,0.08)] flex flex-col h-full">
            <div className="p-7 md:p-8 flex-1 flex flex-col relative">
              <Quote
                size={80}
                className="absolute top-5 right-5 text-primary/[0.06] pointer-events-none"
                fill="currentColor"
                strokeWidth={0} aria-hidden={true} focusable={false} />
              <div className="flex gap-1 mb-5 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400" fill="currentColor" stroke="none" aria-hidden={true} focusable={false} />
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
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const GrowthAccordion = ({
  growth,
  extraFeatures,
}: {
  growth?: { price: string; items: string[] };
  extraFeatures?: string[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/5 rounded-xl px-4 py-2.5 transition-colors"
      >
        <span>Alle Leistungen anzeigen</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden={true} focusable={false} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
            {extraFeatures && extraFeatures.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary">Weitere Leistungen</p>
                <ul className="space-y-1.5">
                  {extraFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground/85">
                      <CheckCircle size={13} className="text-primary shrink-0 mt-0.5" aria-hidden={true} focusable={false} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Wachstumspaket-Block entfernt */}
          </div>
        </div>
      </div>
    </div>
  );
};

type Addon = {
  name: string;
  price: string;
  features: string[];
};

const addons: Addon[] = [
  {
    name: "Starter Add-on",
    price: "+29 €/Monat",
    features: [
      "1 Änderung pro Monat inklusive",
      "Updates & Wartung",
      "Support per WhatsApp",
    ],
  },
  {
    name: "Pro Add-on",
    price: "+49 €/Monat",
    features: [
      "Bis zu 3 Änderungen pro Monat inklusive",
      "Updates & Wartung",
      "Priority Support per WhatsApp",
    ],
  },
  {
    name: "Premium Add-on",
    price: "+79 €/Monat",
    features: [
      "Bis zu 5 Änderungen pro Monat inklusive",
      "Updates & Wartung",
      "Priority Support per WhatsApp",
      "Monatlicher Performance-Check",
    ],
  },
];

const AddonsSection = () => (
  <section className="my-16">
    <p className="text-center text-sm text-muted-foreground mb-6">
      Mehr herausholen? Add-ons zubuchbar – monatlich kündbar.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {addons.map((a) => (
        <div
          key={a.name}
          className="rounded-2xl border border-border bg-muted/40 p-6 flex flex-col"
        >
          <h3 className="font-heading text-lg font-semibold mb-1">{a.name}</h3>
          <p className="text-2xl font-bold text-foreground">{a.price}</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            zzgl. 19% MwSt. · monatlich kündbar
          </p>
          <ul className="space-y-2 mb-6 flex-1">
            {a.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle size={14} className="text-primary shrink-0 mt-0.5" aria-hidden={true} focusable={false} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary text-primary hover:bg-primary/10 transition-colors px-5 py-2.5 text-sm font-semibold"
          >
            Add-on hinzufügen <ArrowRight size={16} aria-hidden={true} focusable={false} />
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export type Pkg = {
  name: string;
  price: string;
  subPrice?: string;
  desc?: string;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
  cta: string;
  upgradeHint?: string;
  includesHint?: string;
  growth?: { price: string; items: string[] };
  badge?: string;
  priceId?: string;
};

export const rentPackages: Pkg[] = [
  {
    name: "Starter",
    price: "59 €/Monat",
    badge: "Starter Miete – 59 €/Monat netto",
    priceId: "starter_rent_monthly",
    features: [
      "1 Seite: Leistungen, Über dich, Kontakt & Anfrageformular",
      "Individuelle Texte & Inhalte – du lieferst die Infos, wir schreiben",
      "Perfekt auf jedem Smartphone & Tablet",
      "Hosting, Domain & SSL inklusive – keine Extra-Kosten",
      "Professionelles Design – kein Baukastensystem",
      "Upgrade auf Pro jederzeit – ohne neue Mindestlaufzeit",
    ],
    cta: "Jetzt Website sichern",
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
    priceId: "pro_rent_monthly",
    includesHint: "✓ Alles aus Starter inklusive – plus:",
    features: [
      "Bis zu 5 Seiten – Leistungen, Referenzen, Über uns, Kontakt",
      "Google Maps & Google Business vollständig eingerichtet",
      "Bei Google gefunden werden – wenn Kunden in deiner Stadt suchen",
      "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
      "Kontaktformular auf jeder Seite",
      "Optimierte Ladezeiten durch Bildkomprimierung",
    ],
    popular: true,
    cta: "Jetzt starten – Website sichern",
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
    priceId: "premium_rent_monthly",
    includesHint: "✓ Alles aus Pro inklusive – plus:",
    features: [
      "Bis zu 10 Seiten – deine komplette Online-Präsenz",
      "Google-Optimierung beim Launch – damit dich Kunden in deiner Stadt finden",
      "Smarte Extras möglich – Terminbuchung, Rechner oder Anfrage-Tool",
      "Feinschliff nach Launch inklusive – damit alles genau passt",
      "Angebotsanfrage-Formular – Kunden liefern dir alle Projektinfos direkt",
      "Bis zu 3 zusätzliche Landingpage inklusive – ideal für Aktionen oder Werbekampagnen",
      "Persönlicher Ansprechpartner",
    ],
    cta: "Premium sichern – Jetzt starten",
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
      "Laufende Änderungen & Pflege inklusive",
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
  includesHint?: string;
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
    priceId: "starter_purchase_deposit",
    compare: "Miete Starter: 59 € × 24 = 1.416 € — hier sparst du 426 € (alle Preise netto)",
    features: [
      "1 Seite: Leistungen, Über dich, Kontakt & Anfrageformular",
      "Individuelle Texte & Inhalte – du lieferst die Infos, wir schreiben",
      "Perfekt auf jedem Smartphone & Tablet",
      "Hosting, Domain & SSL inklusive – keine Extra-Kosten",
      "Professionelles Design – kein Baukastensystem",
      "Upgrade auf Pro jederzeit – ohne neue Mindestlaufzeit",
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
    cta: "Jetzt starten",
  },
  {
    name: "Pro",
    price: "1.990 € einmalig",
    badge: "Pro Kauf – 1.990 € netto",
    priceId: "pro_purchase_deposit",
    compare: "Miete Pro: 99 € × 24 = 2.376 € — hier sparst du 386 € (alle Preise netto)",
    includesHint: "✓ Alles aus Starter inklusive – plus:",
    features: [
      "Bis zu 5 Seiten – Leistungen, Referenzen, Über uns, Kontakt",
      "Google Maps & Google Business vollständig eingerichtet",
      "Bei Google gefunden werden – wenn Kunden in deiner Stadt suchen",
      "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
      "Kontaktformular auf jeder Seite",
      "Optimierte Ladezeiten durch Bildkomprimierung",
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
    cta: "Jetzt starten",
  },
  {
    name: "Premium",
    price: "3.590 € einmalig",
    badge: "Premium Kauf – 3.590 € netto",
    priceId: "premium_purchase_deposit",
    compare: "Miete Premium: 159 € × 24 = 3.816 € — hier sparst du 226 € (alle Preise netto)",
    includesHint: "✓ Alles aus Pro inklusive – plus:",
    features: [
      "Bis zu 10 Seiten – deine komplette Online-Präsenz",
      "Google-Optimierung beim Launch – damit dich Kunden in deiner Stadt finden",
      "Smarte Extras möglich – Terminbuchung, Rechner oder Anfrage-Tool",
      "Feinschliff nach Launch inklusive – damit alles genau passt",
      "Angebotsanfrage-Formular – Kunden liefern dir alle Projektinfos direkt",
      "Bis zu 3 zusätzliche Landingpage inklusive – ideal für Aktionen oder Werbekampagnen",
      "Persönlicher Ansprechpartner",
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
    cta: "Jetzt starten",
  },
];

const buyEnterprise = {
  name: "Enterprise",
  subtitle: "Für Betriebe mit besonderen Anforderungen",
  price: "Auf Anfrage – meist unter 300 €/Monat",
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
  badge: "Enterprise – Auf Anfrage",
};

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

export const PackageCard = ({
  pkg,
  i,
  onOpen,
  onCheckout,
}: {
  pkg: Pkg;
  i: number;
  onOpen: (badge: string) => void;
  onCheckout?: (pkg: Pkg) => void;
}) => {
  const visibleFeatures = pkg.enterprise ? pkg.features : pkg.features.slice(0, 4);
  const hiddenFeatures = pkg.enterprise ? [] : pkg.features.slice(4);
  return (
  <AnimatedSection delay={i * 0.08}>
    <div
      className={`relative rounded-2xl p-10 h-full flex flex-col border bg-background ${
        pkg.popular
          ? "border-2 border-primary shadow-[0_24px_60px_-12px_hsl(var(--primary)/0.35)] lg:scale-[1.03] lg:z-10"
          : pkg.enterprise
            ? "border-foreground/40 bg-gradient-to-br from-card to-background"
            : "border-border"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1 whitespace-nowrap">
          <Star size={12} aria-hidden={true} focusable={false} /> Beliebteste Wahl
        </span>
      )}
      <h3 className="font-heading text-xl font-bold mb-1">{usePricingName(pkg.name)}</h3>
      {pkg.price.toLowerCase().includes("anfrage") ? (
        <>
          <p className="text-sm text-muted-foreground mb-1">
            {pkg.subPrice ? `${pkg.price} – ${pkg.subPrice}` : pkg.price}
          </p>
          <p className="text-xs text-muted-foreground mb-3">zzgl. 19 % MwSt.</p>
        </>
      ) : (
        <>
          <p className="font-heading text-3xl font-bold gradient-text mb-6">{pkg.price}</p>
          {pkg.subPrice && (
            <p className="text-xs text-muted-foreground italic mb-3">{pkg.subPrice}</p>
          )}
        </>
      )}
      {pkg.desc && (
        <p className="text-sm text-muted-foreground mb-5 whitespace-pre-line">{pkg.desc}</p>
      )}
      {pkg.includesHint && (
        <p className="text-xs text-primary mt-2 mb-3">{pkg.includesHint}</p>
      )}
      <div className="space-y-3 flex-1 mb-6">
        {visibleFeatures.map((f) => {
          if (f.startsWith("__hint__")) {
            return (
              <p key={f} className="text-xs text-muted-foreground pl-[22px] -mt-2">
                {f.replace("__hint__", "")}
              </p>
            );
          }
          return (
            <div key={f} className="flex items-start gap-2.5">
              <CheckCircle size={15} className="text-primary shrink-0 mt-1" aria-hidden={true} focusable={false} />
              <span className="text-sm">{f}</span>
            </div>
          );
        })}
      </div>
      {pkg.upgradeHint && (
        <p className="text-xs font-bold text-primary mb-4">{pkg.upgradeHint}</p>
      )}
      {(pkg.growth || hiddenFeatures.length > 0) && (
        <GrowthAccordion growth={pkg.growth} extraFeatures={hiddenFeatures} />
      )}
      <div className="space-y-2 mt-6">
        <Button
          variant={pkg.enterprise ? "outline" : "gradient"}
          size="lg"
          className="w-full"
          onClick={() =>
            pkg.priceId && onCheckout
              ? onCheckout(pkg)
              : onOpen(pkg.badge ?? pkg.name)
          }
          data-pricing-cta="true"
        >
          {pkg.cta} <ArrowRight size={16} aria-hidden={true} focusable={false} />
        </Button>
        {pkg.priceId && onCheckout && (
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-white border-2 border-[#5B3DC8] text-[#5B3DC8] hover:bg-[#5B3DC8]/10 hover:text-[#5B3DC8]"
            onClick={() => onOpen(pkg.badge ?? pkg.name)}
          >
            Kostenlos beraten lassen →
          </Button>
        )}
      </div>
    </div>
  </AnimatedSection>
  );
};

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
}) => {
  const visibleFeatures = pkg.features.slice(0, 4);
  const hiddenFeatures = pkg.features.slice(4);
  return (
  <AnimatedSection delay={i * 0.08}>
    <div
      className={`relative rounded-2xl p-10 h-full flex flex-col border bg-background ${
        pkg.popular
          ? "border-2 border-primary shadow-[0_24px_60px_-12px_hsl(var(--primary)/0.35)] lg:scale-[1.03] lg:z-10"
          : "border-border"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1 whitespace-nowrap">
          <Star size={12} aria-hidden={true} focusable={false} /> Beliebteste Wahl
        </span>
      )}
      <h3 className="font-heading text-xl font-bold mb-1">{usePricingName(pkg.name)}</h3>
      <p className="font-heading text-3xl font-bold gradient-text mb-6">{pkg.price}</p>
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
      {pkg.includesHint && (
        <p className="text-xs text-primary mt-2 mb-3">{pkg.includesHint}</p>
      )}
      <div className="space-y-3 flex-1 mb-6">
        {visibleFeatures.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <CheckCircle size={15} className="text-primary shrink-0 mt-1" aria-hidden={true} focusable={false} />
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </div>
      {(pkg.growth || hiddenFeatures.length > 0) && (
        <GrowthAccordion growth={pkg.growth} extraFeatures={hiddenFeatures} />
      )}
      <div className="space-y-2 mt-6">
        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          onClick={() => (pkg.priceId ? onCheckout(pkg) : onOpen(pkg.badge ?? pkg.name))}
          data-pricing-cta="true"
        >
          {pkg.cta} <ArrowRight size={16} aria-hidden={true} focusable={false} />
        </Button>
        {pkg.priceId && (
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-white border-2 border-[#5B3DC8] text-[#5B3DC8] hover:bg-[#5B3DC8]/10 hover:text-[#5B3DC8]"
            onClick={() => onOpen(pkg.badge ?? pkg.name)}
          >
            Kostenlos beraten lassen →
          </Button>
        )}
      </div>
    </div>
  </AnimatedSection>
  );
};

const WebdesignPreise = () => {
  const [showFloating, setShowFloating] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupBadge, setPopupBadge] = useState("Kostenlose Beratung");
  const [checkoutPkg, setCheckoutPkg] = useState<
    { name: string; priceId?: string; mode: "miete" | "kauf" } | null
  >(null);
  const openPopup = (badge: string) => {
    setPopupBadge(badge);
    setPopupOpen(true);
  };
  const openRentCheckout = (pkg: { name: string; priceId?: string }) =>
    setCheckoutPkg({ ...pkg, mode: "miete" });
  const openBuyCheckout = (pkg: { name: string; priceId?: string }) =>
    setCheckoutPkg({ ...pkg, mode: "kauf" });

  // Numeric price lookup pro Paketname (für Funnel) inkl. Wachstumspaket
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
  const currentFunnelPaket = checkoutPkg
    ? funnelPakete.find((p) => p.name === checkoutPkg.name) ?? funnelPakete[0]
    : null;

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
  <main id="main-content" className="pt-20">
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
        Kostenlose Demo anfordern <ArrowRight size={14} aria-hidden={true} focusable={false} />
      </button>
    </div>

    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign Preise</span>
            <h1 className="mb-5 text-balance">
              Ein Auftrag reicht.{" "}
              <span className="gradient-text">Den Rest verdienst du.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-5">
              Professionell online — ohne großes Investment.
            </p>
            <p className="inline-flex items-center gap-2 text-base md:text-lg font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
              <CheckCircle size={20} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
              Für Gewerbetreibende voll steuerlich absetzbar
            </p>
          </div>
        </AnimatedSection>

        <TrustStrip />

        <Tabs defaultValue="miete" className="mb-12">
          <TabsList className="mx-auto flex w-full max-w-sm mb-8">
            <TabsTrigger value="miete" className="flex-1">Monatlich flexibel</TabsTrigger>
            <TabsTrigger value="kauf" className="flex-1">Einmalig kaufen</TabsTrigger>
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
              Ein verlorener Auftrag kostet dich im Schnitt 800 €.<br />
              Deine neue Website kostet dich ab 59 €/Monat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentPackages.filter(p => !p.enterprise).map((pkg, i) => <PackageCard key={pkg.name} pkg={pkg} i={i} onOpen={openPopup} onCheckout={openRentCheckout} />)}
            </div>
            {rentPackages.filter(p => p.enterprise).map((pkg) => (
              <AnimatedSection key={pkg.name} delay={0.1}>
                <div className="mt-8 rounded-2xl p-8 md:p-10 border border-foreground/40 bg-gradient-to-br from-card to-background flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-bold mb-1"><PricingName name={pkg.name} /></h3>
                    <p className="text-sm text-muted-foreground mb-1">Auf Anfrage – meist unter 300 €/Monat</p>
                    <p className="text-xs text-muted-foreground mb-3">zzgl. 19 % MwSt.</p>
                    {pkg.desc && (
                      <p className="text-sm text-muted-foreground mb-5 whitespace-pre-line">{pkg.desc}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pkg.features.map((f) => (
                        <div key={f} className="flex items-start gap-2.5">
                          <CheckCircle size={15} className="text-primary shrink-0 mt-1" aria-hidden={true} focusable={false} />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-auto">
                    <Button variant="gradient" size="lg" onClick={() => openPopup(pkg.badge ?? "Enterprise – Auf Anfrage")} data-pricing-cta="true">
                      {pkg.cta} <ArrowRight size={16} aria-hidden={true} focusable={false} />
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
            <p className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span>🛡️</span>
              <span>Website in 7 Tagen live — oder wir arbeiten kostenlos weiter bis sie steht.</span>
            </p>
            <div className="mt-4 flex justify-center">
              <PaymentTrustStrip kind="rent" />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
              * 12 Monate Startzeitraum – danach monatlich kündbar. Alle Preise netto zzgl. 19% MwSt.
            </p>
          </TabsContent>

          <TabsContent value="kauf">
            <div className="mb-8 rounded-xl border px-5 py-3 text-center text-sm font-medium bg-[#F0FFF4] text-[#166534] border-[#166534]/20">
              💡 Einmal zahlen. Für immer dein. Nach ca. 2 Jahren günstiger als die Miete.
            </div>
            <p className="text-center text-base md:text-lg italic text-muted-foreground mb-8 max-w-2xl mx-auto">
              Du hast Miete gesehen – und überlegst ob Kauf mehr Sinn macht?<br />
              Hier ist die Antwort: Wer länger als 20 Monate plant, fährt mit Einmalkauf günstiger.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyPackages.map((pkg, i) => (
                <BuyCard
                  key={pkg.name}
                  pkg={pkg}
                  i={i}
                  onOpen={openPopup}
                  onCheckout={openBuyCheckout}
                />
              ))}
            </div>
            <AnimatedSection delay={0.1}>
              <div className="mt-8 rounded-2xl p-8 md:p-10 border border-foreground/40 bg-gradient-to-br from-card to-background flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-bold mb-1">{usePricingName(buyEnterprise.name)}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{buyEnterprise.subtitle}</p>
                  <p className="font-heading text-2xl font-bold gradient-text mb-1">{buyEnterprise.price}</p>
                  <p className="text-xs text-muted-foreground mb-5">zzgl. MwSt.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {buyEnterprise.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <CheckCircle size={15} className="text-primary shrink-0 mt-1" aria-hidden={true} focusable={false} />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:w-auto">
                  <Button variant="outline" size="lg" onClick={() => openPopup(buyEnterprise.badge)} data-pricing-cta="true">
                    {buyEnterprise.cta} <ArrowRight size={16} aria-hidden={true} focusable={false} />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
            <p className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span>🛡️</span>
              <span>Website in 7 Tagen live — oder wir arbeiten kostenlos weiter bis sie steht.</span>
            </p>
            <div className="mt-4 flex justify-center">
              <PaymentTrustStrip kind="deposit" />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
              * 12 Monate Startzeitraum – danach monatlich kündbar. Alle Preise netto zzgl. 19% MwSt.
            </p>
          </TabsContent>
        </Tabs>

        <TestimonialBlock />

        <AnimatedSection>
          <div className="text-center mb-10 max-w-3xl mx-auto mt-12">
            <h2 className="mb-3 text-balance">Häufige Fragen</h2>
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
        </AnimatedSection>
      </div>
    </section>

    <section className="bg-primary/10 py-[60px]">
      <div className="container-narrow px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-5">
          Mehr Aufträge. Weniger Aufwand.
        </h2>
        <p className="text-muted-foreground text-base md:text-lg mb-7 leading-relaxed max-w-2xl mx-auto">
          Kostenlose Design-Demo in 48 Stunden. Kein Risiko. Keine Verpflichtung.<br />
          Gefällt sie dir nicht — Du zahlst nichts.
        </p>
        <Button variant="gradient" size="lg" onClick={() => openPopup("Kostenlose Beratung")} data-pricing-cta="true">
          Kostenlose Demo anfordern — in 48h fertig <ArrowRight size={18} aria-hidden={true} focusable={false} />
        </Button>
        <p className="text-sm text-muted-foreground mt-5">
          Fragen? Einfach anrufen: <a href="tel:+4961313076498" className="underline hover:text-foreground font-semibold">06131 3076498</a>
        </p>
        <p className="text-base md:text-lg font-bold text-primary mt-6">
          ⭐⭐⭐⭐⭐ +150 Betriebe aus der Region vertrauen uns
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
        defaultPaymentMode={checkoutPkg.mode}
      />
    )}
  </main>
  );
};

export default WebdesignPreise;
