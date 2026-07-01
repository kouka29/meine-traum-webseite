import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Reinigungsdienstleister",
  badgeColor: "#06B6D4",
  badgeText: "✨ SPEZIELL FÜR REINIGUNGSDIENSTLEISTER",
  heroH1: <>Mehr Reinigungs-Aufträge — <span style={{ color: "var(--brand-purple)" }}>Gewerbe & Privat, planbar gewonnen</span></>,
  heroSub: "Kunden suchen 'Gebäudereinigung in Deiner Stadt' oder 'Reinigungsfirma'. Wir bauen die Website, die seriös wirkt — und Anfragen produziert.",
  trustBadges: ["Angebotsanfrage in 30 Sekunden", "Gewerbe & Privat trennbar", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Reinigungsbetriebe aus der Region vertrauen uns",
  painPoints: [
    { icon: "📞", title: "Aufträge gehen an die Konkurrenz", description: "Wer nicht bei Google gefunden wird, bekommt die Anfrage nicht. Empfehlungen alleine reichen nicht mehr." },
    { icon: "🏢", title: "B2B-Auftraggeber prüfen online", description: "Hausverwaltungen, Bürogebäude — die googeln Sie. Ohne professionelle Website kein Großauftrag." },
    { icon: "💸", title: "Werbung ohne Conversion", description: "Flyer und Google-Ads ohne starke Website verbrennen Budget. Wir bauen die Seite, die wirklich konvertiert." },
    { icon: "❓", title: "Leistungen unklar", description: "Glasreinigung, Treppenhaus, Industrie, Bauend-Reinigung — Kunden müssen sofort sehen, was Sie können." },
  ],
  stepsH2: "Ihre Reinigungs-Website — sauber & seriös",
  featuresH2: "Was Ihre Reinigungs-Website kann",
  features: [
    { emoji: "📋", title: "Angebotsanfrage in 30 Sekunden", description: "Objekt, m², Frequenz — Kunde sendet, Sie kalkulieren. Klare Leads ohne Telefon-Tennis." },
    { emoji: "🏢", title: "Gewerbe- & Privatbereich getrennt", description: "Zwei unterschiedliche Zielgruppen, zwei optimierte Seitenstränge — beide konvertieren." },
    { emoji: "🗺️", title: "Servicegebiete sichtbar", description: "Welche Städte und PLZ Sie bedienen — Google indexiert jede für lokale Anfragen." },
    { emoji: "⭐", title: "Bewertungen prominent", description: "Echte Stimmen + Google-Sterne — der schnellste Weg zu Vertrauen." },
    { emoji: "📱", title: "Mobil perfekt", description: "Hausmeister und Geschäftsführer suchen mobil. Ihre Seite funktioniert auf jedem Gerät." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Sie reinigen, wir betreiben." },
  ],
  testimonialH2: "Was ein Reinigungsbetrieb über uns sagt",
  testimonial: { stars: 5, badge: "2 NEUE B2B-VERTRÄGE", badgeColor: "#06B6D4", quote: "Wir haben in 6 Wochen zwei neue Bürogebäude als Dauerauftrag gewonnen — beide über die Website angefragt. Die monatlichen Umsätze decken die Investition 10-fach.", name: "Andreas P.", business: "Gebäudereinigung, Mainz" },
  formH2: "Kostenlose Reinigungs-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Aufträge. Saubere Akquise. Planbar.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
});

const ReinigungHub = () => <TradeHub config={config} />;
export default ReinigungHub;