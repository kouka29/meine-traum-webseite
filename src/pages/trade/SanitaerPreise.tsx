import TradePreiseTemplate, { type TradeConfig } from "./TradePreiseTemplate";

const config: TradeConfig = {
  subline: "Professionell online als Sanitärbetrieb – ohne großes Investment.",
  ankerLine2: "Deine neue Sanitär-Website kostet dich ab 59 €/Monat.",
  starterFeatures: [
    "1 Seite: Leistungen, Notdienst, Kontakt & Anfrageformular",
    "Individuelle Texte & Inhalte – du lieferst die Infos, wir schreiben",
    "Perfekt auf jedem Smartphone & Tablet",
    "Hosting, Domain & SSL inklusive – keine Extra-Kosten",
  ],
  proFeatures: [
    "Alles aus Starter inklusive – plus:",
    "Bis zu 5 Seiten – Leistungen, Notdienst, Referenzen, Kontakt",
    "Google Maps & Google Business vollständig eingerichtet",
    "Bei Google gefunden werden – wenn Kunden einen Sanitärbetrieb suchen",
    "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
  ],
  premiumFeatures: [
    "Alles aus Pro inklusive – plus:",
    "Bis zu 10 Seiten – deine komplette Online-Präsenz als Sanitärbetrieb",
    "Google-Optimierung beim Launch – damit dich Kunden in deiner Stadt finden",
    "Smarte Extras möglich – Notdienst-Formular, Rechner oder Buchungstool",
    "Feinschliff nach Launch inklusive – damit alles genau passt",
  ],
  faqLieferzeitAnswer:
    "Beim Starter-Paket ist deine Website in 7 Tagen live.\nBeim Pro-Paket ca. 2 Wochen. Beim Premium-Paket besprechen wir Timing individuell nach deinen Wünschen.",
};

const SanitaerPreise = () => <TradePreiseTemplate config={config} />;

export default SanitaerPreise;