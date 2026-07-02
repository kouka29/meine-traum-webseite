import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, Check, TrendingUp, BarChart3, MousePointer, Target } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const services = [
  { icon: BarChart3, title: "Conversion-Analyse", desc: "Wir analysieren deine Website mit bewährten Methoden und identifizieren, wo Besucher abspringen und warum." },
  { icon: MousePointer, title: "Optimierte Landingpages", desc: "Wir optimieren deine wichtigsten Seiten mit verkaufspsychologischen Elementen für maximale Conversion-Raten." },
  { icon: Target, title: "A/B Testing", desc: "Wir testen verschiedene Varianten und implementieren datengetrieben die beste Lösung." },
  { icon: TrendingUp, title: "Laufende Optimierung", desc: "Conversion-Optimierung ist kein einmaliges Projekt – wir optimieren kontinuierlich für wachsende Ergebnisse." },
];

const faqs = [
  { q: "Was ist Conversion-Optimierung?", a: "Conversion-Optimierung (CRO) bedeutet, deine bestehende Website so zu verbessern, dass mehr Besucher zu Kunden werden – durch bessere Texte, Layouts, Call-to-Actions und User Experience." },
  { q: "Lohnt sich Conversion-Optimierung für kleine Unternehmen?", a: "Absolut! Gerade bei kleinen Budgets ist es entscheidend, das Maximum aus jedem Besucher herauszuholen. Unsere Kunden berichten von bis zu 400% mehr Conversions." },
  { q: "Wie schnell sehe ich Ergebnisse?", a: "Erste Verbesserungen sind oft schon nach 2–4 Wochen messbar. Langfristige Optimierung liefert kontinuierlich steigende Ergebnisse." },
];

const ConversionOptimierung = () => (
  <main id="main-content" className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Conversion Optimierung</span>
            <h1 className="mb-5 text-balance">
              Conversion Optimierung –{" "}
              <span className="gradient-text">mehr Kunden aus deinen bestehenden Besuchern</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              deine Website hat Besucher, aber keine Anfragen? Als Conversion Optimierung Agentur verwandeln wir
              deine bestehenden Besucher in zahlende Kunden – datengetrieben und messbar.
            </p>
            <Button variant="gradient" size="lg" className="mt-10 animate-cta-pulse" asChild>
              <Link to="/kontakt">Website optimieren lassen <ArrowRight size={20} aria-hidden={true} focusable={false} /></Link>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-12 text-balance">Unsere Conversion-Optimierung im Detail</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.1}>
              <div className="flex gap-5 p-7 rounded-2xl border border-border hover:border-primary/20 transition-all bg-background hover:shadow-card">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-1.5">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl p-12 md:p-16 text-primary-foreground text-center mb-20">
            <h2 className="text-primary-foreground mb-5">Ergebnisse unserer Conversion-Optimierung</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[
                { value: "+400%", label: "Mehr Conversions" },
                { value: "3x", label: "Mehr Anfragen" },
                { value: "150+", label: "Optimierte Projekte" },
              ].map((s) => (
                <div key={s.label}>
                  <span className="font-heading text-5xl font-bold text-primary-foreground">{s.value}</span>
                  <p className="text-sm text-primary-foreground/70 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen zur Conversion-Optimierung</h2>
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

export default ConversionOptimierung;
