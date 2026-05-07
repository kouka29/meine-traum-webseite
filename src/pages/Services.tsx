import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { Monitor, TrendingUp, Palette, Search, Settings, ArrowRight, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const services = [
  {
    icon: Monitor,
    title: "Conversion-Webdesign",
    desc: "Keine gewöhnliche Website – sondern ein Verkaufsinstrument. Wir gestalten jede Seite so, dass Besucher zu Kunden werden.",
    features: ["Verkaufspsychologischer Aufbau", "Mobile First", "Unter 3 Sek. Ladezeit", "CMS für einfache Pflege"],
    result: "Ø 3x mehr Anfragen nach Relaunch",
    link: "/webdesign-agentur",
  },
  {
    icon: TrendingUp,
    title: "Conversion-Optimierung",
    desc: "Ihre Website hat Besucher, aber keine Anfragen? Wir analysieren, optimieren und machen aus Besuchern zahlende Kunden.",
    features: ["Conversion-Analyse", "Optimierte Landingpages", "A/B Testing", "Tracking & Analytics"],
    result: "Bis zu 400% mehr Conversions",
    link: "/conversion-optimierung",
  },
  {
    icon: Palette,
    title: "UX/UI Design",
    desc: "Design, das nicht nur gut aussieht – sondern verkauft. Jedes Element hat einen Zweck: Vertrauen schaffen und zum Handeln motivieren.",
    features: ["Nutzerforschung", "Wireframing & Prototyping", "Visuelles Storytelling", "Usability Testing"],
    result: "Nachweisbar höhere Verweildauer",
    link: "/leistungen",
  },
  {
    icon: Search,
    title: "SEO-Grundlagen",
    desc: "Gefunden werden, wenn Kunden suchen. Wir sorgen dafür, dass Ihre Website bei Google sichtbar wird – von Anfang an.",
    features: ["On-Page Optimierung", "Technisches SEO", "Lokale Sichtbarkeit", "Google-konforme Struktur"],
    result: "Top-Platzierungen bei relevanten Suchbegriffen",
    link: "/leistungen",
  },
  {
    icon: Settings,
    title: "Individuelle Lösungen",
    desc: "Buchungssysteme, Anbindungen, Automatisierungen – wir setzen um, was Ihr Business braucht. Maßgeschneidert und zukunftssicher.",
    features: ["API-Integrationen", "Buchungssysteme", "Automatisierungen", "Individuelle Beratung"],
    result: "Zeitersparnis durch Automatisierung",
    link: "/kontakt",
  },
];

const faqs = [
  { q: "Welche Leistungen bietet eure Webdesign Agentur?", a: "Wir bieten Conversion-Webdesign, UX/UI Design, SEO-Optimierung, Landingpage-Erstellung, Website Relaunch und Conversion-Optimierung – alles aus einer Hand." },
  { q: "Kann ich einzelne Leistungen buchen?", a: "Ja! Sie können jede Leistung einzeln buchen oder als Komplettpaket. Wir beraten Sie gerne, welche Kombination für Ihre Ziele am sinnvollsten ist." },
  { q: "Erstellt ihr auch Landingpages?", a: "Ja, wir erstellen hochkonvertierende Landingpages für Google Ads, Social Media Kampagnen und Lead-Generierung. Mehr dazu auf unserer Landingpage-Seite." },
];

const Services = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">
              Unsere Leistungen
            </span>
            <h1 className="mb-5 text-balance">
              Webdesign, Conversion & SEO –{" "}
              <span className="gradient-text">alles für Ihren Online-Erfolg</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Wir erstellen keine Standard-Websites, sondern Verkaufsinstrumente, die sich bezahlt machen –
              für Handwerker, Coaches, Berater und kleine Unternehmen.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-6">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.08}>
              <Link to={s.link} className="flex flex-col md:flex-row gap-7 p-8 md:p-10 rounded-2xl border border-border hover:border-primary/20 hover:shadow-elevated transition-all duration-300 bg-background block">
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <s.icon size={26} className="text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h2 className="font-heading text-xl font-bold">{s.title}</h2>
                    <span className="badge-label bg-primary/10 text-primary text-[11px] w-fit">
                      {s.result}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                  <div className="flex flex-wrap gap-4">
                    {s.features.map((f) => (
                      <span key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle size={14} className="text-primary" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="gradient" size="lg" asChild>
            <Link to="/kontakt">
              Kostenlose Vorschau anfordern <ArrowRight size={18} />
            </Link>
          </Button>
        </div>

        <AnimatedSection>
          <div className="mt-20">
            <h2 className="text-center mb-10 text-balance">Häufige Fragen zu unseren Leistungen</h2>
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
          </div>
        </AnimatedSection>
      </div>
    </section>

    <FreePreviewCTA />
  </main>
);

export default Services;
