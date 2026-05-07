import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PROVIDER = {
  "@type": "Organization",
  name: "Meine Traum Webseite",
  url: "https://meinetraumwebseite.de",
};

interface FaqItem { q: string; a: string }

const faqsByPage: Record<string, FaqItem[]> = {
  "/": [
    { q: "Was kostet es, eine Website erstellen zu lassen?", a: "Die Kosten hängen vom Umfang ab. Unsere Webdesign-Projekte starten ab 1.500 € für eine conversion-optimierte Website. Wir bieten transparente Preise ohne versteckte Kosten." },
    { q: "Wie lange dauert es, eine professionelle Website zu erstellen?", a: "Eine typische Website ist in 2–4 Wochen fertig. Innerhalb von 48 Stunden erhalten Sie bereits eine kostenlose Vorschau." },
    { q: "Was unterscheidet eure Webdesign Agentur von anderen?", a: "Wir erstellen keine digitalen Visitenkarten, sondern Verkaufsinstrumente. Jede Website wird conversion-optimiert gestaltet – mit verkaufspsychologischem Aufbau, schnellen Ladezeiten und messbaren Ergebnissen." },
    { q: "Bietet ihr auch einen Website Relaunch an?", a: "Ja, wir sind spezialisiert auf Website Relaunches. Wir analysieren Ihre bestehende Seite, identifizieren Optimierungspotenziale und erstellen eine moderne, conversion-optimierte Neuauflage." },
  ],
  "/leistungen": [
    { q: "Welche Leistungen bietet eure Webdesign Agentur?", a: "Wir bieten Conversion-Webdesign, UX/UI Design, SEO-Optimierung, Landingpage-Erstellung, Website Relaunch und Conversion-Optimierung – alles aus einer Hand." },
    { q: "Kann ich einzelne Leistungen buchen?", a: "Ja! Sie können jede Leistung einzeln buchen oder als Komplettpaket. Wir beraten Sie gerne, welche Kombination für Ihre Ziele am sinnvollsten ist." },
  ],
  "/webdesign-agentur": [
    { q: "Was macht eine gute Webdesign Agentur aus?", a: "Eine gute Webdesign Agentur erstellt nicht nur schöne Websites, sondern Verkaufsinstrumente. Bei Meine Traum Webseite kombinieren wir verkaufspsychologisches Design mit modernster Technik für messbare Ergebnisse." },
    { q: "Wie viel kostet professionelles Webdesign?", a: "Unsere Webdesign-Projekte starten ab 1.500 €. Der genaue Preis hängt vom Umfang Ihres Projekts ab. Wir bieten transparente Preise und eine kostenlose Erstberatung." },
    { q: "Wie lange dauert die Erstellung einer Website?", a: "In der Regel 2–4 Wochen. Eine kostenlose Vorschau erhalten Sie bereits innerhalb von 48 Stunden nach dem Erstgespräch." },
    { q: "Bietet ihr auch Webdesign für kleine Unternehmen an?", a: "Ja! Wir sind spezialisiert auf Webdesign für kleine Unternehmen, Selbstständige, Handwerker und KMUs im DACH-Raum." },
  ],
  "/website-erstellen-lassen": [
    { q: "Was kostet es, eine Website erstellen zu lassen?", a: "Die Kosten für eine professionelle Website starten ab 1.500 €. Der Preis hängt vom Umfang ab – Landingpage, Unternehmensseite oder E-Commerce. Wir erstellen Ihnen ein individuelles Angebot nach dem Erstgespräch." },
    { q: "Wie lange dauert es, eine Homepage erstellen zu lassen?", a: "Eine typische Website ist in 2–4 Wochen fertig. Einfache Landingpages können schneller umgesetzt werden. Sie erhalten bereits nach 48 Stunden eine kostenlose Vorschau." },
  ],
  "/landingpage-erstellen-lassen": [
    { q: "Was ist eine Landingpage und wofür brauche ich sie?", a: "Eine Landingpage ist eine eigenständige Seite mit einem einzigen Conversion-Ziel – z. B. Anfrage, Terminbuchung oder Lead-Generierung. Sie ist perfekt für Werbekampagnen, da sie Besucher gezielt zum Handeln führt." },
    { q: "Was kostet eine Landingpage erstellen lassen?", a: "Eine professionelle Landingpage kostet ab 800 €. Der Preis variiert je nach Umfang, Integration und Komplexität. Wir erstellen Ihnen ein individuelles Angebot." },
    { q: "Wie schnell kann eine Landingpage erstellt werden?", a: "Eine Landingpage kann in 1–2 Wochen erstellt werden. Für eilige Projekte bieten wir auch Express-Umsetzungen an." },
  ],
  "/website-relaunch": [
    { q: "Was kostet ein Website Relaunch?", a: "Ein professioneller Website Relaunch startet ab 1.500 €. Der Preis hängt vom Umfang der bestehenden Seite und den gewünschten Funktionen ab." },
    { q: "Verliere ich mein Google-Ranking beim Relaunch?", a: "Nein! Wir setzen saubere Weiterleitungen (301-Redirects) und optimieren Ihre neue Website von Anfang an für Suchmaschinen." },
  ],
  "/conversion-optimierung": [
    { q: "Was ist Conversion-Optimierung?", a: "Conversion-Optimierung (CRO) bedeutet, Ihre bestehende Website so zu verbessern, dass mehr Besucher zu Kunden werden – durch bessere Texte, Layouts, Call-to-Actions und User Experience." },
    { q: "Lohnt sich Conversion-Optimierung für kleine Unternehmen?", a: "Absolut! Gerade bei kleinen Budgets ist es entscheidend, das Maximum aus jedem Besucher herauszuholen. Unsere Kunden berichten von bis zu 400% mehr Conversions." },
  ],
  "/webdesign-preise": [
    { q: "Was kostet eine Website erstellen lassen?", a: "Unsere Webdesign-Preise starten ab 1.500 € für eine professionelle Website. Der genaue Preis richtet sich nach Umfang, Funktionalität und individuellen Anforderungen." },
    { q: "Gibt es versteckte Kosten?", a: "Nein! Wir arbeiten mit transparenten Festpreisen. Was im Angebot steht, gilt – ohne Überraschungen." },
  ],
  "/webdesign-shk": [
    { q: "Warum braucht ein SHK-Betrieb eine professionelle Website?", a: "Über 80% der Kunden suchen online nach Handwerkern. Ohne professionelle Website verlieren Sie täglich potenzielle Aufträge an Ihre Konkurrenz." },
    { q: "Was kostet eine Website für SHK-Betriebe?", a: "Unsere Webdesign-Projekte für SHK-Betriebe starten ab 1.500 €. Sie erhalten eine kostenlose Vorschau in 48 Stunden." },
    { q: "Kann ich meine Leistungen selbst aktualisieren?", a: "Ja. Wir richten Ihre Website so ein, dass Sie Inhalte wie Notdienst-Zeiten oder neue Leistungen einfach selbst anpassen können." },
    { q: "Wie schnell ist meine neue SHK-Website online?", a: "In der Regel innerhalb von 2–4 Wochen. Eine erste Vorschau erhalten Sie bereits nach 48 Stunden." },
  ],
  "/webdesign-handwerker": [
    { q: "Brauche ich als Handwerker wirklich eine professionelle Website?", a: "Ja! Über 85% der Kunden suchen online nach Handwerkern. Ohne professionelle Website verlieren Sie täglich Aufträge an die Konkurrenz." },
    { q: "Was kostet eine Handwerker-Website?", a: "Unsere Handwerker-Websites starten ab 1.500 €. Dafür erhalten Sie ein professionelles, conversion-optimiertes Design mit SEO-Grundlagen." },
    { q: "Wie lange dauert es, bis meine Website online ist?", a: "In der Regel 2–4 Wochen. Eine erste Vorschau erhalten Sie bereits innerhalb von 48 Stunden." },
    { q: "Kann ich die Website selbst bearbeiten?", a: "Ja, wir richten ein einfaches System ein, mit dem Sie Texte, Bilder und Öffnungszeiten selbst aktualisieren können." },
  ],
  "/webdesign-aerzte": [
    { q: "Warum braucht meine Arztpraxis eine professionelle Website?", a: "Über 70% der Patienten suchen online nach Ärzten, bevor sie einen Termin buchen. Eine professionelle Website ist heute entscheidend für die Patientengewinnung." },
    { q: "Was kostet eine Website für Ärzte?", a: "Unsere Praxis-Websites starten ab 1.500 €. Sie erhalten ein individuelles, DSGVO-konformes Design mit lokaler SEO-Optimierung." },
    { q: "Ist die Website DSGVO-konform?", a: "Ja, selbstverständlich. Wir achten besonders auf Datenschutz – gerade im medizinischen Bereich ist das essentiell." },
    { q: "Können Patienten online Termine buchen?", a: "Ja, wir können eine Online-Terminbuchung integrieren, damit Patienten rund um die Uhr Termine vereinbaren können." },
  ],
  "/webdesign-immobilienmakler": [
    { q: "Warum braucht ein Immobilienmakler eine professionelle Website?", a: "Vertrauen ist im Immobiliengeschäft alles. Eine professionelle Website zeigt Kompetenz und generiert kontinuierlich neue Eigentümer- und Käufer-Leads." },
    { q: "Was kostet eine Makler-Website?", a: "Unsere Websites für Immobilienmakler starten ab 1.500 €. Je nach Funktionsumfang variiert der Preis." },
    { q: "Kann ich Immobilien selbst auf der Website einpflegen?", a: "Ja, wir richten eine einfache Verwaltung ein, mit der Sie Objekte, Bilder und Beschreibungen selbst aktualisieren können." },
    { q: "Bietet ihr auch Landingpages für Wertermittlung an?", a: "Ja! Spezielle Landingpages für kostenlose Wertermittlung sind einer der besten Wege, um Eigentümer-Leads zu generieren." },
  ],
  "/webdesign-coaches": [
    { q: "Warum brauche ich als Coach eine professionelle Website?", a: "Ihre Website ist Ihr digitales Aushängeschild. Potenzielle Klienten prüfen Ihre Online-Präsenz, bevor sie Kontakt aufnehmen." },
    { q: "Was kostet eine Coach-Website?", a: "Unsere Websites für Coaches und Berater starten ab 1.500 €. Inkl. persönlichem Branding, SEO und Conversion-Optimierung." },
    { q: "Kann ich Testimonials und Erfolgsgeschichten selbst einpflegen?", a: "Ja, wir richten Ihre Website so ein, dass Sie Inhalte wie Testimonials, Blog-Beiträge und Angebote einfach selbst aktualisieren können." },
    { q: "Bietet ihr auch Landingpages für einzelne Angebote an?", a: "Ja! Für Webinare, Online-Kurse oder spezielle Programme erstellen wir gezielte Landingpages, die Teilnehmer und Klienten gewinnen." },
  ],
};

const servicesByPage: Record<string, { name: string; description: string; audience?: string }> = {
  "/leistungen": {
    name: "Webdesign & Conversion-Optimierung",
    description: "Professionelles Webdesign, UX/UI Design, SEO-Optimierung, Landingpage-Erstellung und Conversion-Optimierung für Unternehmen im DACH-Raum.",
  },
  "/webdesign-agentur": {
    name: "Professionelles Webdesign",
    description: "Individuelle, conversion-optimierte Websites für kleine Unternehmen, Selbstständige und KMUs.",
  },
  "/website-erstellen-lassen": {
    name: "Website erstellen lassen",
    description: "Professionelle, conversion-optimierte Website-Erstellung für Unternehmen. Mobilfreundlich, SEO-ready, ab 1.500 €.",
  },
  "/landingpage-erstellen-lassen": {
    name: "Landingpage erstellen lassen",
    description: "Professionelle Landingpages mit verkaufspsychologischem Aufbau für Google Ads und Lead-Generierung. Ab 800 €.",
  },
  "/website-relaunch": {
    name: "Website Relaunch",
    description: "Professioneller Website Relaunch: modernes Design, schnelle Ladezeiten, mehr Anfragen aus Ihrer bestehenden Website.",
  },
  "/conversion-optimierung": {
    name: "Conversion-Optimierung",
    description: "Datengetriebene Conversion-Optimierung für mehr Anfragen und Umsatz aus Ihrer bestehenden Website.",
  },
  "/webdesign-preise": {
    name: "Webdesign Preise & Pakete",
    description: "Transparente Webdesign-Preise ab 1.500 €. Faire Festpreise ohne versteckte Kosten.",
  },
  "/kostenloser-website-check": {
    name: "Kostenloser Website-Check",
    description: "Kostenlose Website-Analyse: Performance, SEO, Mobile-Optimierung und Conversion-Potenzial mit konkreten Handlungsempfehlungen.",
  },
  "/webdesign-shk": {
    name: "Webdesign für SHK-Betriebe",
    description: "Professionelle Websites für Sanitär-, Heizungs- und Klimabetriebe mit lokaler SEO-Optimierung und Notdienst-Integration.",
    audience: "SHK-Betriebe (Sanitär, Heizung, Klima)",
  },
  "/webdesign-handwerker": {
    name: "Webdesign für Handwerker",
    description: "Professionelle Websites für Handwerksbetriebe mit lokaler SEO-Optimierung und conversion-optimiertem Design.",
    audience: "Handwerksbetriebe",
  },
  "/webdesign-aerzte": {
    name: "Webdesign für Ärzte",
    description: "DSGVO-konforme Praxis-Websites für Ärzte und Zahnärzte mit Online-Terminbuchung und lokaler SEO-Optimierung.",
    audience: "Arztpraxen und Zahnarztpraxen",
  },
  "/webdesign-immobilienmakler": {
    name: "Webdesign für Immobilienmakler",
    description: "Hochwertige Makler-Websites mit Objektpräsentation, Wertermittlung und Lead-Generierung.",
    audience: "Immobilienmakler",
  },
  "/webdesign-coaches": {
    name: "Webdesign für Coaches & Berater",
    description: "Professionelle Websites für Coaches und Berater mit persönlichem Branding und Conversion-Optimierung.",
    audience: "Coaches und Berater",
  },
};

const buildFaqSchema = (faqs: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
});

const buildServiceSchema = (service: { name: string; description: string; audience?: string }) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: PROVIDER,
    areaServed: [
      { "@type": "Country", name: "Deutschland" },
      { "@type": "Country", name: "Österreich" },
      { "@type": "Country", name: "Schweiz" },
    ],
  };
  if (service.audience) {
    schema.audience = {
      "@type": "Audience",
      audienceType: service.audience,
    };
  }
  return schema;
};

const SCRIPT_ID = "dynamic-structured-data";

const StructuredData = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remove previous dynamic scripts
    document.querySelectorAll(`[data-sd="${SCRIPT_ID}"]`).forEach((el) => el.remove());

    const schemas: object[] = [];

    const faqs = faqsByPage[pathname];
    if (faqs) schemas.push(buildFaqSchema(faqs));

    const service = servicesByPage[pathname];
    if (service) schemas.push(buildServiceSchema(service));

    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-sd", SCRIPT_ID);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll(`[data-sd="${SCRIPT_ID}"]`).forEach((el) => el.remove());
    };
  }, [pathname]);

  return null;
};

export default StructuredData;
