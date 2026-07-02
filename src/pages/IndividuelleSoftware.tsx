import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Check, Phone, FileSpreadsheet, Clock, RefreshCw, AlertTriangle, Cog, LayoutDashboard, Users, Calendar, Workflow, Monitor, Search, Lightbulb, Code2, TestTube, Rocket, TrendingUp, ShieldCheck, Zap, BarChart3 } from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Excel-Chaos & Insellösungen",
    desc: "Daten verteilt über Tabellen, Tools und Notizen – niemand hat den Überblick.",
  },
  {
    icon: RefreshCw,
    title: "Wiederkehrende manuelle Aufgaben",
    desc: "Dein Team verbringt Stunden mit Aufgaben, die ein System in Sekunden erledigt.",
  },
  {
    icon: Clock,
    title: "Zeitverlust im Alltag",
    desc: "Suchen, kopieren, abstimmen – statt sich auf das Wesentliche zu konzentrieren.",
  },
  {
    icon: AlertTriangle,
    title: "Fehlende Systeme",
    desc: "Es gibt kein zentrales Tool, das deine Abläufe zusammenhält und abbildet.",
  },
];

const solutions = [
  {
    icon: Cog,
    title: "Individuelle Web-Apps",
    desc: "Maßgeschneiderte Anwendungen, die genau zu deinen Abläufen passen – nicht umgekehrt.",
  },
  {
    icon: LayoutDashboard,
    title: "Interne Dashboards & Tools",
    desc: "Alle wichtigen Kennzahlen und Aufgaben auf einen Blick – für bessere Entscheidungen.",
  },
  {
    icon: Users,
    title: "Kundenportale",
    desc: "Gib deinen Kunden Zugang zu Dokumenten, Status-Updates und Kommunikation.",
  },
  {
    icon: Workflow,
    title: "Automatisierte Prozesse",
    desc: "Manuelle Schritte werden automatisch ausgeführt – weniger Fehler, mehr Geschwindigkeit.",
  },
  {
    icon: Monitor,
    title: "Systemverknüpfungen",
    desc: "Verbinden du bestehende Tools und schaffen du durchgängige Abläufe.",
  },
];

const useCases = [
  { icon: Users, title: "CRM-Systeme", desc: "Kunden und Kontakte zentral verwalten, nachverfolgen und pflegen." },
  { icon: Calendar, title: "Buchungsplattformen", desc: "Termine, Ressourcen oder Dienstleistungen online buchbar machen." },
  { icon: LayoutDashboard, title: "Kundenportale", desc: "Dokumente, Rechnungen und Projektstatus für deine Kunden bereitstellen." },
  { icon: BarChart3, title: "Interne Dashboards", desc: "Kennzahlen, Team-Aufgaben und Workflows an einem Ort bündeln." },
  { icon: Workflow, title: "Prozess-Automatisierung", desc: "Wiederkehrende Abläufe automatisieren – von der Anfrage bis zur Rechnung." },
];

const steps = [
  { icon: Search, num: "01", title: "Analyse & Zieldefinition", desc: "Wir verstehen dein Geschäft, deine Abläufe und definieren gemeinsam das Ziel." },
  { icon: Lightbulb, num: "02", title: "Konzept & Struktur", desc: "Wir entwickeln einen klaren Plan – welche Funktionen, welche Abläufe, welches Ergebnis." },
  { icon: Code2, num: "03", title: "Entwicklung", desc: "Dein System wird gebaut – transparent, in Etappen, mit regelmäßigem Feedback." },
  { icon: TestTube, num: "04", title: "Testing & Optimierung", desc: "Wir testen gründlich, optimieren und stellen sicher, dass alles reibungslos läuft." },
  { icon: Rocket, num: "05", title: "Launch & Betreuung", desc: "Go-Live – und danach stehen wir dir weiterhin als Partner zur Seite." },
];

const results = [
  { icon: Clock, value: "70%", label: "Zeitersparnis", desc: "bei wiederkehrenden Aufgaben durch Automatisierung" },
  { icon: ShieldCheck, value: "90%", label: "Weniger Fehler", desc: "durch automatisierte statt manuelle Abläufe" },
  { icon: Zap, value: "3×", label: "Schnellere Abläufe", desc: "durch klar strukturierte, digitale Prozesse" },
  { icon: TrendingUp, value: "∞", label: "Skalierbares Wachstum", desc: "Systeme, die mit deinem Unternehmen mitwachsen" },
];

const IndividuelleSoftware = () => (
  <main id="main-content">
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center section-padding pt-28 sm:pt-36 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container-narrow px-4 relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl">
            <span className="badge-label bg-primary/10 text-primary mb-6 text-[10px] sm:text-xs">
              Individuelle Apps & Softwarelösungen
            </span>
            <h1 className="mb-5 text-balance">
              Individuelle Apps & Software, die Prozesse automatisieren und dein{" "}
              <span className="gradient-text">Business skalieren</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 leading-relaxed">
              Wir entwickeln maßgeschneiderte Web-Apps und Softwarelösungen, die manuelle Abläufe
              ersetzen, Prozesse automatisieren und dein Unternehmen effizient wachsen lassen.
            </p>
            <div className="flex items-center gap-3 sm:gap-5 mb-8 flex-wrap">
              {[
                "Individuelle Lösungen statt Baukasten",
                "Automatisierung von Prozessen",
                "Skalierbare Systeme",
                "Für dein Business entwickelt",
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Check size={16} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button variant="gradient" size="lg" className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link to="/kontakt">
                  Kostenlose Erstberatung sichern <ArrowRight size={20} aria-hidden={true} focusable={false} />
                </Link>
              </Button>
              <Button variant="outline-primary" size="lg" className="text-sm sm:text-base py-5 sm:py-6 w-full sm:w-auto" asChild>
                <Link to="/kontakt">
                  <Phone size={20} aria-hidden={true} focusable={false} /> Projekt anfragen
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Problem Section */}
    <section className="section-padding bg-muted/30">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="badge-label bg-destructive/10 text-destructive mb-4 text-xs">Das Problem</span>
            <h2 className="text-3xl text-2xl sm:text-3xl font-bold mb-4">
              Manuelle Prozesse bremsen dein Wachstum
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Die meisten Unternehmen verlieren täglich Stunden mit Aufgaben, die ein
              durchdachtes System in Sekunden erledigen könnte.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {problems.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <div className="glass-card p-6 sm:p-8 rounded-2xl h-full">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                  <p.icon size={20} className="text-destructive" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Solution Section */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="badge-label bg-primary/10 text-primary mb-4 text-xs">Die Lösung</span>
            <h2 className="text-3xl text-2xl sm:text-3xl font-bold mb-4">
              Wir digitalisieren und automatisieren dein Unternehmen
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Keine Standard-Software, die du verbiegen müssen. Sondern Lösungen,
              die sich an dein Geschäft anpassen.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {solutions.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.08}>
              <div className="glass-card p-6 sm:p-8 rounded-2xl h-full border border-border/50 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Use Cases */}
    <section className="section-padding bg-muted/30">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="badge-label bg-primary/10 text-primary mb-4 text-xs">Anwendungsbeispiele</span>
            <h2 className="text-3xl text-2xl sm:text-3xl font-bold mb-4">
              Mögliche Lösungen für dein Unternehmen
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Jedes Unternehmen ist anders – hier einige Beispiele, was wir für du bauen können.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {useCases.map((u, i) => (
            <AnimatedSection key={u.title} delay={i * 0.08}>
              <div className="glass-card p-6 rounded-2xl h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <u.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{u.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{u.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="badge-label bg-primary/10 text-primary mb-4 text-xs">Unser Prozess</span>
            <h2 className="text-3xl text-2xl sm:text-3xl font-bold mb-4">
              So entsteht deine individuelle Lösung
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Strukturiert, transparent und auf dein Ergebnis ausgerichtet.
            </p>
          </div>
        </AnimatedSection>
        <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <AnimatedSection key={s.num} delay={i * 0.1}>
              <div className="flex gap-4 sm:gap-6 items-start glass-card p-5 sm:p-6 rounded-2xl">
                <div className="shrink-0 w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Results */}
    <section className="section-padding bg-muted/30">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="badge-label bg-primary/10 text-primary mb-4 text-xs">Ergebnisse</span>
            <h2 className="text-3xl text-2xl sm:text-3xl font-bold mb-4">
              Das Ergebnis: Mehr Effizienz, weniger Aufwand
            </h2>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map((r, i) => (
            <AnimatedSection key={r.label} delay={i * 0.1}>
              <div className="glass-card p-5 sm:p-6 rounded-2xl text-center h-full">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 mx-auto">
                  <r.icon size={20} className="text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{r.value}</div>
                <div className="font-semibold text-sm mb-1">{r.label}</div>
                <p className="text-muted-foreground text-xs leading-relaxed">{r.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-8 sm:p-12 md:p-16 text-center max-w-3xl mx-auto border border-primary/20">
            <h2 className="text-3xl text-2xl sm:text-3xl font-bold mb-4">
              Startest du dein Projekt
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Lass uns gemeinsam herausfinden, wie eine individuelle Softwarelösung
              dein Business effizienter und profitabler macht.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gradient" size="lg" className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8" asChild>
                <Link to="/kontakt">
                  Kostenlose Erstberatung sichern <ArrowRight size={20} aria-hidden={true} focusable={false} />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Unverbindlich · Kostenlos · Innerhalb von 24 h
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </main>
);

export default IndividuelleSoftware;
