import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import techstartImg from "@/assets/portfolio/techstart.jpg";
import yogastudioImg from "@/assets/portfolio/yogastudio.jpg";
import digitalboostImg from "@/assets/portfolio/digitalboost.jpg";

const FALLBACK_IMAGES: Record<string, string> = {
  "TechStart GmbH": techstartImg,
  "Studio Flow": yogastudioImg,
  "Yoga Studio Flow": yogastudioImg,
  "DigitalBoost": digitalboostImg,
};

const fallbackItems = [
  { id: "1", title: "TechStart GmbH", category: "SaaS Landing Page", result: "+300% Anfragen", image_url: techstartImg, external_url: "" },
  { id: "2", title: "Studio Flow", category: "Branding & Webdesign", result: "+700% Neukunden", image_url: yogastudioImg, external_url: "" },
  { id: "3", title: "DigitalBoost", category: "E-Commerce", result: "+180% Umsatz", image_url: digitalboostImg, external_url: "" },
];

const IndexPortfolio = () => {
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("id, title, category, result, image_url, external_url")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .limit(3);
      if (data && data.length > 0) {
        setItems(data.map(p => ({
          ...p,
          image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
          external_url: (p as any).external_url || "",
        })));
      }
    };
    fetch();
  }, []);

  return (
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
          {items.map((p, i) => (
            <AnimatedSection key={p.id} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl mb-5 group-hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                  {p.image_url && <img src={p.image_url} alt={`${p.title} – ${p.category} | Website erstellen lassen`} loading="lazy" width={800} height={600} className="w-full h-full object-cover" />}
                  {p.result && (
                    <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
                      {p.result}
                    </span>
                  )}
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
};

export default IndexPortfolio;
