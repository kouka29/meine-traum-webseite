import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Physio- & Ergotherapie",
  badgeColor: "#14B8A6",
  badgeText: "🤲 SPEZIELL FÜR PHYSIO- & ERGOTHERAPEUTEN",
  heroH1: <>Volle Praxis — <span style={{ color: "var(--brand-purple)" }}>Patienten buchen online, Sie therapieren in Ruhe</span></>,
  heroSub: "Patienten suchen 'Physiotherapie [Stadt]' und wollen sofort einen Termin. Wir bauen die Website mit Online-Buchung — die Termine konstant füllt.",
  trustBadges: ["Online-Termin Kasse & Privat", "Heilmittel klar erklärt", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Therapiepraxen aus der Region vertrauen uns",
  painPoints: [
    { icon: "📞", title: "Telefon klingelt während der Behandlung", description: "Online-Termin-Buchung entlastet die Anmeldung — Sie können in Ruhe therapieren." },
    { icon: "📋", title: "Verordnungen unverständlich", description: "KG, MLD, Manuelle Therapie — Patienten brauchen Klarheit, bevor sie anrufen." },
    { icon: "🔍", title: "Konkurrenz steht oben bei Google", description: "Wer 'Physiotherapeut in der Nähe' nicht erscheint, verliert Neupatienten an die Nachbar-Praxis." },
    { icon: "👥", title: "Selbstzahler-Leistungen unsichtbar", description: "Osteopathie, Sport-Reha, Personal Training — höhere Margen, wenn online sichtbar." },
  ],
  stepsH2: "Ihre Praxis-Website — empathisch & professionell",
  featuresH2: "Was Ihre Therapie-Website kann",
  features: [
    { emoji: "📅", title: "Online-Termin direkt buchbar", description: "Kasse & Privat trennbar — Patienten buchen, Sie behandeln. Rezeption entlastet." },
    { emoji: "💆", title: "Heilmittel klar erklärt", description: "KG, MLD, Manuelle Therapie, Sport-Reha — verständlich für jeden Patienten." },
    { emoji: "👥", title: "Team & Spezialisierungen", description: "Bilder, Vita, Schwerpunkte — Patienten wählen die Person, die zu ihnen passt." },
    { emoji: "💎", title: "Selbstzahler-Leistungen prominent", description: "Osteopathie, Personal Training — höhere Margen werden sichtbar verkauft." },
    { emoji: "📱", title: "Mobil perfekt", description: "Patienten suchen mobil — Ihre Seite funktioniert auf jedem Gerät einwandfrei." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, DSGVO, Updates — Sie therapieren, wir betreiben." },
  ],
  testimonialH2: "Was eine Therapiepraxis über uns sagt",
  testimonial: { stars: 5, badge: "+8 SELBSTZAHLER / MONAT", badgeColor: "#14B8A6", quote: "Seit der neuen Website mit Online-Buchung haben wir konstant 8–10 Selbstzahler mehr pro Monat. Das sind 1.500 € extra Umsatz monatlich — bei deutlich weniger Telefon-Stress.", name: "Julia B.", business: "Physiotherapie, Mainz" },
  formH2: "Kostenlose Praxis-Website Vorschau in 48 Stunden",
  finalH2: "Volle Praxis. Ruhiges Telefon. Planbarer Umsatz.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Einzelpraxis", Pro: "Wachstumspraxis", Premium: "Premium-Praxis" },
});

const PhysioHub = () => <TradeHub config={config} />;
export default PhysioHub;