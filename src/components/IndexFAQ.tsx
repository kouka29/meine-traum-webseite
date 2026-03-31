import AnimatedSection from "./AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Was kostet es, eine Website erstellen zu lassen?",
    a: "Die Kosten hängen vom Umfang ab. Unsere Webdesign-Projekte starten ab 1.500 € für eine conversion-optimierte Website. Wir bieten transparente Preise ohne versteckte Kosten. Fordern Sie ein unverbindliches Angebot an.",
  },
  {
    q: "Wie lange dauert es, eine professionelle Website zu erstellen?",
    a: "Eine typische Website ist in 2–4 Wochen fertig. Innerhalb von 48 Stunden erhalten Sie bereits eine kostenlose Vorschau, damit Sie sehen, wie Ihre neue Website aussehen könnte.",
  },
  {
    q: "Was unterscheidet eure Webdesign Agentur von anderen?",
    a: "Wir erstellen keine digitalen Visitenkarten, sondern Verkaufsinstrumente. Jede Website wird conversion-optimiert gestaltet – mit verkaufspsychologischem Aufbau, schnellen Ladezeiten und messbaren Ergebnissen.",
  },
  {
    q: "Ist die kostenlose Website-Vorschau wirklich kostenlos?",
    a: "Ja, 100% kostenlos und unverbindlich. Wir erstellen Ihnen eine individuelle Vorschau Ihrer neuen Website – ohne Verpflichtung und ohne versteckte Kosten.",
  },
  {
    q: "Für wen eignet sich euer Webdesign?",
    a: "Unser Webdesign richtet sich an Selbstständige, Handwerker, Coaches, Berater und kleine bis mittlere Unternehmen (KMUs), die über ihre Website planbar Kunden gewinnen möchten.",
  },
  {
    q: "Bietet ihr auch einen Website Relaunch an?",
    a: "Ja, wir sind spezialisiert auf Website Relaunches. Wir analysieren Ihre bestehende Seite, identifizieren Optimierungspotenziale und erstellen eine moderne, conversion-optimierte Neuauflage.",
  },
];

const IndexFAQ = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="mb-5 text-balance">Häufig gestellte Fragen zum Webdesign</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Antworten auf die wichtigsten Fragen rund um Website erstellen lassen, Kosten und unseren Prozess.
          </p>
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-card transition-all">
                <AccordionTrigger className="text-left font-heading font-semibold text-base hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default IndexFAQ;
