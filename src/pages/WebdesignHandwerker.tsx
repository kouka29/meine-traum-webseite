import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, Check, Hammer, Search, Smartphone, Star, TrendingUp, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const painPoints = [
  "Du verlierst Aufträge an modernere Handwerksbetriebe mit besserer Online-Präsenz",
  "Deine aktuelle Website ist veraltet und macht keinen professionellen Eindruck",
  "Potenzielle Kunden findest du bei Google nicht – aber deine Konkurrenz schon",
  "Deine Website sieht auf dem Smartphone schlecht aus, obwohl die meisten dort suchen",
];

const features = [
  { icon: Hammer, title: "Design für Handwerker", desc: "Deine Website zeigt sofort, wer Du bist und was Du kannst – vertrauenswürdig, professionell und einladend." },
  { icon: Search, title: "Lokales SEO", desc: "Wir sorgen dafür, dass du bei Google Maps und lokalen Suchanfragen ganz oben erscheinen." },
  { icon: Star, title: "Bewertungen einbinden", desc: "Zeigst du deine besten Google-Bewertungen direkt auf der Website – für sofortiges Vertrauen." },
  { icon: Smartphone, title: "Mobilfreundlich", desc: "Perfekte Darstellung auf Smartphone und Tablet – da, wo deine Kunden nach Handwerkern suchen." },
  { icon: Users, title: "Einfache Kontaktaufnahme", desc: "Click-to-Call, Kontaktformular und WhatsApp-Button – Kunden erreichen du mit einem Klick." },
  { icon: TrendingUp, title: "Messbar mehr Aufträge", desc: "Tracking und Analytics zeigen dir genau, wie viele Anfragen über deine Website reinkommen." },
];

const faqs = [
  { q: "Brauche ich als Handwerker wirklich eine professionelle Website?", a: "Ja! Über 85% der Kunden suchen online nach Handwerkern. Ohne professionelle Website verlierst du täglich Aufträge an die Konkurrenz, die online besser aufgestellt ist." },
  { q: "Was kostet eine Handwerker-Website?", a: "Unsere Handwerker-Websites starten ab 990 €. Dafür erhältst du ein professionelles, conversion-optimiertes Design mit SEO-Grundlagen. Eine kostenlose Vorschau gibt es in 48 h." },
  { q: "Wie lange dauert es, bis meine Website online ist?", a: "In der Regel 2–4 Wochen. Eine erste Vorschau deiner neuen Website erhältst du bereits innerhalb von 48 Stunden." },
  { q: "Kann ich die Website selbst bearbeiten?", a: "Ja, wir richten ein einfaches System ein, mit dem du Texte, Bilder und Öffnungszeiten selbst aktualisieren können – ohne technische Vorkenntnisse." },
];

const WebdesignHandwerker = () => (
 <main id="main-content" className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign für Handwerker</span>
            <h1 className="mb-5 text-balance">
              Webdesign für Handwerker –{" "}
              <span className="gradient-text">Die Website, die Aufträge bringt</span>
            </h1>
            <p className="text-muted-foreground text-lg">
 Du bist Handwerker und deine Website bringt keine Anfragen? Wir erstellen professionelle Websites
 speziell für Handwerksbetriebe – damit du online gefunden werden und mehr Kunden gewinnen.
 </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Website-Vorschau für Handwerker <ArrowRight size={20} aria-hidden={true} focusable={false} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Kostenlose Website-Analyse</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-center mb-10 text-balance">Diese Probleme kennen viele Handwerker</h2>
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
          <h2 className="text-center mb-16 text-balance">So bringen wir deinen Handwerksbetrieb online nach vorne</h2>
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
            <h2 className="text-primary-foreground mb-5 text-balance text-center">Ergebnisse, die Handwerker begeistern</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {[
                { value: "+450%", label: "Mehr Online-Anfragen" },
                { value: "48 h", label: "Bis zur Vorschau" },
                { value: "Seite 1", label: "Bei Google lokal" },
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
            <h2 className="text-center mb-5 text-balance">Passende Leistungen für Handwerker</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-center text-lg mb-10">
 Ob neue Website, Relaunch oder Conversion-Optimierung – wir haben die passende Lösung für deinen Handwerksbetrieb.
 </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                { label: "Website erstellen lassen", to: "/website-erstellen-lassen" },
                { label: "Website Relaunch", to: "/website-relaunch" },
                { label: "Landingpage erstellen", to: "/landingpage-erstellen-lassen" },
                { label: "Conversion-Optimierung", to: "/conversion-optimierung" },
                { label: "Kostenloser Website-Check", to: "/kostenloser-website-check" },
                { label: "Webdesign Preise", to: "/webdesign-preise" },
              ].map((l) => (
 <Link key={l.to} to={l.to} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-card transition-all">
                  <Check size={17} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                  <span className="text-sm font-medium">{l.label}</span>
                  <ArrowRight size={16} className="text-muted-foreground ml-auto" aria-hidden={true} focusable={false} />
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen: Webdesign für Handwerker</h2>
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

export default WebdesignHandwerker;
