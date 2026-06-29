import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Tierarztpraxis",
  badgeColor: "#7C3AED",
  badgeText: "🐾 SPEZIELL FÜR TIERÄRZTE",
  heroH1: <>Mehr Tierhalter in Ihrer Praxis — <span style={{ color: "var(--brand-purple)" }}>Termin online, Notdienst klar sichtbar</span></>,
  heroSub: "Tierhalter suchen 'Tierarzt [Stadt]' oft im Notfall. Wir bauen die Website, die sofort die richtige Info liefert und Termine produziert.",
  trustBadges: ["Online-Termin direkt buchbar", "Notdienst-Hinweis prominent", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Tierärzt:innen aus der Region vertrauen uns",
  painPoints: [
    { icon: "🚨", title: "Notfälle blockieren das Telefon", description: "Wer im Notfall die Notdienst-Info auf der Website findet, ruft nicht panisch an." },
    { icon: "📞", title: "Rezeption dauerblockiert", description: "Online-Termine entlasten die Anmeldung — mehr Zeit für die wirklich wichtigen Anrufe." },
    { icon: "🐶", title: "Spezialgebiete unbekannt", description: "Kleintier, Pferde, Exoten, Chirurgie — Tierhalter müssen sofort sehen, ob Sie der richtige Arzt sind." },
    { icon: "🔍", title: "Konkurrenz steht oben bei Google", description: "Wer 'Tierarzt in der Nähe' nicht erscheint, verliert Stamm- und Neupatienten." },
  ],
  stepsH2: "Ihre Tierarzt-Website — empathisch & buchbar",
  featuresH2: "Was Ihre Tierarzt-Website kann",
  features: [
    { emoji: "📅", title: "Online-Termin direkt buchbar", description: "Tierhalter buchen 24/7 — Routine-Untersuchungen, Impfungen, Kontrollen." },
    { emoji: "🚨", title: "Notdienst-Hinweis prominent", description: "Wo finden Halter nachts den Notdienst — sofort sichtbar, keine Sucherei." },
    { emoji: "🐎", title: "Spezialgebiete klar gegliedert", description: "Kleintier, Pferde, Exoten, Chirurgie — eigene SEO-starke Seiten je Schwerpunkt." },
    { emoji: "👥", title: "Team & Praxis vorstellen", description: "Tierhalter wählen oft die Tierärztin, die zu ihrem Tier passt." },
    { emoji: "📱", title: "Mobil perfekt", description: "Tierhalter suchen am Handy, oft in Sorge. Schnelle, klare Info entscheidet." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, DSGVO, Updates — Sie heilen, wir betreiben." },
  ],
  testimonialH2: "Was eine Tierarztpraxis über uns sagt",
  testimonial: { stars: 5, badge: "RUHIGERE REZEPTION", badgeColor: "#7C3AED", quote: "Seit der Online-Terminbuchung ist die Rezeption deutlich ruhiger — wir können uns auf die wirklich wichtigen Anrufe konzentrieren. Notdienst-Anrufe sind um 40 % gesunken.", name: "Dr. K. Reuter", business: "Tierarztpraxis, Mainz" },
  formH2: "Kostenlose Tierarzt-Website Vorschau in 48 Stunden",
  finalH2: "Volle Praxis. Ruhigere Rezeption. Klare Notdienst-Info.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Einzelpraxis", Pro: "Wachstumspraxis", Premium: "Premium-Klinik" },
});

const TieraerzteHub = () => <TradeHub config={config} />;
export default TieraerzteHub;