import TradeHub from "@/components/trade/TradeHub";
import { branche } from "./_shared";

const config = branche({
  branche: "Ingenieurbüro",
  badgeColor: "#0F766E",
  badgeText: "📐 SPEZIELL FÜR INGENIEURE & PLANER",
  heroH1: <>Mehr B2B-Aufträge für Ihr Büro — <span style={{ color: "var(--brand-purple)" }}>Referenzen, die Auftraggeber überzeugen</span></>,
  heroSub: "Architekten, Bauträger und Industrie suchen Ingenieurpartner online. Wir bauen die Website, die Ihre Kompetenz technisch und visuell beweist.",
  trustBadges: ["Referenzprojekte im Fokus", "Fachkräfte-Recruiting integriert", "Fertig in 7–14 Tagen"],
  socialProof: "⭐⭐⭐⭐⭐ Ingenieurbüros aus DACH vertrauen uns",
  painPoints: [
    { icon: "🏗️", title: "Auftraggeber prüfen online — Sie sind unsichtbar", description: "Wer Sie nicht googeln kann, vergibt den Auftrag woanders. Auch bei Empfehlungen wird recherchiert." },
    { icon: "👷", title: "Fachkräfte finden Sie nicht", description: "Ingenieure und Techniker suchen Arbeitgeber online. Ohne Karriereseite verlieren Sie den Krieg um Talente." },
    { icon: "📂", title: "Referenzprojekte verstecken sich in PDFs", description: "Echte Projekte sind Ihr stärkstes Argument. Wir präsentieren sie wie eine Architektur-Monographie." },
    { icon: "⚙️", title: "Komplexe Leistungen unverständlich", description: "Tragwerksplanung, TGA, Bauphysik — Auftraggeber müssen es verstehen, nicht studiert haben." },
  ],
  stepsH2: "Ihre Ingenieur-Website — präzise & überzeugend",
  featuresH2: "Was Ihre Ingenieur-Website kann",
  features: [
    { emoji: "📊", title: "Referenzprojekte als Case-Studies", description: "Jedes Projekt mit Daten, Bildern, Herausforderung & Lösung — wie ein Portfolio, das verkauft." },
    { emoji: "👥", title: "Karriereseite mit Bewerbungsformular", description: "Ingenieure bewerben sich direkt — mit Anschreiben, Lebenslauf, Wunschposition." },
    { emoji: "🏆", title: "Zertifikate & Mitgliedschaften prominent", description: "Ingenieurkammer, DGNB, EnergieEffizienz-Experte — Vertrauen auf einen Blick." },
    { emoji: "📐", title: "Leistungen klar gegliedert", description: "Statik, TGA, Brandschutz, Energieberatung — jede Disziplin eigene SEO-starke Seite." },
    { emoji: "📱", title: "Mobil & schnell", description: "Auch auf der Baustelle abrufbar. Pagespeed-optimiert für jedes Endgerät." },
    { emoji: "🔧", title: "Alles inklusive", description: "Hosting, Domain, SSL, Wartung — Sie planen, wir betreiben." },
  ],
  testimonialH2: "Was ein Ingenieurbüro über uns sagt",
  testimonial: { stars: 5, badge: "+3 GROßPROJEKTE", badgeColor: "#0F766E", quote: "Innerhalb von 4 Monaten haben wir drei Bauträger als Neukunden gewonnen — alle haben uns über Google gefunden. Die Investition ist dreifach zurück.", name: "Dipl.-Ing. R. Hartmann", business: "Ingenieurbüro, Frankfurt" },
  formH2: "Kostenlose Büro-Website Vorschau in 48 Stunden",
  finalH2: "Mehr Aufträge. Bessere Talente. Sichtbare Kompetenz.",
  finalSub: "Kostenlose Website-Vorschau in 48 Stunden. Unverbindlich. Ohne Verpflichtung.",
  pricingNames: { Starter: "Solo-Büro", Pro: "Wachstums-Büro", Premium: "Premium-Büro" },
});

const IngenieureHub = () => <TradeHub config={config} />;
export default IngenieureHub;