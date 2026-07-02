import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import IndexPortfolio from "@/components/IndexPortfolio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, ArrowDown, Sparkles, TrendingUp, Check, Quote, Phone, Zap, Lock, Award, X, AlertTriangle, Smartphone, Search, Shield, Calendar, Lightbulb, Rocket, HeartHandshake, Star, Clock, Users } from "lucide-react";

const TERMIN_LINK = "#termin-buchen";

const scrollTo = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const cards = [
  {
    icon: Sparkles,
    badge: "Ich habe noch keine Website",
    title: "Jetzt online — mit System",
    text: "Starte mit einer professionellen Landingpage, die ab Tag 1 Vertrauen aufbaut und Anfragen bringt. Kein Baukasten, keine Templates.",
    cta: "Das ist meine Situation",
  },
  {
    icon: TrendingUp,
    badge: "Meine Website wirkt veraltet",
    title: "Frischer Look, gleiches Business",
    text: "Wir geben deinem Auftritt ein modernes Update — gleiche Inhalte, neues Vertrauen. Sichtbar besser in 7 Tagen.",
    cta: "Das passt zu mir",
  },
];

const includedLeft = [
  "Modernes, individuelles Design",
  "1 Landingpage (One-Pager)",
  "Mobil-optimiert (Smartphone & Tablet)",
  "Kontaktformular & WhatsApp-Button",
  "Impressum & Datenschutz DSGVO-konform",
];

const includedRight = [
  "Google-ready (SEO-Grundlagen)",
  "Logo, Farben & Fotos eingebaut",
  "Konzept in 48 h — kostenlos",
  "Online in 7 Tagen",
  "30 Tage Support nach Launch",
];

const trust = [
  {
    icon: Lock,
    title: "Fixpreis. Immer.",
    text: "Kein Stundensatz, keine Nachberechnung. Was wir vereinbaren, gilt.",
  },
  {
    icon: Zap,
    title: "Schnell & unkompliziert",
    text: "Effizienter Prozess, keine endlosen Abstimmungen. Online in 7 Tagen.",
  },
  {
    icon: Award,
    title: "150+ Projekte. 98 % Weiterempfehlung.",
    text: "Quer durch alle Branchen — Handwerk, Beauty, Coaching, Dienstleistung.",
  },
];

const painPoints = [
  {
    icon: AlertTriangle,
    title: "Du hast (noch) gar keine Website",
    text: "Kunden googeln Dich — und finden nichts. Jeden Tag verlierst Du Anfragen, die nie bei Dir ankommen.",
  },
  {
    icon: Smartphone,
    title: "Deine Website wirkt wie aus 2015",
    text: "Auf dem Handy unleserlich, langsam, unübersichtlich. Besucher springen ab, bevor sie überhaupt verstehen, was Du anbietest.",
  },
  {
    icon: Search,
    title: "Du wirst bei Google nicht gefunden",
    text: "Keine SEO-Grundlagen, kein Standortbezug. Selbst wer nach Dir sucht, landet bei der Konkurrenz.",
  },
  {
    icon: X,
    title: "Du bekommst keine Anfragen",
    text: "Die Seite ist „nur eine Visitenkarte\". Aber eine Website soll arbeiten — nicht nur existieren.",
  },
];

const comparison = [
  {
    label: "Selber bauen (Wix, Jimdo, WordPress)",
    icon: X,
    tone: "muted",
    points: [
      "20–80 Stunden eigene Arbeit",
      "Sieht am Ende oft nach Baukasten aus",
      "Keine Strategie, keine Conversion-Optimierung",
      "Du wirst zum Webdesigner — nicht zum Unternehmer",
    ],
  },
  {
    label: "Klassische Agentur",
    icon: X,
    tone: "muted",
    points: [
      "3.000–8.000 € für eine einfache Seite",
      "8–12 Wochen Projektlaufzeit",
      "Stundensätze, Nachberechnung, Folgekosten",
      "Briefings, Meetings, Schleifen ohne Ende",
    ],
  },
  {
    label: "Starter Paket",
    icon: Check,
    tone: "primary",
    highlight: true,
    points: [
      "Festpreis ab 990 € einmalig — keine Nachberechnung",
      "Online in 7 Tagen statt 2 Monate",
      "Konzept in 48 h — kostenlos",
      "Wir machen alles. Du sagen nur, ob es passt.",
    ],
  },
];

const process = [
  {
    icon: Phone,
    title: "Erstgespräch (15 Min)",
    text: "Wir verstehen Deine Situation, Branche und Ziele. Kostenlos, unverbindlich.",
    duration: "Tag 1",
  },
  {
    icon: Lightbulb,
    title: "Konzept in 48 h",
    text: "Du bekommst Struktur, Textideen und visuelle Richtung — bevor Du einen Euro zahlen.",
    duration: "Tag 1–3",
  },
  {
    icon: Rocket,
    title: "Umsetzung & Feinschliff",
    text: "Wir bauen, Du gibst Feedback in 1–2 Runden. Kein Pingpong, klare Prozesse.",
    duration: "Tag 4–6",
  },
  {
    icon: HeartHandshake,
    title: "Launch & 30 Tage Support",
    text: "Online-Gehen, Google-Setup, Einweisung — und wir bleiben für Anpassungen erreichbar.",
    duration: "Tag 7",
  },
];

const fitYes = [
  "Du willst endlich online sein — ohne Monate-lange Projekte",
  "Du brauchst eine starke Seite, keine 20-seitige Website",
  "Du willst einen Festpreis, keine Stundenabrechnung",
  "Du willst, dass jemand anderes die Arbeit macht",
];

const fitNo = [
  "Du brauchst einen Online-Shop mit hunderten Produkten",
  "Du willst alles selber machen und nur „Beratung\"",
  "Du suchst die billigste Lösung um jeden Preis",
  "Du erwartest 50 Korrekturschleifen über 6 Monate",
];

const guarantees = [
  {
    icon: Shield,
    title: "Konzept kostenlos",
    text: "Du zahlst erst, wenn Dich das Konzept überzeugt. Keine Vorkasse.",
  },
  {
    icon: Lock,
    title: "Festpreis-Garantie",
    text: "Was im Angebot steht, wird abgerechnet. Keine versteckten Kosten.",
  },
  {
    icon: Calendar,
    title: "7-Tage-Launch-Garantie",
    text: "Bei Verzug durch uns: 10 % Rabatt auf den Endpreis.",
  },
];

const moreTestimonials = [
  {
    quote:
      "In 12 Tagen war meine Seite online. Innerhalb der ersten 4 Wochen 8 Anfragen — vorher hatte ich gar keine Website.",
    name: "Murat D.",
    role: "Express Zulassungsdienst",
    badge: "8 Anfragen in 4 Wochen",
  },
  {
    quote:
      "Festpreis war exakt eingehalten. Keine bösen Überraschungen, kein Hin-und-Her — endlich mal eine Agentur, die liefert.",
    name: "Thomas R.",
    role: "Malermeister",
    badge: "On time. On budget.",
  },
  {
    quote:
      "Ich hätte nie gedacht, dass eine Website unter 1.000 € so professionell aussehen kann. Kunden sprechen mich aktiv darauf an.",
    name: "Lisa F.",
    role: "Heilpraktikerin",
    badge: "Sieht aus wie 5.000 €",
  },
];

const faqs = [
  {
    q: "Was bekomme ich konkret für 990 €?",
    a: "Eine vollständige, professionelle One-Page-Website: modernes Design, mobil-optimiert, mit Kontaktformular & WhatsApp-Button, SSL-Zertifikat, Hosting, Impressum, Datenschutz und SEO-Grundlagen — komplett launchbereit. Einmalzahlung, dann gehört Dir die Seite dauerhaft.",
  },
  {
    q: "Wo ist der Unterschied zu den teureren Paketen?",
    a: "Das Starter Paket ist eine starke einzelne Seite. Wenn Du mehrere Unterseiten, einen Blog, einen Shop oder spezielle Funktionen brauchen, sprechen wir über ein größeres Paket — immer als Fixpreis.",
  },
  {
    q: "Was muss ich selbst vorbereiten?",
    a: "Wenig. Wenn Du Logo, ein paar Infos zum Business und eigene Fotos haben — super. Falls nicht, übernehmen wir Bildauswahl/KI-Bilder, Texte und Konzept komplett.",
  },
  {
    q: "Kann ich später erweitern?",
    a: "Ja. Das Starter Paket ist so aufgebaut, dass weitere Seiten, Funktionen oder ein Relaunch jederzeit angedockt werden können — ohne von vorn anzufangen.",
  },
  {
    q: "Wie läuft die Bezahlung ab?",
    a: "50 % bei Projektstart nach Konzept-Freigabe, 50 % nach Launch. Per Überweisung. Rechnung mit ausgewiesener 19 % MwSt. — alles transparent. Auf Wunsch auch als Miete ab 59 €/Monat verfügbar (siehe /preise).",
  },
  {
    q: "Bin ich nach Launch auf euch angewiesen?",
    a: "Nein. Du bekommst alle Zugänge und bist Eigentümer. Wenn Du später Änderungen wollen, kannst Du sie selbst, mit uns oder mit jeder anderen Agentur machen.",
  },
  {
    q: "Was, wenn mir das Konzept nicht gefällt?",
    a: "Dann zahlst Du nichts und wir gehen freundlich auseinander. Genau dafür ist das 48 h-Konzept kostenlos: damit sehen kannst, was Du bekommst — bevor Du Dich bindest.",
  },
  {
    q: "Macht ihr auch Texte und Bilder?",
    a: "Ja, beides ist im Paket inklusive. Wir schreiben verkaufsstarke Texte und nutzen passende Stockfotos oder KI-Bilder. Eigene Fotos kannst Du natürlich auch liefern.",
  },
];

const Starter = () => (
  <main id="main-content">
    {/* 1. Hero */}
    <section className="relative section-padding pt-28 sm:pt-36">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-label bg-primary/10 text-primary mb-6 sm:mb-8">
              <Zap size={16} className="inline mr-1" aria-hidden={true} focusable={false} /> Starter Paket ab 990 € einmalig
            </span>
            <h1 className="mb-6 text-balance">
              Keine Website? Veraltete Website?{" "}
              <span className="gradient-text">Beides lösbar — in 7 Tagen.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Wir bauen Dir eine moderne, professionelle Website, die Besucher
              sofort überzeugt — zu einem Fixpreis ohne Überraschungen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="gradient"
                size="lg"
                className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 h-auto min-h-12 animate-cta-pulse w-full sm:w-auto whitespace-normal text-center leading-tight"
                asChild
              >
                <a href={TERMIN_LINK}>
                  Kostenloses Erstgespräch buchen <ArrowRight size={20} aria-hidden={true} focusable={false} />
                </a>
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 h-auto min-h-12 w-full sm:w-auto whitespace-normal text-center leading-tight"
                onClick={scrollTo("paket")}
              >
                Was ist enthalten? <ArrowDown size={20} aria-hidden={true} focusable={false} />
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* 2. Zwei-Wege-Erkennung */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Wo stehst Du gerade?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beide Wege führen zu einer Website, die für Du arbeitet.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <AnimatedSection key={c.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-elevated transition-all duration-300 border-border">
                <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-5 text-primary-foreground">
                    <c.icon size={26} />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    {c.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold mb-4">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                    {c.text}
                  </p>
                  <button
                    onClick={scrollTo("paket")}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all self-start"
                  >
                    {c.cta} <ArrowRight size={20} aria-hidden={true} focusable={false} />
                  </button>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 2.5 Pain Points */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="badge-label bg-destructive/10 text-destructive mb-5">
              Klingt bekannt?
            </span>
            <h2 className="mb-4 text-balance">
              Was Du gerade Anfragen kostet — jeden Tag
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wenn Du auch nur einer dieser Punkte trifft, verlierst Du gerade
              Geld. Die gute Nachricht: jeder davon ist in 7 Tagen lösbar.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 gap-5">
          {painPoints.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.05}>
              <div className="flex items-start gap-4 p-5 sm:p-6 rounded-xl bg-card/70 border border-border">
                <div className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                  <p.icon size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.text}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 3. Paket-Section */}
    <section id="paket" className="section-padding scroll-mt-24">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">
              Das Starter Paket —{" "}
              <span className="text-foreground">alles drin, nichts versteckt</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ein klares Paket, ein klarer Preis. Keine Nachverhandlung, keine
              Überraschungen.
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary shadow-elevated overflow-hidden">
              <div className="gradient-hero-bg text-primary-foreground p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="relative z-10">
                  <span className="badge-label bg-primary-foreground/15 text-primary-foreground mb-4">
                    Starter Paket
                  </span>
                  <div className="flex items-baseline justify-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm sm:text-base text-primary-foreground/80">
                      ab
                    </span>
                    <span className="text-5xl sm:text-6xl font-heading font-bold">
                      990 €
                    </span>
                    <span className="text-base sm:text-lg text-primary-foreground/90 font-semibold">
                      einmalig
                    </span>
                  </div>
                  <p className="text-sm text-primary-foreground/80">
                    Festpreis · zzgl. 19 % MwSt. · oder als Miete ab 59 €/Monat
                  </p>
                </div>
              </div>
              <CardContent className="p-6 sm:p-10">
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-8">
                  {[...includedLeft, ...includedRight].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={16} aria-hidden={true} focusable={false} />
                      </div>
                      <span className="text-foreground/90 text-sm sm:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-6">
                    Brauchst Du mehr Seiten, einen Shop oder spezielle Funktionen?{" "}
                    <strong className="text-foreground">
                      Wir erstellen Dir ein individuelles Angebot.
                    </strong>
                  </p>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 h-auto min-h-12 animate-cta-pulse whitespace-normal text-center leading-tight"
                    asChild
                  >
                    <a href={TERMIN_LINK}>
                      Kostenloses Erstgespräch buchen <ArrowRight size={20} aria-hidden={true} focusable={false} />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* 3.5 Vergleich */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">
              Warum Starter — und nicht Selbstbau oder klassische Agentur?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Drei Wege zu einer Website. Nur einer davon kostet Du nicht
              Wochen Deiner Lebenszeit oder tausende Euro extra.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {comparison.map((c, i) => (
            <AnimatedSection key={c.label} delay={i * 0.1}>
              <Card
                className={`h-full ${
                  c.highlight
                    ? "border-2 border-primary shadow-elevated relative"
                    : "border-border opacity-90"
                }`}
              >
                {c.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground">
                    Empfehlung
                  </span>
                )}
                <CardContent className="p-6 sm:p-7">
                  <h3
                    className={`text-base sm:text-lg font-heading font-bold mb-5 ${
                      c.highlight ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {c.label}
                  </h3>
                  <ul className="space-y-3">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <c.icon
                          size={20}
                          className={`shrink-0 mt-0.5 ${
                            c.highlight ? "text-primary" : "text-destructive"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            c.highlight
                              ? "text-foreground/90"
                              : "text-muted-foreground"
                          }`}
                        >
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 3.7 Prozess */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="badge-label bg-primary/10 text-primary mb-5">
              <Clock size={16} className="inline mr-1" aria-hidden={true} focusable={false} /> 14 Tage von Null zu Online
            </span>
            <h2 className="mb-4 text-balance">
              Dein Weg zur fertigen Website — Schritt für Schritt
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Klare Phasen, klare Erwartungen. Du weißt jederzeit, wo wir stehen.
            </p>
          </div>
        </AnimatedSection>
        <div className="max-w-4xl mx-auto space-y-4">
          {process.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.05}>
              <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-xl bg-card/70 border border-border hover:shadow-elevated transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-bg flex items-center justify-center text-primary-foreground shrink-0">
                  <p.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {p.duration}
                    </span>
                    <h3 className="text-base sm:text-lg font-heading font-bold">
                      Schritt {i + 1}: {p.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {p.text}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 4. Portfolio */}
    <IndexPortfolio />

    {/* 4.5 Mehr Testimonials */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="badge-label bg-primary/10 text-primary mb-5">
              <Star size={16} className="inline mr-1" aria-hidden={true} focusable={false} /> Echte Kunden, echte Ergebnisse
            </span>
            <h2 className="mb-4 text-balance">
              Was Starter-Kunden über uns sagen
            </h2>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {moreTestimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.1}>
              <Card className="h-full hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                  <span className="badge-label bg-primary/10 text-primary self-start mb-4">
                    {t.badge}
                  </span>
                  <p className="text-foreground/90 leading-relaxed mb-6 flex-1">
                    „{t.quote}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 5. Vertrauen */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Warum Kunden uns vertrauen</h2>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {trust.map((t, i) => (
            <AnimatedSection key={t.title} delay={i * 0.1}>
              <div className="text-center px-2">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                  <t.icon size={26} />
                </div>
                <h3 className="text-lg font-heading font-bold mb-3">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.text}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 5.3 Garantien */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
              <Shield size={26} aria-hidden={true} focusable={false} />
            </div>
            <h2 className="mb-4 text-balance">3 Garantien — Du gehst null Risiko</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vertrauen bekommen wir nicht durch Versprechen — sondern dadurch,
              dass wir das Risiko übernehmen.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((g, i) => (
            <AnimatedSection key={g.title} delay={i * 0.1}>
              <Card className="h-full text-center border-primary/20">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 text-primary-foreground">
                    <g.icon size={26} />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-3">{g.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {g.text}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 5.5 Fit-Check */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Ist Starter das Richtige für Du?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wir verkaufen lieber ehrlich als überall. Hier siehst Du, ob es passt.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <AnimatedSection>
            <Card className="h-full border-primary/30">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-heading font-bold mb-6 text-primary flex items-center gap-2">
                  <Check size={20} aria-hidden={true} focusable={false} /> Starter passt, wenn …
                </h3>
                <ul className="space-y-4">
                  {fitYes.map((y) => (
                    <li key={y} className="flex items-start gap-3">
                      <Check size={20} className="text-primary shrink-0 mt-1" aria-hidden={true} focusable={false} />
                      <span className="text-foreground/90">{y}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <Card className="h-full border-destructive/20">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-heading font-bold mb-6 text-muted-foreground flex items-center gap-2">
                  <X size={20} aria-hidden={true} focusable={false} /> Starter passt nicht, wenn …
                </h3>
                <ul className="space-y-4">
                  {fitNo.map((n) => (
                    <li key={n} className="flex items-start gap-3">
                      <X size={20} className="text-destructive shrink-0 mt-1" aria-hidden={true} focusable={false} />
                      <span className="text-muted-foreground">{n}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-muted-foreground italic">
                  Falls Du sich hier wiederfindest: kein Problem — wir empfehlen
                  Dir gern eine andere Lösung oder ein größeres Paket.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* 6. Pullquote */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center py-8 sm:py-16">
            <Quote size={24} className="text-primary/30 mx-auto mb-8" aria-hidden={true} focusable={false} />
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium leading-relaxed text-foreground mb-10 text-balance">
              „Endlich eine Website, die so professionell aussieht wie mein
              Studio. Die Neukundengewinnung läuft jetzt automatisch."
            </blockquote>
            <div className="flex flex-col items-center gap-3">
              <span className="badge-label bg-primary/10 text-primary">
                2x mehr Neukunden
              </span>
              <p className="font-semibold text-base sm:text-lg">Claudia B.</p>
              <p className="text-sm text-muted-foreground">Beauty Lounge</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* 7. FAQ */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Häufige Fragen zum Starter Paket</h2>
          </div>
        </AnimatedSection>
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="border border-border rounded-xl px-5 sm:px-6 bg-background"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* 8. CTA-Block */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl sm:rounded-2xl p-8 sm:p-14 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-primary-foreground mb-4 text-balance">
                Starte jetzt — ohne Risiko.
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                Kostenloses Erstgespräch, Konzept in 48 h, Du entscheidest danach
                frei.
              </p>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-elevated animate-cta-pulse text-sm sm:text-base px-6 sm:px-8 h-auto min-h-12 py-3 whitespace-normal text-center leading-tight"
                asChild
              >
                <a href={TERMIN_LINK}>
                  Jetzt Termin buchen <ArrowRight size={20} aria-hidden={true} focusable={false} />
                </a>
              </Button>
              <div className="mt-8 flex flex-col items-center gap-2">
                <a
                  href="tel:+4961313076498"
                  className="inline-flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 font-semibold text-base sm:text-lg transition-colors"
                >
                  <Phone size={20} aria-hidden={true} focusable={false} /> 06131 3076498
                </a>
                <p className="text-primary-foreground/60 text-xs sm:text-sm">
                  Mo–Fr 9–18 Uhr · Auch per WhatsApp
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </main>
);

export default Starter;
