import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import DeviceMockup from "./DeviceMockup";
import { getCachedPortfolio, fetchPortfolio } from "@/lib/portfolioCache";
import techstartImg from "@/assets/portfolio/techstart.jpg";
import yogastudioImg from "@/assets/portfolio/yogastudio.jpg";
import digitalboostImg from "@/assets/portfolio/digitalboost.jpg";
import kanzleiImg from "@/assets/portfolio/kanzlei.jpg";
import fitlifeImg from "@/assets/portfolio/fitlife.jpg";
import greentechImg from "@/assets/portfolio/greentech.jpg";
import { ExternalLink, ArrowRight } from "lucide-react";
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
  "Yoga Studio Flow": yogastudioImg,
  "DigitalBoost": digitalboostImg,
  "Kanzlei Weber": kanzleiImg,
  "FitLife Coaching": fitlifeImg,
  "GreenTech Solutions": greentechImg,
};

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  result: string;
  image_url: string;
  screenshot_url: string;
  external_url: string;
  mockup_desktop_url: string;
  mockup_mobile_url: string;
};

const fallbackItems: PortfolioItem[] = [
  { id: "1", title: "TechStart GmbH", category: "SaaS Landing Page", description: "Conversion-optimierte Landing Page – Anfragen um 300% gesteigert in nur 8 Wochen.", result: "+300% Anfragen", image_url: techstartImg, screenshot_url: "", external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "2", title: "Yoga Studio Flow", category: "Branding & Webdesign", description: "Ganzheitlicher Markenauftritt – von 3 auf 20+ Anfragen pro Monat.", result: "+700% Neukunden", image_url: yogastudioImg, screenshot_url: "", external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "3", title: "DigitalBoost", category: "E-Commerce", description: "Online-Shop mit optimiertem Checkout – Umsatz um 180% gesteigert.", result: "+180% Umsatz", image_url: digitalboostImg, screenshot_url: "", external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "4", title: "Kanzlei Weber", category: "Corporate Website", description: "Vertrauensvolle Online-Präsenz – 5x mehr Mandantenanfragen über die Website.", result: "5x mehr Mandanten", image_url: kanzleiImg, screenshot_url: "", external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "5", title: "FitLife Coaching", category: "Personal Brand", description: "Persönliche Website mit Buchungssystem – Auslastung von 40% auf 95% gesteigert.", result: "95% Auslastung", image_url: fitlifeImg, screenshot_url: "", external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "6", title: "GreenTech Solutions", category: "Startup Website", description: "Investoren-fokussiertes Webdesign – erfolgreich Series A Funding gesichert.", result: "Funding gesichert", image_url: greentechImg, screenshot_url: "", external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
];

const IndexPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const cached = getCachedPortfolio();
    if (cached && cached.length > 0) {
      return cached.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        result: p.result,
        image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
        screenshot_url: p.screenshot_url || "",
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

  const normalizeImageSrc = (image_url: string): string => {
    if (!image_url) return "";
    if (/^https?:\/\//i.test(image_url)) {
      return image_url
        .replace("/storage/v1/render/image/public/", "/storage/v1/object/public/")
        .split("?")[0];
    }
    if (image_url.startsWith("/") || image_url.startsWith("data:") || image_url.startsWith("blob:")) {
      return image_url;
    }
    const base = (import.meta.env.VITE_SUPABASE_URL as string) || "";
    return `${base}/storage/v1/object/public/portfolio-images/${image_url}`;
  };

  const [reducedMotion, setReducedMotion] = useState(false);
  const [flatImages, setFlatImages] = useState<Record<string, boolean>>({});
  const [expandedDescs, setExpandedDescs] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio().then(data => {
      if (cancelled || !data || data.length === 0) return;
      setItems(data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        result: p.result,
        image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
        screenshot_url: p.screenshot_url || "",
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
          className="relative"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <CarouselPrevious className="static shrink-0 hidden sm:flex self-center translate-y-0" />
            <div className="flex-1 min-w-0">
              <CarouselContent className="-ml-6">
              {items.map((p, i) => {
                const rawSrc = (typeof p.image_url === "string" ? p.image_url : "") || p.screenshot_url || "";
                const imgSrc = normalizeImageSrc(rawSrc);
                const eager = i < 3;
                const imgAlt = `Webdesign-Referenz – ${p.title}, ${p.category}`;
                const card = (
                  <div className="group h-full w-full text-left bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-5">
                      <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
                        <div className="bg-muted h-6 flex items-center gap-1.5 px-2.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        {imgSrc ? (
                          <div className="overflow-hidden">
                            <img
                              src={imgSrc}
                              alt={imgAlt}
                              width={800}
                              height={450}
                              loading="eager"
                              {...(eager ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
                              decoding="async"
                              onLoad={(e) => {
                                const img = e.currentTarget;
                                const ratio = img.naturalHeight / Math.max(img.naturalWidth, 1);
                                if (ratio < 0.7) {
                                  setFlatImages((m) => (m[p.id] ? m : { ...m, [p.id]: true }));
                                }
                              }}
                              className={`aspect-video w-full object-cover object-top ${reducedMotion || flatImages[p.id] ? "" : "group-hover:[object-position:50%_100%]"}`}
                              style={reducedMotion || flatImages[p.id] ? undefined : { transition: "object-position 9s linear" }}
                            />
                          </div>
                        ) : p.mockup_desktop_url ? (
                          <DeviceMockup desktopUrl={p.mockup_desktop_url} title={p.title} />
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-4 flex flex-col justify-end">
                            <div className="h-2 w-2/3 bg-foreground/20 rounded mb-2" />
                            <div className="h-1.5 w-1/2 bg-foreground/15 rounded mb-1" />
                            <div className="h-1.5 w-1/3 bg-foreground/15 rounded" />
                          </div>
                        )}
                      </div>
                      {p.external_url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-200">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-2 rounded-full bg-card text-foreground px-4 py-2 text-sm font-semibold shadow-lg">
                            <ExternalLink className="w-4 h-4" aria-hidden={true} focusable={false} />
                            Live ansehen
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {p.category && (
                        <span className="inline-flex self-start items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold mb-2">
                          {p.category}
                        </span>
                      )}
                      <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className={`text-sm text-muted-foreground mb-2 flex-1 ${expandedDescs[p.id] ? "" : "line-clamp-3"}`}>
                        {p.description || `Individuelles ${p.category}-Projekt – konzipiert und umgesetzt von unserer Webdesign Agentur.`}
                      </p>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setExpandedDescs(prev => ({ ...prev, [p.id]: !prev[p.id] }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            e.preventDefault();
                            setExpandedDescs(prev => ({ ...prev, [p.id]: !prev[p.id] }));
                          }
                        }}
                        className="text-xs font-semibold text-primary mb-2 cursor-pointer select-none"
                      >
                        {expandedDescs[p.id] ? "Weniger anzeigen" : "Weiterlesen"}
                      </span>
                    {p.external_url && (
                      <div className="flex items-center justify-end">
                        <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 shrink-0">
                          Ansehen <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden={true} focusable={false} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
              return (
                <CarouselItem key={p.id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 h-auto">
                  <AnimatedSection delay={i * 0.05} className="h-full">
                    {p.external_url ? (
                      <a href={normalizeUrl(p.external_url)} target="_blank" rel="noopener noreferrer" className="block h-full">
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </AnimatedSection>
                </CarouselItem>
              );
            })}
              </CarouselContent>
            </div>
            <CarouselNext className="static shrink-0 hidden sm:flex self-center translate-y-0" />
          </div>
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
