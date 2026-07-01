import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Friseur & Kosmetik",
  badgeColor: "#EC4899",
  badgeText: "💇 SPEZIELL FÜR FRISEURE & KOSMETIK",
  heroH1: <>Volle Terminbücher — <span style={{ color: "var(--brand-purple)" }}>Kunden buchen direkt, ohne Anruf</span></>,
  heroSub: "Kunden suchen 'Friseur in der Nähe' und wollen sofort buchen. Wir bauen die Website mit Online-Termin und Instagram-Anbindung — die Termine produziert.",
  trustBadges: ["Online-Terminbuchung 24/7", "Instagram-Galerie live", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Salons aus der Region vertrauen uns",
  painPoints: [
    { icon: "📞", title: "Telefon klingelt während der Behandlung", description: "Termine annehmen während Kundenarbeit ist nervig. Online-Buchung löst das Problem." },
    { icon: "📸", title: "Instagram-Arbeiten landen nicht im Salon", description: "Tolle Posts, leere Stühle — ohne Website-Brücke konvertiert Instagram schlecht." },
    { icon: "💸", title: "No-Shows kosten Geld", description: "Online-Buchung mit Erinnerung reduziert No-Shows um bis zu 60 %." },
    { icon: "🔍", title: "Bei Google nicht auffindbar", description: "Wer 'Friseur in Deiner Stadt' nicht oben steht, verliert Laufkundschaft komplett." },
  ],
  stepsH2: "Deine Salon-Website — stylisch & buchbar",
  featuresH2: "Was Deine Salon-Website kann",
  features: [
    { emoji: "📅", title: "Online-Terminbuchung 24/7", description: "Kunden buchen abends auf dem Sofa — Du wachst morgens mit vollen Stühlen auf." },
    { emoji: "📸", title: "Instagram-Feed live", description: "Deine besten Arbeiten automatisch auf der Website — frischer Content, ohne Aufwand." },
    { emoji: "💅", title: "Preisliste klar & ehrlich", description: "Schnitt, Färben, Strähnen — keine Überraschungen, mehr Vertrauen, mehr Buchungen." },
    { emoji: "⭐", title: "Bewertungen prominent", description: "Google-Sterne und Kundenstimmen sichtbar — der stärkste Vertrauensbeweis." },
    { emoji: "📱", title: "Mobil perfekt", description: "90 % buchen vom Handy. Deine Seite funktioniert überall einwandfrei." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates — Du schneidest, wir betreiben." },
  ],
  testimonialH2: "Was Salons über uns sagen",
  testimonial: { stars: 5, badge: "ZWEI WOCHEN AUSGEBUCHT", badgeColor: "#EC4899", quote: "Seit der Online-Buchung sind wir 2 Wochen im Voraus ausgebucht. Das Telefon klingelt fast nicht mehr — wir arbeiten in Ruhe. Game-Changer.", name: "Nicole S.", business: "Hair & Beauty, Mainz" },
  formH2: "Kostenlose Salon-Website Vorschau in 48 Stunden",
  finalH2: "Volle Stühle. Ruhiges Telefon. Planbarer Umsatz.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Solo-Salon", Pro: "Wachstums-Salon", Premium: "Premium-Salon" },
});

const FriseureHub = () => <TradeHub config={config} />;
export default FriseureHub;