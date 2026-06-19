import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import DeviceMockup from "@/components/DeviceMockup";
import { supabaseImage, supabaseImageSrcSet } from "@/lib/supabaseImage";
import { ExternalLink, ArrowRight, TrendingUp } from "lucide-react";
import { getCachedPortfolio, fetchPortfolio } from "@/lib/portfolioCache";
import techstartImg from "@/assets/portfolio/techstart.jpg";
import yogastudioImg from "@/assets/portfolio/yogastudio.jpg";
import digitalboostImg from "@/assets/portfolio/digitalboost.jpg";
import kanzleiImg from "@/assets/portfolio/kanzlei.jpg";
import fitlifeImg from "@/assets/portfolio/fitlife.jpg";
import greentechImg from "@/assets/portfolio/greentech.jpg";

const FALLBACK_IMAGES: Record<string, string> = {
  "TechStart GmbH": techstartImg,
  "Yoga Studio Flow": yogastudioImg,
  "DigitalBoost": digitalboostImg,
  "Kanzlei Weber": kanzleiImg,
  "FitLife Coaching": fitlifeImg,
  "GreenTech Solutions": greentechImg,
};

const fallbackProjects = [
  { id: "1", title: "TechStart GmbH", category: "SaaS Landing Page", description: "Conversion-optimierte Landing Page – Anfragen um 300% gesteigert in nur 8 Wochen.", result: "+300% Anfragen", image_url: techstartImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "2", title: "Yoga Studio Flow", category: "Branding & Webdesign", description: "Ganzheitlicher Markenauftritt – von 3 auf 20+ Anfragen pro Monat.", result: "+700% Neukunden", image_url: yogastudioImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "3", title: "DigitalBoost", category: "E-Commerce", description: "Online-Shop mit optimiertem Checkout – Umsatz um 180% gesteigert.", result: "+180% Umsatz", image_url: digitalboostImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "4", title: "Kanzlei Weber", category: "Corporate Website", description: "Vertrauensvolle Online-Präsenz – 5x mehr Mandantenanfragen über die Website.", result: "5x mehr Mandanten", image_url: kanzleiImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "5", title: "FitLife Coaching", category: "Personal Brand", description: "Persönliche Website mit Buchungssystem – Auslastung von 40% auf 95% gesteigert.", result: "95% Auslastung", image_url: fitlifeImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "6", title: "GreenTech Solutions", category: "Startup Website", description: "Investoren-fokussiertes Webdesign – erfolgreich Series A Funding gesichert.", result: "Funding gesichert", image_url: greentechImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
];

const Portfolio = () => {
  const [projects, setProjects] = useState(() => {
    const cached = getCachedPortfolio();
    if (cached && cached.length > 0) {
      return cached.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        result: p.result,
        image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
        external_url: p.external_url || "",
        mockup_desktop_url: p.mockup_desktop_url || "",
        mockup_mobile_url: p.mockup_mobile_url || "",
      }));
    }
    return fallbackProjects;
  });

  const normalizeUrl = (url: string) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio().then(data => {
      if (cancelled || !data || data.length === 0) return;
      setProjects(data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
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
    <>
      <SEOHead
        title="Webdesign Portfolio & Referenzen | Meine Traum Webseite"
        description="Referenzen & Ergebnisse: Website-Projekte für Selbstständige, KMUs und Handwerksbetriebe – bis zu +700% mehr Anfragen durch conversion-optimiertes Design."
        path="/portfolio"
        breadcrumbs={[
          { name: "Start", url: "/" },
          { name: "Portfolio", url: "/portfolio" }
        ]}
      />
      <main id="main-content" className="pt-20">
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-5">Portfolio & Referenzen</span>
              <h1 className="mb-5 text-balance">
                Webdesign-Referenzen –{" "}
                <span className="gradient-text">echte Ergebnisse für echte Unternehmen</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Keine Stockfotos, keine leeren Versprechen – sondern messbare Resultate von Unternehmen,
                die ihre Website erstellen lassen haben und jetzt mehr Kunden gewinnen.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {projects.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08} className="h-full">
                  {p.external_url ? (
                    <a href={normalizeUrl(p.external_url)} target="_blank" rel="noopener noreferrer" className="block h-full">
                      <div className="group cursor-pointer rounded-2xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-elevated transition-all duration-300 bg-background h-full flex flex-col">
                        <div className="aspect-[4/3] relative overflow-hidden p-4 bg-muted/30" style={{ containerType: 'size' }}>
                          {p.image_url ? (
                            <img
                              src={supabaseImage(p.image_url, { width: 640, quality: 72 })}
                              srcSet={supabaseImageSrcSet(p.image_url, [640, 800, 1200], { quality: 72 })}
                              sizes="(min-width: 1024px) 640px, (min-width: 768px) 50vw, 100vw"
                              alt={`${p.title} – ${p.category} | Webdesign Referenz`}
                              loading={i < 3 ? "eager" : "lazy"}
                              {...(i < 3 ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
                              decoding="async"
                              width={800}
                              height={600}
                              className="w-full h-auto absolute top-0 left-0 object-cover object-top transition-transform duration-[3000ms] ease-in-out portfolio-scroll-img"
                            />
                          ) : p.mockup_desktop_url ? (
                            <DeviceMockup desktopUrl={p.mockup_desktop_url} title={p.title} />
                          ) : null}
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                            <ExternalLink size={24} className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" aria-hidden={true} focusable={false} />
                          </div>
                          {p.result && (
                            <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm flex items-center gap-1.5 z-10">
                              <TrendingUp size={12} aria-hidden={true} focusable={false} /> {p.result}
                            </span>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">{p.category}</span>
                          <h2 className="font-heading text-lg font-semibold mt-1.5 mb-2">{p.title}</h2>
                          <p className="text-sm text-muted-foreground leading-relaxed min-h-[3.75rem]">
                            {p.description || `Individuelles ${p.category}-Projekt – konzipiert und umgesetzt von unserer Webdesign Agentur.`}
                          </p>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="group rounded-2xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-elevated transition-all duration-300 bg-background h-full flex flex-col">
                      <div className="aspect-[4/3] relative overflow-hidden p-4 bg-muted/30" style={{ containerType: 'size' }}>
                        {p.image_url ? (
                          <img
                            src={supabaseImage(p.image_url, { width: 640, quality: 72 })}
                            srcSet={supabaseImageSrcSet(p.image_url, [640, 800, 1200], { quality: 72 })}
                            sizes="(min-width: 1024px) 640px, (min-width: 768px) 50vw, 100vw"
                            alt={`${p.title} – ${p.category} | Webdesign Referenz`}
                            loading={i < 3 ? "eager" : "lazy"}
                            {...(i < 3 ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
                            decoding="async"
                            width={800}
                            height={600}
                            className="w-full h-auto absolute top-0 left-0 object-cover object-top transition-transform duration-[3000ms] ease-in-out portfolio-scroll-img"
                          />
                        ) : p.mockup_desktop_url ? (
                          <DeviceMockup desktopUrl={p.mockup_desktop_url} title={p.title} />
                        ) : null}
                        {p.result && (
                          <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm flex items-center gap-1.5">
                            <TrendingUp size={12} aria-hidden={true} focusable={false} /> {p.result}
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">{p.category}</span>
                        <h2 className="font-heading text-lg font-semibold mt-1.5 mb-2">{p.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed min-h-[3.75rem]">
                          {p.description || `Individuelles ${p.category}-Projekt – konzipiert und umgesetzt von unserer Webdesign Agentur.`}
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatedSection>
              ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-5 text-lg">
              Willst du ähnliche Ergebnisse? Lass deine Website von unserer Webdesign Agentur erstellen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link to="/kontakt">Kostenlose Vorschau anfordern <ArrowRight size={18} aria-hidden={true} focusable={false} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Kostenlosen Website-Check starten</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
    </main>
    </>
  );
};

export default Portfolio;
