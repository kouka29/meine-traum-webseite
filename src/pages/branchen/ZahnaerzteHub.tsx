import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Zahnärzte & KFO",
  badgeColor: "#0891B2",
  badgeText: "🦷 SPEZIELL FÜR ZAHNÄRZTE & KIEFERORTHOPÄDEN",
  heroH1: <>Mehr Patienten für Ihre Praxis — <span style={{ color: "var(--brand-purple)" }}>vertrauensvoll, modern, buchbar</span></>,
  heroSub: "Patienten suchen 'Zahnarzt in Deiner Stadt' und entscheiden in Sekunden. Wir bauen die Website, die Vertrauen schafft und Termine produziert.",
  trustBadges: ["Online-Termin direkt buchbar", "DSGVO-konform & sicher", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Praxen aus DACH vertrauen uns",
  painPoints: [
    { icon: "📞", title: "Telefon dauerblockiert", description: "Patiententermine, Notfälle, Rückrufe — eine Online-Buchung entlastet die Rezeption massiv." },
    { icon: "😨", title: "Angstpatienten gehen woanders hin", description: "Eine vertrauensvolle Website mit Bildern, Team und Leistungen senkt die Hemmschwelle deutlich." },
    { icon: "🔍", title: "Konkurrenz steht oben bei Google", description: "Wer bei 'Zahnarzt in Deiner Stadt' nicht erscheint, verliert Neupatienten. Wir bringen Sie nach vorne." },
    { icon: "💉", title: "Leistungen verstecken sich", description: "Implantate, Bleaching, KFO — eigene Seiten je Leistung erhöhen Anfragen messbar." },
  ],
  stepsH2: "Ihre Praxis-Website — modern & vertrauensvoll",
  featuresH2: "Was Ihre Praxis-Website kann",
  features: [
    { emoji: "📅", title: "Online-Termin direkt buchbar", description: "Patienten buchen 24/7 — auch abends, auch am Wochenende. Rezeption wird entlastet." },
    { emoji: "👥", title: "Team & Praxis vorstellen", description: "Bilder, Vita, Schwerpunkte — schafft Vertrauen, bevor der erste Termin stattfindet." },
    { emoji: "🦷", title: "Leistungen als Einzelseiten", description: "Implantate, Bleaching, KFO — jede Leistung eigene SEO-starke Seite mit klarer Erklärung." },
    { emoji: "🚨", title: "Notdienst-Hinweis sichtbar", description: "Notfälle finden die richtige Info sofort — keine verzweifelten Anrufe nachts." },
    { emoji: "📱", title: "Mobil perfekt", description: "70 % der Patienten suchen mobil. Ihre Seite funktioniert überall einwandfrei." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, DSGVO, Updates — Sie behandeln, wir betreiben." },
  ],
  testimonialH2: "Was eine Zahnarztpraxis über uns sagt",
  testimonial: { stars: 5, badge: "+12 NEUPATIENTEN / MONAT", badgeColor: "#0891B2", quote: "Wir haben jetzt konstant 10–15 Neupatienten pro Monat über die Website. Vorher waren es 2–3. Die Online-Terminbuchung wird intensiv genutzt — Rezeption hat endlich Luft.", name: "Dr. T. Klein", business: "Zahnarztpraxis, Wiesbaden" },
  formH2: "Kostenlose Praxis-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Patienten. Mehr Vertrauen. Ruhigere Rezeption.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Einzelpraxis", Pro: "Wachstumspraxis", Premium: "Premium-Praxis" },
});

const ZahnaerzteHub = () => <TradeHub config={config} />;
export default ZahnaerzteHub;