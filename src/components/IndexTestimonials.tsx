import AnimatedSection from "./AnimatedSection";
import { Star, Users } from "lucide-react";

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

const IndexTestimonials = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-20">
          <h2 className="mb-5 text-balance">
            Echte Ergebnisse unserer Webdesign-Kunden
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Keine leeren Versprechen – sondern nachweisbare Resultate von Unternehmen, die ihre Website erstellen lassen haben.
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
);

export default IndexTestimonials;
