import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import { ArrowRight, CheckCircle, Heart, Search, Shield, Smartphone, Clock, TrendingUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const painPoints = [
  "Patienten finden Sie online nicht – aber Ihre Kollegen in der Nachbarschaft schon",
  "Ihre Website wirkt veraltet und vermittelt nicht den professionellen Eindruck Ihrer Praxis",
  "Neue Patienten informieren sich online, bevor sie einen Termin buchen – und springen ab",
  "Sie haben keine Online-Terminbuchung und verlieren Patienten an modernere Praxen",
];

const features = [
  { icon: Heart, title: "Praxis-gerechtes Design", desc: "Ihre Website vermittelt Vertrauen und Kompetenz – mit einem Design, das Ihre Praxis professionell repräsentiert." },
  { icon: Search, title: "Lokales SEO für Ärzte", desc: "Gefunden werden bei "Arzt [Stadt]", "Zahnarzt in der Nähe" und ähnlichen Suchanfragen Ihrer Patienten." },
  { icon: Clock, title: "Online-Terminbuchung", desc: "Integration einer Online-Terminbuchung – damit Patienten rund um die Uhr Termine vereinbaren können." },
  { icon: Shield, title: "DSGVO-konform", desc: "Ihre Praxis-Website erfüllt alle Datenschutz-Anforderungen – inklusive Impressum und Datenschutzerklärung." },
  { icon: Smartphone, title: "Mobilfreundlich", desc: "Patienten suchen unterwegs – Ihre Website sieht auf jedem Gerät professionell aus." },
  { icon: TrendingUp, title: "Mehr Patienten gewinnen", desc: "Conversion-optimierter Aufbau sorgt dafür, dass Besucher zu Patienten werden." },
];

const faqs = [
  { q: "Warum braucht meine Arztpraxis eine professionelle Website?", a: "Über 70% der Patienten suchen online nach Ärzten, bevor sie einen Termin buchen. Eine professionelle, vertrauenswürdige Website ist heute entscheidend für die Patientengewinnung." },
  { q: "Was kostet eine Website für Ärzte?", a: "Unsere Praxis-Websites starten ab 1.500 €. Sie erhalten ein individuelles, DSGVO-konformes Design mit lokaler SEO-Optimierung. Kostenlose Vorschau in 48h." },
  { q: "Ist die Website DSGVO-konform?", a: "Ja, selbstverständlich. Wir achten besonders auf Datenschutz – gerade im medizinischen Bereich ist das essentiell. Impressum, Datenschutzerklärung und Cookie-Banner sind inklusive." },
  { q: "Können Patienten online Termine buchen?", a: "Ja, wir können eine Online-Terminbuchung integrieren. So können Patienten rund um die Uhr Termine vereinbaren – das entlastet Ihr Praxisteam." },
];

const WebdesignAerzte = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="badge-label bg-primary/10 text-primary mb-5">Webdesign für Ärzte</span>
            <h1 className="mb-5 text-balance">
              Webdesign für Ärzte –{" "}
              <span className="gradient-text">Die Praxis-Website, die Patienten gewinnt</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Patienten suchen online nach Ärzten – und entscheiden sich für die Praxis mit der besten Website.
              Wir erstellen professionelle, vertrauenswürdige Websites speziell für Arztpraxen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="gradient" size="lg" className="animate-cta-pulse" asChild>
                <Link to="/kontakt">Kostenlose Website-Vorschau für Ärzte <ArrowRight size={18} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Praxis-Website analysieren</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-center mb-10 text-balance">Diese Probleme kennen viele Arztpraxen</h2>
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
          <h2 className="text-center mb-16 text-balance">Was wir für Ihre Arztpraxis tun</h2>
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
            <h2 className="text-primary-foreground mb-5 text-balance text-center">Das bringt eine professionelle Praxis-Website</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {[
                { value: "+280%", label: "Mehr Terminanfragen" },
                { value: "DSGVO", label: "Vollständig konform" },
                { value: "Top 3", label: "Google-Rankings lokal" },
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
            <h2 className="text-center mb-5 text-balance">Passende Leistungen für Arztpraxen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
              {[
                { label: "Website erstellen lassen", to: "/website-erstellen-lassen" },
                { label: "Website Relaunch", to: "/website-relaunch" },
                { label: "Conversion-Optimierung", to: "/conversion-optimierung" },
                { label: "Kostenloser Website-Check", to: "/kostenloser-website-check" },
                { label: "Webdesign Preise", to: "/webdesign-preise" },
                { label: "Landingpage erstellen", to: "/landingpage-erstellen-lassen" },
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
          <h2 className="text-center mb-10 text-balance">Häufige Fragen: Webdesign für Ärzte</h2>
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

export default WebdesignAerzte;
