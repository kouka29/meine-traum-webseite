import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { ArrowRight, FileText, MessageSquare, ShieldCheck, PhoneCall } from "lucide-react";

const steps = [
  { icon: FileText, text: "Wir analysieren Ihre aktuelle Situation" },
  { icon: MessageSquare, text: "Sie erhalten ein konkretes Konzept mit Struktur & Textideen" },
  { icon: ShieldCheck, text: "Kein Risiko – Sie entscheiden danach frei" },
];

const FreePreviewCTA = () => (
  <section className="section-padding">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="gradient-hero-bg rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="relative z-10">
            <span className="badge-label bg-primary-foreground/15 text-primary-foreground mb-8">
              Ihr nächster Schritt
            </span>
            <h2 className="text-primary-foreground mb-5 text-balance">
              Ihre kostenlose Website-Strategie
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Sie erhalten ein individuelles Konzept für Ihre neue Website – mit konkreten Ideen für Struktur, Texte und Aufbau.
              Kein Verkaufsgespräch. Kein Kleingedrucktes. Sie entscheiden danach in Ruhe.
            </p>
            <div className="flex flex-col gap-4 max-w-md mx-auto mb-10 text-left">
              {steps.map((s) => (
                <div key={s.text} className="flex items-start gap-3 text-sm text-primary-foreground/80">
                  <s.icon size={18} className="shrink-0 mt-0.5" />
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xl mx-auto">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-elevated animate-cta-pulse w-full sm:w-auto text-xs sm:text-base px-4 sm:px-8 h-auto min-h-12 py-3 whitespace-normal text-center leading-tight"
                asChild
              >
                <Link to="/kontakt">
                  Kostenlose Strategie-Vorschau sichern <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/50 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all duration-300 w-full sm:w-auto text-xs sm:text-base px-4 sm:px-8 h-auto min-h-12 py-3 whitespace-normal text-center leading-tight"
                asChild
              >
                <Link to="/kontakt">
                  <PhoneCall size={18} /> Rückruf vereinbaren
                </Link>
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/80 mt-6">
              Unverbindlich. Schnell. Klar.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default FreePreviewCTA;
