import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Kanzlei",
  badgeColor: "#1E3A8A",
  badgeText: "⚖️ SPEZIELL FÜR ANWÄLTE & STEUERBERATER",
  heroH1: <>Mehr Mandanten für Ihre Kanzlei — <span style={{ color: "var(--brand-purple)" }}>seriös, vertrauensvoll, online sichtbar</span></>,
  heroSub: "Mandanten suchen 'Anwalt [Stadt] [Fachgebiet]' oder 'Steuerberater in der Nähe'. Wir sorgen dafür, dass Sie als erste Wahl erscheinen — mit Stil und Substanz.",
  trustBadges: ["DSGVO-konform & verschlüsselt", "Fachgebiete klar dargestellt", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Kanzleien aus der DACH-Region vertrauen uns",
  painPoints: [
    { icon: "🔍", title: "Mandanten finden die Konkurrenz zuerst", description: "Wer bei Google nicht oben steht, bekommt die Anfrage nicht. So einfach ist das heute." },
    { icon: "📞", title: "Veraltete Website schreckt ab", description: "Eine Word-Design-Seite aus 2010 zerstört Vertrauen — bevor das erste Gespräch stattfindet." },
    { icon: "📑", title: "Fachgebiete unklar kommuniziert", description: "Wenn Mandanten nicht sofort sehen, dass Sie ihr Problem lösen — gehen sie weiter." },
    { icon: "🔒", title: "Keine sichere Mandantenkommunikation", description: "Verschlüsselter Upload, Termin online, sichere DSGVO-Formulare — heute Standard, nicht Luxus." },
  ],
  stepsH2: "Ihre Kanzlei-Website — diskret, professionell, schnell",
  featuresH2: "Was Ihre Kanzlei-Website kann",
  features: [
    { emoji: "⚖️", title: "Fachgebiete klar strukturiert", description: "Arbeitsrecht, Familienrecht, Steuerrecht — jedes Gebiet eigene Seite, eigene SEO-Stärke." },
    { emoji: "📅", title: "Erstgespräch online buchbar", description: "Mandanten buchen direkt einen Termin — ohne Telefonsekretariat zu blockieren." },
    { emoji: "🔐", title: "Sicherer Mandanten-Upload", description: "Verschlüsselte Dokumenten-Übergabe statt unsichere E-Mail-Anhänge." },
    { emoji: "🏆", title: "Auszeichnungen & Mitgliedschaften", description: "Kammer-Listungen, JUVE, Focus — sichtbar prominent platziert." },
    { emoji: "📱", title: "Mobil perfekt", description: "60 % der Mandanten suchen mobil. Ihre Seite funktioniert überall einwandfrei." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates, DSGVO — wir kümmern uns um die Technik." },
  ],
  testimonialH2: "Was eine Kanzlei über uns sagt",
  testimonial: { stars: 5, badge: "+5 MANDATE / MONAT", badgeColor: "#1E3A8A", quote: "Wir bekommen jetzt 5–8 qualifizierte Anfragen pro Monat über die Website. Vorher waren es 1–2. Und die Qualität der Mandate ist deutlich höher.", name: "Dr. M. Becker", business: "Anwaltskanzlei, Wiesbaden" },
  formH2: "Kostenlose Kanzlei-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Mandanten. Mehr Vertrauen. Online sichtbar.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Diskret. Unverbindlich.",
  pricingNames: { Starter: "Solo-Kanzlei", Pro: "Wachstums-Kanzlei", Premium: "Premium-Kanzlei" },
});

const KanzleienHub = () => <TradeHub config={config} />;
export default KanzleienHub;