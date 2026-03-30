import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { ArrowRight, PhoneCall } from "lucide-react";

const CTABanner = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="gradient-hero-bg rounded-2xl p-12 md:p-16 text-center text-primary-foreground">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Bereit, mehr Kunden über Ihre Website zu gewinnen?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-4 text-lg">
            Sichern Sie sich jetzt Ihre kostenlose Website-Vorschau – und sehen Sie, 
            wie Ihre neue Website aussehen könnte.
          </p>
          <p className="text-primary-foreground/60 text-sm mb-8">
            Kein Risiko. Keine Verpflichtung. Keine versteckten Kosten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              asChild
            >
              <Link to="/kontakt">
                Kostenlose Vorschau sichern <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300"
              asChild
            >
              <Link to="/kontakt">
                <PhoneCall size={18} /> Rückruf vereinbaren
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default CTABanner;
