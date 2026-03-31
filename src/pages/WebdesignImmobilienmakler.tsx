import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, CheckCircle, Home, Search, Camera, Smartphone, TrendingUp, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const painPoints = [
  "Verkäufer und Käufer finden Sie nicht über Google, sondern gehen zur Konkurrenz",
  "Ihre Website präsentiert Ihre Objekte nicht ansprechend genug",
  "Sie haben keine automatisierte Wertermittlung oder Lead-Generierung auf Ihrer Seite",
  "Ihre Online-Präsenz vermittelt nicht das Vertrauen, das Eigentümer erwarten",
];

const features = [
  { icon: Home, title: "Immobilien-Design", desc: "Hochwertige Objektpräsentation mit großen Bildern, virtuellen Rundgängen und übersichtlicher Darstellung Ihrer Angebote." },
  { icon: Search, title: "SEO für Immobilienmakler", desc: "Gefunden werden bei "Immobilienmakler [Stadt]", "Haus verkaufen" und lokalen Suchanfragen." },
  { icon: Camera, title: "Objekt-Präsentation", desc: "Ihre Immobilien werden professionell in Szene gesetzt – mit Bildergalerien und strukturierten Exposés." },
  { icon: MapPin, title: "Regionale Sichtbarkeit", desc: "Lokale SEO-Optimierung sorgt dafür, dass Eigentümer und Käufer aus Ihrer Region Sie finden." },
  { icon: Smartphone, title: "Mobile Optimierung", desc: "Immobiliensuche findet unterwegs statt – Ihre Website funktioniert perfekt auf jedem Gerät." },
  { icon: TrendingUp, title: "Lead-Generierung", desc: "Wertermittlungs-Formulare und Kontaktmöglichkeiten, die Eigentümer-Leads generieren." },
];

const faqs = [
  { q: "Warum braucht ein Immobilienmakler eine professionelle Website?", a: "Vertrauen ist im Immobiliengeschäft alles. Eine professionelle Website zeigt Kompetenz, präsentiert Ihre Objekte hochwertig und generiert kontinuierlich neue Eigentümer- und Käufer-Leads." },
  { q: "Was kostet eine Makler-Website?", a: "Unsere Websites für Immobilienmakler starten ab 1.500 €. Je nach Funktionsumfang (Objektlisten, Wertermittlung, etc.) variiert der Preis. Kostenlose Vorschau in 48h." },
  { q: "Kann ich Immobilien selbst auf der Website einpflegen?", a: "Ja, wir richten eine einfache Verwaltung ein, mit der Sie Objekte, Bilder und Beschreibungen selbst aktualisieren können." },
  { q: "Bietet ihr auch Landingpages für Wertermittlung an?", a: "Ja! Spezielle Landingpages für kostenlose Wertermittlung sind einer der besten Wege, um Eigentümer-Leads zu generieren. Wir erstellen diese gerne für Sie." },
];

const WebdesignImmobilienmakler = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign für Immobilienmakler</span>
            <h1 className="mb-5 text-balance">
              Webdesign für Immobilienmakler –{" "}
              <span className="gradient-text">Mehr Eigentümer-Leads durch eine starke Website</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Als Immobilienmakler brauchen Sie eine Website, die Vertrauen schafft, Ihre Objekte hochwertig präsentiert
              und kontinuierlich neue Leads generiert. Genau das liefern wir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Website-Vorschau für Makler <ArrowRight size={18} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Website-Check für Makler</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-center mb-10 text-balance">Kennen Sie diese Herausforderungen?</h2>
            <div className="space-y-4">
              {painPoints.map((p) => (
                <div key={p} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-background">
                  <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                  </span>
                  <p className="text-sm">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-16 text-balance">So machen wir Sie zum Makler Nr. 1 in Ihrer Region</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.08}>
              <div className="p-7 rounded-2xl border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 bg-background h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="gradient-hero-bg rounded-3xl p-12 md:p-16 text-primary-foreground mb-20">
            <h2 className="text-primary-foreground mb-5 text-balance text-center">Ergebnisse für Immobilienmakler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {[
                { value: "+380%", label: "Mehr Eigentümer-Leads" },
                { value: "Seite 1", label: "Google-Rankings lokal" },
                { value: "24/7", label: "Automatische Lead-Generierung" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="font-heading text-4xl font-bold text-primary-foreground">{s.value}</span>
                  <p className="text-sm text-primary-foreground/70 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20">
            <h2 className="text-center mb-5 text-balance">Leistungen für Immobilienmakler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
              {[
                { label: "Website erstellen lassen", to: "/website-erstellen-lassen" },
                { label: "Landingpage für Wertermittlung", to: "/landingpage-erstellen-lassen" },
                { label: "Conversion-Optimierung", to: "/conversion-optimierung" },
                { label: "Website Relaunch", to: "/website-relaunch" },
                { label: "Kostenloser Website-Check", to: "/kostenloser-website-check" },
                { label: "Webdesign Preise", to: "/webdesign-preise" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-card transition-all">
                  <CheckCircle size={17} className="text-primary shrink-0" />
                  <span className="text-sm font-medium">{l.label}</span>
                  <ArrowRight size={14} className="text-muted-foreground ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen: Webdesign für Immobilienmakler</h2>
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
    <CTABanner />
  </main>
);

export default WebdesignImmobilienmakler;
