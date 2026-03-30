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
        <div className="gradient-hero-bg rounded-2xl p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground mb-6">
              Risikofreies Angebot
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Kostenlose Website-Vorschau
              <br className="hidden md:block" />
              <span className="text-primary-foreground/90">für Ihr Unternehmen</span>
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-6 text-lg">
              Wir erstellen Ihnen eine individuelle Vorschau – damit Sie sehen, wie Ihre neue Website aussehen könnte. 
              Ohne Risiko. Ohne Verpflichtung. Ohne Kosten.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {trustBadges.map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <b.icon size={16} />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base px-8 py-6"
              asChild
            >
              <Link to="/kontakt">
                Kostenlose Vorschau sichern <ArrowRight size={18} />
              </Link>
            </Button>
            <p className="text-xs text-primary-foreground/50 mt-4">
              Bereits über 150+ Unternehmen vertrauen uns
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default FreePreviewCTA;
