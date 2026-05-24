import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import DeviceMockup from "./DeviceMockup";
import { supabase } from "@/integrations/supabase/client";
import techstartImg from "@/assets/portfolio/techstart.jpg";
import yogastudioImg from "@/assets/portfolio/yogastudio.jpg";
import digitalboostImg from "@/assets/portfolio/digitalboost.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FALLBACK_IMAGES: Record<string, string> = {
  "TechStart GmbH": techstartImg,
  "Studio Flow": yogastudioImg,
  "Yoga Studio Flow": yogastudioImg,
  "DigitalBoost": digitalboostImg,
};

const fallbackItems = [
  { id: "1", title: "TechStart GmbH", category: "SaaS Landing Page", result: "+300% Anfragen", image_url: techstartImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "2", title: "Studio Flow", category: "Branding & Webdesign", result: "+700% Neukunden", image_url: yogastudioImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "3", title: "DigitalBoost", category: "E-Commerce", result: "+180% Umsatz", image_url: digitalboostImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
];

const IndexPortfolio = () => {
  const [items, setItems] = useState(fallbackItems);

  const normalizeUrl = (url: string) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("id, title, category, result, image_url, external_url, mockup_desktop_url, mockup_mobile_url")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setItems(data.map(p => ({
          ...p,
          image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
          external_url: (p as any).external_url || "",
          mockup_desktop_url: (p as any).mockup_desktop_url || "",
          mockup_mobile_url: (p as any).mockup_mobile_url || "",
        })));
      }
    };
    fetch();
  }, []);

  return (
    <section className="section-padding gradient-subtle-bg">
      <div className="container-narrow px-4">
        <AnimatedSection>
          <div className="text-center mb-12 md:mb-20">
            <h2 className="mb-5 text-balance">
              Webdesign-Projekte, die Ergebnisse sprechen lassen
            </h2>
          </div>
        </AnimatedSection>
        <Carousel
          opts={{ align: "start", loop: items.length > 3 }}
          className="max-w-6xl mx-auto relative px-0 sm:px-12"
        >
          <CarouselContent className="-ml-6">
            {items.map((p, i) => {
              const Inner = (
                <>
                  <div className="aspect-[4/3] rounded-2xl mb-5 group-hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden bg-muted/30 p-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt={`${p.title} – ${p.category} | Website erstellen lassen`} loading="lazy" width={800} height={600} className="w-full h-full object-cover rounded-lg" />
                    ) : p.mockup_desktop_url ? (
                      <DeviceMockup desktopUrl={p.mockup_desktop_url} title={p.title} />
                    ) : null}
                    {p.result && (
                      <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm z-10">
                        {p.result}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.category}</p>
                </>
              );
              return (
                <CarouselItem key={p.id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                  <AnimatedSection delay={i * 0.05}>
                    {p.external_url ? (
                      <a href={normalizeUrl(p.external_url)} target="_blank" rel="noopener noreferrer" className="block group cursor-pointer">
                        {Inner}
                      </a>
                    ) : (
                      <div className="group">{Inner}</div>
                    )}
                  </AnimatedSection>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {items.length > 1 && (
            <>
              <CarouselPrevious className="hidden sm:flex left-0 lg:-left-2 top-[38%] -translate-y-1/2 h-10 w-10 shadow-md bg-background z-10" />
              <CarouselNext className="hidden sm:flex right-0 lg:-right-2 top-[38%] -translate-y-1/2 h-10 w-10 shadow-md bg-background z-10" />
            </>
          )}
        </Carousel>
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
