import { useEffect, useState, useCallback, useRef } from "react";
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
  const [enableTransition, setEnableTransition] = useState(true);
  const isResettingRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id,name,role,text,result")
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
  const next = useCallback(() => {
    setEnableTransition(true);
    setCurrent((c) => c + 1);
  }, []);

  const prev = useCallback(() => {
    setEnableTransition(true);
    setCurrent((c) => c - 1);
  }, []);

  useEffect(() => {
    if (testimonials.length <= visibleCount) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, testimonials.length, visibleCount]);

  if (testimonials.length === 0) return null;

  const total = testimonials.length;
  const shouldLoop = total > visibleCount;
  const renderItems = shouldLoop ? [...testimonials, ...testimonials] : testimonials;

  const handleTransitionEnd = () => {
    if (!shouldLoop || isResettingRef.current) return;
    if (current >= total) {
      isResettingRef.current = true;
      setEnableTransition(false);
      setCurrent((c) => c - total);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          isResettingRef.current = false;
        });
      });
    } else if (current < 0) {
      isResettingRef.current = true;
      setEnableTransition(false);
      setCurrent((c) => c + total);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          isResettingRef.current = false;
        });
      });
    }
  };

  const activeDot = ((current % total) + total) % total;

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Seamless aurora background blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(250,56%,97%)] to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(hsl(250,56%,48%) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-narrow px-4 relative z-10">
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
              className="flex ease-in-out"
              onTransitionEnd={handleTransitionEnd}
              style={{
                gap: visibleCount === 1 ? '0px' : '1.5rem',
                transition: enableTransition ? 'transform 500ms ease-in-out' : 'none',
                transform: visibleCount === 1
                  ? `translateX(-${current * 100}%)`
                  : `translateX(calc(-${current} * (100% / ${visibleCount} + ${1.5 / visibleCount}rem)))`,
              }}
            >
              {renderItems.map((t, idx) => (
                <div
                  key={`${t.id}-${idx}`}
                  className="min-w-0 shrink-0 grow-0"
                  style={{
                    flexBasis: visibleCount === 1
                      ? '100%'
                      : `calc((100% - ${(visibleCount - 1) * 1.5}rem) / ${visibleCount})`,
                  }}
                >
                  <div className="group bg-card rounded-2xl p-6 sm:p-7 h-full flex flex-col border border-border/60 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_-16px_hsl(250_56%_48%/0.18)] hover:border-primary/30">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={15} className="text-primary fill-primary" aria-hidden={true} focusable={false} />
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
                        <Users size={16} className="text-primary-foreground" aria-hidden={true} focusable={false} />
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
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setEnableTransition(true);
                      setCurrent(i);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeDot ? "bg-primary w-6" : "bg-muted-foreground/30"
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
