import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { Monitor, ExternalLink, ArrowRight, TrendingUp } from "lucide-react";

const projects = [
  { title: "TechStart GmbH", category: "SaaS Landing Page", desc: "Conversion-optimierte Landing Page – Anfragen um 300% gesteigert in nur 8 Wochen.", result: "+300% Anfragen", gradient: "from-primary to-accent" },
  { title: "Yoga Studio Flow", category: "Branding & Webdesign", desc: "Ganzheitlicher Markenauftritt – von 3 auf 20+ Anfragen pro Monat.", result: "+700% Neukunden", gradient: "from-accent to-primary" },
  { title: "DigitalBoost", category: "E-Commerce", desc: "Online-Shop mit optimiertem Checkout – Umsatz um 180% gesteigert.", result: "+180% Umsatz", gradient: "from-primary/80 to-accent/80" },
  { title: "Kanzlei Weber", category: "Corporate Website", desc: "Vertrauensvolle Online-Präsenz – 5x mehr Mandantenanfragen über die Website.", result: "5x mehr Mandanten", gradient: "from-accent/90 to-primary/90" },
  { title: "FitLife Coaching", category: "Personal Brand", desc: "Persönliche Website mit Buchungssystem – Auslastung von 40% auf 95% gesteigert.", result: "95% Auslastung", gradient: "from-primary to-accent/70" },
  { title: "GreenTech Solutions", category: "Startup Website", desc: "Investoren-fokussiertes Webdesign – erfolgreich Series A Funding gesichert.", result: "Funding gesichert", gradient: "from-accent/70 to-primary" },
];

const Portfolio = () => (
  <main className="pt-16">
    <section className="section-padding">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              Referenzen
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Echte Ergebnisse für{" "}
              <span className="gradient-text">echte Unternehmen</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Keine Stockfotos, keine leeren Versprechen – sondern messbare Resultate, die für sich sprechen.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.08}>
              <div className="group cursor-pointer rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${p.gradient} flex items-center justify-center relative`}
                >
                  <Monitor size={48} className="text-primary-foreground/40" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                    <ExternalLink
                      size={24}
                      className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm flex items-center gap-1">
                    <TrendingUp size={12} /> {p.result}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-primary">{p.category}</span>
                  <h3 className="font-heading font-semibold mt-1 mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Wollen Sie ähnliche Ergebnisse für Ihr Unternehmen?
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/kontakt">
              Kostenlose Vorschau anfordern <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>

    <CTABanner />
  </main>
);

export default Portfolio;
