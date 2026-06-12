import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Check, Star, Lock, Gavel, Building2, TrendingDown, AlertTriangle, X, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import bmasLogo from "@/assets/bmas-logo.svg.asset.json";
import bfdiLogo from "@/assets/bfdi-logo.svg.asset.json";

type Grund = "bfsg" | "cookie" | "design";

const CONTENT: Record<Grund, {
  badge: { text: string; tone: string };
  h1: string;
  sub: string;
  secondary: string;
  problems: { icon: string; title: string; text: string }[];
  source: { name: string; quote: string; link: string };
  faq: { q: string; a: string }[];
}> = {
  bfsg: {
    badge: { text: "⚠️ Abmahnwelle seit Juni 2025 — betrifft auch Ihren Betrieb", tone: "bg-red-50 text-red-700 border-red-200" },
    h1: "Erste Abmahnungen wurden bereits verschickt. Ist Ihre Webseite dabei?",
    sub: "Seit dem 28. Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz (BFSG). Betriebe mit Kontaktformular, Buchungsfunktion oder Download sind betroffen. Wir prüfen Ihre Seite kostenlos — Ergebnis in 48 Stunden.",
    secondary: "Was passiert wenn Sie nichts tun? ↓",
    problems: [
      { icon: "⚖️", title: "Gesetzliche Pflicht", text: "Seit 28.06.2025 gilt das BFSG. Betroffen ist jede Webseite mit Kontaktformular, Buchung oder Download." },
      { icon: "💸", title: "Bußgeld bis 100.000 €", text: "Bei Verstoß können Behörden und Mitbewerber abmahnen. Die ersten Abmahnungen wurden bereits verschickt." },
      { icon: "🔍", title: "Behörden prüfen aktiv", text: "Die staatliche Marktüberwachungsstelle (MLBF) führt bereits Stichproben durch." },
    ],
    source: {
      name: "Bundesministerium für Arbeit und Soziales (BMAS)",
      quote: "Das BFSG verpflichtet Unternehmen seit dem 28. Juni 2025 zur digitalen Barrierefreiheit. Bei Verstoß können Behörden Maßnahmen bis zur Untersagung der Webseite einleiten.",
      link: "https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/barrierefreiheitsstaerkungsgesetz.html",
    },
    faq: [
      { q: "Bin ich als kleiner Betrieb wirklich betroffen?", a: "Sobald Ihre Webseite ein Kontaktformular, eine Buchungsfunktion oder einen Download enthält, greift das BFSG — unabhängig von der Betriebsgröße. Nur reine Info-Seiten ohne jede Interaktion sind ausgenommen." },
      { q: "Was kostet eine gesetzeskonforme neue Webseite?", a: "Unsere Pakete starten bei 59 €/Monat. Zum Vergleich: Eine einzige Abmahnung kostet typischerweise 1.000–5.000 € Anwaltskosten — dazu kommen mögliche Bußgelder." },
      { q: "Wie lange dauert die Umsetzung?", a: "Typisch 2–4 Wochen. Mit unserer kostenlosen Vorschau sehen Sie schon vorher wie Ihre neue Seite aussieht." },
    ],
  },
  cookie: {
    badge: { text: "⚠️ DSGVO-Verstoß auf Ihrer Webseite?", tone: "bg-orange-100 text-orange-700 border-orange-200" },
    h1: "Falscher Cookie-Banner kann Ihre Webseite zur Abmahnfalle machen",
    sub: "Die Verbraucherzentrale und noyb prüfen aktiv tausende Webseiten. Fehlt Ihrer den korrekten Cookie-Consent, drohen Abmahnungen und Bußgelder. Wir prüfen das kostenlos.",
    secondary: "Was muss ich prüfen? ↓",
    problems: [
      { icon: "🍪", title: "Falsche Cookie-Banner", text: "Voreingestellte Häkchen, fehlende Ablehnen-Option oder Tracking vor Einwilligung sind illegal." },
      { icon: "📋", title: "Abmahnwellen laufen", text: "Verbraucherzentrale + noyb prüfen tausende Webseiten. 10% wurden bereits abgemahnt." },
      { icon: "💰", title: "Abmahnkosten 1.000–5.000 €", text: "Typische Anwaltskosten einer Abmahnung plus mögliche DSGVO-Bußgelder." },
    ],
    source: {
      name: "Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)",
      quote: "Für technisch nicht-erforderliche Cookies muss der Webseitenbetreiber eine aktive Einwilligung des Nutzers einholen. Fehlende oder fehlerhafte Banner verstoßen gegen DSGVO und TDDDG.",
      link: "https://www.bfdi.bund.de/DE/Buerger/Inhalte/Telemedien/Cookie-Banner.html",
    },
    faq: [
      { q: "Reicht mein aktueller Cookie-Banner nicht?", a: "Viele Banner sind nicht DSGVO-konform: voreingestellte Häkchen, keine echte Ablehnen-Option, oder Tracking startet vor Einwilligung. Wir prüfen das kostenlos." },
      { q: "Kann ich das selbst nachrüsten?", a: "Technisch ja — aber riskant. Fehler im Cookie-Consent sind schwer zu erkennen und führen trotzdem zur Abmahnung. Eine neue Webseite bei uns ist von Anfang an korrekt aufgesetzt." },
      { q: "Was kostet eine Abmahnung wirklich?", a: "Typisch 1.000–5.000 € Anwaltskosten allein für die Reaktion. Dazu DSGVO-Bußgelder die bis zu 4% des Jahresumsatzes betragen können." },
    ],
  },
  design: {
    badge: { text: "💡 Veraltete Webseite = verlorene Aufträge", tone: "bg-blue-100 text-blue-700 border-blue-200" },
    h1: "Ihre Webseite kostet Sie jeden Tag neue Kunden",
    sub: "Eine veraltete, langsame oder nicht-mobile-optimierte Webseite schreckt Besucher ab — bevor Sie überhaupt Kontakt aufnehmen. Wir zeigen Ihnen kostenlos wie Ihre neue Seite aussehen würde.",
    secondary: "Warum das wichtig ist ↓",
    problems: [
      { icon: "📱", title: "70% surfen mobil", text: "Ist Ihre Seite nicht mobil-optimiert, verlassen 70% der Besucher sie sofort." },
      { icon: "⏱️", title: "3 Sekunden Ladezeit", text: "Lädt Ihre Seite länger als 3 Sekunden, verlieren Sie die Hälfte Ihrer Besucher noch vor dem ersten Klick." },
      { icon: "🏆", title: "Mitbewerber holen auf", text: "Während Ihre alte Seite steht, investieren Ihre Mitbewerber in professionellen Webauftritt." },
    ],
    source: {
      name: "Bitkom e.V. / Statista",
      quote: "Über 70% der deutschen Internetnutzer surfen mobil. Nicht-responsive Webseiten verlieren diese Besucher sofort.",
      link: "https://www.bitkom.org",
    },
    faq: [
      { q: "Was genau ist an meiner Webseite veraltet?", a: "Wir prüfen: mobile Optimierung, Ladegeschwindigkeit, Google-Ranking, DSGVO-Konformität und visuelles Design. Die Vorschau zeigt Ihnen den direkten Vorher/Nachher-Vergleich." },
      { q: "Was kostet eine neue Webseite?", a: "Unsere Pakete starten bei 59 €/Monat. Die Vorschau ist kostenlos und unverbindlich." },
      { q: "Wie viel Aufwand habe ich als Kunde?", a: "Minimal. Sie geben uns ein paar Informationen zu Ihrem Betrieb — den Rest erledigen wir." },
    ],
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -5% 0px", amount: 0.05 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const TESTIMONIALS = [
  { quote: "Ich hatte keine Ahnung dass mein Cookie-Banner nicht korrekt war. Muad hat das sofort erkannt und innerhalb von 3 Wochen hatten wir eine komplett neue, konforme Webseite.", name: "Thomas K., Elektriker aus Mainz" },
  { quote: "Das Gesetz hat mich wirklich überrascht. Dass es eine kostenlose Vorschau gibt, hat mir die Entscheidung leicht gemacht. Sehr professionelle Arbeit.", name: "Sandra M., Malerbetrieb Frankfurt" },
  { quote: "Schnell, unkompliziert, und das Ergebnis überzeugt. Meine neue Webseite ist jetzt gesetzeskonform und sieht besser aus als vorher.", name: "Ali B., Sanitärbetrieb Wiesbaden" },
];

const Gesetz = () => {
  const [params] = useSearchParams();
  const grundParam = (params.get("grund") || "bfsg") as Grund;
  const grund: Grund = ["bfsg", "cookie", "design"].includes(grundParam) ? grundParam : "bfsg";
  const c = CONTENT[grund];

  const [form, setForm] = useState({ name: "", firma: "", url: "", email: "", telefon: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log("[Vorschau Anfrage]", { grund, ...form });
    setSubmitted(true);
    document.getElementById("form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const title =
      grund === "bfsg"
        ? "BFSG-Check: Ist Ihre Webseite gesetzeskonform?"
        : grund === "cookie"
        ? "Cookie-Banner Check: DSGVO-konform?"
        : "Webseiten-Check: Verlieren Sie Kunden durch veraltetes Design?";
    document.title = title;
  }, [grund]);

  const isBfsg = grund === "bfsg";

  const scenarios = [
    { Icon: Gavel, title: "Abmahnung durch Mitbewerber", text: "Mitbewerber können ab sofort abmahnen. Die Anwaltskosten für eine einzige Abmahnung: typischerweise 1.000 bis 5.000 €. Dazu kommt die Pflicht zur sofortigen Nachbesserung." },
    { Icon: Building2, title: "Bußgeld durch Behörden", text: "Die staatliche Marktüberwachungsstelle (MLBF) führt bereits Stichproben durch. Bei festgestelltem Verstoß drohen Bußgelder bis zu 100.000 € und im schlimmsten Fall die Abschaltung Ihrer Webseite." },
    { Icon: TrendingDown, title: "Reputationsschaden", text: "Eine abgemahnte oder behördlich beanstandete Webseite schadet Ihrem Ruf — besonders bei Geschäftskunden und öffentlichen Auftraggebern, die auf Compliance achten." },
  ];

  const checklist = [
    "Meine Webseite hat ein Kontaktformular",
    "Ich verwende Google Maps, YouTube oder Google Fonts",
    "Mein Cookie-Banner hat kein echtes 'Ablehnen'-Feld",
    "Bilder auf meiner Webseite haben keine Bildbeschreibungen (Alt-Texte)",
    "Meine Webseite ist nicht für Tastatur-Navigation optimiert",
    "Meine Webseite ist älter als 3 Jahre",
    "Ich habe keine Barrierefreiheitserklärung auf meiner Webseite",
    "Ich nutze Google Analytics oder Meta Pixel ohne korrekten Consent",
  ];

  const extraFaq = [
    { q: "Was genau prüft ihr bei meiner Webseite?", a: "Wir prüfen: Cookie-Banner und DSGVO-Konformität, Barrierefreiheit nach BFSG (Kontaktformular, Alt-Texte, Tastatur-Navigation), technische Grundlagen und ob eine Barrierefreiheitserklärung vorhanden ist. Das Ergebnis bekommen Sie schriftlich." },
    { q: "Muss ich danach eine neue Webseite kaufen?", a: "Nein. Die Prüfung ist komplett kostenlos und unverbindlich. Wir zeigen Ihnen was fehlt — was Sie daraus machen, entscheiden Sie selbst. Viele Kunden entscheiden sich für uns. Aber niemand muss." },
    { q: "Gilt das BFSG auch für meine Branche?", a: "Das BFSG gilt branchenübergreifend für viele Betriebe mit interaktiven Webseiten — also z. B. Handwerker, Dienstleister, Einzelhändler, Gastronomen und mehr.\n\nMit interaktiven Funktionen sind alle Bereiche gemeint, in denen Besucher aktiv etwas eingeben, auswählen, buchen, kaufen oder anfragen können — zum Beispiel:\n\nKontaktformulare, Online-Terminbuchungen, Reservierungen, Bestell- oder Buchungssysteme, Kunden-Logins, Warenkörbe, Checkout-Prozesse, Chatfunktionen oder Angebotsanfragen.\n\nAusgenommen sind nur Kleinstbetriebe mit weniger als 10 Mitarbeitern und unter 2 Mio. € Jahresumsatz, sofern ihre Webseite keine solchen interaktiven Funktionen anbietet." },
    { q: "Wie schnell kann ich abgemahnt werden?", a: "Sofort — das Gesetz gilt seit dem 28. Juni 2025. Mitbewerber und Abmahnvereine können ab diesem Datum klagen. Die ersten Abmahnungen wurden bereits in den ersten Wochen nach Inkrafttreten des Gesetzes verschickt." },
  ];
  const allFaq = isBfsg ? [...c.faq, ...extraFaq] : c.faq;

  return (
    <div className="bg-background text-foreground font-sans">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(115deg, hsl(250 56% 14%) 0%, hsl(250 56% 18%) 35%, hsl(228 30% 8%) 75%, hsl(228 30% 5%) 100%)",
          }}
        />
        <div className="absolute inset-0 z-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 5% 15%, hsl(270 70% 55% / 0.45), transparent 65%), radial-gradient(ellipse 50% 50% at 30% 70%, hsl(215 100% 45% / 0.25), transparent 65%)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full border ${c.badge.tone}`}>
              {c.badge.text}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-6 leading-tight tracking-tight" style={{ color: "#ffffff", backgroundImage: "none", WebkitBackgroundClip: "border-box", backgroundClip: "border-box", WebkitTextFillColor: "#ffffff" }}>
              {c.h1}
            </h1>
            <p className="text-lg text-white/85 max-w-2xl mx-auto mt-6 mb-8">
              {c.sub}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-white hover:opacity-90 font-semibold shadow-xl" style={{ backgroundColor: "var(--brand-purple)" }} onClick={() => scrollTo("form-card")}>
                {isBfsg ? "Jetzt kostenlos prüfen lassen" : "Jetzt kostenlose Vorschau anfordern"} <ArrowRight className="ml-1" aria-hidden={true} focusable={false} />
              </Button>
              <button onClick={() => scrollTo("problem")} className="text-white/80 hover:text-white text-sm underline-offset-4 hover:underline">
                {c.secondary}
              </button>
            </div>
            {isBfsg && (
              <p className="text-white/70 text-sm mt-4">Keine Verpflichtung. Ergebnis in 48 Stunden.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* SCHMERZ-SEKTION */}
      {isBfsg && (
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.h2 {...fadeUp} className="font-display text-3xl md:text-4xl font-bold text-center mb-14">
              Was passiert, wenn Sie nichts tun?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {scenarios.map(({ Icon, title, text }, i) => {
                const variants = [
                  { glow: "from-indigo-500 to-purple-600", iconBg: "bg-indigo-50", iconColor: "text-indigo-600", tag: "text-indigo-500", tagText: "Rechtliches Risiko" },
                  { glow: "from-purple-500 to-pink-500", iconBg: "bg-purple-50", iconColor: "text-purple-600", tag: "text-purple-500", tagText: "Finanzielles Risiko" },
                  { glow: "from-blue-500 to-indigo-500", iconBg: "bg-blue-50", iconColor: "text-blue-600", tag: "text-blue-500", tagText: "Marken-Risiko" },
                ];
                const v = variants[i] ?? variants[0];
                return (
                  <motion.div
                    key={i}
                    {...fadeUp}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                    className="relative group"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${v.glow} rounded-3xl blur opacity-10 group-hover:opacity-25 transition duration-500`} aria-hidden="true" />
                    <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 h-full flex flex-col" style={{ border: "1px solid hsl(0 0% 100% / 0.6)" }}>
                      <div className={`w-12 h-12 ${v.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                        <Icon className={`w-6 h-6 ${v.iconColor}`} aria-hidden={true} focusable={false} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-900 mb-4 leading-tight">{title}</h3>
                      <p className="text-slate-600 text-[15px] leading-relaxed flex-grow">{text}</p>
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <span className={`text-[10px] uppercase tracking-wider font-bold ${v.tag}`}>{v.tagText}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PROBLEM */}
      <section id="problem" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {c.problems.map((p, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}>
                <Card className="p-8 h-full rounded-2xl border-2 hover:border-primary/40 transition-colors">
                  <div className="text-5xl mb-4">{p.icon}</div>
                  <h3 className="font-display text-xl font-bold mb-3">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STAATLICHE QUELLE */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
              Das sagt der Staat — keine Meinung, Fakten
            </h2>
            <Card className="p-8 md:p-10 rounded-2xl border-2 border-primary/20 bg-card shadow-lg text-left">
              <div className="flex items-center gap-5 mb-5 flex-wrap">
                <div className="shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-center justify-center">
                  <img src={bmasLogo.url} alt="Logo Bundesministerium für Arbeit und Soziales" className="h-10 md:h-12 w-auto" loading="lazy" />
                </div>
                <div className="font-semibold text-lg">{c.source.name}</div>
              </div>
              <blockquote className="text-muted-foreground italic border-l-4 border-primary/40 pl-4 mb-6">
                „{c.source.quote}"
              </blockquote>
              <a href={c.source.link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline-primary">Offizielle Quelle ansehen →</Button>
              </a>
            </Card>
            {isBfsg && (
              <Card className="mt-6 p-8 md:p-10 rounded-2xl border-2 border-primary/20 bg-card shadow-lg text-left">
                <div className="flex items-center gap-5 mb-5 flex-wrap">
                  <div className="shrink-0 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100 flex items-center justify-center">
                    <img src={bfdiLogo.url} alt="Logo Bundesbeauftragte für den Datenschutz und die Informationsfreiheit" className="h-10 md:h-12 w-auto" loading="lazy" />
                  </div>
                  <div className="font-semibold text-lg">Bundesbeauftragte für den Datenschutz (BfDI)</div>
                </div>
                <blockquote className="text-muted-foreground italic border-l-4 border-primary/40 pl-4 mb-6">
                  „Für Cookies und Tracking-Tools gilt: Ohne aktive Einwilligung des Nutzers ist der Einsatz illegal. Falsche Cookie-Banner führen zu Abmahnungen und DSGVO-Bußgeldern."
                </blockquote>
                <a href="https://www.bfdi.bund.de/DE/Buerger/Inhalte/Telemedien/Cookie-Banner.html" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline-primary">Offizielle Quelle ansehen →</Button>
                </a>
              </Card>
            )}
            <p className="text-xs text-muted-foreground/80 italic mt-6 text-center">
              Hinweis: Die Nutzung der Logos dient ausschließlich der Quellenangabe. Es besteht keine Verbindung, Kooperation oder Empfehlung durch die genannten Behörden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CHECKLISTE */}
      {isBfsg && (
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 max-w-[680px]">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Wie viele dieser Punkte treffen auf Ihre Webseite zu?
              </h2>
              <p className="text-muted-foreground">
                Jeder Punkt ist ein potenzielles Risiko. Je mehr zutreffen, desto dringender besteht Handlungsbedarf.
              </p>
            </motion.div>
            <motion.div {...fadeUp}>
              <Card className="p-6 md:p-8 rounded-2xl border-2">
                <ul className="space-y-4">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" aria-hidden={true} focusable={false} />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            <motion.div {...fadeUp} className="mt-8">
              <div className="rounded-2xl p-8 text-center shadow-xl"
                style={{ background: "linear-gradient(135deg, hsl(250 56% 30%), hsl(250 56% 48%))" }}>
                <p className="text-white text-lg mb-6">
                  Wenn Sie auch nur 2 dieser Punkte mit Ja beantwortet haben — lassen Sie Ihre Webseite jetzt kostenlos prüfen.
                </p>
                <Button size="lg" onClick={() => scrollTo("form-card")} className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                  Kostenlose Prüfung anfordern →
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* LÖSUNG */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Unsere Lösung</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6">
              {isBfsg ? "Wir lösen das Problem für Sie — kostenlos und unverbindlich" : "Neue, gesetzeskonforme Webseite — wir zeigen Ihnen kostenlos wie sie aussieht"}
            </h2>
            <ul className="space-y-3 mb-8">
              {(isBfsg ? [
                "Wir analysieren Ihre aktuelle Webseite auf BFSG- und DSGVO-Verstöße",
                "Sie erhalten einen konkreten Bericht: was fehlt, was zu tun ist",
                "Wir zeigen Ihnen kostenlos wie Ihre neue, konforme Webseite aussehen würde",
                "Kein Anwaltsrisiko — Sie handeln bevor jemand abmahnt",
                "Umsetzung in 2–4 Wochen möglich",
              ] : [
                "Kostenlose Vorab-Analyse Ihrer aktuellen Webseite",
                "Kostenlose Design-Vorschau Ihrer neuen Webseite",
                "BFSG- und DSGVO-konform von Anfang an",
                "Kein Risiko — keine Verpflichtung",
              ]).map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 shrink-0" aria-hidden={true} focusable={false} />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={() => scrollTo("form-card")} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
              Jetzt kostenlose Vorschau anfordern →
            </Button>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}>
            {isBfsg ? (
              <div className="rounded-[20px] shadow-xl p-6 md:p-8 text-white"
                style={{ background: "linear-gradient(135deg, hsl(228 24% 12%), hsl(250 56% 18%))", border: "2px solid hsl(250 56% 48% / 0.3)" }}>
                <div className="flex items-center gap-2 text-green-400 font-semibold mb-5">
                  <Check className="w-5 h-5" aria-hidden={true} focusable={false} />
                  Analyse abgeschlossen
                </div>
                <ul className="space-y-3 mb-5">
                  {[
                    "Cookie-Banner nicht konform",
                    "Alt-Texte fehlen (12 Bilder)",
                    "Barrierefreiheitserklärung fehlt",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2.5">
                      <X className="w-5 h-5 text-red-400 mt-0.5 shrink-0" aria-hidden={true} focusable={false} />
                      <span className="text-white/90 text-sm">{t}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2.5">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" aria-hidden={true} focusable={false} />
                    <span className="text-white/90 text-sm">SSL-Zertifikat: aktiv</span>
                  </li>
                </ul>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-red-400 font-semibold">3 kritische Probleme gefunden</div>
                  <div className="text-white/50 text-xs mt-2">So könnte Ihr Analysebericht aussehen</div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/3] rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-muted to-muted/40 overflow-hidden shadow-xl">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-muted-foreground font-medium">Ihre neue Webseite</div>
                </div>
                <style>{`@keyframes shimmer { 100% { transform: translateX(200%); } }`}</style>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA FORM */}
      <section id="form-card" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="max-w-[560px] mx-auto">
            {isBfsg && !submitted && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-center">
                <p className="text-amber-800 text-sm font-medium">
                  🕐 Die Abmahnwelle läuft bereits. Jeden Tag ohne konforme Webseite ist ein Risikotag.
                </p>
              </div>
            )}
            <Card className="p-8 md:p-10 rounded-2xl shadow-xl border-2 border-primary/20">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" aria-hidden={true} focusable={false} />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">✓ Vielen Dank!</h2>
                  <p className="text-muted-foreground">Wir melden uns innerhalb von 48 Stunden.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-bold text-center mb-3">
                    {isBfsg ? "Jetzt kostenlos prüfen lassen" : "Kostenlose Vorschau anfordern"}
                  </h2>
                  <p className="text-muted-foreground text-center mb-8">
                    {isBfsg
                      ? "Geben Sie uns Ihre Webseiten-URL — wir analysieren sie und melden uns innerhalb von 48 Stunden mit konkreten Ergebnissen. Kostenlos. Unverbindlich."
                      : "Wir analysieren Ihre aktuelle Webseite und erstellen eine kostenlose Vorschau Ihrer neuen — innerhalb von 48 Stunden."}
                  </p>
                  <div className="space-y-4">
                    {[
                      { k: "name", label: "Ihr Name", type: "text" },
                      { k: "firma", label: "Firmenname", type: "text" },
                      { k: "url", label: "Webseite URL", type: "url" },
                      { k: "email", label: "E-Mail", type: "email" },
                      { k: "telefon", label: "Telefon (optional)", type: "tel" },
                    ].map((f) => (
                      <div key={f.k}>
                        <Label htmlFor={f.k} className="mb-1.5 block">{f.label}</Label>
                        <Input
                          id={f.k}
                          type={f.type}
                          value={(form as any)[f.k]}
                          onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                        />
                      </div>
                    ))}
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg mt-2"
                    >
                      Kostenlose Vorschau anfordern
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Kein Spam. Keine Verpflichtung. Ihre Daten werden vertraulich behandelt.
                    </p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Was unsere Kunden sagen
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}>
                <Card className="p-6 h-full rounded-2xl bg-card border">
                  <div className="flex gap-1 mb-3 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="w-4 h-4 fill-current" aria-hidden={true} focusable={false} />
                    ))}
                  </div>
                  <p className="text-foreground/90 italic mb-4">„{t.quote}"</p>
                  <p className="text-sm font-semibold text-muted-foreground">— {t.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2 {...fadeUp} className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            Häufige Fragen
          </motion.h2>
          <Accordion type="single" collapsible className="w-full">
            {allFaq.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-base md:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(250 56% 30%), hsl(250 56% 48%) 60%, hsl(215 100% 50%))" }}>
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Jetzt kostenlose Vorschau anfordern
            </h2>
            <p className="text-white/85 text-lg mb-8">
              Unverbindlich. Kostenlos. Innerhalb von 48 Stunden.
            </p>
            <Button
              size="lg"
              onClick={() => scrollTo("form-card")}
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl"
            >
              Zur kostenlosen Vorschau →
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/80 text-sm">
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" aria-hidden={true} focusable={false} /> SSL-gesichert</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4" aria-hidden={true} focusable={false} /> Kein Spam</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-current text-yellow-300" aria-hidden={true} focusable={false} /> 5-Sterne bewertet</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimaler Footer */}
      <footer className="py-8 bg-background border-t">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Meine Traum Webseite — QK Marketing</div>
          <div className="flex gap-5">
            <Link to="/impressum" className="hover:text-foreground">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-foreground">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gesetz;