import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, Check, Monitor, Palette, TrendingUp, Zap, Search, Smartphone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const features = [
  { icon: Monitor, title: "Conversion-optimiertes Webdesign", desc: "Jede Seite wird strategisch aufgebaut, um Besucher zu Kunden zu machen – mit verkaufspsychologischen Elementen." },
  { icon: Palette, title: "Individuelles Design", desc: "Kein Template-Design. Deine Website wird maßgeschneidert für Deine Marke, Deine Branche und Deine Zielgruppe." },
  { icon: Zap, title: "Blitzschnelle Performance", desc: "Ladezeiten unter 3 Sekunden – für bessere Rankings und weniger Absprünge." },
  { icon: Smartphone, title: "Mobile First", desc: "Über 60% Deiner Besucher kommen vom Smartphone. Unsere Websites sehen auf jedem Gerät perfekt aus." },
  { icon: Search, title: "SEO-Grundlagen inklusive", desc: "On-Page SEO, Meta-Tags, strukturierte Daten – damit Google Deine Website findet und rankt." },
  { icon: TrendingUp, title: "Messbare Ergebnisse", desc: "Analytics & Tracking von Anfang an – damit Du siehst, wie Deine Website performt." },
];

const faqs = [
  { q: "Was macht eine gute Webdesign Agentur aus?", a: "Eine gute Webdesign Agentur erstellt nicht nur schöne Websites, sondern Verkaufsinstrumente. Bei Meine Traum Webseite kombinieren wir verkaufspsychologisches Design mit modernster Technik für messbare Ergebnisse." },
   { q: "Wie viel kostet professionelles Webdesign?", a: "Unsere Webdesign-Projekte starten ab 990 €. Der genaue Preis hängt vom Umfang deines Projekts ab. Wir bieten transparente Preise und eine kostenlose Erstberatung." },
  { q: "Wie lange dauert die Erstellung einer Website?", a: "In der Regel 2–4 Wochen. Eine kostenlose Vorschau erhältst Du bereits innerhalb von 48 Stunden nach dem Erstgespräch." },
  { q: "Bietet ihr auch Webdesign für kleine Unternehmen an?", a: "Ja! Wir sind spezialisiert auf Webdesign für kleine Unternehmen, Selbstständige, Handwerker und KMUs im DACH-Raum." },
];

const WebdesignAgentur = () => (
  <main id="main-content" className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign Agentur</span>
            <h1 className="mb-5 text-balance">
              Webdesign Agentur für{" "}
              <span className="gradient-text">moderne Websites, die Kunden gewinnen</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Du suchst eine Webdesign Agentur, die mehr liefert als nur ein hübsches Design? Wir erstellen Websites,
              die als Verkaufsinstrument funktionieren – conversion-optimiert, schnell und mobilfreundlich.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Website-Vorschau sichern <ArrowRight size={20} aria-hidden={true} focusable={false} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/webdesign-preise">Webdesign Preise ansehen</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-16 text-balance">Warum unsere Webdesign Agentur anders ist</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.08}>
              <div className="p-7 rounded-2xl border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 bg-background h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl p-12 md:p-16 text-primary-foreground mb-20">
            <h2 className="text-primary-foreground mb-5 text-balance text-center">Unser Webdesign-Prozess</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
              {[
                { step: "1", title: "Analyse", desc: "Wir analysieren Deine Branche, Zielgruppe und Konkurrenz." },
                { step: "2", title: "Konzept & Design", desc: "Strategischer Aufbau mit verkaufspsychologischen Elementen." },
                { step: "3", title: "Entwicklung", desc: "Umsetzung mit modernster Technik – schnell, responsiv, SEO-optimiert." },
                { step: "4", title: "Launch & Optimierung", desc: "Go-Live mit Tracking und laufender Conversion-Optimierung." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <span className="font-heading text-4xl font-bold text-primary-foreground/30">{s.step}</span>
                  <h3 className="font-heading text-lg font-semibold text-primary-foreground mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20">
            <h2 className="text-center mb-5 text-balance">Webdesign für kleine Unternehmen und KMUs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-center text-lg mb-10">
              Du bist Handwerker, Coach, Berater oder führen ein lokales Unternehmen? Eine moderne Website, die Kunden gewinnt, muss kein Vermögen kosten. Wir erstellen professionelle Webseiten speziell für kleine Unternehmen.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
               {["Professioneller Online-Auftritt ab 990 €", "Kostenlose Vorschau in 48 Stunden", "Keine laufenden Agenturkosten", "Persönlicher Ansprechpartner", "SEO-Grundlagen inklusive", "Mobile-optimiert"].map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <Check size={17} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                  <span className="text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen zu unserer Webdesign Agentur</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-card transition-all">
                  <AccordionTrigger className="text-left font-heading font-semibold text-base hover:no-underline py-5">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <FreePreviewCTA />
  </main>
);

export default WebdesignAgentur;
