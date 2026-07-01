import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Garten- & Landschaftsbau",
  badgeColor: "#16A34A",
  badgeText: "🌿 SPEZIELL FÜR GARTEN- & LANDSCHAFTSBAU",
  heroH1: <>Mehr GaLaBau-Aufträge — <span style={{ color: "var(--brand-purple)" }}>Vorher/Nachher-Bilder, die verkaufen</span></>,
  heroSub: "Kunden suchen 'Gartenbauer in Deiner Stadt' und wollen sehen, was Sie können. Wir bauen die Website mit Referenz-Galerie, die Anfragen konstant produziert.",
  trustBadges: ["Referenz-Galerie als Verkaufsargument", "Anfragen mit Foto-Upload", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ GaLaBau-Betriebe aus DACH vertrauen uns",
  painPoints: [
    { icon: "📸", title: "Projekte verstecken sich auf dem Handy", description: "Tolle Vorher/Nachher-Bilder ohne Website ist verschenktes Potenzial. Sie sind Ihr stärkstes Argument." },
    { icon: "🌱", title: "Saisongeschäft ohne Vorlauf", description: "Wer erst im März Werbung macht, ist zu spät. Eine Website füllt das Jahr planbar." },
    { icon: "🔍", title: "Auf Google unsichtbar", description: "'Gartenbauer in der Nähe' — wer da nicht oben steht, verliert hunderte Anfragen jährlich." },
    { icon: "💸", title: "Anfragen ohne Vorinformation", description: "Kunden wissen nicht, was Sie kosten. Klare Leistungs-Pakete filtern unpassende Anfragen." },
  ],
  stepsH2: "Ihre GaLaBau-Website — grün & konvertierend",
  featuresH2: "Was Ihre Gartenbau-Website kann",
  features: [
    { emoji: "📸", title: "Vorher/Nachher-Galerie", description: "Jedes Projekt mit Bildern, Beschreibung, Standort — verkauft besser als jedes Verkaufsgespräch." },
    { emoji: "📋", title: "Anfrage mit Foto-Upload", description: "Kunde sendet Bilder seines Gartens — Sie kalkulieren präzise ohne Vor-Ort-Termin." },
    { emoji: "🌳", title: "Leistungen saisonal sichtbar", description: "Pflanzung, Pflege, Pflasterung, Teichbau — jede Leistung mit eigener Stärke." },
    { emoji: "⭐", title: "Bewertungen prominent", description: "Google-Sterne und Kundenstimmen — Vertrauen bei großen Investitionen entscheidend." },
    { emoji: "📱", title: "Mobil perfekt", description: "Kunden suchen im Garten am Handy. Ihre Seite funktioniert überall." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Sie gestalten Gärten, wir die Website." },
  ],
  testimonialH2: "Was ein GaLaBau-Betrieb über uns sagt",
  testimonial: { stars: 5, badge: "AUFTRAGSBUCH 2024 VOLL", badgeColor: "#16A34A", quote: "Schon im Februar war das Auftragsbuch für 2024 voll — alles über Anfragen von der Website. Die Vorher/Nachher-Galerie ist ein absoluter Verkaufsbringer.", name: "Markus G.", business: "Garten- & Landschaftsbau, Mainz" },
  formH2: "Kostenlose GaLaBau-Website Vorschau in 48 Stunden",
  finalH2: "Volles Auftragsbuch. Planbares Geschäft. Sichtbar online.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Einzelbetrieb", Pro: "Wachstums-Betrieb", Premium: "Marktführer" },
});

const GartenbauHub = () => <TradeHub config={config} />;
export default GartenbauHub;