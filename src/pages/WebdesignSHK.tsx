import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, CheckCircle, Flame, Droplets, ThermometerSun, Phone, Search, TrendingUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const painPoints = [
  "Trotz hoher Nachfrage kommen zu wenig Anfragen über Ihre Website rein",
  'Kunden finden Sie nicht bei Google, wenn sie nach "Heizungsbauer in der Nähe" suchen',
  "Ihre Website sieht veraltet aus und schreckt potenzielle Kunden ab",
  "Sie verlieren Aufträge an modernere SHK-Betriebe mit besserer Online-Präsenz",
];

const features = [
  { icon: Flame, title: "Branchenspezifisches Design", desc: "Ihre Website wird speziell für SHK-Betriebe gestaltet – mit Fokus auf Notdienst, Leistungsübersicht und Kontaktmöglichkeiten." },
  { icon: Search, title: "Lokales SEO für SHK", desc: 'Wir optimieren Ihre Website für lokale Suchanfragen wie "Heizungsbauer [Stadt]" oder "Sanitär Notdienst in der Nähe".' },
  { icon: Droplets, title: "Leistungen klar präsentiert", desc: "Sanitär, Heizung, Klima – Ihre Leistungen werden übersichtlich und überzeugend dargestellt." },
  { icon: Phone, title: "Sofort-Kontakt-Funktion", desc: "Click-to-Call, Notdienst-Button und Kontaktformular – damit Kunden Sie sofort erreichen." },
  { icon: ThermometerSun, title: "Mobile Optimierung", desc: "Über 70% der Notdienst-Anfragen kommen vom Smartphone. Ihre Website funktioniert auf jedem Gerät perfekt." },
  { icon: TrendingUp, title: "Mehr Anfragen, mehr Aufträge", desc: "Conversion-optimierter Aufbau sorgt dafür, dass aus Besuchern zahlende Kunden werden." },
];

const faqs = [
  { q: "Warum braucht ein SHK-Betrieb eine professionelle Website?", a: "Über 80% der Kunden suchen online nach Handwerkern. Ohne professionelle Website verlieren Sie täglich potenzielle Aufträge an Ihre Konkurrenz – besonders bei Notdienst-Anfragen." },
  { q: "Was kostet eine Website für SHK-Betriebe?", a: "Unsere Webdesign-Projekte für SHK-Betriebe starten ab 1.500 €. Der genaue Preis hängt vom Umfang ab. Sie erhalten eine kostenlose Vorschau in 48 Stunden." },
  { q: "Kann ich meine Leistungen selbst aktualisieren?", a: "Ja. Wir richten Ihre Website so ein, dass Sie Inhalte wie Notdienst-Zeiten oder neue Leistungen einfach selbst anpassen können." },
  { q: "Wie schnell ist meine neue SHK-Website online?", a: "In der Regel innerhalb von 2–4 Wochen. Eine erste Vorschau erhalten Sie bereits nach 48 Stunden." },
];

const WebdesignSHK = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign für SHK-Betriebe</span>
            <h1 className="mb-5 text-balance">
              Webdesign für SHK-Betriebe –{" "}
              <span className="gradient-text">Mehr Anfragen durch eine professionelle Website</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Sie sind Sanitär-, Heizungs- oder Klimabetrieb und Ihre Website bringt kaum Anfragen?
              Wir erstellen Websites speziell für SHK-Betriebe, die bei Google gefunden werden und Kunden überzeugen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Website-Vorschau für SHK sichern <ArrowRight size={18} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Website-Check für SHK-Betriebe</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Pain Points */}
        <AnimatedSection>
          <div className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-center mb-10 text-balance">Kennen Sie diese Probleme als SHK-Betrieb?</h2>
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

        {/* Features */}
        <AnimatedSection>
          <h2 className="text-center mb-16 text-balance">So machen wir Ihren SHK-Betrieb online sichtbar</h2>
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

        {/* Results */}
        <AnimatedSection>
          <div className="gradient-hero-bg rounded-3xl p-12 md:p-16 text-primary-foreground mb-20">
            <h2 className="text-primary-foreground mb-5 text-balance text-center">Was eine professionelle Website Ihrem SHK-Betrieb bringt</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {[
                { value: "+320%", label: "Mehr Online-Anfragen" },
                { value: "24/7", label: "Notdienst-Sichtbarkeit" },
                { value: "Top 5", label: "Google-Rankings lokal" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="font-heading text-4xl font-bold text-primary-foreground">{s.value}</span>
                  <p className="text-sm text-primary-foreground/70 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Internal links */}
        <AnimatedSection>
          <div className="mb-20">
            <h2 className="text-center mb-5 text-balance">Unsere Leistungen für SHK-Betriebe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-center text-lg mb-10">
              Von der Webseite über Landingpages bis zur Conversion-Optimierung – wir bieten alles, was Ihr SHK-Betrieb online braucht.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                { label: "Website erstellen lassen", to: "/website-erstellen-lassen" },
                { label: "Landingpage für SHK-Notdienst", to: "/landingpage-erstellen-lassen" },
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

        {/* FAQ */}
        <AnimatedSection>
          <h2 className="text-center mb-10 text-balance">Häufige Fragen: Webdesign für SHK-Betriebe</h2>
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

export default WebdesignSHK;
