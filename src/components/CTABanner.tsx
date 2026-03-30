import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { ArrowRight } from "lucide-react";

const CTABanner = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="gradient-hero-bg rounded-2xl p-12 md:p-16 text-center text-primary-foreground">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Bereit für Ihre Traum-Webseite?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
            Lassen Sie uns gemeinsam Ihre Online-Präsenz auf das nächste Level heben.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300"
            asChild
          >
            <Link to="/kontakt">
              Kostenloses Erstgespräch <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default CTABanner;
