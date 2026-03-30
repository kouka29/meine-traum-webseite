import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { Monitor, TrendingUp, Palette, Search, Settings } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "Webdesign",
    desc: "Wir gestalten individuelle Webseiten, die Ihre Marke perfekt repräsentieren. Modernes Design trifft auf durchdachte Nutzerführung.",
    features: ["Responsive Design", "Individuelle Layouts", "CMS-Integration", "Schnelle Ladezeiten"],
  },
  {
    icon: TrendingUp,
    title: "Conversion-Optimierung",
    desc: "Mehr Besucher zu Kunden machen – mit strategisch platzierten Call-to-Actions, überzeugenden Texten und optimierten Landingpages.",
    features: ["A/B Testing", "Landing Pages", "Funnel-Optimierung", "Analytics"],
  },
  {
    icon: Palette,
    title: "UX/UI Design",
    desc: "Nutzerzentriertes Design, das begeistert. Wir schaffen intuitive Interfaces, die Ihre Besucher zum Handeln motivieren.",
    features: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
  },
  {
    icon: Search,
    title: "SEO-Basics",
    desc: "Damit Ihre Webseite auch gefunden wird. Wir legen das Fundament für eine nachhaltige Sichtbarkeit in Suchmaschinen.",
    features: ["On-Page SEO", "Meta-Tags", "Seitenstruktur", "Performance-Optimierung"],
  },
  {
    icon: Settings,
    title: "Individuelle Lösungen",
    desc: "Besondere Anforderungen? Kein Problem. Wir entwickeln maßgeschneiderte Funktionen und Integrationen für Ihr Projekt.",
    features: ["API-Integrationen", "Automatisierungen", "Sonderfunktionen", "Beratung"],
  },
];

const Services = () => (
  <main className="pt-16">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              Leistungen
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Was wir für Sie <span className="gradient-text">leisten</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Von der ersten Idee bis zur fertigen Webseite – wir begleiten Sie durch den gesamten Prozess.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.08}>
              <div className="flex flex-col md:flex-row gap-6 p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <s.icon size={26} className="text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-xl font-bold mb-2">{s.title}</h2>
                  <p className="text-muted-foreground mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <CTABanner />
  </main>
);

export default Services;
