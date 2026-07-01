import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Autohaus & Kfz",
  badgeColor: "#EF4444",
  badgeText: "🚗 SPEZIELL FÜR AUTOHÄUSER & KFZ-WERKSTÄTTEN",
  heroH1: <>Mehr Fahrzeugverkäufe & Werkstatt-Aufträge — <span style={{ color: "var(--brand-purple)" }}>online präsent, lokal stark</span></>,
  heroSub: "Kunden suchen 'Werkstatt in Deiner Stadt' oder Gebrauchtwagen online. Wir bauen die Website, die Probefahrten und TÜV-Termine produziert.",
  trustBadges: ["Online-Terminbuchung Werkstatt", "Fahrzeugangebote integriert", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Autohäuser & Werkstätten aus DACH vertrauen uns",
  painPoints: [
    { icon: "📞", title: "Werkstatt-Anrufe blockieren die Annahme", description: "Reifenwechsel-Saison? Telefon kollabiert. Online-Termine entlasten die Annahme massiv." },
    { icon: "🚗", title: "Mobile.de bekommt jede Provision", description: "Wer keinen eigenen Fahrzeug-Bereich auf der Website hat, schenkt Plattformen jede Marge." },
    { icon: "🔍", title: "Auf Google unsichtbar", description: "'Werkstatt in der Nähe' — wer da nicht oben steht, verliert tausende Euro pro Monat." },
    { icon: "🛠️", title: "Services unklar", description: "TÜV, AU, Klimaanlage, Reifen — Kunden müssen auf einen Blick sehen, was Sie können." },
  ],
  stepsH2: "Ihre Autohaus-Website — schnell & verkaufsstark",
  featuresH2: "Was Ihre Autohaus-Website kann",
  features: [
    { emoji: "🗓️", title: "Werkstatt-Termin online", description: "TÜV, Inspektion, Reifenwechsel — Kunden buchen direkt. Sie sehen den Tag im Voraus." },
    { emoji: "🚙", title: "Fahrzeugangebote integriert", description: "Eigene Fahrzeuge mit Bildern, Daten, Probefahrt-Anfrage — Provision behält das Haus." },
    { emoji: "🛠️", title: "Service-Leistungen klar", description: "TÜV, AU, Klima, Reifen, Karosserie — jede Leistung mit klarem Preisrahmen." },
    { emoji: "⭐", title: "Bewertungen prominent", description: "Google-Sterne und echte Kunden-Stimmen — Vertrauen entscheidet beim Werkstattwechsel." },
    { emoji: "📱", title: "Mobil perfekt", description: "Kunden suchen unterwegs. Ihre Seite funktioniert auf jedem Smartphone." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Sie schrauben, wir betreiben." },
  ],
  testimonialH2: "Was ein Autohaus über uns sagt",
  testimonial: { stars: 5, badge: "VOLLE WERKSTATT", badgeColor: "#EF4444", quote: "Die Online-Terminbuchung für die Werkstatt wird täglich genutzt. Wir sind 3 Wochen im Voraus ausgebucht — und das Telefon klingelt deutlich seltener.", name: "Jürgen H.", business: "Kfz-Meisterbetrieb, Frankfurt" },
  formH2: "Kostenlose Autohaus-Website Vorschau in 48 Stunden",
  finalH2: "Volle Werkstatt. Mehr Verkäufe. Online sichtbar.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Solo-Werkstatt", Pro: "Wachstums-Haus", Premium: "Premium-Haus" },
});

const AutohaeuserHub = () => <TradeHub config={config} />;
export default AutohaeuserHub;