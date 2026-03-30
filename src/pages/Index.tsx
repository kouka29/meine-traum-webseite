import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import PainPoints from "@/components/PainPoints";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import SocialProofBar from "@/components/SocialProofBar";
import {
  ArrowRight,
  Users,
  Palette,
  Zap,
  TrendingUp,
  Star,
  Monitor,
  Smartphone,
  Search,
  CheckCircle,
  PhoneCall,
} from "lucide-react";

const benefits = [
  { icon: TrendingUp, title: "Mehr Kundenanfragen", desc: "Websites, die nicht nur gut aussehen – sondern aktiv neue Anfragen generieren. Messbar, nachweisbar, planbar." },
  { icon: Palette, title: "Professioneller Auftritt", desc: "Schaffen Sie sofort Vertrauen bei jedem Besucher – mit einem modernen Design, das Kompetenz ausstrahlt." },
  { icon: Zap, title: "Blitzschnelle Ladezeiten", desc: "Jede Sekunde Ladezeit kostet Sie Kunden. Unsere Websites laden unter 3 Sekunden – garantiert." },
  { icon: Smartphone, title: "Perfekt auf jedem Gerät", desc: "Über 60% Ihrer Besucher kommen vom Handy. Bei uns sieht Ihre Website überall perfekt aus." },
];

const services = [
  { icon: Monitor, title: "Webdesign", desc: "Maßgeschneiderte Websites, die verkaufen" },
  { icon: TrendingUp, title: "Conversion-Optimierung", desc: "Besucher systematisch zu Kunden machen" },
  { icon: Palette, title: "UX/UI Design", desc: "Intuitiv. Überzeugend. Nutzerzentriert." },
  { icon: Search, title: "SEO-Basics", desc: "Gefunden werden – von den richtigen Kunden" },
];

const testimonials = [
  {
    name: "Thomas M.",
    role: "Geschäftsführer, TechStart GmbH",
    text: "Seit dem Relaunch hat sich unsere Anfragequote verdreifacht. Die Investition hat sich innerhalb von 6 Wochen bezahlt gemacht.",
    result: "3x mehr Anfragen",
  },
  {
    name: "Sarah K.",
    role: "Inhaberin, Yoga Studio Flow",
    text: "Vorher hatte ich 2-3 Anfragen im Monat. Jetzt sind es 15-20. Die Website arbeitet rund um die Uhr für mich.",
    result: "7x mehr Neukunden",
  },
  {
    name: "Michael R.",
    role: "CEO, DigitalBoost",
    text: "Endlich eine Agentur, die versteht, dass eine Website ein Verkaufsinstrument ist – nicht nur eine digitale Visitenkarte.",
    result: "+180% Umsatz",
  },
];

const portfolioItems = [
  { title: "TechStart GmbH", category: "SaaS Landing Page", result: "+300% Anfragen", gradient: "from-primary to-accent" },
  { title: "Studio Flow", category: "Branding & Webdesign", result: "+700% Neukunden", gradient: "from-accent to-primary" },
  { title: "DigitalBoost", category: "E-Commerce", result: "+180% Umsatz", gradient: "from-primary/80 to-accent/80" },
];

const Index = () => (
  <main>
    {/* Hero */}
    <section className="relative min-h-[92vh] flex items-center section-padding pt-36 overflow-hidden">
      <div className="absolute inset-0 glow-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="container-narrow px-4 relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl">
            <span className="badge-label bg-destructive/10 text-destructive mb-8">
              Ihre Website bringt keine Kunden? Das ändern wir.
            </span>
            <h1 className="mb-6 text-balance">
              Webseiten, die nicht nur gut aussehen –{" "}
              <span className="gradient-text">aktiv Kunden gewinnen</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-5 leading-relaxed">
              Wir erstellen conversion-optimierte Websites für Selbstständige, Handwerker, Coaches und KMUs –
              strategisch durchdacht, damit Sie <strong className="text-foreground">planbar mehr Anfragen</strong> erhalten.
            </p>
            <div className="flex items-center gap-5 mb-10 flex-wrap">
              {["Kostenlose Vorschau", "Keine Verpflichtung", "In 48h fertig"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={15} className="text-primary" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gradient" size="lg" className="text-base py-6 px-8" asChild>
                <Link to="/kontakt">
                  Kostenlose Website-Vorschau sichern <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="outline-primary" size="lg" className="text-base py-6" asChild>
                <Link to="/kontakt">
                  <PhoneCall size={18} /> Rückruf vereinbaren
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Social Proof */}
    <SocialProofBar />

    {/* Pain Points */}
    <PainPoints />

    {/* Services */}
    <section className="section-padding gradient-subtle-bg">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20">
            <span className="badge-label bg-primary/10 text-primary mb-5">
              Die Lösung
            </span>
            <h2 className="mb-5 text-balance">
              So machen wir Ihre Website zum{" "}
              <span className="gradient-text">Kundenmagnet</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Wir kombinieren verkaufspsychologisches Design mit modernster Technik – für Websites, die messbar Ergebnisse liefern.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.1}>
              <div className="bg-background rounded-2xl p-7 shadow-card hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1 border border-transparent hover:border-primary/10">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <s.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline-primary" asChild>
            <Link to="/leistungen">Alle Leistungen ansehen</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Free Preview CTA */}
    <FreePreviewCTA />

    {/* Benefits */}
    <section className="section-padding gradient-subtle-bg">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="mb-5 text-balance">
              Warum Unternehmen sich für uns entscheiden
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Wir liefern keine digitalen Visitenkarten – sondern Verkaufsinstrumente, die sich bezahlt machen.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b, i) => (
            <AnimatedSection key={b.title} delay={i * 0.1}>
              <div className="flex gap-5 p-7 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300 bg-background hover:shadow-card">
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <b.icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-1.5">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="gradient" size="lg" asChild>
            <Link to="/kontakt">
              Kostenlose Vorschau anfordern <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="mb-5 text-balance">
              Echte Ergebnisse. Echte Kunden.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Keine leeren Versprechen – sondern nachweisbare Resultate.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.1}>
              <div className="bg-card rounded-2xl p-7 shadow-card h-full flex flex-col border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={15} className="text-primary fill-primary" />
                  ))}
                </div>
                <span className="badge-label bg-primary/10 text-primary mb-4 w-fit text-[11px]">
                  {t.result}
                </span>
                <p className="text-sm text-muted-foreground mb-8 flex-1 italic leading-relaxed">
                  „{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Users size={16} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Portfolio */}
    <section className="section-padding gradient-subtle-bg">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="mb-5 text-balance">
              Projekte, die Ergebnisse sprechen lassen
            </h2>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioItems.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div
                  className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${p.gradient} mb-5 flex flex-col items-center justify-center group-hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden`}
                >
                  <Monitor size={48} className="text-primary-foreground/40" />
                  <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
                    {p.result}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.category}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline-primary" asChild>
            <Link to="/portfolio">Alle Projekte ansehen</Link>
          </Button>
        </div>
      </div>
    </section>

    <CTABanner />
  </main>
);

export default Index;
