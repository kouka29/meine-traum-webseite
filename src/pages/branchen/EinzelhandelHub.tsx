import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Einzelhandel",
  badgeColor: "#9333EA",
  badgeText: "🛍️ SPEZIELL FÜR EINZELHANDEL & SHOPS",
  heroH1: <>Mehr Kunden im Laden & online — <span style={{ color: "var(--brand-purple)" }}>lokal gefunden, treu gemacht</span></>,
  heroSub: "Kunden suchen 'Geschäft [Stadt]' oder Ihr Sortiment bei Google. Wir machen Sie sichtbar — und verkaufen optional auch online.",
  trustBadges: ["Local SEO inklusive", "Optional mit Online-Shop", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Läden aus Mainz, Wiesbaden & Frankfurt vertrauen uns",
  painPoints: [
    { icon: "🏬", title: "Online-Riesen fressen Marktanteile", description: "Amazon & Co. nehmen lokalen Läden Kundschaft weg. Ohne digitale Präsenz verlieren Sie täglich." },
    { icon: "📍", title: "Auf Google Maps unsichtbar", description: "Wer Sie nicht auf Maps findet, kommt nicht in den Laden. So einfach ist das heute." },
    { icon: "📸", title: "Sortiment niemandem bekannt", description: "Kunden wissen oft gar nicht, was Sie führen. Eine Website zeigt's auf einen Blick." },
    { icon: "📵", title: "Kein Online-Bestellweg", description: "Click & Collect, Reservierung, Versand — die Konkurrenz bietet's, Sie nicht." },
  ],
  stepsH2: "Ihre Laden-Website — sichtbar & verkaufsstark",
  featuresH2: "Was Ihre Shop-Website kann",
  features: [
    { emoji: "📍", title: "Local SEO & Google Maps", description: "Sie stehen ganz oben, wenn jemand nach Ihrem Sortiment in der Stadt sucht." },
    { emoji: "🛒", title: "Optional: Online-Shop", description: "Shopify, WooCommerce oder eigener Shop — wir bauen, was zu Ihrem Sortiment passt." },
    { emoji: "📦", title: "Click & Collect / Reservierung", description: "Kunden reservieren online, holen im Laden — sehr beliebt, sehr conversionsstark." },
    { emoji: "📸", title: "Sortiment & Highlights zeigen", description: "Saisonangebote, Marken, Bestseller — mobil perfekt präsentiert." },
    { emoji: "🕐", title: "Öffnungszeiten immer aktuell", description: "Auch über Feiertage automatisch. Kunden vor verschlossener Tür — passiert nicht." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Sie verkaufen, wir betreiben." },
  ],
  testimonialH2: "Was Händler über uns sagen",
  testimonial: { stars: 5, badge: "+25% LAUFKUNDSCHAFT", badgeColor: "#9333EA", quote: "Seit der neuen Website mit Google-Optimierung kommen 25 % mehr Laufkunden. Viele sagen: 'Ich habe Sie über Google gefunden.' Vorher kam das nie vor.", name: "Lisa M.", business: "Modeboutique, Mainz" },
  formH2: "Kostenlose Shop-Website Vorschau in 48 Stunden",
  finalH2: "Voller Laden. Volle Kasse. Online gefunden.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Solo-Shop", Pro: "Wachstums-Laden", Premium: "Premium-Marke" },
});

const EinzelhandelHub = () => <TradeHub config={config} />;
export default EinzelhandelHub;