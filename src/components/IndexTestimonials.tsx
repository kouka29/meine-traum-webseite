import { useEffect, useState, useCallback } from "react";
import AnimatedSection from "./AnimatedSection";
import { Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  result: string;
  sort_order: number;
  is_visible: boolean;
}

const FALLBACK_TESTIMONIALS: Omit<Testimonial, "id" | "sort_order" | "is_visible">[] = [
  { name: "Thomas M.", role: "Geschäftsführer, TechStart GmbH", text: "Seit dem Relaunch bekommen wir 3x so viele Anfragen – und die Qualität der Leads ist deutlich besser. Die Investition hat sich in 6 Wochen bezahlt gemacht.", result: "3x mehr Anfragen" },
  { name: "Sarah K.", role: "Inhaberin, Yoga Studio Flow", text: "Vorher kamen 2-3 Anfragen im Monat. Jetzt sind es 15-20. Ich muss keine Kaltakquise mehr machen – die Website übernimmt das für mich.", result: "7x mehr Neukunden" },
  { name: "Michael R.", role: "CEO, DigitalBoost", text: "Zum ersten Mal verstehen Besucher sofort, was wir machen. Die Abschlussquote nach Website-Anfragen liegt jetzt bei über 40%.", result: "+40% Abschlussquote" },
];

const IndexTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Omit<Testimonial, "sort_order" | "is_visible">[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(FALLBACK_TESTIMONIALS.map((t, i) => ({ ...t, id: String(i) })));
      }
    };
    load();
  }, []);

  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (testimonials.length <= visibleCount) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, testimonials.length, visibleCount]);

  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12 md:mb-20">
            <h2 className="mb-5 text-balance">
              Was unsere Kunden sagen – und was sich verändert hat
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Keine leeren Worte. Echte Unternehmer berichten, wie sich ihre Anfragenzahl nach dem Website-Relaunch entwickelt hat.
            </p>
          </div>
        </AnimatedSection>

        <div>
          <div className="relative overflow-visible">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                gap: visibleCount === 1 ? '0px' : '1.5rem',
                transform: visibleCount === 1
                  ? `translateX(-${current * 100}%)`
                  : `translateX(calc(-${current} * (100% / ${visibleCount} + ${1.5 / visibleCount}rem)))`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="min-w-0 shrink-0 grow-0"
                  style={{
                    flexBasis: visibleCount === 1
                      ? '100%'
                      : `calc((100% - ${(visibleCount - 1) * 1.5}rem) / ${visibleCount})`,
                  }}
                >
                  <div className="bg-card rounded-2xl p-6 sm:p-7 shadow-card h-full flex flex-col border border-border">
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
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0">
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

          </div>

          {testimonials.length > visibleCount && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default IndexTestimonials;
