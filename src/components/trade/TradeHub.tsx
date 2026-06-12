import { Link } from "react-router-dom";
import { Phone, Check } from "lucide-react";
import HandwerkerLeadForm from "@/components/trade/HandwerkerLeadForm";
import FeatureCard from "@/components/trade/FeatureCard";
import TestimonialCard from "@/components/trade/TestimonialCard";
import PricingTeaserCard from "@/components/trade/PricingTeaserCard";

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
}

const STEPS = [
  { emoji: "📋", title: "Kurz erzählen (5 Minuten)", text: "Du füllst ein kurzes Formular aus oder rufst uns an. Kein langes Meeting, keine Vorbereitung nötig." },
  { emoji: "🎨", title: "Wir bauen Deine Vorschau (48 Stunden)", text: "Du bekommst eine echte Design-Vorschau Deiner Website — individuell für Deinen Betrieb. Kostenlos." },
  { emoji: "🚀", title: "Gefällt sie Dir — geht sie live", text: "Gefällt sie nicht — zahlst Du nichts. Gefällt sie Dir → wir schalten sie live." },
];

const PRICING = [
  { name: "Einzelkämpfer", price: "59 €/Monat", description: "Schnell professionell online", features: ["1-Seite Website", "Mobil-optimiert", "Online in 7 Tagen"], highlighted: false, ctaLink: "/handwerker/preise" },
  { name: "Wachstums-Betrieb", price: "99 €/Monat", description: "Für Betriebe die wachsen wollen", features: ["Bis zu 5 Seiten", "Google-Optimierung", "Google Maps Einrichtung"], highlighted: true, ctaLink: "/handwerker/preise" },
  { name: "Marktführer", price: "159 €/Monat", description: "Für Betriebe die dominieren wollen", features: ["Bis zu 10 Seiten", "SEO + Seitenstruktur", "Individuelle Umsetzung"], highlighted: false, ctaLink: "/handwerker/preise" },
];

const scrollToForm = () => document.getElementById("vorschau-formular")?.scrollIntoView({ behavior: "smooth", block: "start" });

const Section = ({ bg, children, id }: { bg: "dark" | "light" | "white"; children: React.ReactNode; id?: string }) => {
  const style = bg === "dark" ? { background: "var(--dark-bg)" } : bg === "light" ? { background: "var(--light-bg)" } : { background: "#fff" };
  return <section id={id} className="py-20 md:py-24" style={style}>{children}</section>;
};
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container-narrow px-4 max-w-6xl mx-auto">{children}</div>
);

const TradeHub = ({ config }: { config: TradeHubConfig }) => (
  <main id="main-content" className="pt-[110px]">
    {/* HERO */}
    <Section bg="dark">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full text-white mb-6" style={{ background: config.badgeColor }}>
            {config.badgeText}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">{config.heroH1}</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "var(--text-muted)" }}>{config.heroSub}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white mb-8">
            {config.trustBadges.map((b) => (
              <span key={b} className="flex items-center gap-2"><Check size={16} style={{ color: "var(--success)" }} aria-hidden={true} focusable={false} /> {b}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToForm} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
              Kostenlose Vorschau anfordern →
            </button>
            <a href="tel:+4961313076498" className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
              <Phone size={16} aria-hidden={true} focusable={false} /> 06131 30 764 98
            </a>
          </div>
          <p className="mt-6 text-sm" style={{ color: "var(--text-muted)" }}>{config.socialProof}</p>
        </div>
      </Container>
    </Section>

    {/* PAIN POINTS */}
    <Section bg="dark">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Kommt Dir das bekannt vor?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {config.painPoints.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 flex flex-col gap-3 transition duration-300 hover:-translate-y-0.5"
              style={{ background: "#FFFFFF", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
            >
              <div className="text-3xl">{p.icon}</div>
              <h3 className="text-base font-semibold" style={{ color: "#0A0A1F" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(10,10,31,0.65)" }}>{p.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    {/* HOW IT WORKS */}
    <Section bg="light">
      <Container>
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--brand-purple)" }}>So einfach geht's</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">{config.stepsH2}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-white p-7 shadow-card flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--brand-purple)" }}>{i + 1}</span>
                <span className="text-2xl">{s.emoji}</span>
              </div>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={scrollToForm} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
            Jetzt Vorschau anfordern →
          </button>
        </div>
      </Container>
    </Section>

    {/* FEATURES */}
    <Section bg="white">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 max-w-3xl mx-auto">{config.featuresH2}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {config.features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </Container>
    </Section>

    {/* TESTIMONIAL */}
    <Section bg="dark">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{config.testimonialH2}</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <TestimonialCard {...config.testimonial} />
        </div>
      </Container>
    </Section>

    {/* PRICING TEASER */}
    <Section bg="light">
      <Container>
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--brand-purple)" }}>Transparent & fair</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">Was kostet Deine neue Website?</h2>
          <p className="text-muted-foreground">Keine versteckten Kosten. Für Gewerbetreibende voll steuerlich absetzbar. ✅</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {PRICING.map((p) => <PricingTeaserCard key={p.name} {...p} />)}
        </div>
        <div className="text-center">
          <Link to="/handwerker/kontakt" className="text-sm font-semibold hover:underline" style={{ color: "var(--brand-purple)" }}>
            Nicht sicher welches Paket passt? → Kostenlos beraten lassen
          </Link>
        </div>
      </Container>
    </Section>

    {/* CROSS-LINKS */}
    <Section bg="light">
      <Container>
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Auch für andere Handwerksbetriebe</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {config.crossLinks.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="group rounded-2xl p-7 flex flex-col items-center gap-3 shadow-card border border-border transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent"
              style={{ backgroundColor: "#FFFFFF" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5B5FEF")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
            >
              <span className="text-4xl">{t.icon}</span>
              <span className="text-base font-semibold text-center text-[#0A0A1F] group-hover:text-white transition-colors">{t.label}</span>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link to="/handwerker" className="text-sm font-semibold hover:underline" style={{ color: "var(--brand-purple)" }}>
            Alle Branchen →
          </Link>
        </div>
      </Container>
    </Section>

    {/* LEAD FORM */}
    <Section bg="dark" id="vorschau-formular">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="text-white">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-5" style={{ background: "var(--amber)" }}>
              Kostenlos & unverbindlich
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{config.formH2}</h2>
            <ul className="space-y-3 mb-8">
              {["Individuell für Deinen Betrieb", "Ich melde mich innerhalb von 2 Stunden", "Kein Risiko — Du entscheidest danach frei", "Kostenlos — auch wenn Du nicht kaufst"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <Check size={18} style={{ color: "var(--success)" }} className="mt-0.5 shrink-0" aria-hidden={true} focusable={false} /> {t}
                </li>
              ))}
            </ul>
            <a href="tel:+4961313076498" className="inline-flex items-center gap-3 text-2xl font-bold text-white hover:underline">
              <Phone size={24} aria-hidden={true} focusable={false} /> 06131 30 764 98
            </a>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Mo–Fr 9–18 Uhr</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Vorschau jetzt anfordern</h3>
            <HandwerkerLeadForm branche={config.branche} />
          </div>
        </div>
      </Container>
    </Section>

    {/* FINAL CTA */}
    <Section bg="dark">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">{config.finalH2}</h2>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>{config.finalSub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToForm} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
              Kostenlose Vorschau anfordern →
            </button>
            <a href="tel:+4961313076498" className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
              <Phone size={16} aria-hidden={true} focusable={false} /> 06131 30 764 98
            </a>
          </div>
        </div>
      </Container>
    </Section>
  </main>
);

export default TradeHub;
