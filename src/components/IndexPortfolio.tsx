import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import DeviceMockup from "./DeviceMockup";
import { getCachedPortfolio, fetchPortfolio } from "@/lib/portfolioCache";
import techstartImg from "@/assets/portfolio/techstart.jpg";
import yogastudioImg from "@/assets/portfolio/yogastudio.jpg";
import digitalboostImg from "@/assets/portfolio/digitalboost.jpg";
import Autoplay from "embla-carousel-autoplay";
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

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  result: string;
  image_url: string;
  external_url: string;
  mockup_desktop_url: string;
  mockup_mobile_url: string;
};

const fallbackItems: PortfolioItem[] = [
  { id: "1", title: "TechStart GmbH", category: "SaaS Landing Page", result: "+300% Anfragen", image_url: techstartImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "2", title: "Studio Flow", category: "Branding & Webdesign", result: "+700% Neukunden", image_url: yogastudioImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "3", title: "DigitalBoost", category: "E-Commerce", result: "+180% Umsatz", image_url: digitalboostImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
];

const IndexPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const cached = getCachedPortfolio();
    if (cached && cached.length > 0) {
      return cached.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        result: p.result,
        image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
        external_url: p.external_url || "",
        mockup_desktop_url: p.mockup_desktop_url || "",
        mockup_mobile_url: p.mockup_mobile_url || "",
      }));
    }
    return fallbackItems;
  });
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const normalizeUrl = (url: string) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio().then(data => {
      if (cancelled || !data || data.length === 0) return;
      setItems(data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        result: p.result,
        image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
        external_url: p.external_url || "",
        mockup_desktop_url: p.mockup_desktop_url || "",
        mockup_mobile_url: p.mockup_mobile_url || "",
      })));
    });
    return () => { cancelled = true; };
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
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
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
