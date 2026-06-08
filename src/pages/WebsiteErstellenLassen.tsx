import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, CheckCircle, Clock, Shield, Gift } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  { step: "1", title: "Kostenloses Erstgespräch", desc: "Wir besprechen deine Ziele, Zielgruppe und Anforderungen – telefonisch oder per Video." },
  { step: "2", title: "Kostenlose Vorschau in 48 h", desc: "Du erhältst eine individuelle Vorschau deiner neuen Website – komplett unverbindlich." },
  { step: "3", title: "Professionelle Umsetzung", desc: "Nach deiner Freigabe setzen wir das Projekt in 2–4 Wochen um – mit laufendem Feedback." },
  { step: "4", title: "Launch & Support", desc: "Go-Live, Einweisung und optionaler Support – damit deine Website langfristig performt." },
];

const benefits = [
  "Conversion-optimiertes Design, das Kunden gewinnt",
  "Blitzschnelle Ladezeiten unter 3 Sekunden",
  "100% responsive – perfekt auf Handy, Tablet & Desktop",
  "SEO-Grundlagen für bessere Google-Sichtbarkeit",
  "Individuelle Gestaltung – kein Template-Design",
  "Persönlicher Ansprechpartner während des Projekts",
];

const faqs = [
  { q: "Was kostet es, eine Website erstellen zu lassen?", a: "Die Kosten für eine professionelle Website starten ab 990 €. Der Preis hängt vom Umfang ab – Landingpage, Unternehmensseite oder E-Commerce. Wir erstellen dir ein individuelles Angebot nach dem Erstgespräch." },
  { q: "Wie lange dauert es, eine Homepage erstellen zu lassen?", a: "Eine typische Website ist in 2–4 Wochen fertig. Einfache Landingpages können schneller umgesetzt werden. Du erhältst bereits nach 48 Stunden eine kostenlose Vorschau." },
  { q: "Kann ich meine Website selbst pflegen?", a: "Ja! Wir integrieren ein einfach bedienbares CMS, mit dem du Texte, Bilder und Inhalte selbst aktualisieren können – ohne technische Kenntnisse." },
  { q: "Website erstellen lassen oder selbst machen?", a: "Eine professionell erstellte Website spart dir Zeit und liefert bessere Ergebnisse. Unsere Kunden berichten von durchschnittlich 3x mehr Anfragen nach dem Relaunch. Selbstgebaute Websites erreichen selten diese Conversion-Raten." },
  { q: "Ist die Website auch für Suchmaschinen optimiert?", a: "Ja, SEO-Grundlagen sind bei uns immer inklusive: sauberer Code, Meta-Tags, strukturierte Daten, schnelle Ladezeiten und mobile Optimierung." },
];

const WebsiteErstellenLassen = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Website erstellen lassen</span>
            <h1 className="mb-5 text-balance">
              Professionelle Website erstellen lassen –{" "}
              <span className="gradient-text">die aktiv Kunden gewinnt</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Du möchtest eine moderne Website für dein Unternehmen erstellen lassen? Wir gestalten conversion-optimierte
              Webseiten, die nicht nur gut aussehen, sondern messbar mehr Anfragen und Umsatz generieren.
            </p>
            <div className="flex flex-wrap justify-center gap-5 mt-8">
              {[
                { icon: Gift, text: "Kostenlose Vorschau" },
                { icon: Shield, text: "Unverbindlich" },
                { icon: Clock, text: "In 48 h fertig" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <b.icon size={16} className="text-primary" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Vorschau sichern <ArrowRight size={18} /></Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-5 text-balance">Was Du bekommst, wenn du deine Website bei uns erstellen lassen</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg mb-12">
            Jede Website, die wir erstellen, ist ein strategisches Verkaufsinstrument – kein Template von der Stange.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-20">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle size={17} className="text-primary shrink-0" />
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-12 text-balance">So funktioniert es – Website erstellen in 4 Schritten</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {steps.map((s) => (
              <div key={s.step} className="text-center p-6 rounded-2xl border border-border hover:border-primary/20 transition-all">
                <span className="font-heading text-4xl font-bold gradient-text">{s.step}</span>
                <h3 className="font-heading text-lg font-semibold mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen – Website erstellen lassen</h2>
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

export default WebsiteErstellenLassen;
