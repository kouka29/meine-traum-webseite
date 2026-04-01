import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { ArrowRight, Gift, Shield, Clock } from "lucide-react";

const trustBadges = [
  { icon: Gift, text: "100% kostenlos" },
  { icon: Shield, text: "Unverbindlich" },
  { icon: Clock, text: "In 48h fertig" },
];

const FreePreviewCTA = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="gradient-hero-bg rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="relative z-10">
            <span className="badge-label bg-primary-foreground/15 text-primary-foreground mb-8">
              Risikofreies Angebot
            </span>
            <h2 className="text-primary-foreground mb-5 text-balance">
              Kostenlose Website-Vorschau
              <br className="hidden md:block" />
              <span className="text-primary-foreground/85">für Ihr Unternehmen</span>
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              Wir erstellen Ihnen eine individuelle Vorschau – damit Sie sehen, wie Ihre neue Website aussehen könnte.
              Ohne Risiko. Ohne Verpflichtung. Ohne Kosten.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {trustBadges.map((b) => (
                <div key={b.text} className="flex items-center gap-2.5 text-sm text-primary-foreground/70">
                  <b.icon size={16} />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 shadow-elevated animate-cta-pulse w-full sm:w-auto"
              asChild
            >
              <Link to="/kontakt">
                Kostenlose Vorschau sichern <ArrowRight size={18} />
              </Link>
            </Button>
            <p className="text-xs text-primary-foreground/40 mt-6">
              Bereits über 150+ Unternehmen vertrauen uns
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default FreePreviewCTA;
