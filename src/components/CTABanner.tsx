import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { ArrowRight, PhoneCall } from "lucide-react";

const CTABanner = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="gradient-hero-bg rounded-3xl p-14 md:p-20 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-primary-foreground mb-4 text-balance">
              Bereit, mehr Kunden über Ihre Website zu gewinnen?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-5 text-lg">
              Sichern Sie sich jetzt Ihre kostenlose Website-Vorschau – und sehen Sie,
              wie Ihre neue Website aussehen könnte.
            </p>
            <p className="text-primary-foreground/50 text-sm mb-10">
              Kein Risiko. Keine Verpflichtung. Keine versteckten Kosten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-elevated animate-cta-pulse"
                asChild
              >
                <Link to="/kontakt">
                  Kostenlose Vorschau sichern <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/50 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-300"
                asChild
              >
                <Link to="/kontakt">
                  <PhoneCall size={18} /> Rückruf vereinbaren
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default CTABanner;
