import { useEffect, useState, useCallback } from "react";
import AnimatedSection from "./AnimatedSection";
import { Star, Users, ChevronLeft, ChevronRight } from "lucide-react";

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
  {
    name: "Dr. Anna W.",
    role: "Zahnärztin, Praxis am Park",
    text: "Unsere Online-Terminbuchungen haben sich vervierfacht. Die Patienten finden uns jetzt sofort bei Google.",
    result: "4x mehr Termine",
  },
  {
    name: "Markus L.",
    role: "Inhaber, Elektro Lenz GmbH",
    text: "Früher kamen Aufträge nur über Empfehlungen. Jetzt generiert unsere Website täglich neue Anfragen aus der Region.",
    result: "+250% Anfragen",
  },
  {
    name: "Julia F.",
    role: "Coach & Beraterin",
    text: "Meine alte Website hat null Vertrauen aufgebaut. Seit dem Relaunch buchen Interessenten direkt nach dem ersten Besuch.",
    result: "5x mehr Buchungen",
  },
  {
    name: "Stefan H.",
    role: "Geschäftsführer, Immobilien Huber",
    text: "Die Conversion-Rate unserer Landingpages ist um 320% gestiegen. Jede Investition hat sich mehrfach ausgezahlt.",
    result: "+320% Conversion",
  },
  {
    name: "Claudia B.",
    role: "Inhaberin, Beauty Lounge",
    text: "Endlich eine Website, die so professionell aussieht wie mein Studio. Die Neukundengewinnung läuft jetzt automatisch.",
    result: "2x mehr Neukunden",
  },
];

const IndexTestimonials = () => {
  const [current, setCurrent] = useState(0);
  const visibleCount = 3;
  const maxIndex = testimonials.length - visibleCount;

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  }, [maxIndex]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
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

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(calc(-${current} * (100% / ${visibleCount} + 0.5rem)))`,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className="min-w-0 shrink-0 grow-0"
                  style={{ flexBasis: `calc((100% - ${(visibleCount - 1) * 1.5}rem) / ${visibleCount})` }}
                >
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
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center hover:bg-accent transition-colors z-10"
            aria-label="Vorherige Referenz"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-card flex items-center justify-center hover:bg-accent transition-colors z-10"
            aria-label="Nächste Referenz"
          >
            <ChevronRight size={18} className="text-foreground" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
                aria-label={`Zu Gruppe ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndexTestimonials;
