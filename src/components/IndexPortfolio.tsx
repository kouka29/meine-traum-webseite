import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import techstartImg from "@/assets/portfolio/techstart.jpg";
import yogastudioImg from "@/assets/portfolio/yogastudio.jpg";
import digitalboostImg from "@/assets/portfolio/digitalboost.jpg";

const portfolioItems = [
  { title: "TechStart GmbH", category: "SaaS Landing Page", result: "+300% Anfragen", img: techstartImg },
  { title: "Studio Flow", category: "Branding & Webdesign", result: "+700% Neukunden", img: yogastudioImg },
  { title: "DigitalBoost", category: "E-Commerce", result: "+180% Umsatz", img: digitalboostImg },
];

const IndexPortfolio = () => (
  <section className="section-padding gradient-subtle-bg">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="text-center mb-20">
          <h2 className="mb-5 text-balance">
            Webdesign-Projekte, die Ergebnisse sprechen lassen
          </h2>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolioItems.map((p, i) => (
          <AnimatedSection key={p.title} delay={i * 0.1}>
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl mb-5 group-hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                <img src={p.img} alt={`${p.title} – ${p.category} | Website erstellen lassen`} loading="lazy" width={800} height={600} className="w-full h-full object-cover" />
                <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
                  {p.result}
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.category}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="outline-primary" asChild>
          <Link to="/portfolio">Alle Projekte ansehen</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default IndexPortfolio;
