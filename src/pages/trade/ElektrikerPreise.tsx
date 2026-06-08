import TradePreiseTemplate, { type TradeConfig } from "./TradePreiseTemplate";

const config: TradeConfig = {
  subline: "Professionell online als Elektriker – ohne großes Investment.",
  ankerLine2: "Deine neue Elektriker-Website kostet dich ab 59 €/Monat.",
  starterFeatures: [
    "1 Seite: Leistungen, Über dich, Kontakt & Anfrageformular",
    "Individuelle Texte & Inhalte – du lieferst die Infos, wir schreiben",
    "Perfekt auf jedem Smartphone & Tablet",
    "Hosting, Domain & SSL inklusive – keine Extra-Kosten",
  ],
  proFeatures: [
    "Alles aus Starter inklusive – plus:",
    "Bis zu 5 Seiten – Leistungen, Referenzen, Notdienst, Kontakt",
    "Google Maps & Google Business vollständig eingerichtet",
    "Bei Google gefunden werden – wenn Kunden einen Elektriker suchen",
    "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
  ],
  premiumFeatures: [
    "Alles aus Pro inklusive – plus:",
    "Bis zu 10 Seiten – deine komplette Online-Präsenz als Elektriker",
    "Google-Optimierung beim Launch – damit dich Kunden in deiner Stadt finden",
    "Smarte Extras möglich – Terminbuchung, Rechner oder Anfrage-Tool",
    "Feinschliff nach Launch inklusive – damit alles genau passt",
  ],
  faqLieferzeitAnswer:
    "Beim Starter-Paket ist deine Website in 7 Tagen live.\nBeim Pro-Paket ca. 2 Wochen. Beim Premium-Paket besprechen wir Timing individuell nach deinen Wünschen.",
};

const ElektrikerPreise = () => <TradePreiseTemplate config={config} />;

export default ElektrikerPreise;