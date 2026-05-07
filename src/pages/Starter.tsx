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
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  TrendingUp,
  Check,
  Quote,
  Phone,
  Zap,
  Lock,
  Award,
} from "lucide-react";

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
    text: "Wir geben deinem Auftritt ein modernes Update — gleiche Inhalte, neues Vertrauen. Sichtbar besser in 2 Wochen.",
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
  "Konzept in 48h — kostenlos",
  "Launch in 2 Wochen",
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
    text: "Effizienter Prozess, keine endlosen Abstimmungen. Launch in 2 Wochen.",
  },
  {
    icon: Award,
    title: "150+ Projekte. 98 % Weiterempfehlung.",
    text: "Quer durch alle Branchen — Handwerk, Beauty, Coaching, Dienstleistung.",
  },
];

const faqs = [
  {
    q: "Was bekomme ich konkret für 800€?",
    a: "Eine vollständige, professionelle Landingpage: modernes Design, mobil-optimiert, mit Kontaktformular & WhatsApp-Button, Impressum, Datenschutz und SEO-Grundlagen — komplett launchbereit.",
  },
  {
    q: "Wo ist der Unterschied zu den teureren Paketen?",
    a: "Das Starter Paket ist eine starke einzelne Seite. Wenn du mehrere Unterseiten, einen Blog, einen Shop oder spezielle Funktionen brauchst, sprechen wir über ein größeres Paket — immer als Fixpreis.",
  },
  {
    q: "Was muss ich selbst vorbereiten?",
    a: "Wenig. Wenn du Logo, ein paar Infos zum Business und eigene Fotos hast — super. Falls nicht, übernehmen wir Bildauswahl/KI-Bilder, Texte und Konzept komplett.",
  },
  {
    q: "Kann ich später erweitern?",
    a: "Ja. Das Starter Paket ist so aufgebaut, dass weitere Seiten, Funktionen oder ein Relaunch jederzeit angedockt werden können — ohne von vorn anzufangen.",
  },
];

const Starter = () => (
  <main>
    {/* 1. Hero */}
    <section className="relative section-padding pt-28 sm:pt-36">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-label bg-primary/10 text-primary mb-6 sm:mb-8">
              <Zap size={12} className="inline mr-1" /> Starter Paket ab 800 €
            </span>
            <h1 className="mb-6 text-balance">
              Keine Website? Veraltete Website?{" "}
              <span className="gradient-text">Beides lösbar — in 2 Wochen.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Wir bauen dir eine moderne, professionelle Website, die Besucher
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
                  Kostenloses Erstgespräch buchen <ArrowRight size={18} />
                </a>
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 h-auto min-h-12 w-full sm:w-auto whitespace-normal text-center leading-tight"
                onClick={scrollTo("paket")}
              >
                Was ist enthalten? <ArrowDown size={18} />
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
            <h2 className="mb-4 text-balance">Wo stehst du gerade?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beide Wege führen zu einer Website, die für dich arbeitet.
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
                    {c.cta} <ArrowRight size={18} />
                  </button>
                </CardContent>
              </Card>
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
              <span className="gradient-text">alles drin, nichts versteckt</span>
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
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-sm sm:text-base text-primary-foreground/80">
                      ab
                    </span>
                    <span className="text-5xl sm:text-6xl font-heading font-bold">
                      800 €
                    </span>
                  </div>
                  <p className="text-sm text-primary-foreground/80">
                    Fixpreis · inkl. MwSt.
                  </p>
                </div>
              </div>
              <CardContent className="p-6 sm:p-10">
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-8">
                  {[...includedLeft, ...includedRight].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={14} />
                      </div>
                      <span className="text-foreground/90 text-sm sm:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-6">
                    Brauchst du mehr Seiten, einen Shop oder spezielle Funktionen?{" "}
                    <strong className="text-foreground">
                      Wir erstellen dir ein individuelles Angebot.
                    </strong>
                  </p>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 h-auto min-h-12 animate-cta-pulse whitespace-normal text-center leading-tight"
                    asChild
                  >
                    <a href={TERMIN_LINK}>
                      Kostenloses Erstgespräch buchen <ArrowRight size={18} />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* 4. Portfolio */}
    <IndexPortfolio />

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

    {/* 6. Pullquote */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center py-8 sm:py-16">
            <Quote size={48} className="text-primary/30 mx-auto mb-8" />
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
          <div className="gradient-hero-bg rounded-2xl sm:rounded-3xl p-8 sm:p-14 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-primary-foreground mb-4 text-balance">
                Starte jetzt — ohne Risiko.
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                Kostenloses Erstgespräch, Konzept in 48h, du entscheidest danach
                frei.
              </p>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-elevated animate-cta-pulse text-sm sm:text-base px-6 sm:px-8 h-auto min-h-12 py-3 whitespace-normal text-center leading-tight"
                asChild
              >
                <a href={TERMIN_LINK}>
                  Jetzt Termin buchen <ArrowRight size={18} />
                </a>
              </Button>
              <div className="mt-8 flex flex-col items-center gap-2">
                <a
                  href="tel:+4961313076500"
                  className="inline-flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 font-semibold text-base sm:text-lg transition-colors"
                >
                  <Phone size={18} /> 06131 / 30 765 00
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
