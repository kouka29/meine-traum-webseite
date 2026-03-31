import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { Monitor, TrendingUp, Palette, Search } from "lucide-react";

const services = [
  { icon: Monitor, title: "Webdesign", desc: "Maßgeschneiderte Websites, die verkaufen – modern, schnell und conversion-optimiert.", link: "/webdesign-agentur" },
  { icon: TrendingUp, title: "Conversion-Optimierung", desc: "Besucher systematisch zu Kunden machen – mit datengetriebener Optimierung.", link: "/conversion-optimierung" },
  { icon: Palette, title: "UX/UI Design", desc: "Intuitiv. Überzeugend. Nutzerzentriert – für maximale Verweildauer.", link: "/leistungen" },
  { icon: Search, title: "SEO-Grundlagen", desc: "Gefunden werden – von den richtigen Kunden zur richtigen Zeit.", link: "/leistungen" },
];

const IndexServices = () => (
  <section className="section-padding gradient-subtle-bg">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-20">
          <span className="badge-label bg-primary/10 text-primary mb-5">Unsere Leistungen</span>
          <h2 className="mb-5 text-balance">
            So machen wir Ihre Website zum{" "}
            <span className="gradient-text">Kundenmagnet</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Wir kombinieren verkaufspsychologisches Design mit modernster Technik – für Websites, die messbar Ergebnisse liefern.
          </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <AnimatedSection key={s.title} delay={i * 0.1}>
            <Link to={s.link} className="bg-background rounded-2xl p-7 shadow-card hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1 border border-transparent hover:border-primary/10 h-full flex flex-col block">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <s.icon size={22} className="text-primary-foreground" />
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
