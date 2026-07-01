import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Florist",
  badgeColor: "#DB2777",
  badgeText: "🌸 SPEZIELL FÜR FLORISTEN",
  heroH1: <>Mehr Sträuße & Aufträge — <span style={{ color: "var(--brand-purple)" }}>online bestellt, lokal geliefert</span></>,
  heroSub: "Kunden suchen 'Florist in Deiner Stadt' für Hochzeit, Trauer oder spontane Geste. Wir bauen die Website, die online verkauft und lokal liefert.",
  trustBadges: ["Online-Bestellung mit Lieferung", "Hochzeits- & Trauerfloristik", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Floristen aus DACH vertrauen uns",
  painPoints: [
    { icon: "💐", title: "Fleurop kassiert die Provision", description: "Online-Bestellungen gehen oft an Großportale. Eine eigene Website behält die volle Marge." },
    { icon: "💒", title: "Hochzeitsaufträge gehen verloren", description: "Brautpaare planen monatelang — wer mit Galerie und Beratung online überzeugt, gewinnt." },
    { icon: "🔍", title: "Bei Google unsichtbar", description: "'Blumen Lieferung in Deiner Stadt' — wer da nicht oben steht, verliert spontane Käufe komplett." },
    { icon: "🖤", title: "Trauerfloristik diskret nötig", description: "Trauernde suchen still online — eine empathische Website schafft Vertrauen sofort." },
  ],
  stepsH2: "Ihre Florist-Website — blühend & verkaufsstark",
  featuresH2: "Was Ihre Florist-Website kann",
  features: [
    { emoji: "💐", title: "Online-Bestellung mit Lieferung", description: "Kunden bestellen Sträuße online — Sie liefern lokal, ohne Plattform-Provision." },
    { emoji: "💒", title: "Hochzeitsfloristik als Galerie", description: "Bisherige Hochzeiten als Inspiration — Brautpaare buchen Beratungstermine online." },
    { emoji: "🖤", title: "Trauerfloristik diskret", description: "Eigener Bereich, empathisch, klar — Bestellung mit Lieferung zur Trauerhalle." },
    { emoji: "🌷", title: "Saisonangebote prominent", description: "Muttertag, Valentinstag, Weihnachten — Aktionen werden sichtbar verkauft." },
    { emoji: "📱", title: "Mobil perfekt", description: "90 % der Blumenkäufe entstehen spontan am Handy. Ihre Seite konvertiert dort." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Sie binden Sträuße, wir die Technik." },
  ],
  testimonialH2: "Was ein Floristik-Geschäft über uns sagt",
  testimonial: { stars: 5, badge: "+25 LIEFERUNGEN / WOCHE", badgeColor: "#DB2777", quote: "Wir liefern jetzt 25–30 Sträuße pro Woche, die direkt über die Website bestellt werden. Ohne Fleurop-Provision bleiben uns ca. 15 € mehr pro Bestellung.", name: "Petra L.", business: "Floristik, Wiesbaden" },
  formH2: "Kostenlose Florist-Website Vorschau in 48 Stunden",
  finalH2: "Volle Lieferungen. Hochzeitsaufträge. Online gefunden.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Solo-Florist", Pro: "Wachstums-Laden", Premium: "Premium-Boutique" },
});

const FloristenHub = () => <TradeHub config={config} />;
export default FloristenHub;