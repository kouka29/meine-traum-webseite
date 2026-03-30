import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { Target, Award, Rocket, Heart } from "lucide-react";

const values = [
  { icon: Target, title: "Zielorientiert", desc: "Jede Entscheidung dient einem klaren Ziel: Ihrem Geschäftserfolg." },
  { icon: Award, title: "Qualität", desc: "Wir liefern nur Ergebnisse, auf die wir stolz sind." },
  { icon: Rocket, title: "Performance", desc: "Schnelle, optimierte Webseiten für beste Nutzererfahrung." },
  { icon: Heart, title: "Leidenschaft", desc: "Wir lieben, was wir tun – und das sieht man." },
];

const About = () => (
  <main className="pt-16">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              Über uns
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Ihre Vision. <span className="gradient-text">Unsere Mission.</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Wir sind ein Team aus Designern und Entwicklern mit einer gemeinsamen Mission:
              individuelle Traum-Webseiten zu erstellen, die echte Ergebnisse liefern.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-4">
                Wer wir sind
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Meine Traum Webseite ist eine Webdesign-Agentur mit Fokus auf
                Qualität, Performance und Ergebnisse. Wir arbeiten mit Selbstständigen,
                kleinen und mittelständischen Unternehmen sowie Startups zusammen.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unser Ansatz: Wir kombinieren strategisches Denken mit
                kreativem Design und modernster Technologie, um Webseiten zu schaffen,
                die nicht nur gut aussehen – sondern messbar zum Geschäftserfolg beitragen.
              </p>
            </div>
            <div className="aspect-square rounded-2xl gradient-hero-bg flex items-center justify-center">
              <span className="text-primary-foreground/50 font-heading text-6xl font-bold">MTW</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="font-heading text-2xl font-bold text-center mb-12">
            Unsere Werte
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.1}>
              <div className="text-center p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <CTABanner />
  </main>
);

export default About;
