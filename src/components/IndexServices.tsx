import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { Target, Layers, PenTool, MousePointerClick } from "lucide-react";

const steps = [
  { icon: Target, title: "Strategie & Zielgruppenanalyse", desc: "Wir finden heraus, wen Du erreichst möchtest – und was diese Menschen brauchen, um Vertrauen aufzubauen und anzufragen.", link: "/leistungen" },
  { icon: Layers, title: "Conversion-orientierter Aufbau", desc: "Jede Seite folgt einer klaren Struktur: Problem → Lösung → Beweis → Handlungsaufforderung. Kein Rätselraten für Deine Besucher.", link: "/conversion-optimierung" },
  { icon: PenTool, title: "Psychologisch optimierte Texte", desc: "Texte, die nicht beschreiben, sondern überzeugen. Geschrieben für Menschen, die eine Entscheidung treffen wollen.", link: "/leistungen" },
  { icon: MousePointerClick, title: "Klare Handlungsaufforderungen", desc: "Jeder Besucher weiß sofort, was der nächste Schritt ist – und warum er ihn gehen sollte. Kein Suchen, kein Zögern.", link: "/leistungen" },
];

const IndexServices = () => (
  <section className="section-padding gradient-subtle-bg">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-12 md:mb-20">
          <span className="badge-label bg-primary/10 text-primary mb-5">Unser Ansatz</span>
          <h2 className="mb-5 text-balance">
            So machen wir aus deiner Website einen{" "}
            <span className="text-foreground">Kundenmagneten</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Kein Technik-Vortrag. Wir zeigen Dir, welche vier Hebel Deine Website braucht, damit Besucher zu Kunden werden.
          </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <AnimatedSection key={s.title} delay={i * 0.1}>
            <Link to={s.link} className="bg-background rounded-2xl p-7 shadow-card hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1 border border-transparent hover:border-primary/10 h-full flex flex-col block">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <s.icon size={20} className="text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </Link>
          </AnimatedSection>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="outline-primary" asChild>
          <Link to="/leistungen">Alle Leistungen ansehen</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default IndexServices;
