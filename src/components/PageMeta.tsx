import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_ORIGIN = "https://meine-traum-webseite.de";
const BRAND = "Meine Traum Webseite";
const DEFAULT_DESCRIPTION =
  "Professionelle Webdesign Agentur für conversion-optimierte Websites. Mehr Anfragen für Selbstständige, KMUs und Handwerker.";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: `Website erstellen lassen | ${BRAND}`,
    description:
      "Webdesign Agentur für conversion-optimierte Websites. Mehr Anfragen für Selbstständige, KMUs und Handwerker. Kostenlose Vorschau in 48 h.",
  },
  "/leistungen": {
    title: `Leistungen – Webdesign & SEO | ${BRAND}`,
    description:
      "Conversion-Webdesign, UX/UI, SEO und Landingpages. Websites die Kunden gewinnen – für Handwerker, Coaches und KMUs.",
  },
  "/ueber-uns": {
    title: `Über uns – Webdesign Agentur | ${BRAND}`,
    description:
      "Lernen du Meine Traum Webseite kennen – die Agentur, die Websites zu Verkaufsinstrumenten macht. 150+ Kunden im DACH-Raum.",
  },
  "/portfolio": {
    title: `Webdesign Portfolio & Referenzen | ${BRAND}`,
    description:
      "Echte Ergebnisse für echte Unternehmen. Webdesign-Referenzen mit bis zu +700 % mehr Anfragen. Jetzt Beispiele ansehen.",
  },
  "/kontakt": {
    title: `Kontakt – Vorschau in 48 h | ${BRAND}`,
    description:
      "Sichere sich deine kostenlose Website-Vorschau in 48 h. Unverbindlich, ohne Risiko. Jetzt Kontakt aufnehmen.",
  },
  "/webdesign-agentur": {
    title: `Webdesign Agentur für moderne Websites | ${BRAND}`,
    description:
      "Webdesign Agentur für conversion-optimierte Websites. Individuelles Design für KMUs, Handwerker und Selbstständige. Kostenlose Vorschau.",
  },
  "/website-erstellen-lassen": {
    title: `Website erstellen lassen ab 990 € | ${BRAND}`,
    description:
      "Moderne Website für dein Unternehmen erstellen lassen. Conversion-optimiert, mobilfreundlich, SEO-ready. Vorschau in 48 h.",
  },
  "/landingpage-erstellen-lassen": {
    title: `Landingpage erstellen lassen | ${BRAND}`,
    description:
      "Landingpage erstellen lassen mit verkaufspsychologischem Aufbau. Perfekt für Google Ads & Lead-Generierung. Ab 800 €.",
  },
  "/website-relaunch": {
    title: `Website Relaunch – mehr Anfragen | ${BRAND}`,
    description:
      "Professioneller Website Relaunch: modernes Design, schnelle Ladezeiten, mehr Anfragen. Kostenloser Check inklusive.",
  },
  "/conversion-optimierung": {
    title: `Conversion Optimierung Agentur | ${BRAND}`,
    description:
      "Conversion-Optimierung für mehr Anfragen und Umsatz. Datengetrieben – bis zu 400 % mehr Conversions aus deiner Website.",
  },
  "/kostenloser-website-check": {
    title: `Kostenloser Website-Check | ${BRAND}`,
    description:
      "Kostenlose Website-Analyse: Performance, SEO, Mobile und Conversion-Potenzial. Konkrete Handlungsempfehlungen in 48 h.",
  },
  "/kostenlose-vorschau": {
    title: `Kostenlose Webseiten-Vorschau in 48 h | ${BRAND}`,
    description:
      "Handwerker: Sichere sich einen von 5 Plätzen pro Monat. Kostenlose Vorschau in 48 h. Ohne Risiko und Verpflichtung.",
  },
  "/kostenlose-vorschau2": {
    title: `Vorschau in 48 h für Handwerker | ${BRAND}`,
    description:
      "Handwerksbetrieb? Erhältst du in 48 h eine kostenlose Vorschau deiner neuen Website. Ohne Risiko, ohne Kosten.",
  },
  "/kostenlose-vorschau-v2": {
    title: `Kostenlose Website-Vorschau in 48 h | ${BRAND}`,
    description:
      "Kostenlose Vorschau deiner neuen Website in 48 h. Siehst du dein Design, bevor du sich entscheiden – unverbindlich.",
  },
  "/webdesign-preise": {
    title: `Webdesign Preise & Kosten | ${BRAND}`,
    description:
      "Transparente Webdesign-Preise ab 990 €. Was kostet eine Website? Faire Festpreise ohne versteckte Kosten.",
  },
  "/preise": {
    title: `Webdesign Preise & Pakete | ${BRAND}`,
    description:
      "Transparente Webdesign-Preise ab 990 €. Faire Festpreise und klare Pakete – ohne versteckte Kosten.",
  },
  "/webdesign-shk": {
    title: `Webdesign für SHK-Betriebe | ${BRAND}`,
    description:
      "Webdesign für SHK-Betriebe: Sanitär, Heizung, Klima. Mehr Online-Anfragen durch conversion-optimierte Websites. Vorschau in 48 h.",
  },
  "/webdesign-handwerker": {
    title: `Webdesign für Handwerker | ${BRAND}`,
    description:
      "Websites für Handwerksbetriebe: lokales SEO, mobilfreundlich, conversion-optimiert. Mehr Aufträge durch starke Online-Präsenz.",
  },
  "/webdesign-aerzte": {
    title: `Webdesign für Ärzte & Praxen | ${BRAND}`,
    description:
      "Webdesign für Arztpraxen: DSGVO-konform, mit Online-Terminbuchung und lokalem SEO. Mehr Patienten durch bessere Sichtbarkeit.",
  },
  "/webdesign-immobilienmakler": {
    title: `Webdesign für Immobilienmakler | ${BRAND}`,
    description:
      "Websites für Immobilienmakler: hochwertige Objektpräsentation, Lead-Generierung und lokales SEO. Kostenlose Vorschau.",
  },
  "/webdesign-coaches": {
    title: `Webdesign für Coaches & Berater | ${BRAND}`,
    description:
      "Websites für Coaches und Berater: persönliches Branding, Conversion-Optimierung und SEO. Mehr Klienten online gewinnen.",
  },
  "/individuelle-software": {
    title: `Individuelle Software-Entwicklung | ${BRAND}`,
    description:
      "Maßgeschneiderte Webanwendungen und individuelle Software-Lösungen für dein Unternehmen. Beratung, Konzept und Umsetzung aus einer Hand.",
  },
  "/empfehlung": {
    title: `Empfehlungsprogramm | ${BRAND}`,
    description:
      "Empfehlen du Meine Traum Webseite und profitierst du von attraktiven Prämien für jeden vermittelten Neukunden.",
  },
  "/erstgespraech": {
    title: `Erstgespräch buchen | ${BRAND}`,
    description:
      "Buchst du dein kostenloses Erstgespräch. Gemeinsam klären wir Ziele, Zielgruppe und Strategie für deine neue Website.",
  },
  "/starter": {
    title: `Starter-Paket Website | ${BRAND}`,
    description:
      "Das Starter-Paket: schnell online mit einer professionellen Website. Ideal für Selbstständige und kleine Unternehmen.",
  },
  "/datenschutz": {
    title: `Datenschutzerklärung | ${BRAND}`,
    description: "Datenschutzerklärung gemäß DSGVO, BDSG und TDDDG für meine-traum-webseite.de.",
  },
  "/impressum": {
    title: `Impressum | ${BRAND}`,
    description: "Impressum gemäß § 5 DDG für Meine Traum Webseite – Webdesign Agentur.",
  },
  "/admin": {
    title: `Admin – Lead-Übersicht | ${BRAND}`,
    description: "Interner Admin-Bereich für Lead-Management und Anfragen-Übersicht.",
  },
  "/original": {
    title: `Website erstellen lassen – Original-Version | ${BRAND}`,
    description: "Ursprüngliche Version unserer Homepage. Webdesign Agentur für conversion-optimierte Websites.",
  },
  "/unsubscribe": {
    title: `E-Mail-Abmeldung | ${BRAND}`,
    description: "Vom Newsletter abmelden. Du kannst sich jederzeit wieder anmelden.",
  },
  "/handwerker": {
    title: `Website für Handwerker | ${BRAND}`,
    description: "Professionelle Websites für Handwerksbetriebe. Kostenlose Vorschau in 48 Stunden. Mehr Aufträge durch Google-Optimierung.",
  },
  "/handwerker/preise": {
    title: `Preise Website für Handwerker | ${BRAND}`,
    description: "Transparente Website-Preise für Handwerksbetriebe. Ab 59€/Monat. Steuerlich absetzbar.",
  },
  "/handwerker/leistungen": {
    title: `Leistungen für Handwerker | ${BRAND}`,
    description: "Website-Leistungen speziell für Handwerksbetriebe. SEO, Design, Texte, Hosting — wir übernehmen alles.",
  },
  "/handwerker/portfolio": {
    title: `Portfolio Handwerker-Websites | ${BRAND}`,
    description: "Webdesign-Projekte für Handwerksbetriebe. Elektriker, Maler, Sanitär, Dachdecker — echte Ergebnisse.",
  },
  "/handwerker/ueber-uns": {
    title: `Über uns | ${BRAND} — Websites für Handwerker`,
    description: "Wir bauen Websites speziell für Handwerksbetriebe. Ehrlich, schnell, ergebnisorientiert.",
  },
  "/handwerker/kontakt": {
    title: `Kontakt | ${BRAND}`,
    description: "Kostenlose Website-Vorschau für Handwerker in 48 Stunden. Jetzt anfragen — Antwort in 2 Stunden.",
  },
  "/elektriker": {
    title: `Website für Elektriker | ${BRAND}`,
    description: "Websites speziell für Elektriker. Gefunden bei 'Elektriker [Stadt]'. Mehr Aufträge, auch bei Notfällen. Kostenlose Vorschau in 48h.",
  },
  "/maler": {
    title: `Website für Maler | ${BRAND}`,
    description: "Websites speziell für Maler & Lackierer. Referenzgalerie, Google-Optimierung, mehr Aufträge. Kostenlose Vorschau in 48h.",
  },
  "/sanitaer": {
    title: `Website für Sanitärbetriebe | ${BRAND}`,
    description: "Websites für Sanitär & Heizungsbetriebe. Notfall-Seiten, Badgalerien, Google-Optimierung. Kostenlose Vorschau in 48h.",
  },
  "/dachdecker": {
    title: `Website für Dachdecker | ${BRAND}`,
    description: "Websites speziell für Dachdecker. Sturmschaden-Seiten, Referenzgalerien, Google-Rankings. Kostenlose Vorschau in 48h.",
  },
  "/elektriker/preise": {
    title: `Webdesign Preise für Elektriker | ${BRAND}`,
    description: "Website für Elektriker ab 59€/Monat. In 7 Tagen live. Google Maps, SEO & mehr inklusive.",
  },
  "/sanitaer/preise": {
    title: `Webdesign Preise für Sanitärbetriebe | ${BRAND}`,
    description: "Website für Sanitärbetriebe ab 59€/Monat. In 7 Tagen live. Google Maps, SEO & mehr inklusive.",
  },
  "/dachdecker/preise": {
    title: `Webdesign Preise für Dachdecker | ${BRAND}`,
    description: "Website für Dachdecker ab 59€/Monat. In 7 Tagen live. Google Maps, SEO & mehr inklusive.",
  },
};

const setMeta = (selector: string, attr: string, value: string) => {
  const tag = document.querySelector(selector);
  if (tag) tag.setAttribute(attr, value);
};

const PageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta[pathname] ?? {
      title: `${BRAND} – Webdesign Agentur`,
      description: DEFAULT_DESCRIPTION,
    };
    const url = `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", meta.title);
    setMeta('meta[name="twitter:description"]', "content", meta.description);
    setMeta('link[rel="canonical"]', "href", url);
  }, [pathname]);

  return null;
};

export default PageMeta;
