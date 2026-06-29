import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Logistik & Spedition",
  badgeColor: "#0EA5E9",
  badgeText: "🚛 SPEZIELL FÜR LOGISTIKER & SPEDITIONEN",
  heroH1: <>Mehr B2B-Frachtaufträge — <span style={{ color: "var(--brand-purple)" }}>online sichtbar, schnell anfragbar</span></>,
  heroSub: "Industrie & Handel suchen Logistikpartner bei Google. Wir bauen die Website, die Vertrauen schafft und Anfragen direkt umwandelt.",
  trustBadges: ["Frachtanfrage online", "Fuhrpark & Spezialisierungen sichtbar", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Speditionen aus DACH vertrauen uns",
  painPoints: [
    { icon: "🔍", title: "Auftraggeber googeln zuerst", description: "Disponenten und Einkäufer suchen Logistikpartner online. Wer nicht auftaucht, fällt durchs Raster." },
    { icon: "📞", title: "Anfragen versickern im Telefon", description: "Eine Frachtanfrage online — strukturiert, kalkulierbar — spart Stunden und gewinnt Aufträge." },
    { icon: "🚛", title: "Fuhrpark unbekannt", description: "LKW-Typen, Kühltransport, Schwerlast — Kunden müssen sehen, was Sie leisten können." },
    { icon: "📜", title: "Zertifikate unsichtbar", description: "ISO, ADR, BSCI — entscheidend für Auftraggeber, aber niemand findet sie auf alten Websites." },
  ],
  stepsH2: "Ihre Spedition-Website — effizient & überzeugend",
  featuresH2: "Was Ihre Logistik-Website kann",
  features: [
    { emoji: "📋", title: "Frachtanfrage online", description: "Strecke, Gewicht, Datum, Spezialanforderung — Kunde sendet, Sie kalkulieren." },
    { emoji: "🚛", title: "Fuhrpark transparent", description: "Welche Fahrzeuge, welche Kapazitäten, welche Spezialausstattung — auf einen Blick." },
    { emoji: "🏆", title: "Zertifikate & Mitgliedschaften prominent", description: "ISO 9001, ADR, AEO — Auftraggeber filtern danach. Wir machen es sichtbar." },
    { emoji: "🌍", title: "Routen & Servicegebiete", description: "National, EU, Sonderfahrten — klare Darstellung erhöht die richtigen Anfragen." },
    { emoji: "📱", title: "Mobil perfekt", description: "Disponenten arbeiten oft unterwegs. Ihre Seite funktioniert auf jedem Gerät." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Sie fahren, wir betreiben." },
  ],
  testimonialH2: "Was eine Spedition über uns sagt",
  testimonial: { stars: 5, badge: "+15 NEUE B2B-KUNDEN", badgeColor: "#0EA5E9", quote: "Wir bekommen über die Website 4–6 Frachtanfragen pro Woche von neuen Auftraggebern. Davon werden ca. 30 % zu Daueraufträgen. Riesiger Hebel.", name: "Stefan W.", business: "Spedition, Wiesbaden" },
  formH2: "Kostenlose Spedition-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Fracht. Mehr Aufträge. Planbar.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Einzelkämpfer", Pro: "Wachstums-Spedition", Premium: "Marktführer" },
});

const LogistikHub = () => <TradeHub config={config} />;
export default LogistikHub;