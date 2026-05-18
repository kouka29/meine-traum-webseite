import TradeHub, { TradeHubConfig } from "@/components/trade/TradeHub";

const config: TradeHubConfig = {
  branche: "Maler",
  badgeColor: "#10B981",
  badgeText: "🎨 SPEZIELL FÜR MALER & LACKIERER",
  heroH1: <>Mehr Aufträge als Maler — <span style={{ color: "var(--brand-purple)" }}>mit einer Website die Deine Arbeit wirklich zeigt</span></>,
  heroSub: "Bilder sagen mehr als Worte. Wir bauen Dir eine Website die Deine Referenzen so präsentiert dass Kunden sofort anrufen.",
  trustBadges: ["Vorher-Nachher Galerie", "Kein Technik-Stress", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Malerbetriebe aus der Region vertrauen uns",
  painPoints: [
    { icon: "📸", title: "Referenzen zeigen keine Wirkung", description: "WhatsApp-Fotos überzeugen niemanden. Deine Arbeit verdient eine professionelle Präsentation die Kunden begeistert." },
    { icon: "📅", title: "Saisonale Auftragslücken", description: "Im Winter weniger Aufträge? Eine starke Online-Präsenz füllt den Kalender das ganze Jahr." },
    { icon: "🔗", title: "Nur Empfehlungen reichen nicht", description: "Empfehlungen enden irgendwann. Google-Anfragen kommen täglich — auch von Kunden die Dich noch nie getroffen haben." },
    { icon: "💰", title: "Kunden vergleichen nur den Preis", description: "Wer professionell wirkt bekommt den Auftrag — auch wenn er nicht der Günstigste ist. Vertrauen schlägt Preis." },
  ],
  stepsH2: "Deine Maler-Website — ohne Stress, ohne Technik",
  featuresH2: "Was Deine Maler-Website kann",
  features: [
    { emoji: "🖼️", title: "Vorher-Nachher Galerie", description: "Zeig was Du kannst — mit einer professionellen Bildergalerie die Kunden sofort überzeugt." },
    { emoji: "🎨", title: "Spezialisierung sichtbar machen", description: "Innenausbau, Fassade, Tapete, Lackierung — jede Leistung klar und überzeugend dargestellt." },
    { emoji: "📍", title: "Lokal gefunden werden", description: "Optimiert für 'Maler [Deine Stadt]' — damit Du erscheinst wenn Kunden suchen." },
    { emoji: "📱", title: "Mobil perfekt", description: "Kunden schauen auf dem Handy — Deine Bildergalerie lädt schnell und sieht überall gut aus." },
    { emoji: "⭐", title: "Bewertungen sammeln", description: "Google-Bewertungen direkt auf Deiner Seite — der stärkste Vertrauensbeweis." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Du streichst, wir kümmern uns um den Rest." },
  ],
  testimonialH2: "Was ein Malerbetrieb über uns sagt",
  testimonial: { stars: 5, badge: "+180% MEHR ANFRAGEN", badgeColor: "#10B981", quote: "Meine Vorher-Nachher Fotos auf der Website bringen mir jede Woche neue Anfragen. Die Investition hat sich in 6 Wochen amortisiert. Hätte ich früher machen sollen.", name: "Klaus M.", business: "Malerbetrieb, Wiesbaden" },
  crossLinks: [
    { icon: "⚡", label: "Für Elektriker", to: "/elektriker" },
    { icon: "🔧", label: "Für Sanitär & Heizung", to: "/sanitaer" },
    { icon: "🏠", label: "Für Dachdecker", to: "/dachdecker" },
  ],
  formH2: "Kostenlose Maler-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Aufträge als Maler. Deine Arbeit sichtbar machen.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
};

const MalerHub = () => <TradeHub config={config} />;
export default MalerHub;
