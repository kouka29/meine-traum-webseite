import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PainPoints from "@/components/PainPoints";
import FreePreviewCTA from "@/components/FreePreviewCTA";
import SocialProofBar from "@/components/SocialProofBar";
import IndexPortfolio from "@/components/IndexPortfolio";
import IndexTestimonials from "@/components/IndexTestimonials";
import IndexServices from "@/components/IndexServices";
import IndexBenefits from "@/components/IndexBenefits";
import IndexFAQ from "@/components/IndexFAQ";
import VorschauVerfuegbarkeit from "@/components/VorschauVerfuegbarkeit";
import Picture from "@/components/Picture";
// Build-time responsive image (AVIF + WebP + JPG fallback) via vite-imagetools.
import heroBg from "@/assets/hero-bg.jpg?w=640;1024;1440;1920&format=avif;webp;jpg&as=picture";
import {
  ArrowRight,
  CheckCircle,
  PhoneCall,
} from "lucide-react";

const Index = () => (
  <main id="main-content">
    {/* Hero */}
    <section className="relative min-h-[92vh] flex items-center section-padding pt-28 sm:pt-36 overflow-hidden">
      <div className="absolute inset-0">
        <Picture
          source={heroBg}
          alt="Webdesign das Kunden bringt"
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container-narrow px-4 relative z-10">
        <AnimatedSection>
          <div className="max-w-3xl">
            <span className="badge-label bg-destructive/10 text-destructive mb-6 sm:mb-8 text-[10px] sm:text-xs">
              deine Website bringt keine Kunden? Das ändern wir.
            </span>
            <h1 className="mb-4 sm:mb-6 text-balance">
              Webseiten, die planbar Kundenanfragen bringen –{" "}
              <span className="gradient-text">nicht nur gut aussehen</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-5 leading-relaxed">
              Wir entwickeln strategische, conversion-optimierte Webseiten für Selbstständige und Unternehmen –
              damit aus Besuchern <strong className="text-foreground">zuverlässig neue Kunden</strong> werden.
            </p>
            <div className="flex items-center gap-3 sm:gap-5 mb-8 sm:mb-10 flex-wrap">
              {["Kostenloses Konzept", "Keine Verpflichtung", "Umsetzung in 48 h möglich"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle size={14} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="mb-5">
              <VorschauVerfuegbarkeit variant="light" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button variant="gradient" size="lg" className="text-xs sm:text-base py-5 sm:py-6 px-4 sm:px-8 h-auto min-h-12 animate-cta-pulse w-full sm:w-auto whitespace-normal text-center leading-tight" asChild>
                <Link to="/kontakt">
                  Kostenlose Strategie-Vorschau sichern <ArrowRight size={18} aria-hidden={true} focusable={false} />
                </Link>
              </Button>
              <Button variant="outline-primary" size="lg" className="text-xs sm:text-base py-5 sm:py-6 px-4 sm:px-8 h-auto min-h-12 w-full sm:w-auto whitespace-normal text-center leading-tight" asChild>
                <Link to="/kontakt">
                  <PhoneCall size={18} aria-hidden={true} focusable={false} /> Rückruf vereinbaren
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <SocialProofBar />
    <PainPoints />
    <IndexServices />
    <FreePreviewCTA />
    <IndexBenefits />
    <IndexTestimonials />
    <IndexPortfolio />
    <IndexFAQ />
  </main>
);

export default Index;
