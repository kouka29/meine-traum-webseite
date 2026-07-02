import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import {
  ArrowRight,
  Check,
  X,
  MessageSquare,
  FileText,
  Calendar,
  Gift,
  Shield,
  Clock,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
  Quote,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TERMIN_LINK = "#termin-buchen";

const testimonials = [
  {
    quote:
      "Seit dem Relaunch hat sich unsere Anfragequote verdreifacht. Die Investition hat sich innerhalb von 6 Wochen bezahlt gemacht.",
    name: "Thomas M.",
    role: "Geschäftsführer TechStart GmbH",
    badge: "3x mehr Anfragen",
  },
  {
    quote:
      "Vorher hatte ich 2–3 Anfragen im Monat. Jetzt sind es 15–20. Die Website arbeitet rund um die Uhr für mich.",
    name: "Sarah K.",
    role: "Inhaberin Yoga Studio Flow",
    badge: "7x mehr Neukunden",
  },
  {
    quote:
      "Die neue Website ist mehr als nur schön – sie dient als Kundenplattform. Dadurch spare ich mir einen Mitarbeiter.",
    name: "Murat D.",
    role: "Express Zulassungsdienst",
    badge: "Mitarbeiter gespart",
  },
];

const fitYes = [
  "Du planbar neue Anfragen wollen statt zufällige",
  "Deine Website aktuell kaum oder keine Leads bringt",
  "Du in Selbstständigkeit, KMU oder Handwerk tätig sind",
  "Du eine Entscheidung treffen wollen, nicht 6 Monate warten",
];

const fitNo = [
  "Du nur eine \"hübsche\" Website wollen ohne Strategie",
  "Du noch keine klare Zielgruppe kennst",
  "Du Budget unter 990 € eingeplant haben",
];

const steps = [
  {
    icon: MessageSquare,
    title: "Kostenloses Erstgespräch",
    text: "15–20 Min, wir analysieren Deine Situation",
  },
  {
    icon: FileText,
    title: "Konzept in 48 h",
    text: "Du erhältst eine konkrete Struktur & Textideen",
  },
  {
    icon: Calendar,
    title: "Du entscheidest frei",
    text: "Kein Druck, kein Kleingedrucktes",
  },
];

const empfehlerBenefits = [
  {
    icon: Clock,
    title: "Schnellere Termine",
    text: "Empfohlene Kunden bekommen einen Slot innerhalb von 7 Tagen — statt 3–4 Wochen Wartezeit.",
  },
  {
    icon: Gift,
    title: "Konzept-Bonus gratis",
    text: "Du erhältst Dein persönliches Website-Konzept (Wert 490 €) ohne Aufpreis dazu.",
  },
  {
    icon: Shield,
    title: "Vertrauensvorschuss",
    text: "Keine Verkaufsmasche, keine Standard-Pitches — wir behandeln Du wie wir auch Deine:n Empfehler:in behandelt haben.",
  },
];

const objections = [
  {
    q: "Ich weiß noch nicht, ob ich überhaupt eine neue Website brauche.",
    a: "Genau dafür ist das Erstgespräch da. In 15 Minuten sehen wir gemeinsam, ob ein Relaunch sich für Du lohnt — oder ob kleinere Änderungen reichen. Wenn wir nicht der richtige Partner sind, sagen wir das ehrlich.",
  },
  {
    q: "Wie viel kostet das Ganze ungefähr?",
    a: "Unsere Projekte starten ab 990 € für eine Landingpage und liegen meist zwischen 3.500–8.000 € für eine vollständige Website. Den exakten Preis nennen wir erst nach dem Konzept — damit Du weißt, wofür Du bezahlst.",
  },
  {
    q: "Wie lange dauert die Umsetzung?",
    a: "Eine Landingpage in 48 Stunden, eine vollständige Website in 2–4 Wochen. Express-Umsetzung möglich, falls Du Druck haben.",
  },
  {
    q: "Was, wenn mir das Konzept nicht gefällt?",
    a: "Dann zahlst Du nichts. Das Konzept ist kostenlos und unverbindlich — Du entscheidest danach völlig frei, ob wir weitermachen.",
  },
  {
    q: "Bekomme ich auch Texte und Bilder?",
    a: "Ja. Wir übernehmen Copywriting, KI-Bildgenerierung und visuelle Konzeption komplett — Du musst kein Wort selbst schreiben, wenn Du nicht wollen.",
  },
  {
    q: "Was unterscheidet euch von anderen Agenturen?",
    a: "Strategie zuerst, Design danach. Wir bauen keine Websites die nur schön sind — wir bauen Websites, die planbar Anfragen bringen. Das messen wir auch nach Launch.",
  },
];

const guarantees = [
  "Konzept kostenlos & unverbindlich — Du zahlst erst, wenn Du überzeugt sind",
  "Festpreis vor Projektstart — keine versteckten Kosten",
  "30-Tage-Zufriedenheitsgarantie nach Launch",
  "Persönlicher Ansprechpartner — keine Ticketsysteme, kein Outsourcing",
];

const Empfehlung = () => (
  <main id="main-content">
    {/* 1. Hero */}
    <section className="relative section-padding pt-28 sm:pt-36">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-label bg-primary/10 text-primary mb-6 sm:mb-8">
              Persönliche Empfehlung
            </span>
            <h1 className="mb-6 text-balance">
              Jemand aus deinem Netzwerk hat uns empfohlen.{" "}
              <span className="gradient-text">Kein Zufall.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              98% unserer Kunden empfehlen uns aktiv weiter — weil ihre Website
              nach dem Relaunch endlich Anfragen bringt.{" "}
              <strong className="text-foreground">Jetzt bist Du dran.</strong>
            </p>
            <Button
              variant="gradient"
              size="lg"
              className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 h-auto min-h-12 animate-cta-pulse whitespace-normal text-center leading-tight"
              asChild
            >
              <a href={TERMIN_LINK}>
                Kostenloses Erstgespräch buchen <ArrowRight size={20} aria-hidden={true} focusable={false} />
              </a>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* 2. Social Proof */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4">Was Kunden über uns sagen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Echte Ergebnisse von echten Unternehmen.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.1}>
              <Card className="h-full hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                  <span className="badge-label bg-primary/10 text-primary self-start mb-4">
                    {t.badge}
                  </span>
                  <p className="text-foreground/90 leading-relaxed mb-6 flex-1">
                    „{t.quote}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 2.5 Warum diese Seite (personal note) */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-primary-foreground shrink-0">
                    <Heart size={20} aria-hidden={true} focusable={false} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                      Persönliche Nachricht
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                      Warum Du auf dieser Seite sind
                    </h2>
                  </div>
                </div>
                <div className="space-y-4 text-foreground/90 leading-relaxed text-base sm:text-lg">
                  <p>
                    Du bist hier, weil Dich jemand empfohlen hat — jemand, dem wir
                    geholfen haben, mit seiner Website wirklich Kunden zu gewinnen.
                  </p>
                  <p>
                    Empfehlungen sind das Wertvollste, das wir bekommen können. Du
                    bedeuten: Vertrauen wurde übertragen. Genau deshalb verdienst Du
                    keine Standard-Behandlung — sondern eine, die diesem Vertrauen
                    gerecht wird.
                  </p>
                  <p className="font-semibold text-foreground">
                    Drei Dinge, die wir Dir versprechen:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Kein Verkaufsgespräch — sondern ein ehrliches Strategiegespräch.",
                      "Keine Pauschal-Pitches — sondern ein individuelles Konzept für Deine Situation.",
                      "Keine Ausreden, falls wir nicht passen — wir empfehlen Dir dann jemand anderen.",
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <Check size={20} className="text-primary shrink-0 mt-1" aria-hidden={true} focusable={false} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* 2.6 Empfehler-Benefits */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="badge-label bg-primary/10 text-primary mb-5">
              <Sparkles size={16} className="inline mr-1" aria-hidden={true} focusable={false} /> Dein Empfehlungs-Bonus
            </span>
            <h2 className="mb-4 text-balance">
              3 Vorteile, die Du nur als Empfehlung bekommst
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wer von einem unserer Kunden weiterempfohlen wird, startet nicht bei null —
              sondern mit einem Vertrauensvorschuss.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {empfehlerBenefits.map((b, i) => (
            <AnimatedSection key={b.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <b.icon size={20} />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-3">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 2.7 Mini-Case Study */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="badge-label bg-primary/10 text-primary mb-5">Echte Zahlen</span>
            <h2 className="mb-4 text-balance">
              Was passiert, wenn eine Website wirklich arbeitet
            </h2>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <Card className="overflow-hidden border-primary/20">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 gradient-hero-bg p-8 sm:p-10 text-primary-foreground flex flex-col justify-center">
                <Quote size={24} className="text-primary-foreground/40 mb-4" aria-hidden={true} focusable={false} />
                <p className="text-lg sm:text-xl leading-relaxed mb-6">
                  „Vor dem Relaunch hatten wir 2 Anfragen pro Monat. Heute sind es
                  über 15 — und sie kommen automatisch rein."
                </p>
                <div>
                  <p className="font-semibold">Sarah K.</p>
                  <p className="text-primary-foreground/70 text-sm">
                    Inhaberin · Yoga Studio Flow
                  </p>
                </div>
              </div>
              <div className="md:col-span-3 p-8 sm:p-10">
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                  {[
                    { icon: TrendingUp, value: "7×", label: "mehr Anfragen" },
                    { icon: Clock, value: "14 Tage", label: "bis Launch" },
                    { icon: Users, value: "92 %", label: "Conversion-Rate-Lift" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <s.icon size={20} className="text-primary mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                        {s.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Wir haben Sarahs Website nicht nur „neu gemacht" — wir haben eine
                  klare Positionierung entwickelt, die richtigen Worte gefunden und
                  jeden Klick auf das Ziel ausgerichtet: Probestunde buchen.
                  Das Ergebnis kam in den ersten 30 Tagen.
                </p>
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>

    {/* 3. Fit-Check */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Sind wir der richtige Partner für Dich?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ehrliche Einschätzung — bevor wir miteinander sprechen.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatedSection>
            <Card className="h-full border-primary/30">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-heading font-bold mb-6 text-primary">
                  Für Dich, wenn …
                </h3>
                <ul className="space-y-4">
                  {fitYes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={20} className="text-primary shrink-0 mt-0.5" aria-hidden={true} focusable={false} />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <Card className="h-full border-destructive/20">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-heading font-bold mb-6 text-muted-foreground">
                  Nicht für Dich, wenn …
                </h3>
                <ul className="space-y-4">
                  {fitNo.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <X size={20} className="text-destructive shrink-0 mt-0.5" aria-hidden={true} focusable={false} />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* 4. Prozess */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4">Was passiert als nächstes?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In drei einfachen Schritten zu Deiner neuen Website.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.1}>
              <Card className="h-full text-center">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 text-primary-foreground">
                    <s.icon size={26} />
                  </div>
                  <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-2">
                    Schritt {i + 1}
                  </p>
                  <h3 className="text-lg font-heading font-bold mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* 4.5 Garantien / Risk Reversal */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
              <Shield size={26} aria-hidden={true} focusable={false} />
            </div>
            <h2 className="mb-4 text-balance">Du gehst null Risiko ein</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vertrauen muss verdient werden. Deshalb übernehmen wir das Risiko —
              nicht Dich.
            </p>
          </div>
        </AnimatedSection>
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <Card>
              <CardContent className="p-6 sm:p-8">
                <ul className="space-y-4">
                  {guarantees.map((g) => (
                    <li key={g} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={16} aria-hidden={true} focusable={false} />
                      </div>
                      <span className="text-foreground/90">{g}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* 4.7 FAQ / Einwand-Behandlung */}
    <section className="section-padding bg-card/50 border-y border-border/50">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Die häufigsten Fragen — ehrlich beantwortet</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Falls Du dieselben Gedanken hast wie viele vor Dir.
            </p>
          </div>
        </AnimatedSection>
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Accordion type="single" collapsible className="space-y-3">
              {objections.map((o, i) => (
                <AccordionItem
                  key={o.q}
                  value={`item-${i}`}
                  className="border border-border rounded-xl px-5 sm:px-6 bg-background"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:no-underline py-5">
                    {o.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 leading-relaxed pb-5">
                    {o.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* 5. Primary CTA */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl sm:rounded-2xl p-8 sm:p-14 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-primary-foreground mb-4 text-balance">
                Bereit? Dann lass uns kurz sprechen.
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                15 Minuten reichen — danach weißt Du, ob und wie wir Dir helfen können.
              </p>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-elevated animate-cta-pulse text-sm sm:text-base px-6 sm:px-8 h-auto min-h-12 py-3 whitespace-normal text-center leading-tight"
                asChild
              >
                <a href={TERMIN_LINK}>
                  Jetzt Termin buchen <ArrowRight size={20} aria-hidden={true} focusable={false} />
                </a>
              </Button>
              <p className="text-primary-foreground/60 text-xs sm:text-sm mt-6">
                Kostenlos · Unverbindlich · Kein Verkaufsgespräch
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </main>
);

export default Empfehlung;