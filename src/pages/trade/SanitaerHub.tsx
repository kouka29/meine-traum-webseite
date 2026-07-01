import TradeHub, { TradeHubConfig } from "@/components/trade/TradeHub";

const config: TradeHubConfig = {
  branche: "Sanitär & Heizung",
  badgeColor: "#3B82F6",
  badgeText: "🔧 SPEZIELL FÜR SANITÄR & HEIZUNGSBETRIEBE",
  heroH1: <>Mehr Aufträge als Sanitär- oder Heizungsbetrieb — <span style={{ color: "var(--brand-purple)" }}>rund um die Uhr gefunden</span></>,
  heroSub: "Badezimmer-Renovierung, Heizungsanlage, Rohrbruch — Kunden suchen sofort auf Google. Wir sorgen dafür dass sie Dich finden.",
  trustBadges: ["Notfall-Seite inklusive", "Kein Technik-Stress", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Sanitärbetriebe aus der Region vertrauen uns",
  painPoints: [
    { icon: "🚨", title: "Notfall-Kunden finden die Konkurrenz", description: "Rohrbruch um 22 Uhr: Wer nicht auf Google erscheint bekommt den Notfall-Auftrag nicht. Jeden Tag." },
    { icon: "🛁", title: "Badplanung bringt Stammkunden", description: "Wer ein Traumbad will googelt erst — und ruft dann an. Bist Du der Erste den er findet?" },
    { icon: "♨️", title: "Heizungsmodernisierung ist gefragt", description: "Wärmepumpe, neue Heizanlage — riesige Nachfrage. Wer online sichtbar ist gewinnt diese Aufträge." },
    { icon: "⏰", title: "Keine Zeit für Marketing", description: "Zwischen Montage und Notfalleinsatz bleibt keine Zeit. Deine Website arbeitet für Dich — auch nachts." },
  ],
  stepsH2: "Deine Sanitär-Website — ohne Stress, ohne Technik",
  featuresH2: "Was Deine Sanitär-Website kann",
  features: [
    { emoji: "🚨", title: "Notfall-Page optimiert", description: "Eine eigene Notfall-Seite die bei Suchen wie 'Rohrbruch' in Deiner Stadt rankt und sofort Vertrauen aufbaut — auch um Mitternacht." },
    { emoji: "🛁", title: "Badplanung-Galerie", description: "Zeig Deine schönsten Bad-Referenzen — Kunden entscheiden mit den Augen, dann mit dem Geldbeutel." },
    { emoji: "♨️", title: "Heizungsleistungen klar dargestellt", description: "Wärmepumpe, Gas, Öl, Pellets — alle Leistungen strukturiert und für Kunden verständlich." },
    { emoji: "📍", title: "Lokal bei Google gefunden", description: "Optimiert für lokale Suchen wie 'Sanitär', 'Heizung', 'Rohrbruch' in Deiner Stadt — Du erscheinst wenn es drauf ankommt." },
    { emoji: "📱", title: "Mobil-optimiert", description: "Notfall-Kunden suchen auf dem Handy — Deine Seite lädt sofort und hat Click-to-Call prominent." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Du machst Dein Handwerk, wir den Rest." },
  ],
  testimonialH2: "Was ein Sanitärbetrieb über uns sagt",
  testimonial: { stars: 5, badge: "TOP 3 BEI GOOGLE", badgeColor: "#3B82F6", quote: "Seit wir online sind kommen Anfragen für Badsanierungen automatisch. Letzte Woche 2 Aufträge über Google — das gab es vorher nie. Und die Notfall-Seite bringt uns sogar nachts Anrufe.", name: "Andrea S.", business: "Sanitärbetrieb, Frankfurt" },
  crossLinks: [
    { icon: "⚡", label: "Für Elektriker", to: "/elektriker" },
    { icon: "🎨", label: "Für Maler", to: "/maler" },
    { icon: "🏠", label: "Für Dachdecker", to: "/dachdecker" },
  ],
  formH2: "Kostenlose Sanitär-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Aufträge als Sanitärbetrieb. Auch bei Notfällen gefunden.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
};

const SanitaerHub = () => <TradeHub config={config} />;
export default SanitaerHub;
