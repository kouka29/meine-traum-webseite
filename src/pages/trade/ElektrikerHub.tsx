import TradeHub, { TradeHubConfig } from "@/components/trade/TradeHub";

const config: TradeHubConfig = {
  branche: "Elektriker",
  badgeColor: "#FBBF24",
  badgeText: "⚡ SPEZIELL FÜR ELEKTRIKER",
  heroH1: <>Mehr Aufträge als Elektriker — <span style={{ color: "var(--brand-purple)" }}>gefunden auf Google wenn's drauf ankommt</span></>,
  heroSub: "Kunden suchen 'Elektriker [Stadt]' — wir sorgen dafür dass sie Dich finden. Nicht Deinen Konkurrenten.",
  trustBadges: ["Gefunden bei Notfall-Suchen", "Kein Technik-Stress", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Elektriker aus der Region vertrauen uns",
  painPoints: [
    { icon: "⚡", title: "Notfall-Anrufe gehen an die Konkurrenz", description: "Wenn der Strom ausfällt sucht der Kunde sofort Google. Wer dort nicht erscheint — verliert den Notfall-Auftrag." },
    { icon: "🔗", title: "Zu abhängig von Empfehlungen", description: "Empfehlungen sind gut — aber planbar ist anders. Eine Website bringt täglich neue Anfragen — auch von Fremden." },
    { icon: "👥", title: "Privat- UND Gewerbekunden ansprechen", description: "Deine Website muss beide überzeugen. Mit der richtigen Struktur geht das — wir wissen wie." },
    { icon: "📊", title: "Konkurrenz ist schon online", description: "Deine Mitbewerber haben bereits eine Website. Jeden Tag ohne eigene Seite verlierst Du Kunden." },
  ],
  stepsH2: "Deine Elektriker-Website — ohne Stress, ohne Technik",
  featuresH2: "Was Deine Elektriker-Website kann",
  features: [
    { emoji: "🔍", title: "Gefunden bei Notfall-Suchen", description: "Kunden suchen nachts 'Elektriker Notfall [Stadt]' — wir sorgen dafür dass Du erscheinst wenn es drauf ankommt." },
    { emoji: "📋", title: "Leistungsseiten die überzeugen", description: "Hausanschluss, Zählerschrank, Smart Home — Deine Leistungen klar und vertrauenswürdig dargestellt." },
    { emoji: "⭐", title: "Bewertungen die Kunden bringen", description: "Wir helfen Dir Google-Bewertungen zu sammeln — der stärkste Vertrauensbeweis für neue Kunden." },
    { emoji: "📱", title: "Perfekt auf jedem Handy", description: "Kunden suchen auf dem Handy — auch auf der Baustelle. Deine Seite funktioniert überall." },
    { emoji: "🗺️", title: "Google Maps präsent", description: "Dein Betrieb auf Google Maps eingerichtet — Kunden sehen Dich sofort bei lokalen Suchen." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Du machst Dein Handwerk, wir den Rest." },
  ],
  testimonialH2: "Was ein Elektriker über uns sagt",
  testimonial: { stars: 5, badge: "4X MEHR ANFRAGEN", badgeColor: "#FBBF24", quote: "Seit der neuen Website bekomme ich 3–4 Anfragen pro Woche über Google. Früher war es vielleicht eine im Monat. Die Investition hat sich nach 6 Wochen bezahlt gemacht.", name: "Thomas E.", business: "Elektrobetrieb, Frankfurt" },
  crossLinks: [
    { icon: "🎨", label: "Für Maler", to: "/maler" },
    { icon: "🔧", label: "Für Sanitär & Heizung", to: "/sanitaer" },
    { icon: "🏠", label: "Für Dachdecker", to: "/dachdecker" },
  ],
  formH2: "Kostenlose Elektriker-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Aufträge als Elektriker. Planbar.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
};

const ElektrikerHub = () => <TradeHub config={config} />;
export default ElektrikerHub;
