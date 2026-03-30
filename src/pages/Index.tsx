import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
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
} from "lucide-react";

const benefits = [
  { icon: TrendingUp, title: "Mehr Kundenanfragen", desc: "Webseiten, die konvertieren und Ihr Geschäft wachsen lassen." },
  { icon: Palette, title: "Modernes Design", desc: "Zeitgemäße Designs, die Vertrauen schaffen und begeistern." },
  { icon: Zap, title: "Schnelle Ladezeiten", desc: "Optimierte Performance für beste Nutzererfahrung." },
  { icon: Smartphone, title: "100% Responsiv", desc: "Perfekte Darstellung auf allen Geräten – vom Handy bis Desktop." },
];

const services = [
  { icon: Monitor, title: "Webdesign", desc: "Individuelle, maßgeschneiderte Webseiten" },
  { icon: TrendingUp, title: "Conversion-Optimierung", desc: "Mehr Besucher in Kunden verwandeln" },
  { icon: Palette, title: "UX/UI Design", desc: "Nutzerzentriertes, intuitives Design" },
  { icon: Search, title: "SEO-Basics", desc: "Sichtbarkeit in Suchmaschinen steigern" },
];

const testimonials = [
  {
    name: "Thomas M.",
    role: "Geschäftsführer, TechStart GmbH",
    text: "Seit dem Relaunch hat sich unsere Anfragequote verdreifacht. Absolute Empfehlung!",
  },
  {
    name: "Sarah K.",
    role: "Inhaberin, Yoga Studio Flow",
    text: "Endlich eine Webseite, die meine Marke perfekt widerspiegelt. Der Prozess war unkompliziert und professionell.",
  },
  {
    name: "Michael R.",
    role: "CEO, DigitalBoost",
    text: "Das Team hat unsere Vision verstanden und in ein beeindruckendes Ergebnis umgesetzt. Top Qualität!",
  },
];

const portfolioItems = [
  { title: "TechStart GmbH", category: "SaaS Landing Page", gradient: "from-primary to-accent" },
  { title: "Studio Flow", category: "Branding & Webdesign", gradient: "from-accent to-primary" },
  { title: "DigitalBoost", category: "E-Commerce", gradient: "from-primary/80 to-accent/80" },
];

const Index = () => (
  <main>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center section-padding pt-32 overflow-hidden">
      <div className="absolute inset-0 glow-bg" />
      <div className="container-narrow px-4 relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
              Webdesign Agentur
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Wir erstellen Webseiten, die{" "}
              <span className="gradient-text">Kunden gewinnen</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Moderne, professionelle Websites für Selbstständige, KMUs und Startups –
              strategisch durchdacht und conversion-optimiert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gradient" size="lg" asChild>
                <Link to="/kontakt">
                  Kostenloses Erstgespräch <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/portfolio">Portfolio ansehen</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Services Preview */}
    <section className="section-padding gradient-subtle-bg">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Unsere Leistungen
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Alles aus einer Hand – von der Konzeption bis zum Launch.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.1}>
              <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <s.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline-primary" asChild>
            <Link to="/leistungen">Alle Leistungen ansehen</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Warum <span className="gradient-text">Meine Traum Webseite</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Wir liefern nicht nur schöne Designs – sondern messbare Ergebnisse.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((b, i) => (
            <AnimatedSection key={b.title} delay={i * 0.1}>
              <div className="flex gap-5 p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding gradient-subtle-bg">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Das sagen unsere Kunden
            </h2>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.1}>
              <div className="bg-background rounded-xl p-6 shadow-card h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6 flex-1 italic">
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

    {/* Portfolio Preview */}
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ausgewählte Projekte
            </h2>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioItems.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div
                  className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${p.gradient} mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300`}
                >
                  <Monitor size={48} className="text-primary-foreground/50" />
                </div>
                <h3 className="font-heading font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.category}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-10">
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
