import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Gastronomie & Hotellerie",
  badgeColor: "#DC2626",
  badgeText: "🍽️ SPEZIELL FÜR GASTRONOMIE & HOTELLERIE",
  heroH1: <>Mehr Reservierungen & Buchungen — <span style={{ color: "var(--brand-purple)" }}>direkt, ohne Provision an Portale</span></>,
  heroSub: "Gäste suchen 'Restaurant in Deiner Stadt' oder 'Hotel mit Frühstück'. Wir bauen die Website, die direkt bucht — statt Booking.com 15 % zu schenken.",
  trustBadges: ["Direkt-Reservierung ohne Provision", "Speisekarte/Zimmer mobil", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Restaurants & Hotels aus Mainz/Wiesbaden vertrauen uns",
  painPoints: [
    { icon: "💸", title: "Booking.com & OpenTable kassieren mit", description: "10–15 % jeder Buchung gehen weg. Eine eigene Website kassiert sich in 2 Monaten ein." },
    { icon: "📸", title: "Schlechte Bilder, leere Tische", description: "Gäste entscheiden visuell in 3 Sekunden. Wir setzen Speisen, Räume, Atmosphäre richtig in Szene." },
    { icon: "📋", title: "Speisekarte als veraltetes PDF", description: "Niemand zoomt PDFs. Eine mobile, schöne Karte erhöht Reservierungen messbar." },
    { icon: "🗺️", title: "Auf Google Maps unsichtbar", description: "80 % der Tischreservierungen starten auf Google Maps. Ohne Optimierung verlieren Sie täglich Gäste." },
  ],
  stepsH2: "Ihre Restaurant-/Hotel-Website — appetitlich & buchbar",
  featuresH2: "Was Ihre Gastro-Website kann",
  features: [
    { emoji: "🪑", title: "Online-Reservierung ohne Provision", description: "Gäste reservieren direkt — Sie sparen die Portal-Gebühr, behalten den Kundenkontakt." },
    { emoji: "🛏️", title: "Direkt-Zimmerbuchung", description: "Mit Channel-Manager-Anbindung oder direkter Anfrage — Sie sparen Booking.com-Provision." },
    { emoji: "🍷", title: "Speisekarte mit Bildern", description: "Wechselnde Karten, Tagesgerichte, Allergene — alles übersichtlich, mobil perfekt." },
    { emoji: "🚚", title: "Lieferdienst- & Take-Away-Modul", description: "Optional integriert oder mit Lieferando/Wolt verbunden." },
    { emoji: "🗺️", title: "Google Maps & Local SEO", description: "Sie erscheinen ganz oben, wenn jemand 'Italiener in Deiner Stadt' sucht." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Speisekarten-Updates — wir kochen die Technik, Sie das Essen." },
  ],
  testimonialH2: "Was Gastronomen über uns sagen",
  testimonial: { stars: 5, badge: "30% MEHR RESERVIERUNGEN", badgeColor: "#DC2626", quote: "Direkt-Reservierungen über die Website sind um 30 % gestiegen. Wir sparen jeden Monat über 400 € an Portal-Gebühren. Die Seite war nach 5 Wochen abbezahlt.", name: "Marco F.", business: "Trattoria, Mainz" },
  formH2: "Kostenlose Gastro-Website Vorschau in 48 Stunden",
  finalH2: "Volle Tische. Volle Zimmer. Ohne Portal-Provision.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Bistro", Pro: "Wachstums-Betrieb", Premium: "Marktführer" },
});

const GastronomieHub = () => <TradeHub config={config} />;
export default GastronomieHub;