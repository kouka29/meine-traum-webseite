import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Webdesign Agentur – Website erstellen lassen | Meine Traum Webseite",
    description: "Professionelle Webdesign Agentur – Wir erstellen moderne, conversion-optimierte Webseiten für Selbstständige, KMUs und Handwerker. Kostenlose Vorschau in 48h.",
  },
  "/leistungen": {
    title: "Leistungen – Webdesign, Conversion-Optimierung & SEO | Meine Traum Webseite",
    description: "Conversion-Webdesign, UX/UI Design, SEO und Landingpage-Erstellung. Websites erstellen lassen, die aktiv Kunden gewinnen – für Handwerker, Coaches und KMUs.",
  },
  "/ueber-uns": {
    title: "Über unsere Webdesign Agentur | Meine Traum Webseite",
    description: "Erfahren Sie mehr über Meine Traum Webseite – die Webdesign Agentur, die Websites zu Verkaufsinstrumenten macht. 150+ zufriedene Kunden im DACH-Raum.",
  },
  "/portfolio": {
    title: "Webdesign Portfolio & Referenzen | Meine Traum Webseite",
    description: "Echte Ergebnisse für echte Unternehmen. Webdesign-Referenzen mit bis zu +700% mehr Anfragen. Website erstellen lassen, die messbar Resultate liefert.",
  },
  "/kontakt": {
    title: "Kontakt – Kostenlose Website-Vorschau in 48h | Meine Traum Webseite",
    description: "Sichern Sie sich Ihre kostenlose Website-Vorschau in 48h. Website erstellen lassen – unverbindlich, ohne Risiko. Jetzt Kontakt aufnehmen.",
  },
  "/webdesign-agentur": {
    title: "Webdesign Agentur – Moderne Websites die Kunden gewinnen | Meine Traum Webseite",
    description: "Professionelle Webdesign Agentur für conversion-optimierte Websites. Individuelles Webdesign für kleine Unternehmen, Handwerker und KMUs. Kostenlose Vorschau.",
  },
  "/website-erstellen-lassen": {
    title: "Website erstellen lassen – Professionell & Conversion-optimiert | Meine Traum Webseite",
    description: "Moderne Website für Ihr Unternehmen erstellen lassen. Conversion-optimiert, mobilfreundlich, SEO-ready. Kostenlose Vorschau in 48h. Ab 1.500 €.",
  },
  "/landingpage-erstellen-lassen": {
    title: "Landingpage erstellen lassen – Maximale Conversions | Meine Traum Webseite",
    description: "Professionelle Landingpage erstellen lassen mit verkaufspsychologischem Aufbau. Perfekt für Google Ads & Lead-Generierung. Ab 800 €.",
  },
  "/website-relaunch": {
    title: "Website Relaunch – Veraltete Website zum Kundenmagnet | Meine Traum Webseite",
    description: "Professioneller Website Relaunch: modernes Design, schnelle Ladezeiten, mehr Anfragen. Ihre veraltete Website wird zum Verkaufsinstrument. Kostenloser Check.",
  },
  "/conversion-optimierung": {
    title: "Conversion Optimierung Agentur – Mehr Kunden aus Ihrer Website | Meine Traum Webseite",
    description: "Conversion Optimierung für mehr Anfragen und Umsatz. Wir optimieren Ihre Website datengetrieben – bis zu 400% mehr Conversions. Jetzt Website optimieren lassen.",
  },
  "/kostenloser-website-check": {
    title: "Kostenloser Website-Check – Website Analyse gratis | Meine Traum Webseite",
    description: "Kostenlose Website-Analyse: Performance, SEO, Mobile-Optimierung und Conversion-Potenzial. Erhalten Sie konkrete Handlungsempfehlungen in 48h.",
  },
  "/kostenlose-vorschau": {
    title: "Kostenlose Webseiten-Vorschau in 48h – Nur 5 Plätze/Monat | Meine Traum Webseite",
    description: "Handwerker: Sichern Sie sich einen von 5 Plätzen pro Monat. Kostenlose Webseiten-Vorschau in 48h. In 2 Minuten Formular ausfüllen, ohne Risiko und Verpflichtung.",
  },
  "/kostenlose-vorschau2": {
    title: "Kostenlose Webseiten-Vorschau in 48h für Handwerker | Meine Traum Webseite",
    description: "Handwerksbetrieb? Erhalte in 48 Stunden eine kostenlose Vorschau Ihrer neuen Webseite. Ohne Risiko, ohne Kosten, ohne Verpflichtung. Jetzt anfordern.",
  },
  "/webdesign-preise": {
    title: "Webdesign Preise – Was kostet eine Website? | Meine Traum Webseite",
    description: "Transparente Webdesign Preise ab 1.500 €. Website erstellen lassen Kosten im Überblick. Faire Festpreise ohne versteckte Kosten.",
  },
  "/webdesign-shk": {
    title: "Webdesign für SHK-Betriebe – Mehr Anfragen online | Meine Traum Webseite",
    description: "Professionelles Webdesign für SHK-Betriebe: Sanitär, Heizung, Klima. Mehr Online-Anfragen durch conversion-optimierte Websites. Kostenlose Vorschau in 48h.",
  },
  "/webdesign-handwerker": {
    title: "Webdesign für Handwerker – Die Website die Aufträge bringt | Meine Traum Webseite",
    description: "Professionelle Websites für Handwerksbetriebe. Lokales SEO, mobilfreundlich, conversion-optimiert. Mehr Aufträge durch bessere Online-Präsenz.",
  },
  "/webdesign-aerzte": {
    title: "Webdesign für Ärzte – Praxis-Website die Patienten gewinnt | Meine Traum Webseite",
    description: "Professionelles Webdesign für Arztpraxen. DSGVO-konform, mit Online-Terminbuchung und lokalem SEO. Mehr Patienten durch bessere Sichtbarkeit.",
  },
  "/webdesign-immobilienmakler": {
    title: "Webdesign für Immobilienmakler – Mehr Eigentümer-Leads | Meine Traum Webseite",
    description: "Professionelle Websites für Immobilienmakler. Hochwertige Objektpräsentation, Lead-Generierung und lokales SEO. Kostenlose Vorschau.",
  },
  "/webdesign-coaches": {
    title: "Webdesign für Coaches & Berater – Klienten online gewinnen | Meine Traum Webseite",
    description: "Professionelle Websites für Coaches und Berater. Persönliches Branding, Conversion-Optimierung und SEO. Mehr Klienten durch starke Online-Präsenz.",
  },
  "/datenschutz": {
    title: "Datenschutzerklärung | Meine Traum Webseite",
    description: "Datenschutzerklärung gemäß DSGVO, BDSG und TDDDG für die Website meinetraumwebseite.de.",
  },
  "/impressum": {
    title: "Impressum | Meine Traum Webseite",
    description: "Impressum gemäß § 5 DDG für Meine Traum Webseite – Webdesign Agentur.",
  },
};

const PageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta[pathname];
    if (meta) {
      document.title = meta.title;
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute("content", meta.description);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", meta.title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", meta.description);

      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute("href", `https://meinetraumwebseite.de${pathname === "/" ? "" : pathname}`);
    }
  }, [pathname]);

  return null;
};

export default PageMeta;
