import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Meine Traum Webseite – Webdesign Agentur für moderne Websites",
    description: "Professionelle Webdesign Agentur – Wir erstellen moderne, conversion-optimierte Webseiten für Selbstständige, KMUs und Startups. Kostenlose Vorschau in 48h.",
  },
  "/leistungen": {
    title: "Leistungen – Webdesign, Conversion & SEO | Meine Traum Webseite",
    description: "Conversion-Webdesign, UX/UI Design, SEO und individuelle Lösungen. Websites, die aktiv Kunden gewinnen – für Handwerker, Coaches und KMUs.",
  },
  "/ueber-uns": {
    title: "Über uns – Ihre Webdesign Agentur | Meine Traum Webseite",
    description: "Erfahren Sie mehr über Meine Traum Webseite – die Agentur, die Websites zu Verkaufsinstrumenten macht. 150+ zufriedene Kunden im DACH-Raum.",
  },
  "/portfolio": {
    title: "Portfolio & Referenzen | Meine Traum Webseite",
    description: "Echte Ergebnisse für echte Unternehmen. Sehen Sie unsere Projekte mit bis zu +700% mehr Anfragen. Webdesign, das messbar Resultate liefert.",
  },
  "/kontakt": {
    title: "Kontakt – Kostenlose Website-Vorschau | Meine Traum Webseite",
    description: "Sichern Sie sich Ihre kostenlose Website-Vorschau in 48h. Unverbindlich, ohne Risiko. Jetzt Kontakt aufnehmen.",
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
    }
  }, [pathname]);

  return null;
};

export default PageMeta;
