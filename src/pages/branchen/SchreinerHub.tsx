import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Schreiner & Tischler",
  badgeColor: "#92400E",
  badgeText: "🪚 SPEZIELL FÜR SCHREINER & TISCHLER",
  heroH1: <>Mehr Aufträge für Ihre Werkstatt — <span style={{ color: "var(--brand-purple)" }}>Handwerk, das man online sieht</span></>,
  heroSub: "Kunden suchen 'Schreiner [Stadt]' für Küchen, Möbel oder Einbauten. Wir bauen die Website, die Ihre Handarbeit ins richtige Licht rückt.",
  trustBadges: ["Referenz-Galerie wie Manufaktur", "Individuelle Anfrage online", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Schreinereien aus DACH vertrauen uns",
  painPoints: [
    { icon: "🪑", title: "Ihre Stücke verstecken sich", description: "Die schönsten Möbel ohne Online-Galerie ist verschenktes Verkaufspotenzial." },
    { icon: "🏭", title: "Industrie verkauft online besser", description: "IKEA & Co. sind allgegenwärtig. Eine starke Website zeigt, was Maßarbeit wirklich bedeutet." },
    { icon: "🔍", title: "Bei Google unauffindbar", description: "'Schreiner in der Nähe' — wer da nicht erscheint, bekommt die Anfrage nicht." },
    { icon: "💸", title: "Anfragen ohne Vorinformation", description: "Maßmöbel kosten — wer ohne Erwartung anfragt, springt beim Angebot ab." },
  ],
  stepsH2: "Ihre Schreinerei-Website — wertig & buchbar",
  featuresH2: "Was Ihre Schreiner-Website kann",
  features: [
    { emoji: "🪑", title: "Werke wie eine Manufaktur zeigen", description: "Küchen, Möbel, Einbauten — jedes Stück mit Bildern, Story, Materialien." },
    { emoji: "📋", title: "Individuelle Anfrage mit Skizzen", description: "Kunde lädt Bilder/Skizzen hoch — Sie kalkulieren präzise und sparen Vor-Ort-Termine." },
    { emoji: "🌳", title: "Materialien & Werte zeigen", description: "Massivholz, regionale Hölzer, Nachhaltigkeit — Werte schaffen Premiumpreise." },
    { emoji: "⭐", title: "Bewertungen prominent", description: "Vertrauen entscheidet bei 5-stelligen Aufträgen — Google-Sterne sichtbar." },
    { emoji: "📱", title: "Mobil perfekt", description: "Auch auf der Baustelle abrufbar — Ihre Seite funktioniert auf jedem Gerät." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Sie hobeln, wir betreiben." },
  ],
  testimonialH2: "Was eine Schreinerei über uns sagt",
  testimonial: { stars: 5, badge: "+3 KÜCHEN / QUARTAL", badgeColor: "#92400E", quote: "Über die Website kommen 3–4 Küchen-Anfragen pro Quartal — alle ernsthaft, alle mit Budget. Die Manufaktur-Optik der Seite verkauft Premium-Preise.", name: "Robert M.", business: "Schreinerei, Wiesbaden" },
  formH2: "Kostenlose Schreinerei-Website Vorschau in 48 Stunden",
  finalH2: "Volle Werkstatt. Premium-Preise. Online gefunden.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Einzelmeister", Pro: "Wachstums-Werkstatt", Premium: "Premium-Manufaktur" },
});

const SchreinerHub = () => <TradeHub config={config} />;
export default SchreinerHub;