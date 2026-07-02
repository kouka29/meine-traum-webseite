import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Briefcase, FileSignature, Handshake, CreditCard, Repeat, Server, Clock, Check, ShieldAlert, ShieldCheck, Copyright, BadgeCheck, Lock, Database, Gavel, ArrowUp, Printer, ChevronLeft, Menu } from "lucide-react";

type Section = {
  id: string;
  num: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
};

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block bg-accent-agb/15 text-accent-agb font-semibold px-1.5 py-0.5 rounded">
    {children}
  </span>
);

const P = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <p className="mb-4 leading-[1.7] text-[16px]">
    <span className="font-semibold text-foreground mr-1">({n})</span>
    {children}
  </p>
);

const sections: Section[] = [
  {
    id: "p1",
    num: "§ 1",
    title: "Geltungsbereich",
    icon: FileText,
    content: (
      <>
        <P n="1">
          Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Geschäftsbeziehungen zwischen{" "}
          <strong>Muad Amar – QK Marketing, Rheinallee 88, Gebäude 23, 55120 Mainz, handelnd unter dem Markennamen „Meine-Traum-Webseite"</strong> (nachfolgend „Auftragnehmer") und seinen Auftraggebern, bei denen es sich ausschließlich um Unternehmer im Sinne des § 14 BGB handelt (nachfolgend „Auftraggeber"). Diese AGB gelten für alle Leistungen im Bereich Webdesign, Webseitenerstellung, Webseitenpflege, Webseitenredesign, Mietmodelle für Webseiten, Marketing-Dienstleistungen sowie Grafikdesign.
        </P>
        <div className="bg-muted/60 border-l-4 border-accent-agb/50 rounded-r-lg px-5 py-4 my-5 text-sm text-foreground/85 leading-[1.7]">
          <span className="font-semibold text-foreground">Hinweis:</span>{" "}
          „Meine-Traum-Webseite" (meine-traum-webseite.de) ist ein eingetragener Handelsname und eine Marke des Auftragnehmers Muad Amar / QK Marketing. Vertragspartner ist stets Muad Amar – QK Marketing als Einzelunternehmer. Die Marke „Meine-Traum-Webseite" begründet keine eigene Rechtspersönlichkeit.
        </div>
        <P n="2">
          Entgegenstehende oder abweichende Bedingungen des Auftraggebers werden nicht anerkannt, es sei denn, der Auftragnehmer stimmt ihrer Geltung ausdrücklich schriftlich zu.
        </P>
        <P n="3">
          Diese AGB gelten auch für alle zukünftigen Leistungen gegenüber dem Auftraggeber, ohne dass es jeweils erneuter Einbeziehung bedarf.
        </P>
      </>
    ),
  },
  {
    id: "p2",
    num: "§ 2",
    title: "Leistungsgegenstand",
    icon: Briefcase,
    content: (
      <>
        <P n="1">Der Auftragnehmer erbringt folgende Leistungen:</P>
        <ul className="list-disc pl-6 space-y-1.5 mb-4 leading-[1.7]">
          <li>Erstellung von Webseiten (Corporate Websites, Landingpages, Online-Shops, Plattformen u.a.)</li>
          <li>Pflege und Wartung bestehender Webseiten</li>
          <li>Neugestaltung und Umgestaltung (Redesign) von Webseiten</li>
          <li>Mietmodell: Bereitstellung und Betrieb einer Webseite gegen monatliche Mietzahlung</li>
          <li>Marketing-Dienstleistungen (Online-Marketing, SEO, Social Media, Werbekampagnen u.a.)</li>
          <li>Grafikdesign (Logos, Werbematerialien, Corporate Design, Printmedien u.a.)</li>
          <li>Kostenlose Strategie-Vorschau / Website-Konzept (unverbindlich, begründet kein Vertragsverhältnis)</li>
        </ul>
        <P n="2">
          Der genaue Leistungsumfang ergibt sich aus dem jeweiligen individuellen Angebot. Im Widerspruchsfall geht das Angebot diesen AGB vor.
        </P>
        <P n="3">
          Der Auftragnehmer schuldet keinen bestimmten wirtschaftlichen Erfolg (z. B. Steigerung von Konversionsraten, Besucherzahlen oder Umsätzen), sofern nicht ausdrücklich schriftlich vereinbart.
        </P>
      </>
    ),
  },
  {
    id: "p3",
    num: "§ 3",
    title: "Vertragsschluss und verbindliche Auftragserteilung",
    icon: FileSignature,
    content: (
      <>
        <P n="1">
          Angebote des Auftragnehmers sind freibleibend und unverbindlich, sofern sie nicht ausdrücklich als verbindlich bezeichnet werden.
        </P>
        <P n="2">
          Erhält der Auftraggeber einen personalisierten, passwortgeschützten Angebotslink (nachfolgend „Angebotslink"), so ist dieser ausschließlich für ihn bestimmt und darf nicht an Dritte weitergegeben werden. Der Auftragnehmer speichert das Datum der Übersendung sowie die Zugangsinformationen.
        </P>
        <P n="3">Ein verbindlicher Vertrag kommt zustande durch eine der folgenden Handlungen des Auftraggebers:</P>
        <ul className="list-disc pl-6 space-y-1.5 mb-4 leading-[1.7]">
          <li>Klick auf den Bestätigungs-Button im Angebotslink („Verbindlich buchen" o. Ä.) mit anschließender Bestätigung im erscheinenden Pop-up-Fenster (Zwei-Klick-Verfahren);</li>
          <li>Verbindliche Buchung oder Zahlungsauslösung über einen Zahlungsanbieter (z. B. Stripe) auf der Angebotsseite;</li>
          <li>Auftragserteilung über LexOffice oder vergleichbare Plattformen;</li>
          <li>Schriftliche Auftragserteilung per E-Mail und schriftliche Bestätigung durch den Auftragnehmer;</li>
          <li>Beginn der Leistungserbringung durch den Auftragnehmer nach Anforderung durch den Auftraggeber.</li>
        </ul>
        <P n="4">
          Bei Vertragsschluss über das Zwei-Klick-Verfahren (Abs. 3, 1. Spiegelstrich) werden <Highlight>Zeitstempel und IP-Adresse</Highlight> des Auftraggebers zum Zeitpunkt beider Klicks elektronisch gespeichert. Diese Daten gelten als Nachweis der verbindlichen Willenserklärung des Auftraggebers im Sinne des § 126b BGB und können im Streitfall als Beweismittel verwendet werden.
        </P>
        <P n="5">
          Gleiches gilt für Buchungen und Zahlungsauslösungen über Zahlungsanbieter (Stripe u. a.): Die vom Zahlungsanbieter protokollierten Transaktionsdaten (Zeitstempel, IP-Adresse, Transaktions-ID) gelten ebenfalls als Nachweis der verbindlichen Auftragserteilung.
        </P>
        <P n="6">
          Da das Angebot ausschließlich für den jeweiligen Auftraggeber (B2B) bestimmt ist und individuell ausgehandelte Konditionen enthält, besteht <Highlight>kein Widerrufsrecht</Highlight>. § 312 BGB (Fernabsatzverträge mit Verbrauchern) findet keine Anwendung, da es sich beim Auftraggeber um einen Unternehmer im Sinne des § 14 BGB handelt.
        </P>
        <P n="7">
          Die kostenlose Strategie-Vorschau ist ausdrücklich unverbindlich und begründet weder eine Zahlungspflicht noch ein sonstiges Rechtsverhältnis.
        </P>
      </>
    ),
  },
  {
    id: "p4",
    num: "§ 4",
    title: "Mitwirkungspflichten des Auftraggebers",
    icon: Handshake,
    content: (
      <>
        <P n="1">Der Auftraggeber hat alle für die Leistungserbringung erforderlichen Informationen, Inhalte (Texte, Bilder, Logos, Zugangsdaten etc.) rechtzeitig und vollständig bereitzustellen.</P>
        <P n="2">Der Auftraggeber stellt sicher, dass die von ihm bereitgestellten Materialien frei von Rechten Dritter sind oder er über die erforderlichen Nutzungsrechte verfügt. Er stellt den Auftragnehmer von etwaigen Ansprüchen Dritter frei.</P>
        <P n="3">Verzögert sich die Leistungserbringung aufgrund verspäteter oder unvollständiger Mitwirkung des Auftraggebers, verlängern sich vereinbarte Fristen entsprechend. Entstehende Mehrkosten gehen zu Lasten des Auftraggebers.</P>
        <P n="4">Der Auftraggeber benennt bei Vertragsschluss einen Ansprechpartner mit Entscheidungsbefugnis und stellt die Erreichbarkeit dieses Ansprechpartners sicher.</P>
      </>
    ),
  },
  {
    id: "p5",
    num: "§ 5",
    title: "Vergütung und Zahlungsbedingungen",
    icon: CreditCard,
    content: (
      <>
        <P n="1">Die Vergütung richtet sich nach dem individuellen Angebot. Alle Preise verstehen sich netto zuzüglich der gesetzlichen Umsatzsteuer.</P>
        <P n="2">Sofern im Angebot nichts anderes vereinbart, gilt folgende Zahlungsstruktur für Einmalprojekte:</P>
        <ul className="list-disc pl-6 space-y-1.5 mb-4 leading-[1.7]">
          <li>50 % der vereinbarten Vergütung als Anzahlung bei Auftragserteilung (Projektstart)</li>
          <li>50 % bei Lieferung / Abnahme des fertiggestellten Projekts</li>
        </ul>
        <P n="3">Rechnungen sind, sofern nicht abweichend vereinbart, innerhalb von <Highlight>14 Tagen netto</Highlight> ohne Abzug zahlbar.</P>
        <P n="4">Zahlungen erfolgen per Stripe (Kreditkarte, SEPA etc.) oder per Überweisung auf Rechnung.</P>
        <P n="5">Bei Zahlungsverzug ist der Auftragnehmer berechtigt, Verzugszinsen in Höhe von 9 Prozentpunkten über dem jeweiligen Basiszinssatz (§ 288 Abs. 2 BGB) sowie eine Mahnpauschale von 40,00 EUR je Mahnung (§ 288 Abs. 5 BGB) zu erheben. Weitergehende Schadensersatzansprüche bleiben vorbehalten.</P>
        <P n="6">Bei Zahlungsverzug von mehr als 14 Tagen nach Mahnung ist der Auftragnehmer berechtigt, laufende Arbeiten einzustellen, bis der ausstehende Betrag vollständig beglichen ist. Der Vergütungsanspruch bleibt in vollem Umfang bestehen.</P>
        <P n="7">Aufrechnung mit streitigen oder nicht rechtskräftig festgestellten Gegenforderungen ist ausgeschlossen, soweit gesetzlich zulässig.</P>
      </>
    ),
  },
  {
    id: "p6",
    num: "§ 6",
    title: "Laufzeitverträge (Abonnements / Wartung / Pflege)",
    icon: Repeat,
    content: (
      <>
        <P n="1">Wiederkehrende Leistungen (z. B. Webseitenpflege, Wartungspakete, Marketing-Retainer, Grafikdesign-Abos) werden auf Basis monatlich oder jährlich abgerechneter Laufzeitverträge erbracht.</P>
        <P n="2">Laufzeitverträge haben eine <Highlight>Mindestlaufzeit von 12 Monaten</Highlight> ab Vertragsbeginn.</P>
        <P n="3">Nach Ablauf der Mindestlaufzeit verlängert sich der Vertrag automatisch auf unbestimmte Zeit und kann von beiden Parteien mit einer Frist von <Highlight>einem (1) Monat</Highlight> zum Monatsende in Textform (E-Mail genügt) gekündigt werden.</P>
        <P n="4">Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.</P>
        <P n="5">Bei monatlicher Abrechnung ist die Vergütung jeweils zum Ersten des Monats im Voraus fällig.</P>
      </>
    ),
  },
  {
    id: "p7",
    num: "§ 7",
    title: "Mietmodell für Webseiten",
    icon: Server,
    content: (
      <>
        <P n="1">Beim Mietmodell stellt der Auftragnehmer dem Auftraggeber eine betriebsfertige Webseite gegen eine monatliche Mietzahlung zur Verfügung (nachfolgend „Mietwebseite"). Eigentumsrechte an der Mietwebseite verbleiben beim Auftragnehmer.</P>
        <P n="2">Die Mietwebseite ist für die Dauer des Mietvertrags online verfügbar, sofern der Auftraggeber seinen Zahlungspflichten nachkommt. Der Mietvertrag unterliegt den Kündigungsregelungen des § 6 dieser AGB (12 Monate Mindestlaufzeit, danach monatlich kündbar).</P>
        <P n="3">Bei Zahlungsverzug des Auftraggebers gilt folgendes Verfahren:</P>
        <ul className="list-disc pl-6 space-y-1.5 mb-4 leading-[1.7]">
          <li>Der Auftragnehmer mahnt den Auftraggeber schriftlich (E-Mail genügt) und setzt eine angemessene Nachfrist von mindestens 7 Werktagen zur Zahlung.</li>
          <li>Geht der ausstehende Betrag innerhalb der Nachfrist nicht ein, ist der Auftragnehmer berechtigt, die Mietwebseite bis zum vollständigen Zahlungseingang vorübergehend zu <Highlight>deaktivieren</Highlight> (Leistungsverweigerungsrecht gem. § 320 BGB).</li>
          <li>Durch die Deaktivierung wird der Mietvertrag nicht beendet. Die Mietzahlungspflicht des Auftraggebers bleibt in voller Höhe bestehen.</li>
          <li>Nach vollständigem Zahlungseingang einschließlich etwaiger Verzugszinsen und Mahnkosten wird die Webseite unverzüglich wieder aktiviert.</li>
        </ul>
        <P n="4">Der Auftragnehmer ist nicht haftbar für Schäden, die dem Auftraggeber durch eine rechtmäßige Deaktivierung nach Abs. 3 entstehen (z. B. entgangene Anfragen, Umsatzverluste).</P>
        <P n="5">Bei Beendigung des Mietvertrags wird die Mietwebseite vom Netz genommen. Der Auftraggeber hat keinen Anspruch auf Herausgabe des Quellcodes, der Designdaten oder sonstiger technischer Grundlagen der Mietwebseite, sofern nicht ausdrücklich schriftlich etwas anderes vereinbart wurde.</P>
        <P n="6">Sondervereinbarungen (z. B. Kaufoption für die Mietwebseite) bedürfen der Schriftform.</P>
      </>
    ),
  },
  {
    id: "p8",
    num: "§ 8",
    title: "Lieferfristen und Lieferumfang",
    icon: Clock,
    content: (
      <>
        <P n="1">Lieferfristen und Lieferumfang werden individuell im Angebot vereinbart.</P>
        <P n="2">Genannte Fristen sind Richtwerte und beginnen mit vollständiger Anzahlung und vollständiger Bereitstellung aller Auftraggeberunterlagen.</P>
        <P n="3">Verzögerungen durch höhere Gewalt, technische Störungen Dritter (z. B. Hosting-Anbieter, Zahlungsdienstleister) oder mangelnde Mitwirkung des Auftraggebers berechtigen den Auftragnehmer zur angemessenen Fristverlängerung.</P>
      </>
    ),
  },
  {
    id: "p9",
    num: "§ 9",
    title: "Abnahme",
    icon: Check,
    content: (
      <>
        <P n="1">Nach Fertigstellung fordert der Auftragnehmer den Auftraggeber zur Abnahme auf. Die Abnahme hat innerhalb von <Highlight>7 Werktagen</Highlight> zu erfolgen.</P>
        <P n="2">Die Abnahme erfolgt schriftlich oder per E-Mail. Du gilt auch als erteilt, wenn der Auftraggeber die Leistung ohne begründete Mängelrüge produktiv nutzt oder innerhalb der 7-Tage-Frist keine begründete Ablehnung erklärt.</P>
        <P n="3">Mängel sind konkret zu benennen. Unwesentliche Mängel berechtigen nicht zur Abnahmeverweigerung.</P>
        <P n="4">Das Mietmodell nach § 7 unterliegt keiner gesonderten Abnahme; mit Inbetriebnahme gilt die Mietwebseite als vertragsgemäß zur Verfügung gestellt.</P>
      </>
    ),
  },
  {
    id: "p10",
    num: "§ 10",
    title: "Mängelansprüche / Gewährleistung",
    icon: ShieldCheck,
    content: (
      <>
        <P n="1">Mängelansprüche bei Werkleistungen verjähren in <Highlight>12 Monaten</Highlight> ab Abnahme, soweit gesetzlich zulässig.</P>
        <P n="2">Der Auftragnehmer hat das Recht zur zweimaligen Nacherfüllung. Schlägt die Nacherfüllung fehl, kann der Auftraggeber Minderung verlangen oder vom Vertrag zurücktreten.</P>
        <P n="3">Kein Mangel liegt vor bei: Fehler durch unsachgemäße Nutzung oder Veränderung durch den Auftraggeber; Inkompatibilitäten mit nicht vereinbarten Drittanwendungen; Updates Dritter (CMS, Plugins, Browser), die nach Abnahme eingespielt werden; gewöhnliche Abnutzung oder technische Veralterung.</P>
      </>
    ),
  },
  {
    id: "p11",
    num: "§ 11",
    title: "Haftungsbeschränkung",
    icon: ShieldAlert,
    content: (
      <>
        <P n="1">Der Auftragnehmer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.</P>
        <P n="2">Bei einfacher Fahrlässigkeit haftet der Auftragnehmer nur bei Verletzung einer vertragswesentlichen Pflicht (Kardinalpflicht), begrenzt auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden. Die Haftung ist auf die Höhe der für den betreffenden Auftrag gezahlten Nettovergütung begrenzt.</P>
        <P n="3">Der Auftragnehmer haftet nicht für Datenverluste, entgangenen Gewinn, mittelbare Schäden oder Folgeschäden, soweit die Haftung nach Abs. 2 beschränkt ist.</P>
        <P n="4">Der Auftragnehmer haftet nicht für Verfügbarkeit, Sicherheit oder Funktionalität externer Dienste (Hosting, Domain-Registrare, Zahlungsdienstleister, CMS-Hersteller, Social-Media-Plattformen).</P>
        <P n="5">Für Marketing-Dienstleistungen und Grafikdesign-Leistungen schuldet der Auftragnehmer Leistung nach dem Stand der Technik und professioneller Sorgfalt, nicht jedoch einen bestimmten Werbeerfolg oder eine bestimmte Reichweite.</P>
      </>
    ),
  },
  {
    id: "p12",
    num: "§ 12",
    title: "Urheberrecht und Nutzungsrechte",
    icon: Copyright,
    content: (
      <>
        <P n="1">Der Auftragnehmer überträgt dem Auftraggeber nach vollständiger Bezahlung das einfache, nicht ausschließliche, zeitlich und räumlich unbeschränkte Nutzungsrecht an den erstellten Werken für den vertraglich vereinbarten Zweck.</P>
        <P n="2">Vor vollständiger Zahlung verbleiben alle Rechte beim Auftragnehmer. Bei Mietmodellen (§ 7) verbleiben die Rechte dauerhaft beim Auftragnehmer, solange kein gesonderter Erwerb schriftlich vereinbart wurde.</P>
        <P n="3">Eigenständige kreative Leistungen des Auftragnehmers (Designs, Texte, Grafiken, Code) bleiben urheberrechtlich beim Auftragnehmer. Eine Übertragung auf Dritte ist nur mit ausdrücklicher schriftlicher Zustimmung des Auftragnehmers zulässig.</P>
        <P n="4">Der Auftragnehmer ist berechtigt, abgeschlossene Projekte in seinem Portfolio und zu Marketingzwecken zu verwenden, sofern der Auftraggeber nicht innerhalb von 14 Tagen nach Abnahme schriftlich widerspricht.</P>
        <P n="5">Verwendete Open-Source-Komponenten unterliegen den jeweiligen Open-Source-Lizenzbedingungen.</P>
        <P n="6">Der Auftraggeber stellt sicher, dass von ihm bereitgestellte Inhalte (Texte, Bilder, Logos, Marken etc.) keine Rechte Dritter verletzen. Er stellt den Auftragnehmer von sämtlichen Ansprüchen Dritter frei.</P>
      </>
    ),
  },
  {
    id: "marke",
    num: "§ 12a",
    title: "Marke, Handelsname und geistiges Eigentum des Auftragnehmers",
    icon: BadgeCheck,
    content: (
      <>
        <P n="1">Der Handelsname „Meine-Traum-Webseite" sowie das zugehörige Logo, Wort-Bild-Marken, Farbschemata und sonstige Kennzeichen sind geistiges Eigentum von Muad Amar / QK Marketing (nachfolgend „Marke"). Der Auftraggeber erwirbt durch den Vertragsschluss keinerlei Rechte an der Marke.</P>
        <P n="2">Dem Auftraggeber ist es untersagt, die Marke „Meine-Traum-Webseite", das Logo oder damit assoziierte Kennzeichen ohne ausdrückliche schriftliche Zustimmung des Auftragnehmers zu verwenden, zu vervielfältigen, zu verändern oder Dritten zur Nutzung zu überlassen.</P>
        <P n="3">Die Verwendung des Markennamens oder Logos im Rahmen eines Portfolio-Eintrags, einer Kundenreferenz oder ähnlicher Darstellungen durch den Auftraggeber bedarf der vorherigen schriftlichen Zustimmung des Auftragnehmers.</P>
        <P n="4">Der Auftragnehmer ist berechtigt, den Namen und das Projekt des Auftraggebers im Rahmen seiner Referenzliste und seines Portfolios unter der Marke „Meine-Traum-Webseite" zu verwenden, sofern der Auftraggeber nicht innerhalb von 14 Tagen nach Abnahme schriftlich widerspricht (vgl. § 12 Abs. 4).</P>
      </>
    ),
  },
  {
    id: "p13",
    num: "§ 13",
    title: "Vertraulichkeit",
    icon: Lock,
    content: (
      <>
        <P n="1">Beide Parteien verpflichten sich, alle im Rahmen der Zusammenarbeit erhaltenen vertraulichen Informationen dauerhaft geheim zu halten und nicht an Dritte weiterzugeben.</P>
        <P n="2">Diese Pflicht gilt nicht für Informationen, die öffentlich bekannt sind oder werden, ohne dass eine Partei dagegen verstoßen hat.</P>
        <P n="3">Personalisierte Angebotslinks und Zugangsdaten für das Angebotsportal sind vom Auftraggeber streng vertraulich zu behandeln und dürfen nicht an Dritte weitergegeben werden.</P>
      </>
    ),
  },
  {
    id: "p14",
    num: "§ 14",
    title: "Datenschutz und Nachweis der Willenserklärung",
    icon: Database,
    content: (
      <>
        <P n="1">Der Auftragnehmer verarbeitet personenbezogene Daten des Auftraggebers ausschließlich zur Vertragserfüllung und -anbahnung gemäß DSGVO und BDSG.</P>
        <P n="2"><Highlight>Zeitstempel, IP-Adressen und Transaktionsdaten</Highlight>, die beim Vertragsschluss über das Online-Angebotsportal oder über Zahlungsdienstleister erhoben werden, werden gespeichert und dienen als elektronischer Nachweis der verbindlichen Willenserklärung (§ 126b BGB). Die Speicherung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beweissicherung).</P>
        <P n="3">Soweit der Auftragnehmer im Rahmen der Leistungserbringung Zugang zu personenbezogenen Daten der Kunden des Auftraggebers erhält, ist bei Bedarf ein Auftragsverarbeitungsvertrag (AVV) gem. Art. 28 DSGVO abzuschließen.</P>
        <P n="4">Weiteres ergibt sich aus der Datenschutzerklärung unter meine-traum-webseite.de.</P>
      </>
    ),
  },
  {
    id: "p15",
    num: "§ 15",
    title: "Schlussbestimmungen",
    icon: Gavel,
    content: (
      <>
        <P n="1">Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).</P>
        <P n="2">Gerichtsstand für alle Streitigkeiten aus und im Zusammenhang mit diesem Vertrag ist <Highlight>Mainz</Highlight>, soweit der Auftraggeber Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.</P>
        <P n="3">Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Die unwirksame Bestimmung ist durch eine wirksame Regelung zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt <strong>(Salvatorische Klausel)</strong>.</P>
        <P n="4">Änderungen und Ergänzungen dieser AGB bedürfen der Textform. Mündliche Nebenabreden bestehen nicht.</P>
        <P n="5">Der Auftragnehmer ist berechtigt, diese AGB mit einer Ankündigungsfrist von 4 Wochen für laufende Dauerschuldverhältnisse zu aktualisieren. Bei wesentlichen Änderungen erhält der Auftraggeber eine gesonderte Information.</P>
      </>
    ),
  },
];

const AGB = () => {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const [showTop, setShowTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  const nav = useMemo(
    () =>
      sections.map((s) => {
        const Icon = s.icon;
        const active = activeId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`group flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
              active
                ? "bg-accent-agb/10 text-accent-agb font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${active ? "text-accent-agb" : ""}`} />
            <span className="leading-tight">
              <span className="font-semibold mr-1">{s.num}</span>
              {s.title}
            </span>
          </button>
        );
      }),
    [activeId],
  );

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Hero / Header */}
      <header className="bg-[#0d0d10] text-white print:bg-white print:text-black">
        <div className="container-narrow px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" aria-hidden={true} focusable={false} />
            <span className="font-heading font-bold text-lg tracking-tight">Meine-Traum-Webseite</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-2 text-sm text-white/80 hover:text-white border border-white/15 hover:border-white/40 rounded-lg px-3 py-1.5 transition-all print:hidden"
          >
            <Printer className="w-4 h-4" aria-hidden={true} focusable={false} />
            Drucken
          </button>
        </div>
        <div className="container-narrow px-4 pt-10 pb-16 md:pt-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 leading-tight">
              Meine-Traum-Webseite
            </h1>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white/90 tracking-tight mb-5">
              Allgemeine Geschäftsbedingungen
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
              Ein Angebot von Muad Amar – QK Marketing · Stand: Mai 2025 | Version 2.0
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white/10 text-white/90 px-3 py-1.5 rounded-full border border-white/10">
                meine-traum-webseite.de
              </span>
              <span className="bg-accent-agb/15 text-accent-agb px-3 py-1.5 rounded-full border border-accent-agb/30">
                B2B – nur für Unternehmer
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Mobile nav toggle */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 border-b border-border print:hidden">
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          className="container-narrow px-4 py-3 flex items-center justify-between w-full text-sm font-semibold"
        >
          <span className="flex items-center gap-2">
            <Menu className="w-4 h-4" aria-hidden={true} focusable={false} />
            Inhaltsverzeichnis
          </span>
          <span className="text-muted-foreground text-xs">
            {sections.find((s) => s.id === activeId)?.num}
          </span>
        </button>
        {mobileNavOpen && (
          <div className="container-narrow px-4 pb-4 max-h-[60vh] overflow-y-auto space-y-1">{nav}</div>
        )}
      </div>

      {/* Layout */}
      <div className="container-narrow px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
          {/* Sidebar */}
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-8 space-y-1">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 px-3">
                Inhalt
              </div>
              {nav}
            </div>
          </aside>

          {/* Content */}
          <main id="main-content" className="min-w-0 max-w-3xl">
            {sections.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.section
                  key={s.id}
                  id={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24 mb-14"
                >
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                    <div className="w-10 h-10 rounded-lg bg-accent-agb/10 text-accent-agb flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-semibold">{s.num}</div>
                      <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {s.title}
                      </h2>
                    </div>
                  </div>
                  <div className="text-foreground/85">{s.content}</div>
                  {i < sections.length - 1 && <div className="mt-14 h-px bg-border" />}
                </motion.section>
              );
            })}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0d0d10] text-white/70 print:bg-white print:text-black">
        <div className="container-narrow px-4 py-12 text-sm">
          <div className="font-heading font-bold text-accent-agb text-xl mb-1 print:text-black">
            Meine-Traum-Webseite
          </div>
          <div className="text-white/60 mb-5 print:text-black">
            Ein Angebot von Muad Amar – QK Marketing
          </div>
          <p className="leading-relaxed mb-6">
            Rheinallee 88, Gebäude 23 · 55120 Mainz
            <br />
            www.meine-traum-webseite.de
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-white/10 text-xs">
            <span>© {new Date().getFullYear()} Meine-Traum-Webseite | Muad Amar – QK Marketing | Alle Rechte vorbehalten</span>
            <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
              className="hover:text-white transition-colors"
            >
              Cookie-Einstellungen
            </button>
            <Link to="/" className="hover:text-white transition-colors">Startseite</Link>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Nach oben"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-accent-agb text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center print:hidden"
        >
          <ArrowUp className="w-5 h-5" aria-hidden={true} focusable={false} />
        </button>
      )}
    </div>
  );
};

export default AGB;