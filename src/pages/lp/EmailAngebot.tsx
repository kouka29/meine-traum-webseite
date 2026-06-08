import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Clock, ShieldCheck, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  popular?: boolean;
  cta: string;
};

const packages: Pkg[] = [
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
    text: "Früher kamen Aufträge nur über Empfehlungen. Jetzt generiert unsere Website täglich neue Anfragen.",
    name: "Markus L.",
    role: "Inhaber, Elektro Lenz GmbH",
  },
  {
    text: "In der ersten Woche nach dem Launch hatten wir 4 neue Anfragen. Die Website macht das, was ich mir erhofft hatte.",
    name: "Thomas B.",
    role: "Inhaber, Malerbetrieb Brandt",
  },
  {
    text: "59€ im Monat und ich brauche keine Werbung mehr zu schalten. Die Website holt mir die Kunden selbst.",
    name: "Jürgen M.",
    role: "Meister, Elektro Müller",
  },
];

const faqs = [
  {
    q: "Wie lange dauert es bis meine Website fertig ist?",
    a: "Beim Starter-Paket ist deine Website in 7 Tagen live. Beim Pro-Paket ca. 2 Wochen. Beim Premium-Paket besprechen wir Timing individuell.",
  },
  {
    q: "Was passiert nach den 12 Monaten?",
    a: "Nach dem 12-monatigen Startzeitraum läuft dein Vertrag monatlich weiter – du kannst jederzeit kündigen.",
  },
  {
    q: "Muss ich selbst Texte liefern?",
    a: "Nein – du lieferst uns deine Infos und wir schreiben die Texte für dich. Professionell, auf dein Unternehmen zugeschnitten.",
  },
  {
    q: "Was wenn ich mit der Website nicht zufrieden bin?",
    a: "Wir zeigen dir vor dem Launch eine Vorschau – erst wenn du zufrieden bist, gehen wir live.",
  },
];

const initialsFor = (name: string) =>
  name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("");

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
            <h1 className="mb-5 text-balance">
              Deine neue <span className="gradient-text">Website</span> —<br />
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

          {/* BLOCK 3: Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 lg:px-4">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl p-10 h-full flex flex-col border bg-background ${
                  pkg.popular
                    ? "border-[3px] border-primary shadow-[0_32px_70px_-12px_hsl(var(--primary)/0.5)] lg:scale-[1.05] lg:z-10"
                    : "border-border"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1 whitespace-nowrap">
                    <Star size={12} /> Beliebteste Wahl
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold mb-1">{pkg.name}</h3>
                <p className="font-heading text-3xl font-bold gradient-text mb-6">{pkg.price}</p>
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

          {/* BLOCK 4: Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative overflow-hidden rounded-3xl bg-background border border-border shadow-[0_20px_50px_rgba(91,61,200,0.08)] flex flex-col"
              >
                <div className="p-7 md:p-8 flex-1 flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400" fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <blockquote className="font-heading text-base md:text-lg leading-snug text-foreground font-semibold mb-6 tracking-tight flex-1">
                    „{t.text}"
                  </blockquote>
                  <div className="flex items-center gap-3">
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
            ))}
          </div>

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
        </div>
      </section>

      {/* BLOCK 6: Finaler CTA */}
      <section className="bg-primary/10 py-[60px]">
        <div className="container-narrow px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Noch Fragen?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-7">
            Ich berate dich kostenlos und unverbindlich.
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/kontakt">
              Kostenlos beraten lassen <ArrowRight size={18} />
            </Link>
          </Button>
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
          defaultPaymentMode="miete"
        />
      )}
    </main>
  );
};

export default EmailAngebot;