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
import { ShieldCheck, ArrowRight, Check, Star, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    badge: { text: "⚠️ Neues Gesetz seit 28. Juni 2025", tone: "bg-red-100 text-red-700 border-red-200" },
    h1: "Ihre Webseite verstößt möglicherweise gegen das neue Barrierefreiheitsgesetz",
    sub: "Das BFSG verpflichtet viele Betriebe zur barrierefreien Webseite — bei Verstoß drohen Abmahnungen und Bußgelder bis 100.000 €. Wir prüfen Ihre Seite kostenlos.",
    secondary: "Was ist das BFSG? ↓",
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
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

const TESTIMONIALS = [
  { quote: "Wir hatten keine Ahnung vom neuen Gesetz. Muad hat alles erklärt und uns eine tolle neue Seite gebaut.", name: "Thomas K., Elektriker aus Mainz" },
  { quote: "Innerhalb von 48 Stunden hatten wir eine Vorschau unserer neuen Webseite. Genau so haben wir uns das vorgestellt.", name: "Sandra M., Malerbetrieb Frankfurt" },
  { quote: "Endlich eine Webseite die auf dem Handy funktioniert. Kunden rufen jetzt viel öfter an.", name: "Ali B., Sanitärbetrieb Wiesbaden" },
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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, hsl(250 56% 22%) 0%, hsl(250 56% 30%) 40%, hsl(228 24% 10%) 100%)",
          }}
        />
        <div className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 20%, hsl(215 100% 60% / 0.35), transparent 60%), radial-gradient(ellipse 50% 50% at 10% 80%, hsl(270 70% 65% / 0.3), transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full border ${c.badge.tone}`}>
              {c.badge.text}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 leading-tight tracking-tight">
              {c.h1}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mt-6 max-w-2xl mx-auto">
              {c.sub}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl" onClick={() => scrollTo("form-card")}>
                Jetzt kostenlose Vorschau anfordern <ArrowRight className="ml-1" />
              </Button>
              <button onClick={() => scrollTo("problem")} className="text-white/80 hover:text-white text-sm underline-offset-4 hover:underline">
                {c.secondary}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {c.problems.map((p, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}>
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
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
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
          </motion.div>
        </div>
      </section>

      {/* LÖSUNG */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Unsere Lösung</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6">
              Neue, gesetzeskonforme Webseite — wir zeigen Ihnen kostenlos wie sie aussieht
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "Kostenlose Vorab-Analyse Ihrer aktuellen Webseite",
                "Kostenlose Design-Vorschau Ihrer neuen Webseite",
                "BFSG- und DSGVO-konform von Anfang an",
                "Kein Risiko — keine Verpflichtung",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={() => scrollTo("form-card")} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
              Jetzt kostenlose Vorschau anfordern →
            </Button>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}>
            <div className="relative aspect-[4/3] rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-muted to-muted/40 overflow-hidden shadow-xl">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-muted-foreground font-medium">Ihre neue Webseite</div>
              </div>
            </div>
            <style>{`@keyframes shimmer { 100% { transform: translateX(200%); } }`}</style>
          </motion.div>
        </div>
      </section>

      {/* CTA FORM */}
      <section id="form-card" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="max-w-[560px] mx-auto">
            <Card className="p-8 md:p-10 rounded-2xl shadow-xl border-2 border-primary/20">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">✓ Vielen Dank!</h2>
                  <p className="text-muted-foreground">Wir melden uns innerhalb von 48 Stunden.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-bold text-center mb-3">Kostenlose Vorschau anfordern</h2>
                  <p className="text-muted-foreground text-center mb-8">
                    Wir analysieren Ihre aktuelle Webseite und erstellen eine kostenlose Vorschau Ihrer neuen — innerhalb von 48 Stunden.
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
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}>
                <Card className="p-6 h-full rounded-2xl bg-card border">
                  <div className="flex gap-1 mb-3 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="w-4 h-4 fill-current" />
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
            {c.faq.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-base md:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
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
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> SSL-gesichert</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Kein Spam</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-current text-yellow-300" /> 5-Sterne bewertet</span>
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