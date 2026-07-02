import AnimatedSection from "./AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Was kostet eine conversion-optimierte Website?",
    a: "Unsere Projekte starten ab 990 €. Der genaue Preis hängt vom Umfang ab – aber Du siehst vorher im kostenlosen Konzept genau, was Du bekommst. Keine Überraschungen.",
  },
  {
    q: "Wie schnell kann meine neue Website live gehen?",
    a: "Die meisten Projekte sind in 2–4 Wochen fertig. Das erste Konzept mit Struktur und Textideen erhältst Du bereits innerhalb von 48 Stunden – kostenlos und unverbindlich.",
  },
  {
    q: "Was ist der Unterschied zu einer normalen Webdesign-Agentur?",
    a: "Die meisten Agenturen bauen Webseiten, die gut aussehen. Wir bauen Webseiten, die Anfragen generieren. Jedes Element – vom ersten Satz bis zum letzten Button – ist darauf ausgelegt, Besucher in Kunden zu verwandeln.",
  },
  {
    q: "Ist das kostenlose Konzept wirklich ohne Haken?",
    a: "Ja. Du erhältst ein individuelles Konzept für Deine Website – Struktur, Textideen, Empfehlungen. Wenn es Dir gefällt, können wir loslegen. Wenn nicht, behalten Du die Ideen trotzdem. Kein Druck.",
  },
  {
    q: "Für wen funktioniert das am besten?",
    a: "Für Selbstständige und Unternehmen, die über ihre Website Kunden gewinnen wollen – nicht nur eine Visitenkarte im Netz brauchen. Besonders gut funktioniert unser Ansatz für Dienstleister, Handwerker, Berater und Coaches.",
  },
  {
    q: "Kann ich meine bestehende Website überarbeiten lassen?",
    a: "Absolut. Viele unserer Kunden kommen mit einer bestehenden Website, die nicht performt. Wir analysieren sie, zeigen Dir die Schwachstellen und erstellen ein Relaunch-Konzept – auf Wunsch komplett kostenlos.",
  },
];

const IndexFAQ = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="mb-5 text-balance">Häufige Fragen – ehrlich beantwortet</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Kein Fachchinesisch. Klare Antworten auf die Fragen, die uns am häufigsten gestellt werden.
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
