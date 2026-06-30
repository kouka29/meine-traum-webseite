import { Link } from "react-router-dom";
import { Phone, Check } from "lucide-react";
import EmojiIcon from "@/lib/emojiToIcon";
import HandwerkerLeadForm from "@/components/trade/HandwerkerLeadForm";
import FeatureCard from "@/components/trade/FeatureCard";
import TestimonialCard from "@/components/trade/TestimonialCard";
import { PackageCard, rentPackages } from "@/pages/WebdesignPreise";
import { PricingNamesProvider } from "@/lib/pricingNames";
import Section from "@/components/ui-marketing/Section";
import SectionHeading from "@/components/ui-marketing/SectionHeading";
import { Button } from "@/components/ui/button";

export interface TradeHubConfig {
  branche: string;
  badgeColor: string;
  badgeText: string;
  heroH1: React.ReactNode;
  heroSub: string;
  trustBadges: string[];
  socialProof: string;
  painPoints: { icon: string; title: string; description: string }[];
  stepsH2: string;
  featuresH2: string;
  features: { emoji: string; title: string; description: string }[];
  testimonialH2: string;
  testimonial: { stars: number; badge: string; badgeColor: string; quote: string; name: string; business: string };
  crossLinks: { icon: string; label: string; to: string }[];
  formH2: string;
  finalH2: string;
  finalSub: string;
  /** Overrides for non-Handwerker branches */
  crossLinksH2?: string;
  crossLinksFooterLabel?: string;
  crossLinksFooterTo?: string;
  pricingContactPath?: string;
  pricingNames?: { Starter: string; Pro: string; Premium: string };
}

const STEPS = [
  { emoji: "📋", title: "Kurz erzählen (5 Minuten)", text: "Du füllst ein kurzes Formular aus oder rufst uns an. Kein langes Meeting, keine Vorbereitung nötig." },
  { emoji: "🎨", title: "Wir bauen Deine Vorschau (48 Stunden)", text: "Du bekommst eine echte Design-Vorschau Deiner Website — individuell für Deinen Betrieb. Kostenlos." },
  { emoji: "🚀", title: "Gefällt sie Dir — geht sie live", text: "Gefällt sie nicht — zahlst Du nichts. Gefällt sie Dir → wir schalten sie live." },
];

const DEFAULT_TRADE_NAMES = {
  Starter: "Einzelkämpfer",
  Pro: "Wachstums-Betrieb",
  Premium: "Marktführer",
};
const TRADE_RENT_PACKAGES = rentPackages.filter((p) => !p.enterprise);

const scrollToForm = () => document.getElementById("vorschau-formular")?.scrollIntoView({ behavior: "smooth", block: "start" });

const TradeHub = ({ config }: { config: TradeHubConfig }) => (
  <main id="main-content" className="pt-[110px]">
    {/* HERO */}
    <Section bg="dark">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full text-white mb-6" style={{ background: config.badgeColor }}>
            {config.badgeText}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">{config.heroH1}</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-on-dark-muted">{config.heroSub}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white mb-8">
            {config.trustBadges.map((b) => (
              <span key={b} className="flex items-center gap-2"><Check size={16} className="text-success" aria-hidden={true} focusable={false} /> {b}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="brand" size="lg" onClick={scrollToForm}>
              Kostenlose Vorschau anfordern →
            </Button>
            <Button variant="brand-soft" size="lg" asChild>
              <a href="tel:+4961313076498">
                <Phone size={16} aria-hidden focusable={false} /> 06131 3076498
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-on-dark-muted">{config.socialProof}</p>
        </div>
    </Section>

    {/* PAIN POINTS */}
    <Section bg="dark">
        <SectionHeading tone="onDark" title="Kommt Dir das bekannt vor?" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {config.painPoints.map((p) => (
            <div
              key={p.title}
              className="rounded-card bg-white p-6 flex flex-col gap-3 transition duration-300 hover:-translate-y-0.5 shadow-elevated"
            >
              <EmojiIcon emoji={p.icon} size={20} />
              <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
    </Section>

    {/* HOW IT WORKS */}
    <Section bg="light">
        <SectionHeading eyebrow="So einfach geht's" title={config.stepsH2} />
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-card bg-white p-7 shadow-marketing flex flex-col gap-3 border border-border">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center bg-brand text-brand-foreground font-bold text-sm">{i + 1}</span>
                <EmojiIcon emoji={s.emoji} size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button variant="brand" size="lg" onClick={scrollToForm}>Jetzt Vorschau anfordern →</Button>
        </div>
    </Section>

    {/* FEATURES */}
    <Section bg="white">
        <SectionHeading title={config.featuresH2} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {config.features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
    </Section>

    {/* TESTIMONIAL */}
    <Section bg="dark">
        <SectionHeading tone="onDark" title={config.testimonialH2} />
        <div className="max-w-2xl mx-auto">
          <TestimonialCard {...config.testimonial} />
        </div>
    </Section>

    {/* PRICING TEASER */}
    <Section bg="light">
        <SectionHeading
          eyebrow="Transparent & fair"
          title="Was kostet Deine neue Website?"
          subtitle="Keine versteckten Kosten. Für Gewerbetreibende voll steuerlich absetzbar."
        />
        <PricingNamesProvider names={config.pricingNames ?? DEFAULT_TRADE_NAMES}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {TRADE_RENT_PACKAGES.map((pkg, i) => (
              <PackageCard key={pkg.name} pkg={pkg} i={i} onOpen={scrollToForm} />
            ))}
          </div>
        </PricingNamesProvider>
        <div className="text-center">
          <Link to={config.pricingContactPath ?? "/handwerker/kontakt"} className="text-sm font-semibold hover:underline text-brand">
            Nicht sicher welches Paket passt? → Kostenlos beraten lassen
          </Link>
        </div>
    </Section>

    {/* CROSS-LINKS */}
    <Section bg="light">
        <SectionHeading title={config.crossLinksH2 ?? "Auch für andere Handwerksbetriebe"} />
        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {config.crossLinks.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="group rounded-card bg-white p-7 flex flex-col items-center gap-3 shadow-marketing border border-border transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:shadow-marketing-hover"
            >
              <EmojiIcon emoji={t.icon} size={20} />
              <span className="text-base font-semibold text-center text-foreground group-hover:text-brand transition-colors">{t.label}</span>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link to={config.crossLinksFooterTo ?? "/handwerker"} className="text-sm font-semibold hover:underline text-brand">
            {config.crossLinksFooterLabel ?? "Alle Branchen →"}
          </Link>
        </div>
    </Section>

    {/* LEAD FORM */}
    <Section bg="white" id="vorschau-formular">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="text-foreground">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-warning text-warning-foreground mb-5">
              Kostenlos & unverbindlich
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">{config.formH2}</h2>
            <ul className="space-y-3 mb-8">
              {["Individuell für Deinen Betrieb", "Ich melde mich innerhalb von 2 Stunden", "Kein Risiko — Du entscheidest danach frei", "Kostenlos — auch wenn Du nicht kaufst"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground">
                  <Check size={18} className="mt-0.5 shrink-0 text-success" aria-hidden={true} focusable={false} /> {t}
                </li>
              ))}
            </ul>
            <a href="tel:+4961313076498" className="inline-flex items-center gap-3 text-2xl font-bold text-foreground hover:underline">
              <Phone size={24} aria-hidden={true} focusable={false} /> 06131 3076498
            </a>
            <p className="text-sm mt-1 text-muted-foreground">Mo–Fr 9–18 Uhr</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Vorschau jetzt anfordern</h3>
            <HandwerkerLeadForm branche={config.branche} />
          </div>
        </div>
    </Section>

    {/* FINAL CTA */}
    <Section bg="dark">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">{config.finalH2}</h2>
          <p className="text-lg mb-8 text-on-dark-muted">{config.finalSub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="brand" size="lg" onClick={scrollToForm}>
              Kostenlose Vorschau anfordern →
            </Button>
            <Button variant="brand-soft" size="lg" asChild>
              <a href="tel:+4961313076498">
                <Phone size={16} aria-hidden focusable={false} /> 06131 3076498
              </a>
            </Button>
          </div>
        </div>
    </Section>
  </main>
);

export default TradeHub;
