import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Fitnessstudio",
  badgeColor: "#F97316",
  badgeText: "💪 SPEZIELL FÜR FITNESS- & YOGASTUDIOS",
  heroH1: <>Mehr Mitglieder für Dein Studio — <span style={{ color: "var(--brand-purple)" }}>gefunden, gebucht, gewonnen</span></>,
  heroSub: "Kunden suchen 'Fitnessstudio [Stadt]' oder 'Yoga in der Nähe' — wir sorgen dafür dass sie Dich finden und direkt eine Probestunde buchen.",
  trustBadges: ["Probestunde direkt buchbar", "Kursplan immer aktuell", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Studios aus Mainz, Frankfurt & Wiesbaden vertrauen uns",
  painPoints: [
    { icon: "📅", title: "Probestunden landen auf Instagram statt im Studio", description: "Interessenten schreiben DMs, du verlierst sie im Posteingang. Eine Website mit Online-Buchung wandelt sofort." },
    { icon: "🥊", title: "Konkurrenz mit Online-Mitgliedschaft", description: "Die großen Ketten sind 24/7 online. Wer keine Website hat, wirkt klein — selbst wenn die Hallen voll sind." },
    { icon: "📋", title: "Kursplan nur als PDF", description: "Niemand lädt PDFs runter. Ein aktueller, mobiler Kursplan auf der Website hält Mitglieder informiert." },
    { icon: "💸", title: "Werbung ohne Landingpage verbrennt Geld", description: "Instagram-Ads ohne Conversion-Seite bringen kein Mitglied. Wir bauen die Seite, die wirklich konvertiert." },
  ],
  stepsH2: "Deine Studio-Website — ohne Stress, ohne Tech-Wissen",
  featuresH2: "Was Deine Fitness-Website kann",
  features: [
    { emoji: "🗓️", title: "Online-Probestunde buchen", description: "Interessenten buchen direkt — ohne Anruf, ohne DM, ohne dass Du etwas tun musst." },
    { emoji: "💪", title: "Kursplan & Trainer vorstellen", description: "Kurse, Trainer:innen, Specials — alles übersichtlich und mobil perfekt." },
    { emoji: "⭐", title: "Bewertungen sichtbar machen", description: "Google-Sterne und echte Mitglieder-Stimmen prominent — der stärkste Vertrauensbeweis." },
    { emoji: "📱", title: "Perfekt auf jedem Handy", description: "90 % Deiner Interessenten kommen vom Smartphone. Wir bauen mobile-first." },
    { emoji: "🎯", title: "Lokal gefunden werden", description: "Google Maps + lokale SEO — Du erscheinst genau wenn jemand nach 'Yoga [Stadt]' sucht." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Updates, Kursplan-Pflege — wir kümmern uns." },
  ],
  testimonialH2: "Was Studios über uns sagen",
  testimonial: { stars: 5, badge: "+40 NEUE MITGLIEDER", badgeColor: "#F97316", quote: "Seit der neuen Website buchen Interessenten Probestunden komplett selbst. Wir haben in 3 Monaten 40 neue Mitglieder gewonnen — ohne mehr Werbung.", name: "Sarah K.", business: "Yogastudio, Mainz" },
  formH2: "Kostenlose Studio-Website Vorschau in 48 Stunden",
  finalH2: "Volle Kurse. Planbar. Ohne Tech-Stress.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.",
  pricingNames: { Starter: "Solo-Studio", Pro: "Wachstums-Studio", Premium: "Premium-Studio" },
});

const FitnessHub = () => <TradeHub config={config} />;
export default FitnessHub;