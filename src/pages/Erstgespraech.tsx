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
  Target,
  BarChart3,
  Zap,
  Quote,
  Phone,
  Check,
} from "lucide-react";

const TERMIN_LINK = "#termin-buchen";

const cards = [
  {
    icon: Sparkles,
    badge: "Ich brauche eine neue Website",
    title: "Null zu Online — mit System",
    text: "Keine Website ist kein Problem. Wir bauen dir eine, die vom ersten Tag an Besucher in Anfragen verwandelt. Kein Baukastensystem. Keine Templates. Strategie first.",
    bullets: [
      "Konzept + Struktur inklusive",
      "Fertig in 2–4 Wochen",
      "Erstes Konzept in 48h kostenlos",
    ],
  },
  {
    icon: TrendingUp,
    badge: "Meine Website bringt keine Anfragen",
    title: "Relaunch mit messbarem Ergebnis",
    text: "Schickes Design reicht nicht. Wir analysieren was fehlt und bauen deine Website so um, dass Besucher zu Kunden werden. Unsere Kunden berichten von 2–5x mehr Anfragen.",
    bullets: [
      "Website-Analyse inklusive",
      "Keine Arbeit für dich — wir übernehmen alles",
      "Ergebnisse messbar ab Tag 1",
    ],
  },
];

const trust = [
  {
    icon: Target,
    title: "Strategie vor Design",
    text: "Wir fragen zuerst: Wer soll anfragen? Erst dann bauen wir.",
  },
  {
    icon: BarChart3,
    title: "Ergebnisse, keine Versprechen",
    text: "150+ Projekte. 98% Weiterempfehlungsrate. Zahlen statt Floskeln.",
  },
  {
    icon: Zap,
    title: "48h Konzept — kostenlos",
    text: "Du siehst, wie deine Website aussehen könnte, bevor du einen Euro ausgibst.",
  },
];

const faqs = [
  {
    q: "Was kostet das ungefähr?",
    a: "Landingpage ab 1.500€, Corporate Website ab 2.500€. Im Erstgespräch konkrete Einschätzung — ohne Überraschungen.",
  },
  {
    q: "Wie lange dauert die Umsetzung?",
    a: "2–4 Wochen von Konzept bis Launch. Erstes Konzept in 48h kostenlos.",
  },
  {
    q: "Was muss ich selbst vorbereiten?",
    a: "Wenig. Logo, Infos zum Business, Wunschfotos — wir führen dich durch alles.",
  },
];

const scrollToWeiter = () => {
  document.getElementById("weiter")?.scrollIntoView({ behavior: "smooth" });
};

const Erstgespraech = () => (
  <main>
    {/* 1. Hero */}
    <section className="relative section-padding pt-28 sm:pt-36">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-label bg-primary/10 text-primary mb-6 sm:mb-8">
              Persönliches Erstgespräch
            </span>
            <h1 className="mb-6 text-balance">
              Du hast dich gemeldet. Gut.{" "}
              <span className="gradient-text">
                Lass uns schauen, ob wir zusammenpassen.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Egal ob du noch gar keine Website hast oder deine bestehende endlich
              Anfragen bringen soll — in 15 Minuten wissen wir, was dein nächster
              Schritt ist.
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
                onClick={scrollToWeiter}
              >
                Erst mehr erfahren <ArrowDown size={18} />
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* 2. Zwei-Wege-Section */}
    <section id="weiter" className="section-padding bg-card/50 border-y border-border/50 scroll-mt-24">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">
              Zwei Ausgangssituationen — ein Ziel:{" "}
              <span className="gradient-text">mehr Anfragen.</span>
            </h2>
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
                  <ul className="space-y-3 border-t border-border pt-5">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <Check size={18} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/90 text-sm sm:text-base">
                          {b}
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

    {/* 3. Vertrauens-Section */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">
              Was uns von anderen Agenturen unterscheidet
            </h2>
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

    {/* 4. Mini-Portfolio */}
    <IndexPortfolio />

    {/* 5. Pullquote */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center py-8 sm:py-16">
            <Quote size={48} className="text-primary/30 mx-auto mb-8" />
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium leading-relaxed text-foreground mb-10 text-balance">
              „Meine alte Website sah zwar ganz ansprechend aus, brachte jedoch
              kaum Anfragen. Mit der neuen, deutlich hochwertigeren Website
              erhalte ich nun regelmäßig Anfragen."
            </blockquote>
            <div className="flex flex-col items-center gap-3">
              <span className="badge-label bg-primary/10 text-primary">
                5x mehr Anfragen
              </span>
              <p className="font-semibold text-base sm:text-lg">Bayram Y.</p>
              <p className="text-sm text-muted-foreground">Neckar Palettenhandel</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* 6. FAQ */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Häufige Fragen vor dem Gespräch</h2>
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

    {/* 7. Abschluss-CTA */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl sm:rounded-3xl p-8 sm:p-14 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-primary-foreground mb-4 text-balance">
                15 Minuten. Kein Verkaufsgespräch.
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                Wir schauen gemeinsam auf deine Situation und zeigen dir konkret,
                was möglich ist. Danach entscheidest du in Ruhe.
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
                  Mo–Fr 9–18 Uhr · Auch per WhatsApp erreichbar
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </main>
);

export default Erstgespraech;
