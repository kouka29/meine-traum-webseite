import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TradeBreadcrumbs from "@/components/TradeBreadcrumbs";

type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlighted?: boolean;
  enterprise?: boolean;
};

const plans: Plan[] = [
  {
    name: "Einzelkämpfer",
    price: "59 €/Monat",
    desc: "Für Betriebe die schnell professionell online wollen",
    features: [
      "Eine starke Seite — reicht für die meisten Betriebe",
      "Perfekt auf jedem Handy — auch auf der Baustelle",
      "Kunden können Dich direkt anfragen — rund um die Uhr",
      "Kunden sehen kein 'Nicht sicher' im Browser — Vertrauen inklusive",
      "In 7 Tagen live — Du machst weiter Dein Handwerk",
    ],
  },
  {
    name: "Wachstums-Betrieb",
    price: "99 €/Monat",
    desc: "Für Betriebe die wachsen wollen",
    features: [
      "Bis zu 5 Seiten — Leistungen, Referenzen, Kontakt",
      "Google findet Dich wenn jemand '[Beruf] in [Stadt]' sucht",
      "Google Maps Eintrag eingerichtet — Kunden finden Dich sofort",
      "Hosting & Domain inklusive",
      "Fertig in ca. 2 Wochen",
    ],
    highlighted: true,
  },
  {
    name: "Marktführer",
    price: "159 €/Monat",
    desc: "Für Betriebe die dominieren wollen",
    features: [
      "Bis zu 10 Seiten — komplette Online-Präsenz",
      "Google-Optimierung die Anfragen bringt",
      "Design das mehr Anfragen bringt",
      "Google Business Einrichtung",
      "Individuelle Umsetzung — Timing nach Absprache",
    ],
  },
];

const enterprise: Plan = {
  name: "Enterprise",
  price: "Auf Anfrage",
  desc: "Für Betriebe mit besonderen Anforderungen",
  features: [
    "Onlineshop möglich",
    "Unbegrenzte Seiten",
    "SEO-Strategie + Google Ads",
    "Persönlicher Ansprechpartner",
    "Unbegrenzte Änderungen inklusive",
    "Wartung & Updates inklusive",
  ],
  enterprise: true,
};

const faqs = [
  { q: "Lohnt sich eine Website überhaupt für meinen Betrieb?", a: "Ja – ein einziger neuer Auftrag reicht. Den Rest verdienst Du." },
  { q: "Was passiert wenn mir die Vorschau nicht gefällt?", a: "Gar nichts. Du zahlst keinen Cent. Kein Druck, keine Verpflichtung." },
  { q: "Muss ich selbst viel Zeit investieren?", a: "Nein. 2-Minuten-Formular ausfüllen — wir kümmern uns um alles." },
  { q: "Kann ich das Paket wechseln?", a: "Ja — jederzeit upgraden ohne neue Mindestlaufzeit. Downgrade nach Ablauf der 12 Monate möglich." },
];

const PlanCard = ({ p }: { p: Plan }) => (
  <div className="relative rounded-2xl border bg-white p-7 flex flex-col gap-4 shadow-card" style={p.highlighted ? { borderColor: "var(--brand-purple)", borderWidth: 2 } : undefined}>
    {p.highlighted && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full text-white" style={{ background: "var(--amber)" }}>
        BELIEBTESTE WAHL
      </span>
    )}
    <div>
      <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
    </div>
    <p className="text-3xl font-bold text-foreground">{p.price}</p>
    <p className="text-xs text-muted-foreground -mt-3">zzgl. 19% MwSt.</p>
    <ul className="space-y-2 text-sm flex-1">
      {p.features.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <Check size={16} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
          <span className="text-foreground/80">{f}</span>
        </li>
      ))}
    </ul>
    <div className="flex flex-col gap-2">
      <Link to="/handwerker/kontakt" className="w-full text-center rounded-xl py-3 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
        {p.enterprise ? "Beratung anfragen" : "Jetzt starten"} →
      </Link>
      {!p.enterprise && (
        <Link to="/handwerker/kontakt" className="text-xs text-center text-muted-foreground hover:text-foreground">
          Lieber erst beraten lassen
        </Link>
      )}
    </div>
  </div>
);

const HandwerkerPreise = () => (
  <main className="pt-[110px] pb-20" style={{ background: "var(--light-bg)" }}>
    <TradeBreadcrumbs />
    <div className="container-narrow px-4 max-w-6xl mx-auto mt-6">
      {/* Amber info banner */}
      <div className="rounded-xl px-5 py-3 mb-8 text-sm text-foreground flex items-start gap-2" style={{ background: "rgba(245,158,11,0.15)", borderLeft: "4px solid var(--amber)" }}>
        💡 Als Gewerbetreibender kannst Du die Website komplett von der Steuer absetzen — frag Deinen Steuerberater.
      </div>

      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Was kostet Deine Website als Handwerker?</h1>
        <p className="text-muted-foreground text-lg">Transparent. Fair. Steuerlich absetzbar. Keine versteckten Kosten.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {plans.map((p) => <PlanCard key={p.name} p={p} />)}
      </div>

      {/* Trust row */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
        {[
          { icon: "🔨", text: "Kein Technik-Wissen nötig" },
          { icon: "⚡", text: "Wir übernehmen alles" },
          { icon: "✅", text: "Fertig während Du arbeitest" },
        ].map((t) => (
          <div key={t.text} className="rounded-xl bg-white p-4 text-center text-sm font-semibold text-foreground shadow-card">
            <span className="text-2xl block mb-1">{t.icon}</span>{t.text}
          </div>
        ))}
      </div>

      {/* Enterprise */}
      <div className="rounded-2xl bg-white p-8 md:p-10 border border-border mb-16 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-1">{enterprise.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{enterprise.desc}</p>
          <p className="text-2xl font-bold text-foreground mb-4">{enterprise.price} – meist unter 300 €/Monat</p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {enterprise.features.map((f) => (
              <li key={f} className="flex items-start gap-2"><Check size={16} style={{ color: "var(--success)" }} className="mt-0.5 shrink-0" />{f}</li>
            ))}
          </ul>
        </div>
        <Link to="/handwerker/kontakt" className="shrink-0 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
          Beratung anfragen →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">Häufige Fragen</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-2xl border border-border bg-white px-6">
              <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center">
        <Link to="/handwerker/kontakt" className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
          Kostenlose Vorschau anfordern <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </main>
);

export default HandwerkerPreise;
