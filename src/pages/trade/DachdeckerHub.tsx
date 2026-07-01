import TradeHub, { TradeHubConfig } from "@/components/trade/TradeHub";

const config: TradeHubConfig = {
  branche: "Dachdecker",
  badgeColor: "#F97316",
  badgeText: "🏠 SPEZIELL FÜR DACHDECKER",
  heroH1: <>Mehr Aufträge als Dachdecker — <span style={{ color: "var(--brand-purple)" }}>wenn Kunden ein Dach brauchen finden sie Dich</span></>,
  heroSub: "Dachsanierung, Sturmschaden, Neueindeckung — Kunden suchen sofort online. Mit der richtigen Website rufst Du sie an — nicht umgekehrt.",
  trustBadges: ["Sturmschaden-Seite inklusive", "Kein Technik-Stress", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Dachdecker aus der Region vertrauen uns",
  painPoints: [
    { icon: "⛈️", title: "Sturmschäden gehen an die Konkurrenz", description: "Nach jedem Sturm suchen hunderte Kunden nach 'Dachdecker' in Deiner Stadt. Wer nicht erscheint verliert diese Aufträge jedes Mal." },
    { icon: "📅", title: "Saisonalität überbrücken", description: "Winter = weniger Aufträge? Eine starke Online-Präsenz bringt Anfragen das ganze Jahr — nicht nur im Sommer." },
    { icon: "💰", title: "Große Aufträge brauchen Vertrauen", description: "Eine Dachsanierung kostet 20.000€+. Kunden kaufen nur beim Betrieb dem sie vertrauen — und Vertrauen beginnt online." },
    { icon: "☀️", title: "Photovoltaik-Nachfrage nutzen", description: "PV-Anlagen auf Dächern — riesige Nachfrage. Wer online sichtbar ist gewinnt diese lukrativen Aufträge." },
  ],
  stepsH2: "Deine Dachdecker-Website — ohne Stress, ohne Technik",
  featuresH2: "Was Deine Dachdecker-Website kann",
  features: [
    { emoji: "⛈️", title: "Sturmschaden-Notfallseite", description: "Eine eigene Seite die bei Suchen wie 'Sturmschaden Dach' in Deiner Stadt rankt — sofort nach dem nächsten Unwetter werden Kunden auf Dich aufmerksam." },
    { emoji: "🏗️", title: "Referenz-Galerie Vorher/Nachher", description: "Zeig Deine Projekte professionell — Kunden wollen sehen was Du kannst, bevor sie anrufen." },
    { emoji: "☀️", title: "PV-Leistungen sichtbar machen", description: "Photovoltaik, Dachbegrünung, Dämmung — alle Leistungen klar dargestellt damit Kunden wissen was Du anbietest." },
    { emoji: "📍", title: "Regional top bei Google", description: "Optimiert für lokale Suchen wie 'Dachdecker' und 'Dachsanierung' in Deiner Region — Du erscheinst wenn jemand sucht." },
    { emoji: "📱", title: "Mobil perfekt", description: "Kunden suchen nach Sturm sofort auf dem Handy — Deine Seite lädt schnell und hat Click-to-Call prominent." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Du machst Dein Handwerk, wir den Rest." },
  ],
  testimonialH2: "Was ein Dachdecker über uns sagt",
  testimonial: { stars: 5, badge: "15 ANFRAGEN NACH STURM", badgeColor: "#F97316", quote: "Nach dem letzten Sturm hatten wir 15 Anfragen über die Website in 2 Tagen. Früher hätten die alle die Konkurrenz angerufen. Die Sturmschaden-Seite war die beste Investition des Jahres.", name: "Stefan D.", business: "Dachdeckerbetrieb, Mainz" },
  crossLinks: [
    { icon: "⚡", label: "Für Elektriker", to: "/elektriker" },
    { icon: "🎨", label: "Für Maler", to: "/maler" },
    { icon: "🔧", label: "Für Sanitär & Heizung", to: "/sanitaer" },
  ],
  formH2: "Kostenlose Dachdecker-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Aufträge als Dachdecker. Auch nach dem nächsten Sturm.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
};

const DachdeckerHub = () => <TradeHub config={config} />;
export default DachdeckerHub;
