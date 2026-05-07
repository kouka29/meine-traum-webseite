import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Check, X, MessageSquare, FileText, Calendar } from "lucide-react";

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
  "Du planbar neue Anfragen willst statt zufällige",
  "Deine Website aktuell kaum oder keine Leads bringt",
  "Du in Selbstständigkeit, KMU oder Handwerk tätig bist",
  "Du eine Entscheidung treffen willst, nicht 6 Monate warten",
];

const fitNo = [
  "Du nur eine \"hübsche\" Website willst ohne Strategie",
  "Du noch keine klare Zielgruppe kennst",
  "Du Budget unter 1.500€ eingeplant hast",
];

const steps = [
  {
    icon: MessageSquare,
    title: "Kostenloses Erstgespräch",
    text: "15–20 Min, wir analysieren deine Situation",
  },
  {
    icon: FileText,
    title: "Konzept in 48h",
    text: "Du erhältst eine konkrete Struktur & Textideen",
  },
  {
    icon: Calendar,
    title: "Du entscheidest frei",
    text: "Kein Druck, kein Kleingedrucktes",
  },
];

const Empfehlung = () => (
  <main>
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
              <strong className="text-foreground">Jetzt bist du dran.</strong>
            </p>
            <Button
              variant="gradient"
              size="lg"
              className="text-sm sm:text-base py-5 sm:py-6 px-6 sm:px-8 h-auto min-h-12 animate-cta-pulse whitespace-normal text-center leading-tight"
              asChild
            >
              <a href={TERMIN_LINK}>
                Kostenloses Erstgespräch buchen <ArrowRight size={18} />
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

    {/* 3. Fit-Check */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="mb-4 text-balance">Sind wir der richtige Partner für dich?</h2>
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
                  Für dich, wenn …
                </h3>
                <ul className="space-y-4">
                  {fitYes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={20} className="text-primary shrink-0 mt-0.5" />
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
                  Nicht für dich, wenn …
                </h3>
                <ul className="space-y-4">
                  {fitNo.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <X size={20} className="text-destructive shrink-0 mt-0.5" />
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
              In drei einfachen Schritten zu deiner neuen Website.
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

    {/* 5. Primary CTA */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="gradient-hero-bg rounded-2xl sm:rounded-3xl p-8 sm:p-14 md:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-primary-foreground mb-4 text-balance">
                Bereit? Dann lass uns kurz sprechen.
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                15 Minuten reichen — danach weißt du, ob und wie wir dir helfen können.
              </p>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-elevated animate-cta-pulse text-sm sm:text-base px-6 sm:px-8 h-auto min-h-12 py-3 whitespace-normal text-center leading-tight"
                asChild
              >
                <a href={TERMIN_LINK}>
                  Jetzt Termin buchen <ArrowRight size={18} />
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